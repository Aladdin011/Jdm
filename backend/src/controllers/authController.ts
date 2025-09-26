import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }
  const existing = await prisma.users.findUnique({ where: { email } });
  if (existing) {
    return res.status(400).json({ message: "User with this email already exists" });
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.users.create({
    data: {
      email,
      password: hash,
      role: "USER",
    }
  });
  return res.status(201).json({ id: user.id, email: user.email, role: user.role });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: "Email and password required" });
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as jwt.SignOptions['expiresIn'] });
  return res.json({ token });
};

export const profile = async (req: Request, res: Response) => {
  const payload = (req as any).user;
  const user = await prisma.users.findUnique({
    where: { id: payload.userId },
    select: { id: true, email: true, role: true }
  });
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json(user);
};
