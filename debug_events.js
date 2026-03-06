const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');

async function main() {
    const events = await prisma.event.findMany({
        select: {
            id: true,
            title: true,
            imageUrl: true,
            certificateTemplateUrl: true
        }
    });
    fs.writeFileSync('events_debug.json', JSON.stringify(events, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
