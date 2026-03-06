import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('auth_token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token);
        if (!payload || (payload.role !== 'COLLEGE_ADMIN' && payload.role !== 'SYSTEM_ADMIN')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { title, category, date, location, description, capacity, imageUrl, certificateTemplateUrl, isPaid, price } = body;

        // Use collegeId from token
        const collegeId = (body.collegeId || payload.collegeId) as string;

        if (!title || !category || !date || !location || !description || !capacity || !collegeId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const event = await prisma.event.create({
            data: {
                title,
                category,
                date: new Date(date),
                location,
                description,
                capacity: parseInt(capacity),
                imageUrl,
                certificateTemplateUrl,
                collegeId,
                isPaid: !!isPaid,
                price: parseFloat(price as any) || 0,
            } as any,
        });

        return NextResponse.json(event);
    } catch (error) {
        console.error('Error creating event:', error);
        return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('auth_token')?.value;
        let userId: string | null = null;
        if (token) {
            const payload = await verifyToken(token);
            if (payload) userId = payload.userId as string;
        }

        const events = await prisma.event.findMany({
            include: {
                college: true,
                attendees: userId ? {
                    where: { userId }
                } : false
            },
            orderBy: {
                date: 'asc',
            },
        });

        const eventsWithRegistration = events.map(event => ({
            ...event,
            isRegistered: event.attendees ? event.attendees.length > 0 : false,
            attendees: undefined // Don't leak all attendee data in bulk fetch if not needed
        }));

        return NextResponse.json(eventsWithRegistration);
    } catch (error) {
        console.error('Error fetching events:', error);
        return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }
}
