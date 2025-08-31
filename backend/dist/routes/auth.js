"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const router = express_1.default.Router();
const users = [
    {
        id: '1',
        email: 'admin@jdmarcng.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        company: 'JD Marc Limited',
        isVerified: true,
    },
    {
        id: '2',
        email: 'user@example.com',
        password: 'user123',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        company: 'Example Corp',
        isVerified: true,
    },
];
router.post('/login', (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
            });
        }
        const user = users.find((u) => u.email === email);
        if (!user || user.password !== password) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }
        const token = `mock-jwt-token-${(0, uuid_1.v4)()}`;
        const { password: _, ...userData } = user;
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: userData,
                token,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
router.post('/register', (req, res) => {
    try {
        const { email, password, firstName, lastName, company } = req.body;
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: 'Required fields missing',
            });
        }
        const existingUser = users.find((u) => u.email === email);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists',
            });
        }
        const newUser = {
            id: (0, uuid_1.v4)(),
            email,
            password,
            firstName,
            lastName,
            role: 'user',
            company: company || '',
            isVerified: false,
        };
        console.log('New user registered:', newUser);
        const token = `mock-jwt-token-${(0, uuid_1.v4)()}`;
        const { password: _, ...userData } = newUser;
        return res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                user: userData,
                token,
            },
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map