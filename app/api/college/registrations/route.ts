import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload || (payload.role !== 'COLLEGE_ADMIN' && payload.role !== 'SYSTEM_ADMIN')) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const admin = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            select: { collegeId: true }
        });

        if (!admin || !admin.collegeId) {
            return NextResponse.json({ error: 'College not found' }, { status: 404 });
        }

        const registrations = await prisma.registration.findMany({
            where: {
                event: {
                    collegeId: admin.collegeId
                }
            },
            include: {
                user: {
                    include: {
                        college: {
                            select: { name: true }
                        }
                    }
                },
                event: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(registrations);
    } catch (error) {
        console.error('Error fetching registrations:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
