import type { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

// Single PrismaClient instance to avoid repeated connections across requests
const prisma = new PrismaClient();

let isConnected = false;

async function ensureConnection() {
  if (isConnected) return true;
  try {
    await prisma.$connect();
    isConnected = true;
    console.log('[Render::DB] Connected to Prisma');
    return true;
  } catch (err) {
    console.error('[Render::DB] Prisma connection failed', err);
    isConnected = false;
    return false;
  }
}

export async function dbReadiness(req: Request, res: Response, next: NextFunction) {
  const ok = await ensureConnection();
  if (!ok) {
    return res.status(503).json({ success: false, message: 'Database not ready' });
  }
  return next();
}

// Safe shutdown to avoid dangling connections during Render restarts
process.on('beforeExit', async () => {
  try {
    await prisma.$disconnect();
    isConnected = false;
  } catch (err) {
    console.error('[Render::DB] Error during disconnect', err);
  }
});