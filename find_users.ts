import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const users = await prisma.user.findMany();
  console.log("Users currently in DB:", users.map(u => ({ email: u.email, role: u.role, name: u.name })));
  
  let admin = users.find(u => u.role === 'ADMIN');
  if (!admin) {
    console.log("No admin found. Creating admin@test.com...");
    const hashedPassword = await bcrypt.hash('admin123', 10);
    admin = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        name: 'Admin User',
        role: 'ADMIN',
        password: hashedPassword,
      }
    });
    console.log("Created admin:", admin.email);
  } else {
    console.log("Admin exists:", admin.email);
    console.log("Resetting password to 'admin123' for access...");
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.update({
      where: { id: admin.id },
      data: { password: hashedPassword }
    });
    console.log("Reset done.");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
