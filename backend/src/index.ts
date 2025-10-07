import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from './config/environment';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { validate } from './middleware/validation';
import { authenticate } from './middleware/auth';
import { connectDatabaseWithRetry } from './config/database';
import { ApiResponse } from './types/response';

// Import routes
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';
import userRoutes from './routes/userRoutes';
import healthRoutes from './routes/healthRoutes';

class Server {
  private app: express.Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = config.server.port;
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
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
    this.app.use(cors({
      origin: config.cors.origin,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Skip-Auth'],
    }));

    // Compression and parsing
    this.app.use(compression());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // General API rate limiting
    const generalLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: config.rateLimit.maxRequests,
      message: {
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: 900
      },
      standardHeaders: true,
      legacyHeaders: false,
    });

    // More lenient rate limiting for authentication endpoints
    const authLimiter = rateLimit({
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
    this.app.use(requestLogger);
  }

  private initializeRoutes(): void {
    // Health check (no auth required)
    this.app.use('/api/health', healthRoutes);

    // Public routes
    this.app.use('/api/auth', authRoutes);

    // Protected routes
    this.app.use('/api/admin', authenticate, adminRoutes);
    this.app.use('/api/users', authenticate, userRoutes);

    // Root endpoint
    this.app.get('/', (_req, res) => {
      const response: ApiResponse<{ project: string; version: string; status: string }> = {
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
      const response: ApiResponse<null> = {
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

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    // Start server without blocking on DB
    this.app.listen(this.port, () => {
      logger.info(`Server running on port ${this.port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
      logger.info(`API Documentation: http://localhost:${this.port}/api/docs`);
    });

    // Kick off DB connection retries in background
    connectDatabaseWithRetry().catch((err) => {
      logger.error('Background DB connection failed:', err);
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled promise rejection:', { reason, promise });
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start server
const server = new Server();
server.start();

export default server;
