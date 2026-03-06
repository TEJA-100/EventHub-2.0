import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            // For security, don't reveal if user exists
            return NextResponse.json({ message: 'If an account exists with this email, a reset link has been sent.' });
        }

        const token = uuidv4();
        const expiry = new Date(Date.now() + 3600000); // 1 hour from now

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetToken: token,
                resetTokenExpiry: expiry
            }
        });

        // In a real app, send email here.
        // For development, we'll return the token in the response so it can be tested.
        console.log(`Password reset link: http://localhost:3000/reset-password?token=${token}`);

        return NextResponse.json({
            message: 'If an account exists with this email, a reset link has been sent.',
            debugToken: token // Remove in production
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
