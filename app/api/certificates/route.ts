import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { jsPDF } from 'jspdf';
import fs from 'fs';
import path from 'path';
import { poppinsRegularBase64 } from '@/lib/poppinsFont';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const registrationId = searchParams.get('registrationId');

        if (!registrationId) {
            return NextResponse.json({ error: 'Registration ID required' }, { status: 400 });
        }

        const registration = await prisma.registration.findUnique({
            where: { id: registrationId },
            include: {
                user: true,
                event: {
                    include: {
                        college: true
                    }
                }
            }
        }) as any;

        if (!registration || registration.userId !== payload.userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        if (registration.status !== 'ATTENDED') {
            return NextResponse.json({ error: 'Certificate not available. Attendance was not marked.' }, { status: 403 });
        }

        // Generate PDF
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        // Add Poppins font
        doc.addFileToVFS('Poppins-Regular.ttf', poppinsRegularBase64);
        doc.addFont('Poppins-Regular.ttf', 'Poppins', 'normal');

        // 1. Template
        let templateUsed = false;
        try {
            // Try specific template first, fallback to user's requested participation_cert.png
            let templatePath = registration.event.certificateTemplateUrl
                ? path.join(process.cwd(), 'public', registration.event.certificateTemplateUrl.replace(/^\//, ''))
                : path.join(process.cwd(), 'participation_cert.png');

            if (!fs.existsSync(templatePath)) {
                templatePath = path.join(process.cwd(), 'participation_cert.png');
            }

            if (fs.existsSync(templatePath)) {
                const ext = path.extname(templatePath).toLowerCase().replace('.', '');
                const format = (ext === 'jpg' || ext === 'jpeg') ? 'JPEG' : (ext === 'webp' ? 'WEBP' : 'PNG');
                const imageBuffer = fs.readFileSync(templatePath);
                doc.addImage(imageBuffer, format, 0, 0, 297, 210);
                templateUsed = true;
            }
        } catch (e) {
            console.error('Failed to load template:', e);
        }

        if (!templateUsed) {
            applyDefaultStyling(doc);
        }

        // 3. Overlay Content
        doc.setFont('Poppins', 'normal');
        doc.setTextColor(30, 41, 59); // Dark grey text

        const name = `${registration.user.firstName} ${registration.user.lastName}`;
        const eventName = registration.event.title;
        const department = registration.event.college.name;
        const eventDate = new Date(registration.event.date).toLocaleDateString();

        // 1. [Name] - Centered in the first line gap
        doc.setFontSize(22);
        doc.text(name, 140, 85.5, { align: 'center' });

        // Line 2: the [Event] organized by [College] on [Date]
        doc.setFontSize(16);
        // 2. [Event Name]
        doc.text(eventName, 75, 105.5, { align: 'center' });

        // 3. Department of College
        doc.text(department, 170, 105.5, { align: 'center' });

        // 4. Date (Gap after "on")
        doc.text(eventDate, 245, 105.5, { align: 'center' });

        // Footer Section (Aligning with template labels)
        doc.setFontSize(14);
        // 5. Last Date of completion (next to Date: label)
        doc.text(eventDate, 70, 177);

        // 6. Name of event (next to Event: label)
        doc.text(eventName, 70, 184);

        const pdfOutput = doc.output('arraybuffer');
        const buffer = Buffer.from(pdfOutput);

        return new NextResponse(buffer, {
            headers: {
                // Return inline for easier previewing/testing during development, or attachment for download
                'Content-Type': 'application/pdf',
                'Content-Disposition': `inline; filename="Certificate_${registration.event.title.replace(/\s+/g, '_')}.pdf"`
            }
        });

    } catch (error) {
        console.error('Error generating certificate:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

function applyDefaultStyling(doc: any) {
    doc.setFillColor(245, 245, 245);
    doc.rect(0, 0, 297, 210, 'F');
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(5);
    doc.rect(10, 10, 277, 190, 'S');
}
