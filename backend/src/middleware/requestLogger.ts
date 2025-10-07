import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Interface for request logging data
interface RequestLogData {
  method: string;
  url: string;
  ip: string;
  userAgent?: string;
  userId?: number;
  statusCode?: number;
  responseTime?: number;
  contentLength?: number;
}

// Request logger middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  
  // Get basic request information
  const logData: RequestLogData = {
    method: req.method,
    url: req.url,
    ip: req.ip || req.connection.remoteAddress || 'unknown',
    userAgent: req.get('User-Agent')
  };
  
  // Add user ID if authenticated
  if ((req as any).user) {
    logData.userId = (req as any).user.id;
  }
  
  // Log incoming request
  logger.info('Incoming request', {
    ...logData,
    headers: {
      'content-type': req.get('Content-Type'),
      'content-length': req.get('Content-Length'),
      'authorization': req.get('Authorization') ? '[REDACTED]' : undefined
    },
    query: Object.keys(req.query).length > 0 ? req.query : undefined,
    body: req.method !== 'GET' && req.body ? sanitizeBody(req.body) : undefined
  });
  
  // Override res.end to capture response data
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any) {
    const responseTime = Date.now() - startTime;
    
    // Log response
    logger.info('Request completed', {
      ...logData,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      contentLength: res.get('Content-Length')
    });
    
    // Call original end method
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};

// Sanitize request body for logging (remove sensitive data)
function sanitizeBody(body: any): any {
  if (!body || typeof body !== 'object') {
    return body;
  }
  
  const sensitiveFields = [
    'password',
    'confirmPassword',
    'currentPassword',
    'newPassword',
    'token',
    'refreshToken',
    'accessToken',
    'secret',
    'key',
    'apiKey',
    'authorization'
  ];
  
  const sanitized = { ...body };
  
  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }
  
  return sanitized;
}

// Export default
export default requestLogger;