import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('auth_token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const payload = await verifyToken(token);
        if (!payload || !payload.userId) {
            return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                collegeId: true,
                college: {
                    select: {
                        name: true,
                        events: {
                            select: {
                                id: true,
                                title: true,
                                category: true,
                                date: true,
                                location: true,
                                capacity: true,
                                _count: {
                                    select: { attendees: true }
                                }
                            }
                        },
                        broadcasts: {
                            orderBy: { createdAt: 'desc' },
                            take: 10
                        }
                    }
                } as any,
                registrations: {
                    include: {
                        event: {
                            select: {
                                id: true,
                                title: true,
                                category: true,
                                date: true,
                                location: true
                            }
                        }
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Fetch broadcasts separately to include Global ones
        const broadcasts = await (prisma.broadcast as any).findMany({
            where: {
                OR: [
                    { collegeId: user.collegeId },
                    { collegeId: null }
                ]
            },
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        return NextResponse.json({ ...user, broadcasts });
    } catch (error) {
        console.error('Me error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const token = request.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload || !payload.userId) return NextResponse.json({ error: 'Invalid session' }, { status: 401 });

        const body = await request.json();
        const { firstName, lastName, email } = body;

        if (!firstName || !lastName || !email) {
            return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: payload.userId as string },
            data: { firstName, lastName, email },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
        }
        console.error('Update profile error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }
}

