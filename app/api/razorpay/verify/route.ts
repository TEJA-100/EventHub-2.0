import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
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
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            eventId
        } = await request.json();

        const body = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

        // Update or Create registration
        const registration = await (prisma.registration as any).upsert({
            where: {
                userId_eventId: {
                    userId: payload.userId as string,
                    eventId: eventId,
                }
            },
            update: {
                status: 'CONFIRMED',
                paymentStatus: 'COMPLETED',
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
            },
            create: {
                userId: payload.userId as string,
                eventId: eventId,
                status: 'CONFIRMED',
                paymentStatus: 'COMPLETED',
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
            }
        });

        return NextResponse.json({
            message: 'Payment verified successfully',
            registration
        });
    } catch (error) {
        console.error('Razorpay Verification Error:', error);
        return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
    }
}
