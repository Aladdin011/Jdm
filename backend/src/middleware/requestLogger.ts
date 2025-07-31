import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

/**
 * Request logging middleware
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const startTime = Date.now();

  // Log request details
  logger.info("Incoming request", {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    userId: (req as any).user?.id,
    timestamp: new Date().toISOString(),
  });

  // Log response details when request finishes
  res.on("finish", () => {
    const duration = Date.now() - startTime;

    logger.info("Request completed", {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userId: (req as any).user?.id,
    });
  });

  next();
};

/**
 * API usage tracking middleware
 */
export const apiUsageTracker = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const startTime = Date.now();

  // Track API usage
  res.on("finish", () => {
    const duration = Date.now() - startTime;

    // Log API metrics
    logger.info("API Usage", {
      endpoint: req.route?.path || req.path,
      method: req.method,
      statusCode: res.statusCode,
      duration,
      timestamp: new Date().toISOString(),
      userId: (req as any).user?.id,
      userAgent: req.get("User-Agent"),
      ip: req.ip,
    });
  });

  next();
};
