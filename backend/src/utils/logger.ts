import { config } from '../config/environment';

// Log levels
type LogLevel = 'error' | 'warn' | 'info' | 'debug';

// Log entry interface
interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
  error?: Error;
}

// Color codes for console output
const colors = {
  error: '\x1b[31m', // Red
  warn: '\x1b[33m',  // Yellow
  info: '\x1b[36m',  // Cyan
  debug: '\x1b[35m', // Magenta
  reset: '\x1b[0m',  // Reset
} as const;

// Log level priorities
const levelPriorities: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

class Logger {
  private level: LogLevel;
  private isDevelopment: boolean;

  constructor(level: LogLevel = 'info') {
    this.level = level;
    this.isDevelopment = config.nodeEnv === 'development';
  }

  private shouldLog(level: LogLevel): boolean {
    return levelPriorities[level] <= levelPriorities[this.level];
  }

  private formatMessage(entry: LogEntry): string {
    const { level, message, timestamp, data, error } = entry;
    
    let formatted = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    if (data) {
      formatted += ` ${JSON.stringify(data, null, 2)}`;
    }
    
    if (error) {
      formatted += `\n${error.stack || error.message}`;
    }
    
    return formatted;
  }

  private getColoredMessage(level: LogLevel, message: string): string {
    if (!this.isDevelopment) {
      return message;
    }
    
    return `${colors[level]}${message}${colors.reset}`;
  }

  private log(level: LogLevel, message: string, data?: any, error?: Error): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      error,
    };

    const formattedMessage = this.formatMessage(entry);
    const coloredMessage = this.getColoredMessage(level, formattedMessage);

    // Output to console
    switch (level) {
      case 'error':
        console.error(coloredMessage);
        break;
      case 'warn':
        console.warn(coloredMessage);
        break;
      case 'info':
        console.info(coloredMessage);
        break;
      case 'debug':
        console.debug(coloredMessage);
        break;
    }

    // In production, you might want to send logs to external service
    if (config.nodeEnv === 'production' && level === 'error') {
      // TODO: Send to external logging service (e.g., Sentry, LogRocket)
      this.sendToExternalService(entry);
    }
  }

  private sendToExternalService(entry: LogEntry): void {
    // Placeholder for external logging service integration
    // This could be Sentry, LogRocket, CloudWatch, etc.
    if (config.nodeEnv === 'production') {
      // Example: Sentry.captureException(entry.error || new Error(entry.message));
    }
  }

  // Public logging methods
  error(message: string, data?: any, error?: Error): void {
    this.log('error', message, data, error);
  }

  warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  debug(message: string, data?: any): void {
    this.log('debug', message, data);
  }

  // Utility methods
  setLevel(level: LogLevel): void {
    this.level = level;
  }

  getLevel(): LogLevel {
    return this.level;
  }

  // Request logging helper
  logRequest(method: string, url: string, statusCode: number, duration: number, userAgent?: string): void {
    const message = `${method} ${url} - ${statusCode} (${duration}ms)`;
    const data = { method, url, statusCode, duration, userAgent };
    
    if (statusCode >= 400) {
      this.warn(message, data);
    } else {
      this.info(message, data);
    }
  }

  // Database query logging helper
  logQuery(query: string, duration: number, params?: any): void {
    if (this.isDevelopment) {
      this.debug(`DB Query (${duration}ms): ${query}`, params);
    }
  }

  // Authentication logging helper
  logAuth(action: string, userId?: number, email?: string, success: boolean = true): void {
    const message = `Auth ${action}: ${success ? 'SUCCESS' : 'FAILED'}`;
    const data = { action, userId, email, success };
    
    if (success) {
      this.info(message, data);
    } else {
      this.warn(message, data);
    }
  }
}

// Create and export logger instance
export const logger = new Logger(config.logging.level);

// Export types
export type { LogLevel, LogEntry };
export { Logger };