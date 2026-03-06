import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { verifyToken } from '@/lib/auth';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

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

        // Block admins from registering/paying
        if (payload.role === 'COLLEGE_ADMIN' || payload.role === 'SYSTEM_ADMIN') {
            return NextResponse.json({ error: 'Admins cannot register or pay for events' }, { status: 403 });
        }

        const { amount, eventId } = await request.json();

        if (!amount || !eventId) {
            return NextResponse.json({ error: 'Missing amount or eventId' }, { status: 400 });
        }

        const options = {
            amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
            currency: 'INR',
            receipt: `event_${eventId.substring(0, 10)}_${Date.now()}`,
            notes: {
                eventId,
                userId: payload.userId,
            },
        };

        const order = await razorpay.orders.create(options as any) as any;

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        });
    } catch (error) {
        console.error('Razorpay Order Error:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
