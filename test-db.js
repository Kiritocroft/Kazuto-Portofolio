
const { PrismaClient } = require('@prisma/client');

async function main() {
  console.log('Starting DB check...');
  try {
    const prisma = new PrismaClient();
    await prisma.$connect();
    console.log('Connected.');

    const projectCount = await prisma.project.count();
    console.log('Project count:', projectCount);

    if (prisma.experience) {
        const experienceCount = await prisma.experience.count();
        console.log('Experience count:', experienceCount);
    } else {
        console.error('prisma.experience is UNDEFINED');
        throw new Error('Prisma Client out of sync');
    }

    await prisma.$disconnect();
  } catch (e) {
    console.error('DB Error:', e);
    process.exit(1);
  }
}

main();
