import { Request, Response, NextFunction } from 'express';

interface RequestRecord {
  timestamp: number;
  endpoint?: string;
  userAgent?: string;
}

interface RateLimitOptions {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  whitelist?: string[];
  message?: string;
  standardHeaders?: boolean;
  legacyHeaders?: boolean;
}

class EnhancedRateLimiter {
  private requests: Map<string, RequestRecord[]> = new Map();
  private options: RateLimitOptions;
  private cleanupInterval: NodeJS.Timeout;

  constructor(options: RateLimitOptions) {
    this.options = {
      skipSuccessfulRequests: false,
      skipFailedRequests: false,
      whitelist: [],
      standardHeaders: true,
      legacyHeaders: false,
      message: 'Too many requests from this IP, please try again later.',
      ...options
    };

    // Clean up old entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private getKey(req: Request): string {
    // Use IP address as the key, with fallbacks
    const forwarded = req.headers['x-forwarded-for'] as string;
    const ip = forwarded ? forwarded.split(',')[0].trim() : 
               req.ip || 
               req.socket.remoteAddress || 
               req.connection?.remoteAddress ||
               'unknown';
    return ip;
  }

  private isWhitelisted(key: string): boolean {
    if (!this.options.whitelist || this.options.whitelist.length === 0) {
      return false;
    }
    return this.options.whitelist.includes(key) || 
           this.options.whitelist.includes('127.0.0.1') && (key === '::1' || key === '127.0.0.1') ||
           this.options.whitelist.includes('localhost') && (key === '::1' || key === '127.0.0.1');
  }

  private cleanup(): void {
    const now = Date.now();
    const windowStart = now - this.options.windowMs;
    
    for (const [key, records] of this.requests.entries()) {
      const validRecords = records.filter(r => r.timestamp > windowStart);
      if (validRecords.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, validRecords);
      }
    }
  }

  private setHeaders(res: Response, totalHits: number, resetTime: Date): void {
    if (this.options.standardHeaders) {
      res.set({
        'RateLimit-Limit': this.options.maxRequests.toString(),
        'RateLimit-Remaining': Math.max(0, this.options.maxRequests - totalHits).toString(),
        'RateLimit-Reset': resetTime.toISOString(),
      });
    }

    if (this.options.legacyHeaders) {
      res.set({
        'X-RateLimit-Limit': this.options.maxRequests.toString(),
        'X-RateLimit-Remaining': Math.max(0, this.options.maxRequests - totalHits).toString(),
        'X-RateLimit-Reset': Math.ceil(resetTime.getTime() / 1000).toString(),
      });
    }
  }

  public limit(req: Request, res: Response, next: NextFunction): void {
    const key = this.getKey(req);
    const now = Date.now();
    const windowStart = now - this.options.windowMs;
    const resetTime = new Date(now + this.options.windowMs);

    // Check if IP is whitelisted
    if (this.isWhitelisted(key)) {
      console.log(`[RateLimit] Whitelisted IP: ${key}`);
      return next();
    }

    // Get existing requests for this key or create a new array
    const keyRequests = this.requests.get(key) || [];
    
    // Filter out requests outside the current window
    const recentRequests = keyRequests.filter(r => r.timestamp > windowStart);
    
    // Set rate limit headers
    this.setHeaders(res, recentRequests.length, resetTime);
    
    // Check if the request limit has been reached
    if (recentRequests.length >= this.options.maxRequests) {
      const retryAfterSeconds = Math.ceil(this.options.windowMs / 1000);
      const oldestRequest = Math.min(...recentRequests.map(r => r.timestamp));
      const timeUntilReset = Math.ceil((oldestRequest + this.options.windowMs - now) / 1000);
      
      console.warn(`[RateLimit] Rate limit exceeded for IP: ${key}, endpoint: ${req.path}`);
      
      res.set('Retry-After', Math.min(retryAfterSeconds, timeUntilReset).toString());
      
      return res.status(429).json({
        success: false,
        error: 'Rate limit exceeded',
        message: this.options.message,
        details: {
          limit: this.options.maxRequests,
          windowMs: this.options.windowMs,
          retryAfter: Math.min(retryAfterSeconds, timeUntilReset),
          resetTime: resetTime.toISOString()
        },
        timestamp: new Date().toISOString()
      });
    }

    // Add current request to the list
    recentRequests.push({ 
      timestamp: now,
      endpoint: req.path,
      userAgent: req.get('User-Agent')
    });
    this.requests.set(key, recentRequests);

    console.log(`[RateLimit] Request allowed for IP: ${key}, count: ${recentRequests.length}/${this.options.maxRequests}`);
    next();
  }

  public destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

// Development and production configurations
const isDevelopment = process.env.NODE_ENV === 'development';

// Create enhanced rate limiter instance with environment-specific settings
const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || (isDevelopment ? '60000' : '900000')); // 1 min dev, 15 min prod
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || (isDevelopment ? '1000' : '100')); // Higher limit for dev

// Development whitelist (localhost, common dev IPs)
const developmentWhitelist = isDevelopment ? [
  '127.0.0.1',
  '::1',
  'localhost',
  '::ffff:127.0.0.1'
] : [];

// Custom whitelist from environment
const customWhitelist = process.env.RATE_LIMIT_WHITELIST ? 
  process.env.RATE_LIMIT_WHITELIST.split(',').map(ip => ip.trim()) : [];

const rateLimiter = new EnhancedRateLimiter({
  windowMs,
  maxRequests,
  whitelist: [...developmentWhitelist, ...customWhitelist],
  message: isDevelopment ? 
    'Rate limit exceeded. This is more lenient in development mode.' :
    'Too many requests from this IP address. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

// Graceful shutdown handler
process.on('SIGTERM', () => {
  console.log('[RateLimit] Shutting down rate limiter...');
  rateLimiter.destroy();
});

process.on('SIGINT', () => {
  console.log('[RateLimit] Shutting down rate limiter...');
  rateLimiter.destroy();
});

// Export the middleware function with error handling
export const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    rateLimiter.limit(req, res, next);
  } catch (error) {
    console.error('[RateLimit] Error in rate limiting middleware:', error);
    // In case of rate limiter failure, allow the request to proceed
    // This ensures the application remains functional even if rate limiting fails
    next();
  }
};

// Export rate limiter instance for testing
export { rateLimiter };