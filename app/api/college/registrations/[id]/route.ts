import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function PATCH(
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

        const { status } = await request.json();
        if (!['ATTENDED', 'ABSENT', 'CONFIRMED'].includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const registration = await prisma.registration.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json(registration);
    } catch (error) {
        console.error('Error updating registration status:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
