import { NextResponse } from 'next/server';

export async function POST() {
    const response = NextResponse.json({ message: 'Logout successful' });

    // Clear the auth cookie
    response.cookies.delete('auth_token');

    return response;
}
