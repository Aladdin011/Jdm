"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateDepartment = exports.blockUser = exports.assignRole = exports.listUsers = void 0;
const database_1 = require("../config/database");
const listUsers = async (_req, res) => {
    const users = await database_1.prisma.users.findMany({
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
        const user = await database_1.prisma.users.update({
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
        const user = await database_1.prisma.users.update({
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
const updateDepartment = async (req, res) => {
    const { id } = req.params;
    const { department } = req.body;
    if (!id || !department)
        return res.status(400).json({ message: "id and department required" });
    try {
        const user = await database_1.prisma.users.update({
            where: { id: parseInt(id) },
            data: { department }
        });
        return res.json({ ok: true, user, message: "Department updated successfully" });
    }
    catch (error) {
        return res.status(404).json({ message: "User not found" });
    }
};
exports.updateDepartment = updateDepartment;
const deleteUser = async (req, res) => {
    const { id } = req.params;
    if (!id)
        return res.status(400).json({ message: "id required" });
    try {
        await database_1.prisma.users.delete({ where: { id: parseInt(id) } });
        return res.json({ ok: true, message: "User deleted successfully" });
    }
    catch (error) {
        return res.status(404).json({ message: "User not found" });
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=adminController.js.map