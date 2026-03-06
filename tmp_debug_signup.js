const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const { SignJWT } = require('jose');

async function testSignup() {
    const email = 'debug_user_' + Date.now() + '@example.com';
    const password = 'Password123!';
    const firstName = 'Debug';
    const lastName = 'User';

    try {
        console.log('1. Hashing password...');
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        console.log('2. Creating user in DB...');
        const user = await prisma.user.create({
            data: {
                firstName,
                lastName,
                email,
                passwordHash,
                role: 'STUDENT',
                collegeId: null
            }
        });
        console.log('User created: ID =', user.id);

        console.log('3. Signing token...');
        const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-for-development-only-please-change');
        const token = await new SignJWT({ userId: user.id, email: user.email, role: user.role, collegeId: user.collegeId })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('7d')
            .sign(JWT_SECRET);
        console.log('Token signed successfully:', !!token);

    } catch (err) {
        console.error('Signup simulation failed:', err);
    }
}

testSignup();
