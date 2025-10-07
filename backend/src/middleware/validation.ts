import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema, ZodError } from 'zod';
import { ValidationError } from './errorHandler';
import { logger } from '../utils/logger';
import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';

// Validation middleware factory
export const validate = (schema: {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
  headers?: ZodSchema;
}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body
      if (schema.body) {
        req.body = schema.body.parse(req.body);
      }
      
      // Validate query parameters
      if (schema.query) {
        req.query = schema.query.parse(req.query);
      }
      
      // Validate route parameters
      if (schema.params) {
        req.params = schema.params.parse(req.params);
      }
      
      // Validate headers
      if (schema.headers) {
        req.headers = schema.headers.parse(req.headers);
      }
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          value: err.code === 'invalid_type' ? undefined : (err as any).received
        }));
        
        logger.warn('Validation failed:', {
          url: req.url,
          method: req.method,
          errors: validationErrors,
          body: req.body,
          query: req.query,
          params: req.params
        });
        
        next(new ValidationError('Validation failed', { validationErrors }));
      } else {
        next(error);
      }
    }
  };
};

// Common validation schemas
export const commonSchemas = {
  // ID parameter validation
  id: z.object({
    id: z.string().uuid('Invalid ID format')
  }),
  
  // Pagination query validation
  pagination: z.object({
    page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1)
      .pipe(z.number().min(1, 'Page must be at least 1')),
    limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10)
      .pipe(z.number().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100')),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc']).optional().default('desc')
  }),
  
  // Search query validation
  search: z.object({
    q: z.string().min(1, 'Search query is required').max(100, 'Search query too long'),
    category: z.string().optional(),
    tags: z.string().optional()
  }),
  
  // Email validation
  email: z.string().email('Invalid email format').toLowerCase(),
  
  // Password validation
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password cannot exceed 128 characters'),
  
  // Name validation
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name cannot exceed 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  
  // Phone number validation
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
  
  // URL validation
  url: z.string().url('Invalid URL format'),
  
  // Date validation
  date: z.string().refine(val => validator.isISO8601(val), 'Invalid date format'),
  
  // File validation
  file: z.object({
    filename: z.string().min(1, 'Filename is required'),
    mimetype: z.string().min(1, 'File type is required'),
    size: z.number().max(5 * 1024 * 1024, 'File size cannot exceed 5MB')
  })
};

// Authentication validation schemas
export const authSchemas = {
  register: z.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
    department: z.string().optional()
  }),
  
  login: z.object({
    email: commonSchemas.email,
    password: z.string().min(1, 'Password is required'),
    rememberMe: z.boolean().optional()
  }),
  
  forgotPassword: z.object({
    email: commonSchemas.email
  }),
  
  resetPassword: z.object({
    token: z.string().min(1, 'Reset token is required'),
    password: commonSchemas.password,
    confirmPassword: z.string()
  }).refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  }),
  
  changePassword: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: commonSchemas.password,
    confirmPassword: z.string()
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  }),
  
  refreshToken: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required')
  })
};

// User validation schemas
export const userSchemas = {
  updateProfile: z.object({
    firstName: commonSchemas.name.optional(),
    lastName: commonSchemas.name.optional(),
    phone: commonSchemas.phone.optional(),
    department: z.string().optional(),
    bio: z.string().max(500, 'Bio cannot exceed 500 characters').optional()
  }),
  
  updateRole: z.object({
    role: z.enum(['user', 'admin', 'moderator'], {
      errorMap: () => ({ message: 'Invalid role' })
    })
  }),
  
  updateStatus: z.object({
    active: z.boolean()
  })
};

// Sanitization middleware
export const sanitize = (fields: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Sanitize specified fields or all string fields if none specified
      const sanitizeObject = (obj: any, fieldsToSanitize: string[] = []) => {
        if (!obj || typeof obj !== 'object') return obj;
        
        const sanitized = { ...obj };
        
        Object.keys(sanitized).forEach(key => {
          const value = sanitized[key];
          
          // Only sanitize if field is specified or if no fields specified (sanitize all)
          const shouldSanitize = fieldsToSanitize.length === 0 || fieldsToSanitize.includes(key);
          
          if (shouldSanitize && typeof value === 'string') {
            // Remove HTML tags and sanitize
            sanitized[key] = DOMPurify.sanitize(value, { 
              ALLOWED_TAGS: [],
              ALLOWED_ATTR: []
            }).trim();
            
            // Additional sanitization
            sanitized[key] = validator.escape(sanitized[key]);
          } else if (typeof value === 'object' && value !== null) {
            sanitized[key] = sanitizeObject(value, fieldsToSanitize);
          }
        });
        
        return sanitized;
      };
      
      // Sanitize request body
      if (req.body) {
        req.body = sanitizeObject(req.body, fields);
      }
      
      // Sanitize query parameters
      if (req.query) {
        req.query = sanitizeObject(req.query, fields);
      }
      
      next();
    } catch (error) {
      logger.error('Sanitization error:', error);
      next(error);
    }
  };
};

// Rate limiting validation
export const rateLimitValidation = {
  // Strict rate limiting for authentication endpoints
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    message: 'Too many authentication attempts, please try again later'
  },
  
  // General API rate limiting
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per window
    message: 'Too many requests, please try again later'
  },
  
  // File upload rate limiting
  upload: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 uploads per hour
    message: 'Too many file uploads, please try again later'
  }
};

// Custom validation helpers
export const customValidators = {
  // Check if string contains only alphanumeric characters
  isAlphanumeric: (value: string) => /^[a-zA-Z0-9]+$/.test(value),
  
  // Check if string is a valid slug
  isSlug: (value: string) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value),
  
  // Check if string is a valid hex color
  isHexColor: (value: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value),
  
  // Check if array has unique values
  hasUniqueValues: (array: any[]) => new Set(array).size === array.length,
  
  // Check if date is in the future
  isFutureDate: (date: string) => new Date(date) > new Date(),
  
  // Check if date is in the past
  isPastDate: (date: string) => new Date(date) < new Date(),
  
  // Validate file extension
  hasValidExtension: (filename: string, allowedExtensions: string[]) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension ? allowedExtensions.includes(extension) : false;
  }
};

// Validation error formatter
export const formatValidationError = (error: ZodError) => {
  return error.errors.map(err => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code,
    value: (err as any).received
  }));
};

// Export validation middleware with common schemas
export const validateAuth = {
  register: validate({ body: authSchemas.register }),
  login: validate({ body: authSchemas.login }),
  forgotPassword: validate({ body: authSchemas.forgotPassword }),
  resetPassword: validate({ body: authSchemas.resetPassword }),
  changePassword: validate({ body: authSchemas.changePassword }),
  refreshToken: validate({ body: authSchemas.refreshToken })
};

export const validateUser = {
  updateProfile: validate({ body: userSchemas.updateProfile }),
  updateRole: validate({ body: userSchemas.updateRole }),
  updateStatus: validate({ body: userSchemas.updateStatus }),
  id: validate({ params: commonSchemas.id })
};

export const validateCommon = {
  pagination: validate({ query: commonSchemas.pagination }),
  search: validate({ query: commonSchemas.search }),
  id: validate({ params: commonSchemas.id })
};