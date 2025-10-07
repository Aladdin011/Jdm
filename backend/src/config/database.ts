import { PrismaClient } from '@prisma/client';
import { config } from './environment';
import { logger } from '../utils/logger';

// Extend PrismaClient with custom methods
class DatabaseClient extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: config.database.url,
        },
      },
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
    });

    // Log database queries in development
    if (config.nodeEnv === 'development') {
      this.$on('query', (e) => {
        logger.debug(`Query: ${e.query}`);
        logger.debug(`Duration: ${e.duration}ms`);
      });
    }

    // Log database errors
    this.$on('error', (e) => {
      logger.error('Database error:', e);
    });

    // Log database info
    this.$on('info', (e) => {
      logger.info('Database info:', e.message);
    });

    // Log database warnings
    this.$on('warn', (e) => {
      logger.warn('Database warning:', e.message);
    });
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      logger.error('Database health check failed:', error);
      return false;
    }
  }

  // Graceful disconnect
  async gracefulDisconnect(): Promise<void> {
    try {
      await this.$disconnect();
      logger.info('Database disconnected gracefully');
    } catch (error) {
      logger.error('Error during database disconnect:', error);
    }
  }

  // Transaction wrapper with retry logic
  async withRetry<T>(
    operation: (prisma: DatabaseClient) => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation(this);
      } catch (error) {
        lastError = error as Error;
        logger.warn(`Database operation failed (attempt ${attempt}/${maxRetries}):`, error);
        
        if (attempt === maxRetries) {
          break;
        }
        
        // Exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }
}

// Create singleton instance
let dbClient: DatabaseClient;

export const getPrismaClient = (): DatabaseClient => {
  if (!dbClient) {
    dbClient = new DatabaseClient();
  }
  return dbClient;
};

// Connect to database
export const connectDatabase = async (): Promise<void> => {
  try {
    const client = getPrismaClient();
    
    // Test connection
    await client.$connect();
    
    // Run health check
    const isHealthy = await client.healthCheck();
    if (!isHealthy) {
      throw new Error('Database health check failed');
    }
    
    logger.info('✅ Database connected successfully');
    
    // Setup graceful shutdown
    const gracefulShutdown = async () => {
      logger.info('Shutting down database connection...');
      await client.gracefulDisconnect();
    };
    
    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
    process.on('beforeExit', gracefulShutdown);
    
  } catch (error) {
    logger.error('❌ Failed to connect to database:', error);
    throw error;
  }
};

// Export the client instance
export const prisma = getPrismaClient();
export default getPrismaClient();

// Export types
export type { PrismaClient } from '@prisma/client';
export type DatabaseTransaction = Parameters<Parameters<DatabaseClient['$transaction']>[0]>[0];