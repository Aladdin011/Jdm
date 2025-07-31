import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '@/utils/database';
import { generateOTP, validateOTP } from '@/utils/otp';
import { sendEmail } from '@/utils/email';
import { logger } from '@/utils/logger';
import { authMiddleware } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validation';
import { createLeadScore } from '@/services/leadScoring';
import { trackUserAnalytics } from '@/services/analytics';

const router = express.Router();

// Validation schemas
const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  phone: z.string().optional(),
  company: z.string().optional(),
  role: z.enum(['CLIENT', 'CONTRACTOR', 'ARCHITECT', 'ENGINEER']).default('CLIENT')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  deviceInfo: z.string().optional(),
  rememberMe: z.boolean().default(false)
});

const verifyOTPSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  type: z.enum(['EMAIL_VERIFICATION', 'PASSWORD_RESET', 'LOGIN_VERIFICATION'])
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
});

const resetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters')
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters')
});

// Helper function to generate JWT tokens
const generateTokens = (userId: string, sessionId: string, rememberMe: boolean = false) => {
  const accessTokenExpiry = rememberMe ? '30d' : '1d';
  const refreshTokenExpiry = rememberMe ? '90d' : '7d';

  const accessToken = jwt.sign(
    { userId, sessionId, type: 'access' },
    process.env.JWT_SECRET!,
    { expiresIn: accessTokenExpiry }
  );

  const refreshToken = jwt.sign(
    { userId, sessionId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: refreshTokenExpiry }
  );

  return { accessToken, refreshToken };
};

