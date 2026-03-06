import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

// Send Broadcast (Admin Only)
export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload || (payload.role !== 'COLLEGE_ADMIN' && payload.role !== 'SYSTEM_ADMIN')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const collegeId = payload.role === 'SYSTEM_ADMIN' ? null : payload.collegeId as string;
        const { title, message, type } = await request.json();

        if (!title || !message) {
            return NextResponse.json({ error: 'Title and message are required' }, { status: 400 });
        }

        const broadcast = await (prisma as any).broadcast.create({
            data: {
                title,
                message,
                type: type || 'ANNOUNCEMENT',
                collegeId: collegeId
            }
        });

        return NextResponse.json(broadcast, { status: 201 });
    } catch (error) {
        console.error('Error creating broadcast:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// Get Broadcasts for User's College
export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const collegeId = payload.collegeId as string;

        // System Admins see everything, College Admins and Students see their college + Global
        const where = payload.role === 'SYSTEM_ADMIN'
            ? {}
            : {
                OR: [
                    { collegeId: collegeId },
                    { collegeId: null }
                ]
            };

        const broadcasts = await (prisma as any).broadcast.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(broadcasts);
    } catch (error) {
        console.error('Error fetching broadcasts:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
