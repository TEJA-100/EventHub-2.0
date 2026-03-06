import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload || (payload.role !== 'COLLEGE_ADMIN' && payload.role !== 'SYSTEM_ADMIN')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            select: { collegeId: true }
        });

        if (!user || !user.collegeId) {
            return NextResponse.json({ error: 'College partition not found' }, { status: 404 });
        }

        const college = await prisma.college.findUnique({
            where: { id: user.collegeId },
            select: { name: true }
        });

        const events = await prisma.event.findMany({
            where: { collegeId: user.collegeId },
            include: {
                attendees: true
            },
            orderBy: { date: 'desc' }
        });

        const totalRegistrations = events.reduce((sum, e) => sum + e.attendees.length, 0);
        const activeEvents = events.filter(e => new Date(e.date) >= new Date()).length;

        return NextResponse.json({
            collegeName: college?.name || 'Your College',
            activeEvents,
            totalRegistrations,
            events: events.map(e => ({
                id: e.id,
                title: e.title,
                date: e.date,
                category: e.category,
                attendeeCount: e.attendees.length,
                capacity: e.capacity,
                status: new Date(e.date) >= new Date() ? 'Published' : 'Past'
            }))
        });
    } catch (error) {
        console.error('Stats error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
