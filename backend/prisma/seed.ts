import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Seed accounts matching the frontend SeedAccounts.ts
const seedAccounts = [
  {
    email: 'admin@jdmarcng.com',
    password: 'Admin@123',
    role: 'admin',
    department: 'Admin'
  },
  {
    email: 'accounts@jdmarcng.com',
    password: 'Acc@123',
    role: 'staff',
    department: 'Accounts'
  },
  {
    email: 'accounting@jdmarcng.com',
    password: 'Acct@123',
    role: 'staff',
    department: 'Accounting'
  },
  {
    email: 'busadmin@jdmarcng.com',
    password: 'BA@123',
    role: 'staff',
    department: 'Business Administration'
  },
  {
    email: 'busdev@jdmarcng.com',
    password: 'BD@123',
    role: 'staff',
    department: 'Executive Assistant'
  },
  {
    email: 'marketing@jdmarcng.com',
    password: 'Mkt@123',
    role: 'staff',
    department: 'Digital Marketing'
  },
  {
    email: 'hr@jdmarcng.com',
    password: 'Hr@123',
    role: 'staff',
    department: 'HR'
  },
  {
    email: 'projects@jdmarcng.com',
    password: 'Proj@123',
    role: 'staff',
    department: 'Projects'
  },
  {
    email: 'secretariat@jdmarcng.com',
    password: 'Sec@123',
    role: 'staff',
    department: 'Secretariat'
  },
  {
    email: 'general@jdmarcng.com',
    password: 'Gen@123',
    role: 'user',
    department: 'General Users'
  }
];

async function main() {
  console.log('Starting database seeding...');
  
  for (const account of seedAccounts) {
    const existingUser = await prisma.users.findUnique({
      where: { email: account.email }
    });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(account.password, 10);
      
      await prisma.users.create({
        data: {
          email: account.email,
          password: hashedPassword,
          role: account.role,
          department: account.department,
          active: true
        }
      });
      
      console.log(`Created user: ${account.email}`);
    } else {
      console.log(`User already exists: ${account.email}`);
    }
  }
  
  console.log('Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });