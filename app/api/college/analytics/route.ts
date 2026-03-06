import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const exportCsv = url.searchParams.get('export') === 'csv';

    const token = request.cookies.get('auth_token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const userCollegeId = payload.collegeId as string;

    // Aggregate registration data per event, scoped to admin's college
    const events = await prisma.event.findMany({
        where: userCollegeId ? { collegeId: userCollegeId } : {},
        include: {
            attendees: {
                include: {
                    user: {
                        select: { id: true, firstName: true, lastName: true, email: true, role: true, collegeId: true, college: true },
                    },
                },
            },
            college: true,
        },
    });

    const analytics = events.map(event => ({
        eventId: event.id,
        eventName: event.title,
        college: event.college?.name ?? 'N/A',
        totalRegistrations: event.attendees.length,
        registrationsByCollege: event.attendees.reduce((acc, a) => {
            const collegeName = a.user.college?.name ?? 'No College';
            acc[collegeName] = (acc[collegeName] || 0) + 1;
            return acc;
        }, {} as Record<string, number>),
        studentDetails: event.attendees.map(a => ({
            id: a.user.id,
            name: `${a.user.firstName} ${a.user.lastName}`,
            email: a.user.email,
        })),
    }));

    if (exportCsv) {
        // Build CSV rows
        const header = ['Event ID', 'Event Name', 'College', 'Student ID', 'Student Name', 'Student Email'].join(',');

        let rows = [header];
        analytics.forEach(ev => {
            ev.studentDetails.forEach(st => {
                const row = [
                    ev.eventId,
                    `"${ev.eventName.replace(/"/g, '""')}"`,
                    `"${ev.college.replace(/"/g, '""')}"`,
                    st.id,
                    `"${st.name.replace(/"/g, '""')}"`,
                    `"${st.email.replace(/"/g, '""')}"`
                ].join(',');
                rows.push(row);
            });
        });
        const csv = rows.join('\n');
        return new NextResponse(csv, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename="event_registrations.csv"',
            },
        });
    }

    return NextResponse.json({ analytics }, { status: 200 });
}
