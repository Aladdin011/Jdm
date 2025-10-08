import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();
let isConnected = false;

export const dbReadiness = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!isConnected) {
      await prisma.$connect();
      console.log('✅ Database connected successfully.');
      isConnected = true;
    }

    // Optional: Simple check query (can be removed for performance)
    await prisma.$queryRaw`SELECT 1`;

    next();
  } catch (error: any) {
    console.error('❌ Database connection error:', error.message || error);
    isConnected = false;

    return res.status(503).json({
      success: false,
      message: 'Database not ready or connection failed. Please try again later.',
      error: error.message || error,
    });
  }
};

// Graceful shutdown handling for Render
process.on('beforeExit', async () => {
  console.log('⚙️ Closing Prisma connection...');
  await prisma.$disconnect();
});