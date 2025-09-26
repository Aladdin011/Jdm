import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Check if admin user already exists
  const adminEmail = 'admin@example.com';
  const existingAdmin = await prisma.users.findUnique({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    // Create admin user if it doesn't exist
    const hashedPassword = await bcrypt.hash('password', 10);
    
    await prisma.users.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        department: 'IT',
        department_code: 'IT001'
      }
    });
    
    console.log('Admin user created successfully');
  } else {
    console.log('Admin user already exists');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });