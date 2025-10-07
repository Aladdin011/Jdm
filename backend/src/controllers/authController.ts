import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/database";
import { 
  generateTokenPair, 
  AuthenticatedRequest 
} from "../middleware/auth";
import { ResponseHelper, HttpStatus, ErrorCodes } from "../types/response";
import { logger } from "../utils/logger";

export const register = async (req: Request, res: Response) => {
  try {
    logger.info('Registration attempt started', { body: req.body });
    const { email, password, department } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();
    
    if (!normalizedEmail || !password) {
      logger.warn('Missing email or password');
      return res.status(HttpStatus.BAD_REQUEST).json(
        ResponseHelper.error(ErrorCodes.MISSING_REQUIRED_FIELD, "Email and password are required")
      );
    }
    
    logger.info('Checking if user exists');
    // Check if user already exists
    const existing = await prisma.users.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      logger.warn('User already exists', { email });
      return res.status(HttpStatus.CONFLICT).json(
        ResponseHelper.error(ErrorCodes.ALREADY_EXISTS, "User with this email already exists")
      );
    }
    
    logger.info('Hashing password');
    // Hash password with lower rounds for testing
    const hashedPassword = await bcrypt.hash(password, 10);
    
    logger.info('Creating user in database');
    // Create user
    const user = await prisma.users.create({
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
    
    logger.info('Generating tokens');
    // Generate tokens
    const tokens = generateTokenPair(user);
    
    logger.info('User registered successfully', {
      userId: user.id,
      email: user.email,
      ip: req.ip
    });
    
    return res.status(HttpStatus.CREATED).json(
      ResponseHelper.success({
        user,
        ...tokens
      }, "User registered successfully")
    );
  } catch (error) {
    logger.error('Registration error', { error: error.message, stack: error.stack, ip: req.ip });
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
      ResponseHelper.error(ErrorCodes.INTERNAL_ERROR, "Registration failed")
    );
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();
    
    if (!normalizedEmail || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json(
        ResponseHelper.error(ErrorCodes.MISSING_REQUIRED_FIELD, "Email and password are required")
      );
    }
    
    // Find user
    const user = await prisma.users.findUnique({ 
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
      return res.status(HttpStatus.UNAUTHORIZED).json(
        ResponseHelper.error(ErrorCodes.INVALID_CREDENTIALS, "Invalid credentials")
      );
    }
    
    if (!user.active) {
      return res.status(HttpStatus.UNAUTHORIZED).json(
        ResponseHelper.error(ErrorCodes.ACCOUNT_DISABLED, "Account is deactivated")
      );
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(HttpStatus.UNAUTHORIZED).json(
        ResponseHelper.error(ErrorCodes.INVALID_CREDENTIALS, "Invalid credentials")
      );
    }
    
    // Remove password from user object
    const { password: _, ...userWithoutPassword } = user;
    
    // Generate tokens
    const tokens = generateTokenPair(userWithoutPassword);
    
    logger.info('User logged in successfully', {
      userId: user.id,
      email: user.email,
      ip: req.ip
    });
    
    return res.json(
      ResponseHelper.success({
        user: userWithoutPassword,
        ...tokens
      }, "Login successful")
    );
  } catch (error) {
    logger.error('Login error', { error, ip: req.ip });
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
      ResponseHelper.error(ErrorCodes.INTERNAL_ERROR, "Login failed")
    );
  }
};

export const profile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(HttpStatus.UNAUTHORIZED).json(
        ResponseHelper.error(ErrorCodes.UNAUTHORIZED, "Authentication required")
      );
    }
    
    // Get fresh user data from database
    const userData = await prisma.users.findUnique({
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
      return res.status(HttpStatus.NOT_FOUND).json(
        ResponseHelper.error(ErrorCodes.NOT_FOUND, "User not found")
      );
    }
    
    return res.json(
      ResponseHelper.success(userData, "Profile retrieved successfully")
    );
  } catch (error) {
    logger.error('Profile retrieval error', { error, userId: req.user?.id });
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
      ResponseHelper.error(ErrorCodes.INTERNAL_ERROR, "Failed to retrieve profile")
    );
  }
};

export const verifyCredentials = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || '').trim().toLowerCase();
    
    if (!normalizedEmail || !password) {
      return res.status(HttpStatus.BAD_REQUEST).json(
        ResponseHelper.error(ErrorCodes.MISSING_REQUIRED_FIELD, "Email and password are required")
      );
    }
    
    const user = await prisma.users.findUnique({ 
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
      return res.status(HttpStatus.UNAUTHORIZED).json(
        ResponseHelper.error(ErrorCodes.INVALID_CREDENTIALS, "Invalid credentials")
      );
    }
    
    if (!user.active) {
      return res.status(HttpStatus.UNAUTHORIZED).json(
        ResponseHelper.error(ErrorCodes.ACCOUNT_DISABLED, "Account is deactivated")
      );
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(HttpStatus.UNAUTHORIZED).json(
        ResponseHelper.error(ErrorCodes.INVALID_CREDENTIALS, "Invalid credentials")
      );
    }
    
    logger.info('Credentials verified successfully', {
      userId: user.id,
      email: user.email,
      ip: req.ip
    });
    
    return res.json(
      ResponseHelper.success({
        success: true,
        userId: user.id,
        department: user.department || 'default'
      }, "Credentials verified successfully")
    );
  } catch (error) {
    logger.error('Verify credentials error', { error, ip: req.ip });
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
      ResponseHelper.error(ErrorCodes.INTERNAL_ERROR, "Credential verification failed")
    );
  }
};



export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(HttpStatus.BAD_REQUEST).json(
        ResponseHelper.error(ErrorCodes.MISSING_REQUIRED_FIELD, "Refresh token is required")
      );
    }
    
    // This will be handled by the refreshTokenMiddleware
    // The middleware will validate the token and generate new tokens
  } catch (error) {
    logger.error('Refresh token error', { error });
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
      ResponseHelper.error(ErrorCodes.INTERNAL_ERROR, "Token refresh failed")
    );
  }
};

export const completeLogin = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(HttpStatus.BAD_REQUEST).json(
        ResponseHelper.error(ErrorCodes.MISSING_REQUIRED_FIELD, "User ID required")
      );
    }
    
    // Convert userId to integer since the database expects an integer ID
    const userIdInt = parseInt(userId, 10);
    if (isNaN(userIdInt)) {
      return res.status(HttpStatus.BAD_REQUEST).json(
        ResponseHelper.error(ErrorCodes.INVALID_FORMAT, "Invalid user ID format")
      );
    }
    
    const user = await prisma.users.findUnique({ 
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
      return res.status(HttpStatus.NOT_FOUND).json(
        ResponseHelper.error(ErrorCodes.NOT_FOUND, "User not found")
      );
    }
    
    if (!user.active) {
      return res.status(HttpStatus.UNAUTHORIZED).json(
        ResponseHelper.error(ErrorCodes.ACCOUNT_DISABLED, "Account is deactivated")
      );
    }
    
    // Generate tokens
    const tokens = generateTokenPair(user);
    
    logger.info('Login completed successfully', {
      userId: user.id,
      email: user.email,
      ip: req.ip
    });
    
    return res.json(
      ResponseHelper.success({
        user,
        // Maintain both accessToken and token for frontend compatibility
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
        token: tokens.accessToken,
        dashboard: user.department || 'default'
      }, "Login completed successfully")
    );
  } catch (error) {
    logger.error('Complete login error', { error });
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
      ResponseHelper.error(ErrorCodes.INTERNAL_ERROR, "Login completion failed")
    );
  }
};
