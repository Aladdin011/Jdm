"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockUser = exports.assignRole = exports.listUsers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const listUsers = async (_req, res) => {
    const users = await prisma.users.findMany({
        select: { id: true, email: true, role: true, created_at: true }
    });
    return res.json({ users });
};
exports.listUsers = listUsers;
const assignRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    if (!id || !role)
        return res.status(400).json({ message: "id and role required" });
    if (!['admin', 'staff', 'user'].includes(role.toLowerCase()))
        return res.status(400).json({ message: "Invalid role" });
    try {
        const user = await prisma.users.update({
            where: { id: parseInt(id) },
            data: { role: role.toLowerCase() }
        });
        return res.json({ ok: true, user });
    }
    catch (error) {
        return res.status(404).json({ message: "User not found" });
    }
};
exports.assignRole = assignRole;
const blockUser = async (req, res) => {
    const { id } = req.params;
    const { blocked } = req.body;
    if (!id || blocked === undefined)
        return res.status(400).json({ message: "id and blocked flag required" });
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
    }
    catch (error) {
        return res.status(404).json({ message: "User not found" });
    }
};
exports.blockUser = blockUser;
//# sourceMappingURL=adminController.js.map