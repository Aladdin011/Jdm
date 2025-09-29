"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeLogin = exports.verifyDepartmentCode = exports.verifyCredentials = exports.profile = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const register = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
    }
    const existing = await prisma.users.findUnique({ where: { email } });
    if (existing) {
        return res.status(400).json({ message: "User with this email already exists" });
    }
    const hash = await bcryptjs_1.default.hash(password, 10);
    const user = await prisma.users.create({
        data: {
            email,
            password: hash,
            role: "USER",
        }
    });
    return res.status(201).json({ id: user.id, email: user.email, role: user.role });
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: "Email and password required" });
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user)
        return res.status(401).json({ message: "Invalid credentials" });
    const ok = await bcryptjs_1.default.compare(password, user.password);
    if (!ok)
        return res.status(401).json({ message: "Invalid credentials" });
    const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: (process.env.JWT_EXPIRES_IN || "7d") });
    return res.json({ token });
};
exports.login = login;
const profile = async (req, res) => {
    const payload = req.user;
    const user = await prisma.users.findUnique({
        where: { id: payload.userId },
        select: { id: true, email: true, role: true }
    });
    if (!user)
        return res.status(404).json({ message: "User not found" });
    return res.json(user);
};
exports.profile = profile;
const verifyCredentials = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password required"
        });
    }
    try {
        const user = await prisma.users.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }
        // Check if user belongs to a department that requires a code
        const requiresDepartmentCode = user.department !== null;
        return res.json({
            success: true,
            requiresDepartmentCode,
            userId: user.id,
            department: user.department || '',
            message: "Credentials verified successfully"
        });
    }
    catch (error) {
        console.error("Error verifying credentials:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while verifying credentials"
        });
    }
};
exports.verifyCredentials = verifyCredentials;
const verifyDepartmentCode = async (req, res) => {
    const { userId, departmentCode } = req.body;
    if (!userId || !departmentCode) {
        return res.status(400).json({
            success: false,
            message: "User ID and department code required"
        });
    }
    try {
        const user = await prisma.users.findUnique({
            where: { id: userId }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        // Verify department code logic
        // This is a simplified example - you would typically check against stored codes
        const isValidCode = user.department_code === departmentCode;
        if (!isValidCode) {
            return res.status(401).json({
                success: false,
                message: "Invalid department code"
            });
        }
        // Generate token for authenticated user
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: (process.env.JWT_EXPIRES_IN || "7d") });
        // Return user data and token
        return res.json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                department: user.department
                // Note: firstName and lastName are not in the schema
            },
            token,
            dashboard: user.department || 'default'
        });
    }
    catch (error) {
        console.error("Error verifying department code:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while verifying department code"
        });
    }
};
exports.verifyDepartmentCode = verifyDepartmentCode;
const completeLogin = async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID required"
        });
    }
    try {
        const user = await prisma.users.findUnique({
            where: { id: userId }
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        // Generate token for authenticated user
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: (process.env.JWT_EXPIRES_IN || "7d") });
        // Return user data and token
        return res.json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                department: user.department
                // Note: firstName and lastName are not in the schema
            },
            token,
            dashboard: 'default'
        });
    }
    catch (error) {
        console.error("Error completing login:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while completing login"
        });
    }
};
exports.completeLogin = completeLogin;
//# sourceMappingURL=authController.js.map