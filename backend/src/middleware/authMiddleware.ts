import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return res.status(401).json({ message: "No token provided" });
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    const user = await prisma.users.findUnique({ where: { id: payload.userId } });
    if (!user) return res.status(404).json({ message: "User not found" });
    (req as any).user = { userId: user.id, role: user.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!user || (user.role.toLowerCase() !== "admin")) return res.status(403).json({ message: "Forbidden" });
  next();
};
