const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const testUser = await prisma.user.findUnique({
            where: { email: 'test_connection@example.com' }
        });
        console.log('Database connection successful');
        console.log('Test User:', testUser);
    } catch (err) {
        console.error('Database connection failed:', err);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
