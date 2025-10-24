import { toast } from "@/components/ui/use-toast";

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: AppError[] = [];

  private constructor() {}

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  public handleError(error: any, context?: string): AppError {
    const appError: AppError = {
      code: error.code || 'UNKNOWN_ERROR',
      message: error.message || 'An unexpected error occurred',
      details: error.details || error,
      timestamp: new Date()
    };

    // Log error for debugging
    console.error(`[${context || 'App'}] Error:`, appError);

    // Store error in memory for potential reporting
    this.errorLog.push(appError);

    // Keep only last 50 errors to prevent memory issues
    if (this.errorLog.length > 50) {
      this.errorLog = this.errorLog.slice(-50);
    }

    return appError;
  }

  public showUserError(error: AppError | string, title?: string): void {
    const message = typeof error === 'string' ? error : error.message;
    
    toast({
      title: title || "Error",
      description: message,
      variant: "destructive",
    });
  }

  public handleApiError(error: any, context?: string): AppError {
    let message = 'An error occurred while communicating with the server';
    let code = 'API_ERROR';

    if (error.response) {
      // Server responded with error status
      code = `HTTP_${error.response.status}`;
      message = error.response.data?.message || `Server error: ${error.response.status}`;
    } else if (error.request) {
      // Network error
      code = 'NETWORK_ERROR';
      message = 'Unable to connect to the server. Please check your internet connection.';
    } else {
      // Other error
      message = error.message || message;
    }

    return this.handleError({ code, message, details: error }, context);
  }

  public handleAuthError(error: any): AppError {
    let message = 'Authentication failed';
    let code = 'AUTH_ERROR';

    if (error.message?.includes('Invalid credentials')) {
      code = 'INVALID_CREDENTIALS';
      message = 'Email or password is incorrect. Please try again.';
    } else if (error.message?.includes('Too many attempts')) {
      code = 'RATE_LIMITED';
      message = error.message;
    } else if (error.message?.includes('Network')) {
      code = 'NETWORK_ERROR';
      message = 'Unable to connect to authentication server.';
    }

    return this.handleError({ code, message, details: error }, 'Authentication');
  }

  public getErrorLog(): AppError[] {
    return [...this.errorLog];
  }

  public clearErrorLog(): void {
    this.errorLog = [];
  }
}

// Convenience functions for common error handling patterns
export const handleError = (error: any, context?: string): AppError => {
  return ErrorHandler.getInstance().handleError(error, context);
};

export const handleApiError = (error: any, context?: string): AppError => {
  return ErrorHandler.getInstance().handleApiError(error, context);
};

export const handleAuthError = (error: any): AppError => {
  return ErrorHandler.getInstance().handleAuthError(error);
};

export const showUserError = (error: AppError | string, title?: string): void => {
  ErrorHandler.getInstance().showUserError(error, title);
};

// Error boundary helper
export const withErrorBoundary = <T extends (...args: any[]) => any>(
  fn: T,
  context?: string
): T => {
  return ((...args: any[]) => {
    try {
      const result = fn(...args);
      
      // Handle async functions
      if (result instanceof Promise) {
        return result.catch((error) => {
          const appError = handleError(error, context);
          showUserError(appError);
          throw appError;
        });
      }
      
      return result;
    } catch (error) {
      const appError = handleError(error, context);
      showUserError(appError);
      throw appError;
    }
  }) as T;
};