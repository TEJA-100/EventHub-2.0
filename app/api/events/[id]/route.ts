import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                college: true,
                attendees: true
            }
        });

        if (!event) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        }

        // Check if current user is registered
        const token = request.cookies.get('auth_token')?.value;
        let isRegistered = false;
        if (token) {
            const payload = await verifyToken(token);
            if (payload) {
                const registration = await prisma.registration.findFirst({
                    where: {
                        eventId: id,
                        userId: payload.userId as string
                    }
                });
                isRegistered = !!registration;
            }
        }

        return NextResponse.json({
            ...event,
            attendeeCount: event.attendees.length,
            isRegistered
        });
    } catch (error) {
        console.error('Error fetching event:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: eventId } = await params;
        const token = request.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        // Reject registration if user is an admin
        if (payload.role === 'COLLEGE_ADMIN' || payload.role === 'SYSTEM_ADMIN') {
            return NextResponse.json({ error: 'Admins cannot register for events' }, { status: 403 });
        }

        const userId = payload.userId as string;
        // eventId is already extracted from params at the top of the function

        // Check if event exists and has capacity
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            include: { attendees: true }
        });

        if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });
        if ((event as any).isPaid) {
            return NextResponse.json({ error: 'This is a paid event. Please complete payment to register.' }, { status: 402 });
        }
        if (event.attendees.length >= event.capacity) {
            return NextResponse.json({ error: 'Event is full' }, { status: 400 });
        }

        // Create registration
        const registration = await prisma.registration.create({
            data: {
                userId,
                eventId,
                status: 'CONFIRMED'
            }
        });

        return NextResponse.json(registration);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Already registered' }, { status: 400 });
        }
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Failed to register' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const token = request.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const role = payload.role as string;
        if (role !== 'COLLEGE_ADMIN' && role !== 'SYSTEM_ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Verify if the event belongs to this admin's college (unless system admin)
        const event = await prisma.event.findUnique({
            where: { id },
            select: { collegeId: true }
        });

        if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

        if (role === 'COLLEGE_ADMIN' && event.collegeId !== payload.collegeId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.event.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error('Error deleting event:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
