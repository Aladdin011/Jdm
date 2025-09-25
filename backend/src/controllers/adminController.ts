import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const listUsers = async (_req: Request, res: Response) => {
  const users = await prisma.users.findMany({
    select: { id: true, email: true, role: true, created_at: true }
  });
  return res.json({ users });
};

export const assignRole = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;
  if (!id || !role) return res.status(400).json({ message: "id and role required" });
  if (!['admin', 'staff', 'user'].includes(role.toLowerCase())) return res.status(400).json({ message: "Invalid role" });
  try {
    const user = await prisma.users.update({
      where: { id: parseInt(id) },
      data: { role: role.toLowerCase() }
    });
    return res.json({ ok: true, user });
  } catch (error) {
    return res.status(404).json({ message: "User not found" });
  }
};

export const blockUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { blocked } = req.body;
  if (!id || blocked === undefined) return res.status(400).json({ message: "id and blocked flag required" });
  
  try {
    const user = await prisma.users.update({
      where: { id: parseInt(id) },
      data: { active: !blocked }
    });
    return res.json({ 
      ok: true, 
      user,
      message: blocked ? "User has been deactivated" : "User has been activated"
    });
  } catch (error) {
    return res.status(404).json({ message: "User not found" });
  }
};
