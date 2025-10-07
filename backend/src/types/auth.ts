import { Request } from 'express';

// User role enumeration
export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
  USER = 'user',
  MODERATOR = 'moderator',
}

// JWT payload interface
export interface JwtPayload {
  userId: number;
  email: string;
  role: UserRole;
  department?: string;
  iat?: number;
  exp?: number;
  jti?: string; // JWT ID for token tracking
}

// Refresh token payload
export interface RefreshTokenPayload {
  userId: number;
  tokenId: string;
  type: 'refresh';
  iat?: number;
  exp?: number;
}

// User entity interface
export interface User {
  id: number;
  email: string;
  password: string;
  role: UserRole;
  department?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  emailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}

// Public user data (without sensitive fields)
export interface PublicUser {
  id: number;
  email: string;
  role: UserRole;
  department?: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  emailVerified: boolean;
}

// Authentication request interfaces
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  department?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface VerifyEmailRequest {
  token: string;
}

// Authentication response interfaces
export interface LoginResponse {
  user: PublicUser;
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    refreshExpiresIn: number;
  };
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: number;
}

// Extended Express Request with user
export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
  token?: string;
  requestId?: string;
}

// Token blacklist entry
export interface TokenBlacklist {
  id: string;
  jti: string;
  userId: number;
  expiresAt: Date;
  createdAt: Date;
}

// Refresh token storage
export interface RefreshToken {
  id: string;
  userId: number;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  lastUsedAt?: Date;
  deviceInfo?: string;
  ipAddress?: string;
}

// Password policy interface
export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  forbidCommonPasswords: boolean;
}

// Authentication configuration
export interface AuthConfig {
  jwt: {
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
    algorithm: string;
  };
  bcrypt: {
    rounds: number;
  };
  passwordPolicy: PasswordPolicy;
  session: {
    maxConcurrentSessions: number;
    extendSessionOnActivity: boolean;
  };
  security: {
    maxLoginAttempts: number;
    lockoutDuration: number;
    requireEmailVerification: boolean;
    passwordResetExpiration: number;
  };
}

// Login attempt tracking
export interface LoginAttempt {
  id: string;
  email: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  attemptedAt: Date;
  failureReason?: string;
}

// Account lockout
export interface AccountLockout {
  id: string;
  userId: number;
  lockedAt: Date;
  expiresAt: Date;
  reason: string;
  ipAddress?: string;
}

// Security event types
export enum SecurityEventType {
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILURE = 'login_failure',
  LOGOUT = 'logout',
  PASSWORD_CHANGE = 'password_change',
  PASSWORD_RESET_REQUEST = 'password_reset_request',
  PASSWORD_RESET_SUCCESS = 'password_reset_success',
  EMAIL_VERIFICATION = 'email_verification',
  ACCOUNT_LOCKED = 'account_locked',
  ACCOUNT_UNLOCKED = 'account_unlocked',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',
  TOKEN_REFRESH = 'token_refresh',
  TOKEN_REVOKED = 'token_revoked',
}

// Security event
export interface SecurityEvent {
  id: string;
  userId?: number;
  type: SecurityEventType;
  description: string;
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

// Permission interface
export interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
  action: string;
}

// Role with permissions
export interface RoleWithPermissions {
  role: UserRole;
  permissions: Permission[];
}

// Authorization context
export interface AuthorizationContext {
  user: PublicUser;
  permissions: Permission[];
  ipAddress: string;
  userAgent: string;
}

// Default password policy
export const DEFAULT_PASSWORD_POLICY: PasswordPolicy = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  forbidCommonPasswords: true,
};

// Helper functions
export const isValidRole = (role: string): role is UserRole => {
  return Object.values(UserRole).includes(role as UserRole);
};

export const hasPermission = (
  userRole: UserRole,
  requiredRole: UserRole
): boolean => {
  const roleHierarchy = {
    [UserRole.USER]: 0,
    [UserRole.STAFF]: 1,
    [UserRole.MODERATOR]: 2,
    [UserRole.ADMIN]: 3,
  };
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

export const sanitizeUser = (user: User): PublicUser => {
  const { password, passwordResetToken, emailVerificationToken, ...publicUser } = user;
  return publicUser;
};