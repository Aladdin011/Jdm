"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profile = exports.login = exports.register = void 0;
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
//# sourceMappingURL=authController.js.map