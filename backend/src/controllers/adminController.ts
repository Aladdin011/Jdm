import { Request, Response } from 'express';
import { prisma } from '../config/database';

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

export const updateDepartment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { department } = req.body;
  if (!id || !department) return res.status(400).json({ message: "id and department required" });

  try {
    const user = await prisma.users.update({
      where: { id: parseInt(id) },
      data: { department }
    });
    return res.json({ ok: true, user, message: "Department updated successfully" });
  } catch (error) {
    return res.status(404).json({ message: "User not found" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ message: "id required" });

  try {
    await prisma.users.delete({ where: { id: parseInt(id) } });
    return res.json({ ok: true, message: "User deleted successfully" });
  } catch (error) {
    return res.status(404).json({ message: "User not found" });
  }
};

// Admin dashboard summary endpoint
export const getDashboardSummary = async (_req: Request, res: Response) => {
  try {
    const totalUsers = await prisma.users.count();
    const activeUsers = await prisma.users.count({ where: { active: true } });
    const admins = await prisma.users.count({ where: { role: 'admin' } });
    const departmentsAgg = await prisma.users.groupBy({
      by: ['department'],
      _count: { department: true },
    });

    const departmentCounts = departmentsAgg
      .filter((d: any) => d.department)
      .map((d: any) => ({ department: d.department, count: d._count.department }));

    return res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        admins,
        departmentCounts,
      },
      message: 'Admin dashboard summary fetched successfully',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch dashboard summary' });
  }
};
