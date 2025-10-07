import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';
import { ResponseHelper, ErrorCodes, HttpStatus } from '../types/response';
import { config } from '../config/environment';

// Custom error class
export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public isOperational: boolean;
  public details?: any;

  constructor(
    message: string,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    code: string = ErrorCodes.INTERNAL_ERROR,
    isOperational: boolean = true,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Validation error class
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, HttpStatus.BAD_REQUEST, ErrorCodes.VALIDATION_ERROR, true, details);
  }
}

// Authentication error class
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, HttpStatus.UNAUTHORIZED, ErrorCodes.UNAUTHORIZED);
  }
}

// Authorization error class
export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, HttpStatus.FORBIDDEN, ErrorCodes.FORBIDDEN);
  }
}

// Not found error class
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, HttpStatus.NOT_FOUND, ErrorCodes.NOT_FOUND);
  }
}

// Conflict error class
export class ConflictError extends AppError {
  constructor(message: string = 'Resource already exists') {
    super(message, HttpStatus.CONFLICT, ErrorCodes.CONFLICT);
  }
}

// Rate limit error class
export class RateLimitError extends AppError {
  constructor(retryAfter?: number) {
    super(
      'Rate limit exceeded. Please try again later.',
      HttpStatus.TOO_MANY_REQUESTS,
      ErrorCodes.RATE_LIMIT_EXCEEDED,
      true,
      { retryAfter }
    );
  }
}

// Database error handler
const handleDatabaseError = (error: any): AppError => {
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        // Unique constraint violation
        const field = error.meta?.target as string[];
        return new ConflictError(
          `${field ? field.join(', ') : 'Resource'} already exists`
        );
      
      case 'P2025':
        // Record not found
        return new NotFoundError('Record');
      
      case 'P2003':
        // Foreign key constraint violation
        return new ValidationError('Invalid reference to related resource');
      
      case 'P2014':
        // Required relation violation
        return new ValidationError('Required relation is missing');
      
      default:
        logger.error('Unhandled Prisma error:', { code: error.code, message: error.message });
        return new AppError(
          'Database operation failed',
          HttpStatus.INTERNAL_SERVER_ERROR,
          ErrorCodes.DATABASE_ERROR
        );
    }
  }
  
  if (error instanceof PrismaClientValidationError) {
    return new ValidationError('Invalid data provided', {
      prismaError: config.nodeEnv === 'development' ? error.message : undefined
    });
  }
  
  return new AppError(
    'Database error occurred',
    HttpStatus.INTERNAL_SERVER_ERROR,
    ErrorCodes.DATABASE_ERROR
  );
};

// JWT error handler
const handleJWTError = (error: JsonWebTokenError | TokenExpiredError): AppError => {
  if (error instanceof TokenExpiredError) {
    return new AppError(
      'Token has expired',
      HttpStatus.UNAUTHORIZED,
      ErrorCodes.TOKEN_EXPIRED
    );
  }
  
  return new AppError(
    'Invalid token',
    HttpStatus.UNAUTHORIZED,
    ErrorCodes.INVALID_TOKEN
  );
};

// Zod validation error handler
const handleZodError = (error: ZodError): ValidationError => {
  const validationErrors = error.issues.map(issue => ({
    field: issue.path?.join('.') || '',
    message: issue.message,
    code: issue.code,
    // received exists for invalid_type issues; include if present
    value: (issue as any).received
  }));
  
  return new ValidationError('Validation failed', { validationErrors });
};

// Main error handler middleware
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let appError: AppError;
  
  // Convert known errors to AppError
  if (error instanceof AppError) {
    appError = error;
  } else if (error instanceof ZodError) {
    appError = handleZodError(error);
  } else if (error instanceof JsonWebTokenError || error instanceof TokenExpiredError) {
    appError = handleJWTError(error);
  } else if (error.name === 'PrismaClientKnownRequestError' || error.name === 'PrismaClientValidationError') {
    appError = handleDatabaseError(error);
  } else {
    // Unknown error
    appError = new AppError(
      config.nodeEnv === 'production' ? 'Something went wrong' : error.message,
      HttpStatus.INTERNAL_SERVER_ERROR,
      ErrorCodes.INTERNAL_ERROR,
      false
    );
  }
  
  // Log error
  const logData = {
    error: {
      message: appError.message,
      code: appError.code,
      statusCode: appError.statusCode,
      stack: config.nodeEnv === 'development' ? appError.stack : undefined,
      details: appError.details
    },
    request: {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: req.method !== 'GET' ? req.body : undefined,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    },
    user: (req as any).user || null
  };
  
  if (appError.statusCode >= 500) {
    logger.error('Server error occurred:', logData);
  } else {
    logger.warn('Client error occurred:', logData);
  }
  
  // Send error response
  const errorResponse = ResponseHelper.error(
    appError.code,
    appError.message,
    config.nodeEnv === 'development' ? {
      stack: appError.stack,
      details: appError.details
    } : appError.details,
    (req as any).requestId
  );
  
  res.status(appError.statusCode).json(errorResponse);
};

// Async error wrapper
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// 404 handler
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const error = new NotFoundError(`Route ${req.originalUrl}`);
  next(error);
};

// Unhandled rejection handler
export const handleUnhandledRejection = () => {
  process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    logger.error('Unhandled Rejection:', { reason, promise });
    
    // Graceful shutdown
    process.exit(1);
  });
};

// Uncaught exception handler
export const handleUncaughtException = () => {
  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', error);
    
    // Graceful shutdown
    process.exit(1);
  });
};