import winston from "winston";
import path from "path";
import fs from "fs";

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint(),
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: "HH:mm:ss",
  }),
  winston.format.printf(({ level, message, timestamp, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta, null, 2)}`;
    }
    return msg;
  }),
);

// Create Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: logFormat,
  defaultMeta: {
    service: "jdmarc-backend",
    environment: process.env.NODE_ENV || "development",
  },
  transports: [
    // Write all logs with importance level of 'error' or less to error.log
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true,
    }),

    // Write all logs with importance level of 'info' or less to combined.log
    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      tailable: true,
    }),

    // Write all logs with importance level of 'debug' or less to debug.log
    new winston.transports.File({
      filename: path.join(logsDir, "debug.log"),
      level: "debug",
      maxsize: 5242880, // 5MB
      maxFiles: 3,
      tailable: true,
    }),
  ],

  // Handle exceptions and rejections
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, "exceptions.log"),
      maxsize: 5242880,
      maxFiles: 3,
    }),
  ],

  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, "rejections.log"),
      maxsize: 5242880,
      maxFiles: 3,
    }),
  ],
});

// Add console logging in development
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
      level: "debug",
    }),
  );
}

// Custom logging methods for different contexts
export const authLogger = logger.child({ context: "auth" });
export const dbLogger = logger.child({ context: "database" });
export const emailLogger = logger.child({ context: "email" });
export const apiLogger = logger.child({ context: "api" });
export const securityLogger = logger.child({ context: "security" });

// Request logging helper
export const logRequest = (req: any, res: any, responseTime?: number) => {
  const logData = {
    method: req.method,
    url: req.url,
    userAgent: req.headers["user-agent"],
    ip: req.ip,
    userId: req.user?.userId,
    statusCode: res.statusCode,
    responseTime: responseTime ? `${responseTime}ms` : undefined,
  };

  if (res.statusCode >= 400) {
    logger.warn("HTTP Request Error", logData);
  } else {
    logger.info("HTTP Request", logData);
  }
};

// Error logging helper
export const logError = (error: Error, context?: string, metadata?: any) => {
  logger.error("Application Error", {
    message: error.message,
    stack: error.stack,
    context,
    ...metadata,
  });
};

// Security event logging
export const logSecurityEvent = (
  event: string,
  details: any,
  severity: "low" | "medium" | "high" = "medium",
) => {
  securityLogger.warn("Security Event", {
    event,
    severity,
    timestamp: new Date().toISOString(),
    ...details,
  });
};

// Performance logging
export const logPerformance = (
  operation: string,
  duration: number,
  metadata?: any,
) => {
  const logLevel =
    duration > 5000 ? "warn" : duration > 1000 ? "info" : "debug";

  logger.log(logLevel, "Performance Metric", {
    operation,
    duration: `${duration}ms`,
    slow: duration > 1000,
    ...metadata,
  });
};

// Business event logging
export const logBusinessEvent = (event: string, data: any) => {
  logger.info("Business Event", {
    event,
    timestamp: new Date().toISOString(),
    ...data,
  });
};

// Database operation logging
export const logDatabaseOperation = (
  operation: string,
  table?: string,
  duration?: number,
  error?: Error,
) => {
  if (error) {
    dbLogger.error("Database Operation Failed", {
      operation,
      table,
      duration: duration ? `${duration}ms` : undefined,
      error: error.message,
    });
  } else {
    dbLogger.debug("Database Operation", {
      operation,
      table,
      duration: duration ? `${duration}ms` : undefined,
    });
  }
};

// Email operation logging
export const logEmailOperation = (
  operation: string,
  recipient?: string,
  template?: string,
  success?: boolean,
  error?: Error,
) => {
  const logData = {
    operation,
    recipient: recipient
      ? recipient.replace(/(.{2}).*@(.*)/, "$1***@$2")
      : undefined, // Mask email for privacy
    template,
    success,
    timestamp: new Date().toISOString(),
  };

  if (error) {
    emailLogger.error("Email Operation Failed", {
      ...logData,
      error: error.message,
    });
  } else {
    emailLogger.info("Email Operation", logData);
  }
};

// API rate limit logging
export const logRateLimit = (
  ip: string,
  endpoint: string,
  limit: number,
  current: number,
) => {
  securityLogger.warn("Rate Limit Event", {
    ip,
    endpoint,
    limit,
    current,
    percentage: Math.round((current / limit) * 100),
    timestamp: new Date().toISOString(),
  });
};

// User activity logging
export const logUserActivity = (
  userId: string,
  activity: string,
  metadata?: any,
) => {
  logger.info("User Activity", {
    userId,
    activity,
    timestamp: new Date().toISOString(),
    ...metadata,
  });
};

// System health logging
export const logSystemHealth = (
  component: string,
  status: "healthy" | "unhealthy" | "degraded",
  metrics?: any,
) => {
  const logLevel =
    status === "healthy" ? "info" : status === "degraded" ? "warn" : "error";

  logger.log(logLevel, "System Health Check", {
    component,
    status,
    timestamp: new Date().toISOString(),
    ...metrics,
  });
};

// Create a timer for measuring execution time
export const createTimer = (operation: string) => {
  const start = Date.now();

  return {
    end: (metadata?: any) => {
      const duration = Date.now() - start;
      logPerformance(operation, duration, metadata);
      return duration;
    },
  };
};

// Stream for real-time log monitoring (useful for dashboards)
export const getLogStream = () => {
  return new winston.transports.Stream({
    stream: process.stdout,
    format: winston.format.simple(),
  });
};

// Clean old log files
export const cleanOldLogs = (daysToKeep: number = 30) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  fs.readdir(logsDir, (err, files) => {
    if (err) {
      logger.error("Error reading logs directory", { error: err.message });
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(logsDir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return;

        if (stats.mtime < cutoffDate) {
          fs.unlink(filePath, (err) => {
            if (err) {
              logger.error("Error deleting old log file", {
                file,
                error: err.message,
              });
            } else {
              logger.info("Deleted old log file", { file });
            }
          });
        }
      });
    });
  });
};

// Schedule log cleanup (run daily)
if (process.env.NODE_ENV === "production") {
  setInterval(
    () => {
      cleanOldLogs(30); // Keep logs for 30 days
    },
    24 * 60 * 60 * 1000,
  ); // Run every 24 hours
}

export { logger };
export default logger;
