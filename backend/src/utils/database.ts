import { PrismaClient } from "@prisma/client";
import { logger } from "./logger";

// Create Prisma client with enhanced configuration
const prisma = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "error",
    },
    {
      emit: "event",
      level: "info",
    },
    {
      emit: "event",
      level: "warn",
    },
  ],
  errorFormat: "pretty",
});

// Log database queries in development
if (process.env.NODE_ENV === "development") {
  prisma.$on("query", (e) => {
    logger.debug(`Query: ${e.query}`);
    logger.debug(`Duration: ${e.duration}ms`);
  });
}

// Log database errors
prisma.$on("error", (e) => {
  logger.error("Database error:", e);
});

// Log database info
prisma.$on("info", (e) => {
  logger.info(`Database info: ${e.message}`);
});

// Log database warnings
prisma.$on("warn", (e) => {
  logger.warn(`Database warning: ${e.message}`);
});

// Test database connection
export const testDatabaseConnection = async () => {
  try {
    await prisma.$connect();
    logger.info("✅ Database connected successfully");
    return true;
  } catch (error) {
    logger.error("❌ Database connection failed:", error);
    return false;
  }
};

// Graceful shutdown
export const disconnectDatabase = async () => {
  try {
    await prisma.$disconnect();
    logger.info("Database disconnected successfully");
  } catch (error) {
    logger.error("Error disconnecting from database:", error);
  }
};

// Health check function
export const databaseHealthCheck = async () => {
  try {
    const startTime = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const responseTime = Date.now() - startTime;

    return {
      status: "healthy",
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error("Database health check failed:", error);
    return {
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    };
  }
};

// Transaction helper
export const withTransaction = async <T>(
  callback: (tx: any) => Promise<T>,
): Promise<T> => {
  return await prisma.$transaction(callback);
};

export { prisma };
export default prisma;
