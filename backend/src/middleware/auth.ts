import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/environment';
import { logger } from '../utils/logger';
import { 
  AuthenticationError, 
  AuthorizationError
} from './errorHandler';
import { ResponseHelper, HttpStatus } from '../types/response';
import { prisma } from '../config/database';

// Simple JWT payload interface
interface JwtPayload {
  userId: number;
  email: string;
  role: string;
  department?: string;
  iat?: number;
  exp?: number;
}

// Extended request interface
export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
    department?: string;
    active: boolean;
  };
  token?: string;
}

// Generate access token
export const generateAccessToken = (user: any): string => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    department: user.department
  };
  const options: SignOptions = { expiresIn: config.jwt.expiresIn as any };
  return jwt.sign(payload, config.jwt.secret as unknown as jwt.Secret, options);
};

// Generate refresh token
export const generateRefreshToken = (user: any): string => {
  const payload = {
    userId: user.id,
    type: 'refresh'
  };
  const options: SignOptions = { expiresIn: config.jwt.refreshExpiresIn as any };
  return jwt.sign(payload, config.jwt.refreshSecret as unknown as jwt.Secret, options);
};

// Generate token pair
export const generateTokenPair = (user: any) => {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
    expiresIn: config.jwt.expiresIn
  };
};

// Extract token from request
const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  return null;
};

// Main authentication middleware
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      throw new AuthenticationError('Access token is required');
    }
    
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    
    // Get user from database
    const user = await prisma.users.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        department: true,
        active: true
      }
    });
    
    if (!user) {
      throw new AuthenticationError('User not found');
    }
    
    if (!user.active) {
      throw new AuthenticationError('Account is deactivated');
    }
    
    // Attach user to request
    req.user = user;
    req.token = token;
    
    // Log authentication with robust IP extraction to avoid typing mismatches
    const forwarded = ((req as any).headers?.['x-forwarded-for'] || (req as any).headers?.['X-Forwarded-For']);
    const ipAddress = (req as any).ip || forwarded || (req as any).socket?.remoteAddress || (req as any).connection?.remoteAddress || 'unknown';
    logger.info('User authenticated', {
      userId: user.id,
      email: user.email,
      role: user.role,
      ip: Array.isArray(ipAddress) ? ipAddress[0] : String(ipAddress)
    });
    
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new AuthenticationError('Token has expired'));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new AuthenticationError('Invalid token'));
    } else {
      next(error);
    }
  }
};

// Optional authentication middleware
export const optionalAuthenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      return next();
    }
    
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    
    const user = await prisma.users.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        department: true,
        active: true
      }
    });
    
    if (user && user.active) {
      req.user = user;
      req.token = token;
    }
    
    next();
  } catch (error) {
    // Don't throw error for optional authentication
    next();
  }
};

// Role-based authorization middleware
export const authorize = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AuthenticationError('Authentication required'));
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      const requestUrl = (req as any).url || (req as any).originalUrl || (req as any).path || '';
      logger.warn('Authorization failed', {
        userId: req.user.id,
        userRole: req.user.role,
        requiredRoles: allowedRoles,
        url: requestUrl
      });
      
      return next(new AuthorizationError(
        `Access denied. Required roles: ${allowedRoles.join(', ')}`
      ));
    }
    
    next();
  };
};

// Admin only middleware
export const adminOnly = authorize('admin');

// Self or admin middleware
export const selfOrAdmin = (getUserId: (req: AuthenticatedRequest) => number) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AuthenticationError('Authentication required'));
    }
    
    const targetUserId = getUserId(req);
    const isOwner = req.user.id === targetUserId;
    const isAdmin = req.user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      return next(new AuthorizationError(
        'Access denied. You can only access your own resources.'
      ));
    }
    
    next();
  };
};

// Refresh token middleware
export const refreshTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      throw new AuthenticationError('Refresh token is required');
    }
    
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as any;
    
    const user = await prisma.users.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        department: true,
        active: true
      }
    });
    
    if (!user) {
      throw new AuthenticationError('User not found');
    }
    
    if (!user.active) {
      throw new AuthenticationError('Account is deactivated');
    }
    
    const tokens = generateTokenPair(user);
    
    res.json(ResponseHelper.success({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        department: user.department
      },
      ...tokens
    }, 'Tokens refreshed successfully'));
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new AuthenticationError('Refresh token has expired'));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new AuthenticationError('Invalid refresh token'));
    } else {
      next(error);
    }
  }
};

// Export cleanup function
export const cleanup = async (): Promise<void> => {
  await prisma.$disconnect();
};
