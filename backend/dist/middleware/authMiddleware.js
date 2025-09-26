"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOnly = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
        return res.status(401).json({ message: "No token provided" });
    const token = authHeader.split(" ")[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await prisma.users.findUnique({ where: { id: payload.userId } });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        req.user = { userId: user.id, role: user.role };
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};
exports.authMiddleware = authMiddleware;
const adminOnly = (req, res, next) => {
    const user = req.user;
    if (!user || (user.role.toLowerCase() !== "admin"))
        return res.status(403).json({ message: "Forbidden" });
    next();
};
exports.adminOnly = adminOnly;
//# sourceMappingURL=authMiddleware.js.map