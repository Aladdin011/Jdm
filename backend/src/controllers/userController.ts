import { Request, Response } from 'express';
import { prisma } from '../config/database';

// Public (authenticated) users listing for chat/communication features
// Returns minimal safe fields for directory display
export const listUsersPublic = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        department: true,
        active: true,
        created_at: true,
      },
    });

    // Return in a simple shape consistent with existing admin list
    return res.json({ users });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
};