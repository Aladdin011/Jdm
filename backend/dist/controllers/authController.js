"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.completeLogin = exports.refreshToken = exports.verifyCredentials = exports.profile = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../config/database");
const auth_1 = require("../middleware/auth");
const response_1 = require("../types/response");
const logger_1 = require("../utils/logger");
const register = async (req, res) => {
    try {
        logger_1.logger.info('Registration attempt started', { body: req.body });
        const { email, password, department } = req.body;
        const normalizedEmail = String(email || '').trim().toLowerCase();
        if (!normalizedEmail || !password) {
            logger_1.logger.warn('Missing email or password');
            return res.status(response_1.HttpStatus.BAD_REQUEST).json(response_1.ResponseHelper.error(response_1.ErrorCodes.MISSING_REQUIRED_FIELD, "Email and password are required"));
        }
        logger_1.logger.info('Checking if user exists');
        // Check if user already exists
        const existing = await database_1.prisma.users.findUnique({ where: { email: normalizedEmail } });
        if (existing) {
            logger_1.logger.warn('User already exists', { email });
            return res.status(response_1.HttpStatus.CONFLICT).json(response_1.ResponseHelper.error(response_1.ErrorCodes.ALREADY_EXISTS, "User with this email already exists"));
        }
        logger_1.logger.info('Hashing password');
        // Hash password with lower rounds for testing
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        logger_1.logger.info('Creating user in database');
        // Create user
        const user = await database_1.prisma.users.create({
            data: {
                email: normalizedEmail,
                password: hashedPassword,
                department,
                role: "user",
                active: true
            },
            select: {
                id: true,
                email: true,
                role: true,
                department: true,
                active: true
            }
        });
        logger_1.logger.info('Generating tokens');
        // Generate tokens
        const tokens = (0, auth_1.generateTokenPair)(user);
        logger_1.logger.info('User registered successfully', {
            userId: user.id,
            email: user.email,
            ip: req.ip
        });
        return res.status(response_1.HttpStatus.CREATED).json(response_1.ResponseHelper.success({
            user,
            ...tokens
        }, "User registered successfully"));
    }
    catch (error) {
        logger_1.logger.error('Registration error', { error: error.message, stack: error.stack, ip: req.ip });
        return res.status(response_1.HttpStatus.INTERNAL_SERVER_ERROR).json(response_1.ResponseHelper.error(response_1.ErrorCodes.INTERNAL_ERROR, "Registration failed"));
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = String(email || '').trim().toLowerCase();
        if (!normalizedEmail || !password) {
            return res.status(response_1.HttpStatus.BAD_REQUEST).json(response_1.ResponseHelper.error(response_1.ErrorCodes.MISSING_REQUIRED_FIELD, "Email and password are required"));
        }
        // Find user
        const user = await database_1.prisma.users.findUnique({
            where: { email: normalizedEmail },
            select: {
                id: true,
                email: true,
                password: true,
                role: true,
                department: true,
                active: true
            }
        });
        if (!user) {
            return res.status(response_1.HttpStatus.UNAUTHORIZED).json(response_1.ResponseHelper.error(response_1.ErrorCodes.INVALID_CREDENTIALS, "Invalid credentials"));
        }
        if (!user.active) {
            return res.status(response_1.HttpStatus.UNAUTHORIZED).json(response_1.ResponseHelper.error(response_1.ErrorCodes.ACCOUNT_DISABLED, "Account is deactivated"));
        }
        // Verify password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(response_1.HttpStatus.UNAUTHORIZED).json(response_1.ResponseHelper.error(response_1.ErrorCodes.INVALID_CREDENTIALS, "Invalid credentials"));
        }
        // Remove password from user object
        const { password: _, ...userWithoutPassword } = user;
        // Generate tokens
        const tokens = (0, auth_1.generateTokenPair)(userWithoutPassword);
        logger_1.logger.info('User logged in successfully', {
            userId: user.id,
            email: user.email,
            ip: req.ip
        });
        return res.json(response_1.ResponseHelper.success({
            user: userWithoutPassword,
            ...tokens
        }, "Login successful"));
    }
    catch (error) {
        logger_1.logger.error('Login error', { error, ip: req.ip });
        return res.status(response_1.HttpStatus.INTERNAL_SERVER_ERROR).json(response_1.ResponseHelper.error(response_1.ErrorCodes.INTERNAL_ERROR, "Login failed"));
    }
};
exports.login = login;
const profile = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(response_1.HttpStatus.UNAUTHORIZED).json(response_1.ResponseHelper.error(response_1.ErrorCodes.UNAUTHORIZED, "Authentication required"));
        }
        // Get fresh user data from database
        const userData = await database_1.prisma.users.findUnique({
            where: { id: user.id },
            select: {
                id: true,
                email: true,
                role: true,
                department: true,
                active: true,
                created_at: true,
                updated_at: true
            }
        });
        if (!userData) {
            return res.status(response_1.HttpStatus.NOT_FOUND).json(response_1.ResponseHelper.error(response_1.ErrorCodes.NOT_FOUND, "User not found"));
        }
        return res.json(response_1.ResponseHelper.success(userData, "Profile retrieved successfully"));
    }
    catch (error) {
        logger_1.logger.error('Profile retrieval error', { error, userId: req.user?.id });
        return res.status(response_1.HttpStatus.INTERNAL_SERVER_ERROR).json(response_1.ResponseHelper.error(response_1.ErrorCodes.INTERNAL_ERROR, "Failed to retrieve profile"));
    }
};
exports.profile = profile;
const verifyCredentials = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = String(email || '').trim().toLowerCase();
        if (!normalizedEmail || !password) {
            return res.status(response_1.HttpStatus.BAD_REQUEST).json(response_1.ResponseHelper.error(response_1.ErrorCodes.MISSING_REQUIRED_FIELD, "Email and password are required"));
        }
        const user = await database_1.prisma.users.findUnique({
            where: { email: normalizedEmail },
            select: {
                id: true,
                email: true,
                password: true,
                role: true,
                department: true,
                active: true
            }
        });
        if (!user) {
            return res.status(response_1.HttpStatus.UNAUTHORIZED).json(response_1.ResponseHelper.error(response_1.ErrorCodes.INVALID_CREDENTIALS, "Invalid credentials"));
        }
        if (!user.active) {
            return res.status(response_1.HttpStatus.UNAUTHORIZED).json(response_1.ResponseHelper.error(response_1.ErrorCodes.ACCOUNT_DISABLED, "Account is deactivated"));
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(response_1.HttpStatus.UNAUTHORIZED).json(response_1.ResponseHelper.error(response_1.ErrorCodes.INVALID_CREDENTIALS, "Invalid credentials"));
        }
        logger_1.logger.info('Credentials verified successfully', {
            userId: user.id,
            email: user.email,
            ip: req.ip
        });
        return res.json(response_1.ResponseHelper.success({
            success: true,
            userId: user.id,
            department: user.department || 'default'
        }, "Credentials verified successfully"));
    }
    catch (error) {
        logger_1.logger.error('Verify credentials error', { error, ip: req.ip });
        return res.status(response_1.HttpStatus.INTERNAL_SERVER_ERROR).json(response_1.ResponseHelper.error(response_1.ErrorCodes.INTERNAL_ERROR, "Credential verification failed"));
    }
};
exports.verifyCredentials = verifyCredentials;
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(response_1.HttpStatus.BAD_REQUEST).json(response_1.ResponseHelper.error(response_1.ErrorCodes.MISSING_REQUIRED_FIELD, "Refresh token is required"));
        }
        // This will be handled by the refreshTokenMiddleware
        // The middleware will validate the token and generate new tokens
    }
    catch (error) {
        logger_1.logger.error('Refresh token error', { error });
        return res.status(response_1.HttpStatus.INTERNAL_SERVER_ERROR).json(response_1.ResponseHelper.error(response_1.ErrorCodes.INTERNAL_ERROR, "Token refresh failed"));
    }
};
exports.refreshToken = refreshToken;
const completeLogin = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(response_1.HttpStatus.BAD_REQUEST).json(response_1.ResponseHelper.error(response_1.ErrorCodes.MISSING_REQUIRED_FIELD, "User ID required"));
        }
        // Convert userId to integer since the database expects an integer ID
        const userIdInt = parseInt(userId, 10);
        if (isNaN(userIdInt)) {
            return res.status(response_1.HttpStatus.BAD_REQUEST).json(response_1.ResponseHelper.error(response_1.ErrorCodes.INVALID_FORMAT, "Invalid user ID format"));
        }
        const user = await database_1.prisma.users.findUnique({
            where: { id: userIdInt },
            select: {
                id: true,
                email: true,
                role: true,
                department: true,
                active: true
            }
        });
        if (!user) {
            return res.status(response_1.HttpStatus.NOT_FOUND).json(response_1.ResponseHelper.error(response_1.ErrorCodes.NOT_FOUND, "User not found"));
        }
        if (!user.active) {
            return res.status(response_1.HttpStatus.UNAUTHORIZED).json(response_1.ResponseHelper.error(response_1.ErrorCodes.ACCOUNT_DISABLED, "Account is deactivated"));
        }
        // Generate tokens
        const tokens = (0, auth_1.generateTokenPair)(user);
        logger_1.logger.info('Login completed successfully', {
            userId: user.id,
            email: user.email,
            ip: req.ip
        });
        return res.json(response_1.ResponseHelper.success({
            user,
            // Maintain both accessToken and token for frontend compatibility
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresIn: tokens.expiresIn,
            token: tokens.accessToken,
            dashboard: user.department || 'default'
        }, "Login completed successfully"));
    }
    catch (error) {
        logger_1.logger.error('Complete login error', { error });
        return res.status(response_1.HttpStatus.INTERNAL_SERVER_ERROR).json(response_1.ResponseHelper.error(response_1.ErrorCodes.INTERNAL_ERROR, "Login completion failed"));
    }
};
exports.completeLogin = completeLogin;
//# sourceMappingURL=authController.js.map