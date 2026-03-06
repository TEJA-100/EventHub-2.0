import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function DELETE(request: NextRequest) {
    try {
        const token = request.cookies.get('auth_token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyToken(token);
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const userId = payload.userId as string;

        // Perform deletion in a transaction
        await prisma.$transaction(async (tx) => {
            // 1. Delete all registrations for this user
            await tx.registration.deleteMany({
                where: { userId }
            });

            // 2. Delete the user
            await tx.user.delete({
                where: { id: userId }
            });
        });

        // Clear the auth cookie
        const response = NextResponse.json({ message: 'Account deleted successfully' });
        response.cookies.set('auth_token', '', { expires: new Date(0) });

        return response;
    } catch (error) {
        console.error('Error deleting account:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
