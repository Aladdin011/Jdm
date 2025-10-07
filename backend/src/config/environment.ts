import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Environment validation schema
const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Server configuration
  PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).default(4000),
  HOST: z.string().default('localhost'),
  
  // Database configuration
  DATABASE_URL: z.string().min(1, 'Database URL is required'),
  
  // JWT configuration
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('24h'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT refresh secret must be at least 32 characters'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  
  // CORS configuration
  // Allow common local dev ports by default; can be overridden via env
  CORS_ORIGIN: z.string().default('http://localhost:3000,http://localhost:5173,http://localhost:5177,https://jdmarcng.com,https://api.jdmarcng.com'),
  
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).pipe(z.number().positive()).default(900000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).pipe(z.number().positive()).default(100),
  
  // Email configuration (optional)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).pipe(z.number().positive()).optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),
  
  // Security
  BCRYPT_ROUNDS: z.string().transform(Number).pipe(z.number().min(10).max(15)).default(12),
  
  // Session configuration
  SESSION_SECRET: z.string().min(32, 'Session secret must be at least 32 characters').optional(),
  
  // File upload
  MAX_FILE_SIZE: z.string().transform(Number).pipe(z.number().positive()).default(5242880), // 5MB
  UPLOAD_DIR: z.string().default('./uploads'),
  
  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_FILE: z.string().optional(),
  
  // External services
  REDIS_URL: z.string().optional(),
  
  // Security headers
  TRUST_PROXY: z.string().transform(val => val === 'true').default(false),
  
  // API versioning
  API_VERSION: z.string().default('v1'),
  
  // Health check
  HEALTH_CHECK_ENDPOINT: z.string().default('/health'),
  
  // Database connection pool
  DB_CONNECTION_LIMIT: z.string().transform(Number).pipe(z.number().positive()).default(10),
  
  // Request timeout
  REQUEST_TIMEOUT: z.string().transform(Number).pipe(z.number().positive()).default(30000), // 30 seconds
});

// Validate environment variables
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join('\n');
      
      console.error('❌ Environment validation failed:');
      console.error(missingVars);
      process.exit(1);
    }
    throw error;
  }
};

const env = parseEnv();

// Configuration object
export const config = {
  // Environment
  nodeEnv: env.NODE_ENV,
  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',
  
  // Server
  server: {
    port: env.PORT,
    host: env.HOST,
    trustProxy: env.TRUST_PROXY,
    requestTimeout: env.REQUEST_TIMEOUT,
  },
  
  // Database
  database: {
    url: env.DATABASE_URL,
    connectionLimit: env.DB_CONNECTION_LIMIT,
  },
  
  // JWT
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshSecret: env.JWT_REFRESH_SECRET,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },
  
  // CORS
  cors: {
    origin: env.CORS_ORIGIN.split(',').map(origin => origin.trim()),
    credentials: true,
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
  },
  
  // Email
  email: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    from: env.SMTP_FROM,
  },
  
  // Security
  security: {
    bcryptRounds: env.BCRYPT_ROUNDS,
    sessionSecret: env.SESSION_SECRET,
  },
  
  // File upload
  upload: {
    maxFileSize: env.MAX_FILE_SIZE,
    uploadDir: env.UPLOAD_DIR,
  },
  
  // Logging
  logging: {
    level: env.LOG_LEVEL,
    file: env.LOG_FILE,
  },
  
  // External services
  redis: {
    url: env.REDIS_URL,
  },
  
  // API
  api: {
    version: env.API_VERSION,
    healthCheckEndpoint: env.HEALTH_CHECK_ENDPOINT,
  },
} as const;

// Export individual configurations for convenience
export const {
  nodeEnv,
  isDevelopment,
  isProduction,
  isTest,
} = config;

// Validate required environment variables for specific features
export const validateEmailConfig = (): boolean => {
  return !!(env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS && env.SMTP_FROM);
};

export const validateRedisConfig = (): boolean => {
  return !!env.REDIS_URL;
};

// Environment-specific configurations
export const getLogLevel = (): string => {
  if (isTest) return 'error';
  if (isDevelopment) return 'debug';
  return env.LOG_LEVEL;
};

export const getDatabaseConfig = () => {
  const baseConfig = {
    url: env.DATABASE_URL,
  };
  
  if (isDevelopment) {
    return {
      ...baseConfig,
      logging: ['query', 'error'],
    };
  }
  
  if (isProduction) {
    return {
      ...baseConfig,
      logging: ['error'],
      pool: {
        min: 2,
        max: env.DB_CONNECTION_LIMIT,
      },
    };
  }
  
  return baseConfig;
};

// Security configurations
export const getSecurityConfig = () => {
  return {
    helmet: {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    },
    rateLimit: {
      windowMs: env.RATE_LIMIT_WINDOW_MS,
      max: env.RATE_LIMIT_MAX_REQUESTS,
      message: {
        error: 'Too many requests',
        message: 'Rate limit exceeded. Please try again later.',
        retryAfter: Math.ceil(env.RATE_LIMIT_WINDOW_MS / 1000),
      },
      standardHeaders: true,
      legacyHeaders: false,
    },
  };
};

// Export default
export default config;