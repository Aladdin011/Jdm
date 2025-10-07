// Standard API response interface
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
    pagination?: PaginationMeta;
  };
}

// Pagination metadata
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Error response interface
export interface ErrorResponse {
  success: false;
  data: null;
  message: string;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  meta: {
    timestamp: string;
    requestId?: string;
  };
}

// Success response interface
export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  message: string;
  meta?: {
    timestamp: string;
    requestId?: string;
    pagination?: PaginationMeta;
  };
}

// Authentication response types
export interface AuthResponse {
  user: {
    id: number;
    email: string;
    role: string;
    department?: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

// User profile response
export interface UserProfileResponse {
  id: number;
  email: string;
  role: string;
  department?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

// Validation error details
export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// Common error codes
export enum ErrorCodes {
  // Authentication errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',
  
  // Resource errors
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  CONFLICT = 'CONFLICT',
  
  // Server errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // Business logic errors
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  ACCOUNT_DISABLED = 'ACCOUNT_DISABLED',
  OPERATION_NOT_ALLOWED = 'OPERATION_NOT_ALLOWED',
}

// HTTP status codes
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
}

// Response helper functions
export class ResponseHelper {
  static success<T>(
    data: T,
    message: string = 'Operation successful',
    meta?: Partial<SuccessResponse<T>['meta']>
  ): SuccessResponse<T> {
    return {
      success: true,
      data,
      message,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    };
  }

  static error(
    code: ErrorCodes | string,
    message: string,
    details?: any,
    requestId?: string
  ): ErrorResponse {
    return {
      success: false,
      data: null,
      message,
      error: {
        code,
        message,
        details,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId,
      },
    };
  }

  static validationError(
    errors: ValidationError[],
    message: string = 'Validation failed'
  ): ErrorResponse {
    return this.error(
      ErrorCodes.VALIDATION_ERROR,
      message,
      { validationErrors: errors }
    );
  }

  static paginated<T>(
    data: T[],
    pagination: PaginationMeta,
    message: string = 'Data retrieved successfully'
  ): SuccessResponse<T[]> {
    return {
      success: true,
      data,
      message,
      meta: {
        timestamp: new Date().toISOString(),
        pagination,
      },
    };
  }

  static unauthorized(
    message: string = 'Authentication required'
  ): ErrorResponse {
    return this.error(ErrorCodes.UNAUTHORIZED, message);
  }

  static forbidden(
    message: string = 'Insufficient permissions'
  ): ErrorResponse {
    return this.error(ErrorCodes.FORBIDDEN, message);
  }

  static notFound(
    resource: string = 'Resource'
  ): ErrorResponse {
    return this.error(
      ErrorCodes.NOT_FOUND,
      `${resource} not found`
    );
  }

  static conflict(
    message: string = 'Resource already exists'
  ): ErrorResponse {
    return this.error(ErrorCodes.CONFLICT, message);
  }

  static internalError(
    message: string = 'Internal server error'
  ): ErrorResponse {
    return this.error(ErrorCodes.INTERNAL_ERROR, message);
  }

  static rateLimitExceeded(
    retryAfter?: number
  ): ErrorResponse {
    return this.error(
      ErrorCodes.RATE_LIMIT_EXCEEDED,
      'Rate limit exceeded. Please try again later.',
      { retryAfter }
    );
  }
}