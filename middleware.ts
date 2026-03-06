import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;
    const { pathname } = request.nextUrl;

    // Public routes that should always be accessible
    const isPublicRoute =
        pathname === '/' ||
        pathname === '/login' ||
        pathname === '/signup' ||
        pathname.startsWith('/api/auth') ||
        pathname.startsWith('/explore') ||
        pathname === '/about';

    // Authentication routes (login/signup) - redirect to profile if already logged in
    if (token && (pathname === '/login' || pathname === '/signup')) {
        return NextResponse.redirect(new URL('/explore', request.url));
    }

    // Protected routes logic
    if (!token && !isPublicRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token) {
        const payload = await verifyToken(token);

        if (!payload && !isPublicRoute) {
            const response = NextResponse.redirect(new URL('/login', request.url));
            response.cookies.delete('auth_token');
            return response;
        }

        if (payload) {
            const role = payload.role as string;

            // Restrict admin routes
            if (pathname.startsWith('/admin') && role !== 'SYSTEM_ADMIN') {
                return NextResponse.redirect(new URL('/explore', request.url));
            }

            // Restrict college routes
            if (pathname.startsWith('/college') && role !== 'COLLEGE_ADMIN' && role !== 'SYSTEM_ADMIN') {
                return NextResponse.redirect(new URL('/explore', request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
