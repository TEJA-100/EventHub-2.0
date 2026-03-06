import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const token = request.cookies.get('auth_token')?.value;

        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const payload = await verifyToken(token);
        if (!payload || (payload.role !== 'COLLEGE_ADMIN' && payload.role !== 'SYSTEM_ADMIN')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const event = await prisma.event.findUnique({
            where: { id },
            include: {
                college: true,
                attendees: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                                college: {
                                    select: { name: true }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 });

        // Ensure the admin owns this college/event
        if (payload.collegeId !== event.collegeId && payload.role !== 'SYSTEM_ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const registrationsByCollege: Record<string, number> = {};
        event.attendees.forEach(a => {
            const collegeName = a.user.college?.name || 'Unknown College';
            registrationsByCollege[collegeName] = (registrationsByCollege[collegeName] || 0) + 1;
        });

        return NextResponse.json({
            event: {
                id: event.id,
                title: event.title,
                date: event.date,
                location: event.location,
                capacity: event.capacity,
                category: event.category,
                attendeeCount: event.attendees.length,
                college: { name: event.college.name }
            },
            attendees: event.attendees.map(a => ({
                id: a.id,
                name: `${a.user.firstName} ${a.user.lastName}`,
                email: a.user.email,
                college: a.user.college?.name || 'N/A',
                status: a.status,
                registeredAt: a.createdAt
            })),
            registrationsByCollege
        });
    } catch (error) {
        console.error('Event analytics error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
