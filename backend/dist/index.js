"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const environment_1 = require("./config/environment");
const logger_1 = require("./utils/logger");
const errorHandler_1 = require("./middleware/errorHandler");
const requestLogger_1 = require("./middleware/requestLogger");
const auth_1 = require("./middleware/auth");
const database_1 = require("./config/database");
// Import routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const healthRoutes_1 = __importDefault(require("./routes/healthRoutes"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.port = environment_1.config.server.port;
        this.initializeMiddleware();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }
    initializeMiddleware() {
        // Security middleware
        this.app.use((0, helmet_1.default)({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                    scriptSrc: ["'self'"],
                    imgSrc: ["'self'", "data:", "https:"],
                },
            },
        }));
        // CORS configuration
        this.app.use((0, cors_1.default)({
            origin: environment_1.config.cors.origin,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Skip-Auth'],
        }));
        // Compression and parsing
        this.app.use((0, compression_1.default)());
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
        // General API rate limiting
        const generalLimiter = (0, express_rate_limit_1.default)({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: environment_1.config.rateLimit.maxRequests,
            message: {
                error: 'Too many requests',
                message: 'Rate limit exceeded. Please try again later.',
                retryAfter: 900
            },
            standardHeaders: true,
            legacyHeaders: false,
        });
        // More lenient rate limiting for authentication endpoints
        const authLimiter = (0, express_rate_limit_1.default)({
            windowMs: 5 * 60 * 1000, // 5 minutes
            max: 20, // 20 requests per 5 minutes for auth endpoints
            message: {
                error: 'Too many authentication requests',
                message: 'Too many login attempts. Please wait a few minutes and try again.',
                retryAfter: 300
            },
            standardHeaders: true,
            legacyHeaders: false,
            skip: (req) => {
                // Skip rate limiting in development mode
                return process.env.NODE_ENV === 'development';
            }
        });
        // Apply general rate limiting to all API routes
        this.app.use('/api', generalLimiter);
        // Apply specific auth rate limiting to auth endpoints
        this.app.use('/api/auth', authLimiter);
        // Request logging
        this.app.use(requestLogger_1.requestLogger);
    }
    initializeRoutes() {
        // Health check (no auth required)
        this.app.use('/api/health', healthRoutes_1.default);
        // Public routes
        this.app.use('/api/auth', authRoutes_1.default);
        // Protected routes
        this.app.use('/api/admin', auth_1.authenticate, adminRoutes_1.default);
        this.app.use('/api/users', auth_1.authenticate, userRoutes_1.default);
        // Root endpoint
        this.app.get('/', (_req, res) => {
            const response = {
                success: true,
                data: {
                    project: 'JD Marc Backend API',
                    version: '2.0.0',
                    status: 'operational'
                },
                message: 'API is running successfully'
            };
            res.json(response);
        });
        // 404 handler
        this.app.use('*', (_req, res) => {
            const response = {
                success: false,
                data: null,
                message: 'Endpoint not found',
                error: {
                    code: 'ENDPOINT_NOT_FOUND',
                    message: 'The requested endpoint does not exist'
                }
            };
            res.status(404).json(response);
        });
    }
    initializeErrorHandling() {
        this.app.use(errorHandler_1.errorHandler);
    }
    async start() {
        // Start server without blocking on DB
        this.app.listen(this.port, () => {
            logger_1.logger.info(`Server running on port ${this.port}`);
            logger_1.logger.info(`Environment: ${environment_1.config.nodeEnv}`);
            logger_1.logger.info(`API Documentation: http://localhost:${this.port}/api/docs`);
        });
        // Kick off DB connection retries in background
        (0, database_1.connectDatabaseWithRetry)().catch((err) => {
            logger_1.logger.error('Background DB connection failed:', err);
        });
    }
    getApp() {
        return this.app;
    }
}
// Graceful shutdown
process.on('SIGTERM', () => {
    logger_1.logger.info('SIGTERM received, shutting down gracefully');
    process.exit(0);
});
process.on('SIGINT', () => {
    logger_1.logger.info('SIGINT received, shutting down gracefully');
    process.exit(0);
});
process.on('unhandledRejection', (reason, promise) => {
    logger_1.logger.error('Unhandled promise rejection:', { reason, promise });
    process.exit(1);
});
process.on('uncaughtException', (error) => {
    logger_1.logger.error('Uncaught Exception:', error);
    process.exit(1);
});
// Start server
const server = new Server();
server.start();
exports.default = server;
//# sourceMappingURL=index.js.map