// Register endpoint
router.post('/register', validateRequest(registerSchema), async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, company, role } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: email.toLowerCase(),
        password: hashedPassword,
        phone,
        role,
        profile: {
          create: {
            company,
            preferences: {}
          }
        },
        analytics: {
          create: {
            deviceType: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop',
            browser: req.headers['user-agent']?.split(' ')[0] || 'unknown',
            ipAddress: req.ip
          }
        }
      },
      include: {
        profile: true
      }
    });

    // Generate email verification OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.otpVerification.create({
      data: {
        userId: user.id,
        email: user.email,
        otp,
        type: 'EMAIL_VERIFICATION',
        expiresAt
      }
    });

    // Send verification email
    await sendEmail({
      to: user.email,
      subject: 'Verify Your Email - JD Marc Limited',
      template: 'email-verification',
      data: {
        firstName: user.firstName,
        otp,
        expiresIn: '10 minutes'
      }
    });

    // Create initial lead score
    await createLeadScore(user.id, {
      userType: 'new',
      source: 'registration',
      deviceType: req.headers['user-agent']?.includes('Mobile') ? 'mobile' : 'desktop'
    });

    logger.info(`User registered: ${user.email}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for verification code.',
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        }
      }
    });

  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Login endpoint
router.post('/login', validateRequest(loginSchema), async (req, res) => {
  try {
    const { email, password, deviceInfo, rememberMe } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        profile: true,
        analytics: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Account is deactivated'
      });
    }

    // Check if email is verified for new users
    if (!user.isEmailVerified && user.role === 'CLIENT') {
      // Generate new OTP for unverified users
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await prisma.otpVerification.create({
        data: {
          userId: user.id,
          email: user.email,
          otp,
          type: 'EMAIL_VERIFICATION',
          expiresAt
        }
      });

      await sendEmail({
        to: user.email,
        subject: 'Verify Your Email - JD Marc Limited',
        template: 'email-verification',
        data: {
          firstName: user.firstName,
          otp,
          expiresIn: '10 minutes'
        }
      });

      return res.status(403).json({
        success: false,
        error: 'Email not verified. Verification code sent to your email.',
        requiresVerification: true
      });
    }

    // Create user session
    const sessionExpiresAt = new Date(Date.now() + (rememberMe ? 90 : 7) * 24 * 60 * 60 * 1000);
    
    const session = await prisma.userSession.create({
      data: {
        userId: user.id,
        token: '',
        refreshToken: '',
        deviceInfo,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        expiresAt: sessionExpiresAt
      }
    });

    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user.id, session.id, rememberMe);

    // Update session with tokens
    await prisma.userSession.update({
      where: { id: session.id },
      data: {
        token: accessToken,
        refreshToken
      }
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Track login analytics
    await trackUserAnalytics(user.id, 'login', {
      deviceInfo,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    logger.info(`User logged in: ${user.email}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          avatar: user.avatar,
          profile: user.profile
        },
        tokens: {
          accessToken,
          refreshToken,
          expiresIn: rememberMe ? '30d' : '1d'
        }
      }
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Verify OTP endpoint
router.post('/verify-otp', validateRequest(verifyOTPSchema), async (req, res) => {
  try {
    const { email, otp, type } = req.body;

    // Find the OTP verification record
    const otpRecord = await prisma.otpVerification.findFirst({
      where: {
        email: email.toLowerCase(),
        otp,
        type,
        isUsed: false,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: true
      }
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired OTP'
      });
    }

    // Mark OTP as used
    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { isUsed: true }
    });

    // Update user based on OTP type
    if (type === 'EMAIL_VERIFICATION') {
      await prisma.user.update({
        where: { id: otpRecord.userId },
        data: { isEmailVerified: true }
      });
    }

    logger.info(`OTP verified for user: ${email}, type: ${type}`);

    res.json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        verified: true,
        type
      }
    });

  } catch (error) {
    logger.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Forgot password endpoint
router.post('/forgot-password', validateRequest(forgotPasswordSchema), async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      // Don't reveal if user exists or not
      return res.json({
        success: true,
        message: 'If an account with this email exists, you will receive a password reset code.'
      });
    }

    // Generate password reset OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.otpVerification.create({
      data: {
        userId: user.id,
        email: user.email,
        otp,
        type: 'PASSWORD_RESET',
        expiresAt
      }
    });

    // Send password reset email
    await sendEmail({
      to: user.email,
      subject: 'Password Reset - JD Marc Limited',
      template: 'password-reset',
      data: {
        firstName: user.firstName,
        otp,
        expiresIn: '15 minutes'
      }
    });

    logger.info(`Password reset requested for: ${email}`);

    res.json({
      success: true,
      message: 'If an account with this email exists, you will receive a password reset code.'
    });

  } catch (error) {
    logger.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Reset password endpoint
router.post('/reset-password', validateRequest(resetPasswordSchema), async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Verify OTP
    const otpRecord = await prisma.otpVerification.findFirst({
      where: {
        email: email.toLowerCase(),
        otp,
        type: 'PASSWORD_RESET',
        isUsed: false,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: true
      }
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired OTP'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password
    await prisma.user.update({
      where: { id: otpRecord.userId },
      data: { password: hashedPassword }
    });

    // Mark OTP as used
    await prisma.otpVerification.update({
      where: { id: otpRecord.id },
      data: { isUsed: true }
    });

    // Invalidate all user sessions
    await prisma.userSession.updateMany({
      where: { userId: otpRecord.userId },
      data: { isActive: false }
    });

    logger.info(`Password reset successful for: ${email}`);

    res.json({
      success: true,
      message: 'Password reset successful. Please login with your new password.'
    });

  } catch (error) {
    logger.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Change password endpoint (authenticated)
router.post('/change-password', authMiddleware, validateRequest(changePasswordSchema), async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    logger.info(`Password changed for user: ${user.email}`);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Refresh token endpoint
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token is required'
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;

    // Find session
    const session = await prisma.userSession.findFirst({
      where: {
        id: decoded.sessionId,
        userId: decoded.userId,
        refreshToken,
        isActive: true,
        expiresAt: {
          gt: new Date()
        }
      },
      include: {
        user: true
      }
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      session.userId,
      session.id,
      false
    );

    // Update session
    await prisma.userSession.update({
      where: { id: session.id },
      data: {
        token: accessToken,
        refreshToken: newRefreshToken
      }
    });

    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken: newRefreshToken,
        expiresIn: '1d'
      }
    });

  } catch (error) {
    logger.error('Refresh token error:', error);
    res.status(401).json({
      success: false,
      error: 'Invalid refresh token'
    });
  }
});

// Logout endpoint
router.post('/logout', authMiddleware, async (req, res) => {
  try {
    const sessionId = req.user!.sessionId;

    // Deactivate session
    await prisma.userSession.update({
      where: { id: sessionId },
      data: { isActive: false }
    });

    logger.info(`User logged out, session: ${sessionId}`);

    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Get current user endpoint
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        analytics: true,
        leadScoring: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          avatar: user.avatar,
          isEmailVerified: user.isEmailVerified,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          profile: user.profile,
          analytics: user.analytics,
          leadScoring: user.leadScoring
        }
      }
    });

  } catch (error) {
    logger.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// Resend verification email
router.post('/resend-verification', validateRequest(z.object({ email: z.string().email() })), async (req, res) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        error: 'Email is already verified'
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpVerification.create({
      data: {
        userId: user.id,
        email: user.email,
        otp,
        type: 'EMAIL_VERIFICATION',
        expiresAt
      }
    });

    // Send verification email
    await sendEmail({
      to: user.email,
      subject: 'Verify Your Email - JD Marc Limited',
      template: 'email-verification',
      data: {
        firstName: user.firstName,
        otp,
        expiresIn: '10 minutes'
      }
    });

    res.json({
      success: true,
      message: 'Verification code sent successfully'
    });

  } catch (error) {
    logger.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

export default router;
