const { SignJWT } = require('jose');

async function testToken() {
    try {
        const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-for-development-only-please-change');
        console.log('Using secret length:', JWT_SECRET.length);

        const token = await new SignJWT({ userId: '123' })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('7d')
            .sign(JWT_SECRET);

        console.log('Token generated:', !!token);
    } catch (err) {
        console.error('Token generation failed:', err);
    }
}

testToken();
