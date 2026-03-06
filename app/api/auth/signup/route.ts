import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { firstName, lastName, email, accountType, password, collegeName, adminSecret } = body;

        console.log(`Processing signup for: ${email}, Account Type: ${accountType}`);

        if (!firstName || !lastName || !email || !password || !accountType) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const passwordHash = await hashPassword(password);
        const role = accountType === 'college' ? 'COLLEGE_ADMIN' : 'STUDENT';

        if (role === 'COLLEGE_ADMIN') {
            try {
                const secretPath = path.join(process.cwd(), 'secret_password.txt');
                const secretFileContent = fs.readFileSync(secretPath, 'utf-8');
                const match = secretFileContent.match(/password=(.+)/);
                const expectedSecret = match ? match[1].trim() : null;

                if (!expectedSecret || adminSecret !== expectedSecret) {
                    return NextResponse.json({ error: 'Invalid or missing Admin Secret Password' }, { status: 403 });
                }
            } catch (fsError) {
                console.error('Error reading secret password file:', fsError);
                return NextResponse.json({ error: 'Server configuration error regarding admin secrets.' }, { status: 500 });
            }
        }

        if (!collegeName) {
            return NextResponse.json({ error: 'Institution Name is required.' }, { status: 400 });
        }

        const normalizedCollegeName = collegeName.trim();

        const college = await prisma.college.upsert({
            where: { name: normalizedCollegeName },
            update: {},
            create: {
                name: normalizedCollegeName,
                isVerified: role === 'COLLEGE_ADMIN' // Auto-verify if an admin signs up (or you can keep it false)
            }
        });
        const collegeId = college.id;

        const user = await prisma.user.create({
            data: { firstName, lastName, email, passwordHash, role, collegeId }
        });

        const token = await signToken({
            userId: user.id,
            email: user.email,
            role: user.role,
            collegeId: user.collegeId
        });

        const cookieStore = await cookies();
        cookieStore.set({
            name: 'auth_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });

        return NextResponse.json({
            message: 'User created successfully',
            user: { id: user.id, firstName: user.firstName, role: user.role }
        }, { status: 201 });

    } catch (error: any) {
        console.error('Signup API error:', error);
        return NextResponse.json({
            error: `Registration failed. Please try again or contact support. Details: ${error.message}`
        }, { status: 500 });
    }
}
