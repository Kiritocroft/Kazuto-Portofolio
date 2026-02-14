
const { PrismaClient } = require('@prisma/client');

// Try adding standard options
const url = "mongodb+srv://nabiryuu:KazutoGay123@kiryuu.a9joirx.mongodb.net/kazuto_portfolio?retryWrites=true&w=majority";

console.log('Testing URL:', url);
process.env.DATABASE_URL = url;

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function main() {
  try {
    console.log('Connecting to database...');
    await prisma.$connect();
    console.log('Connected successfully!');
    
    console.log('Fetching projects...');
    // Use a simple count first to be safe
    const count = await prisma.project.count();
    console.log(`Found ${count} projects.`);
    
  } catch (error) {
    console.error('Error connecting to database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
