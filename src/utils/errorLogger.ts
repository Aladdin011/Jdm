// Centralized Error Logging System
interface ErrorLog {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  component: string;
  action: string;
  message: string;
  stack?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

class ErrorLogger {
  private logs: ErrorLog[] = [];
  private maxLogs = 1000;
  private devConsoleLimit = 4;
  private devConsoleCount = 0;
  private recentConsoleKeys: string[] = [];

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private makeConsoleKey(
    level: 'error' | 'warning' | 'info',
    component: string,
    action: string,
    message: string
  ): string {
    return `${level}|${component}|${action}|${message}`;
  }

  private shouldConsoleLog(key: string): boolean {
    if (!import.meta.env.DEV) return false;
    if (this.devConsoleCount >= this.devConsoleLimit) return false;
    if (this.recentConsoleKeys.includes(key)) return false;
    return true;
  }

  private recordConsoleKey(key: string): void {
    this.recentConsoleKeys.push(key);
    if (this.recentConsoleKeys.length > 50) {
      this.recentConsoleKeys.shift();
    }
  }

  log(
    level: 'error' | 'warning' | 'info',
    component: string,
    action: string,
    message: string,
    error?: Error,
    metadata?: Record<string, any>
  ): void {
    const errorLog: ErrorLog = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      level,
      component,
      action,
      message,
      stack: error?.stack,
      userId: this.getCurrentUserId(),
      metadata
    };

    this.logs.unshift(errorLog);
    
    // Keep only the most recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Console logging for development
    const consoleKey = this.makeConsoleKey(level, component, action, message);
    if (this.shouldConsoleLog(consoleKey)) {
      const logMethod = level === 'error' ? console.error : 
                       level === 'warning' ? console.warn : console.info;
      logMethod(`[${component}] ${action}: ${message}`, error || metadata);
      this.devConsoleCount += 1;
      this.recordConsoleKey(consoleKey);
    }

    // Store in localStorage for persistence
    try {
      localStorage.setItem('dashboard_error_logs', JSON.stringify(this.logs.slice(0, 100)));
    } catch (e) {
      console.warn('Failed to store error logs in localStorage');
    }
  }

  error(component: string, action: string, message: string, error?: Error, metadata?: Record<string, any>): void {
    this.log('error', component, action, message, error, metadata);
  }

  warning(component: string, action: string, message: string, metadata?: Record<string, any>): void {
    this.log('warning', component, action, message, undefined, metadata);
  }

  info(component: string, action: string, message: string, metadata?: Record<string, any>): void {
    this.log('info', component, action, message, undefined, metadata);
  }

  getLogs(level?: 'error' | 'warning' | 'info'): ErrorLog[] {
    return level ? this.logs.filter(log => log.level === level) : this.logs;
  }

  clearLogs(): void {
    this.logs = [];
    localStorage.removeItem('dashboard_error_logs');
  }

  private getCurrentUserId(): string | undefined {
    try {
      const authData = localStorage.getItem('builder_aura_auth_token');
      if (authData) {
        // Extract user ID from token or auth context
        return 'current-user'; // Placeholder - would extract from actual auth
      }
    } catch (e) {
      // Ignore errors when getting user ID
    }
    return undefined;
  }

  // Load persisted logs on initialization
  loadPersistedLogs(): void {
    try {
      const stored = localStorage.getItem('dashboard_error_logs');
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load persisted error logs');
    }
  }
}

// Create singleton instance
export const errorLogger = new ErrorLogger();

// Load persisted logs on module initialization
errorLogger.loadPersistedLogs();

// Helper function for dashboard components
export const logDashboardAction = (
  component: string,
  action: string,
  success: boolean,
  error?: Error,
  metadata?: Record<string, any>
) => {
  if (success) {
    errorLogger.info(component, action, `${action} completed successfully`, metadata);
  } else {
    errorLogger.error(component, action, `${action} failed`, error, metadata);
  }
};

export default errorLogger;
