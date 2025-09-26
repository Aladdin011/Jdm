"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitMiddleware = void 0;
class RateLimiter {
    constructor(windowMs, maxRequests) {
        this.requests = new Map();
        this.windowMs = windowMs;
        this.maxRequests = maxRequests;
    }
    getKey(req) {
        // Use IP address as the key
        return req.ip || req.socket.remoteAddress || 'unknown';
    }
    limit(req, res, next) {
        const key = this.getKey(req);
        const now = Date.now();
        const windowStart = now - this.windowMs;
        // Get existing requests for this key or create a new array
        const keyRequests = this.requests.get(key) || [];
        // Filter out requests outside the current window
        const recentRequests = keyRequests.filter(r => r.timestamp > windowStart);
        // Check if the request limit has been reached
        if (recentRequests.length >= this.maxRequests) {
            res.status(429).json({
                message: 'Too many requests, please try again later.',
                retryAfter: Math.ceil(this.windowMs / 1000)
            });
            return;
        }
        // Add current request to the list
        recentRequests.push({ timestamp: now });
        this.requests.set(key, recentRequests);
        next();
    }
}
// Create rate limiter instance using environment variables or defaults
const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10); // 15 minutes by default
const maxRequests = parseInt(process.env.RATE_LIMIT_MAX || '100', 10); // 100 requests per window by default
const rateLimiter = new RateLimiter(windowMs, maxRequests);
const rateLimitMiddleware = (req, res, next) => {
    rateLimiter.limit(req, res, next);
};
exports.rateLimitMiddleware = rateLimitMiddleware;
//# sourceMappingURL=rateLimitMiddleware.js.map