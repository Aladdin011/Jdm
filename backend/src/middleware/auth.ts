import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '@/utils/database';
import { logger, logSecurityEvent } from '@/utils/logger';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        sessionId: string;
        role: string;
        email: string;
      };
    }
  }
}

interface JWTPayload {
  userId: string;
  sessionId: string;
  type: 'access' | 'refresh';
  iat: number;
  exp: number;
}

// Main authentication middleware
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access token is required'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify JWT token
    let decoded: JWTPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    } catch (jwtError) {
      logSecurityEvent('invalid_token_attempt', {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        token: token.substring(0, 20) + '...' // Log partial token for debugging
      });

      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    // Check if it's an access token
    if (decoded.type !== 'access') {
      return res.status(401).json({
        success: false,
        error: 'Invalid token type'
      });
    }

    // Find user session
    const session = await prisma.userSession.findFirst({
      where: {
        id: decoded.sessionId,
        userId: decoded.userId,
        token,
        isActive: true,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
            isEmailVerified: true
          }
        }
      }
    });

    if (!session) {
      logSecurityEvent('invalid_session_attempt', {
        userId: decoded.userId,
        sessionId: decoded.sessionId,
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });

      return res.status(401).json({
        success: false,
        error: 'Session not found or expired'
      });
    }

    // Check if user is active
    if (!session.user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated'
      });
    }

    // Attach user to request
    req.user = {
      userId: session.user.id,
      sessionId: session.id,
      role: session.user.role,
      email: session.user.email
    };

    // Update session last activity
    await prisma.userSession.update({
      where: { id: session.id },
      data: { updatedAt: new Date() }
    });

    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// Optional authentication middleware (for endpoints that work with or without auth)
export const optionalAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without authentication
    }

    // Use the main auth middleware but don't return errors
    await authMiddleware(req, res, (error) => {
      if (error) {
        // Log the error but continue
        logger.warn('Optional auth failed:', error);
      }
      next();
    });
  } catch (error) {
    logger.warn('Optional auth middleware error:', error);
    next(); // Continue even if auth fails
  }
};

// Role-based authorization middleware
export const requireRole = (allowedRoles: string | string[]) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      logSecurityEvent('unauthorized_access_attempt', {
        userId: req.user.userId,
        requiredRoles: roles,
        userRole: req.user.role,
        endpoint: req.path,
        ip: req.ip
      });

      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Admin role middleware
export const requireAdmin = requireRole(['ADMIN', 'SUPER_ADMIN']);

// Manager or above middleware
export const requireManager = requireRole(['PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN']);

// Professional roles middleware (contractors, architects, engineers)
export const requireProfessional = requireRole([
  'CONTRACTOR', 'ARCHITECT', 'ENGINEER', 'PROJECT_MANAGER', 'ADMIN', 'SUPER_ADMIN'
]);

// Email verification middleware
export const requireEmailVerification = (req: Request, res: Response, next: NextFunction) => {
  // This would need user data, typically used after authMiddleware
  // For now, we'll assume this check is done in routes that need it
  next();
};

// Rate limiting by user
const userRateLimits = new Map<string, { count: number; resetTime: number }>();

export const userRateLimit = (maxRequests: number = 100, windowMinutes: number = 15) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(); // Skip rate limiting for unauthenticated requests
    }

    const userId = req.user.userId;
    const now = Date.now();
    const windowMs = windowMinutes * 60 * 1000;
    
    const current = userRateLimits.get(userId);
    
    if (!current || now > current.resetTime) {
      userRateLimits.set(userId, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    if (current.count >= maxRequests) {
      logSecurityEvent('user_rate_limit_exceeded', {
        userId,
        maxRequests,
        windowMinutes,
        ip: req.ip
      });

      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please try again later.',
        retryAfter: Math.ceil((current.resetTime - now) / 1000)
      });
    }
    
    current.count++;
    userRateLimits.set(userId, current);
    
    next();
  };
};

// API key authentication (for external integrations)
export const apiKeyAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.headers['x-api-key'] as string;
    
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        error: 'API key is required'
      });
    }

    // In a real implementation, you'd store API keys in the database
    // For now, we'll use environment variables
    const validApiKeys = process.env.API_KEYS?.split(',') || [];
    
    if (!validApiKeys.includes(apiKey)) {
      logSecurityEvent('invalid_api_key_attempt', {
        apiKey: apiKey.substring(0, 8) + '...', // Log partial key
        ip: req.ip,
        userAgent: req.headers['user-agent']
      });

      return res.status(401).json({
        success: false,
        error: 'Invalid API key'
      });
    }

    // You could attach API key info to req for logging
    req.user = {
      userId: 'api-user',
      sessionId: 'api-session',
      role: 'API',
      email: 'api@jdmarc.com'
    };

    next();
  } catch (error) {
    logger.error('API key auth error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

// IP whitelist middleware (for sensitive endpoints)
export const ipWhitelist = (allowedIPs: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = req.ip || req.socket.remoteAddress;
    
    if (!allowedIPs.includes(clientIP)) {
      logSecurityEvent('ip_not_whitelisted', {
        clientIP,
        allowedIPs,
        endpoint: req.path
      });

      return res.status(403).json({
        success: false,
        error: 'Access denied from this IP address'
      });
    }

    next();
  };
};

// Two-factor authentication middleware (placeholder for future implementation)
export const require2FA = (req: Request, res: Response, next: NextFunction) => {
  // This would check if the user has 2FA enabled and if the current session is 2FA verified
  // For now, we'll just pass through
  next();
};

// Session validation (check if session is still valid)
export const validateSession = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return next();
    }

    const session = await prisma.userSession.findUnique({
      where: { id: req.user.sessionId }
    });

    if (!session || !session.isActive || session.expiresAt < new Date()) {
      return res.status(401).json({
        success: false,
        error: 'Session expired. Please login again.'
      });
    }

    next();
  } catch (error) {
    logger.error('Session validation error:', error);
    next(); // Don't block the request on validation errors
  }
};

// Clean expired user rate limits
setInterval(() => {
  const now = Date.now();
  for (const [userId, data] of userRateLimits.entries()) {
    if (now > data.resetTime) {
      userRateLimits.delete(userId);
    }
  }
}, 5 * 60 * 1000); // Clean every 5 minutes

export default authMiddleware;
