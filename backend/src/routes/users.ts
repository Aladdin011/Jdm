import { Router, Request, Response } from 'express';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validatePaginationQuery } from '../middleware/validation';
import { asyncHandler, createError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { prisma } from '../utils/database';

const router = Router();

/**
 * Get current user profile
 */
router.get('/profile', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      company: true,
      role: true,
      isEmailVerified: true,
      createdAt: true,
      updatedAt: true,
      lastLoginAt: true,
      profile: true
    }
  });

  if (!user) {
    throw createError('User not found', 404, 'USER_NOT_FOUND');
  }

  res.json({
    success: true,
    data: user
  });
}));

/**
 * Update user profile
 */
router.put('/profile', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const {
    firstName,
    lastName,
    phone,
    company,
    position,
    bio,
    address,
    city,
    state,
    country,
    website,
    linkedIn,
    twitter
  } = req.body;

  // Update user basic info
  const updateData: any = {};
  if (firstName) updateData.firstName = firstName;
  if (lastName) updateData.lastName = lastName;
  if (phone) updateData.phone = phone;
  if (company) updateData.company = company;

  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      company: true,
      role: true,
      updatedAt: true
    }
  });

  // Update profile data if provided
  if (position || bio || address || city || state || country || website || linkedIn || twitter) {
    const profileData: any = {};
    if (position) profileData.position = position;
    if (bio) profileData.bio = bio;
    if (address) profileData.address = address;
    if (city) profileData.city = city;
    if (state) profileData.state = state;
    if (country) profileData.country = country;
    if (website) profileData.website = website;
    if (linkedIn) profileData.linkedIn = linkedIn;
    if (twitter) profileData.twitter = twitter;

    await prisma.userProfile.upsert({
      where: { userId },
      update: profileData,
      create: {
        userId,
        ...profileData
      }
    });
  }

  logger.info('User profile updated', { userId, updatedFields: Object.keys(updateData) });

  res.json({
    success: true,
    data: user,
    message: 'Profile updated successfully'
  });
}));

/**
 * Upload user avatar
 */
router.post('/upload-avatar', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  
  // This would typically use multer middleware for file upload
  // For now, we'll just return a placeholder response
  res.json({
    success: true,
    message: 'Avatar upload endpoint - implementation needed with multer middleware'
  });
}));

/**
 * Get all users (Admin only)
 */
router.get('/', 
  authenticateToken, 
  requireRole(['ADMIN']), 
  validatePaginationQuery, 
  asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const role = req.query.role as string;
    const search = req.query.search as string;
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortOrder = req.query.sortOrder as string || 'desc';

    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          company: true,
          role: true,
          isEmailVerified: true,
          createdAt: true,
          lastLoginAt: true,
          profile: true
        }
      }),
      prisma.user.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: totalPages
      }
    });
  })
);

/**
 * Get user by ID (Admin only)
 */
router.get('/:id', 
  authenticateToken, 
  requireRole(['ADMIN']), 
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        company: true,
        role: true,
        isEmailVerified: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        profile: true,
        sessions: {
          select: {
            id: true,
            deviceInfo: true,
            lastActivity: true,
            isActive: true
          },
          orderBy: { lastActivity: 'desc' },
          take: 5
        }
      }
    });

    if (!user) {
      throw createError('User not found', 404, 'USER_NOT_FOUND');
    }

    res.json({
      success: true,
      data: user
    });
  })
);

/**
 * Update user role (Admin only)
 */
router.patch('/:id/role', 
  authenticateToken, 
  requireRole(['ADMIN']), 
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!['CLIENT', 'ADMIN', 'MANAGER', 'CONTRACTOR'].includes(role)) {
      throw createError('Invalid role specified', 400, 'INVALID_ROLE');
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        updatedAt: true
      }
    });

    logger.info('User role updated', { 
      userId: id, 
      newRole: role, 
      updatedBy: (req as any).user.id 
    });

    res.json({
      success: true,
      data: user,
      message: 'User role updated successfully'
    });
  })
);

/**
 * Disable/Enable user (Admin only)
 */
router.patch('/:id/status', 
  authenticateToken, 
  requireRole(['ADMIN']), 
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { isActive: Boolean(isActive) },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        isActive: true,
        updatedAt: true
      }
    });

    logger.info('User status updated', { 
      userId: id, 
      isActive: Boolean(isActive), 
      updatedBy: (req as any).user.id 
    });

    res.json({
      success: true,
      data: user,
      message: `User ${isActive ? 'enabled' : 'disabled'} successfully`
    });
  })
);

/**
 * Delete user (Admin only)
 */
router.delete('/:id', 
  authenticateToken, 
  requireRole(['ADMIN']), 
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const currentUserId = (req as any).user.id;

    // Prevent admin from deleting themselves
    if (id === currentUserId) {
      throw createError('Cannot delete your own account', 400, 'CANNOT_DELETE_SELF');
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true }
    });

    if (!user) {
      throw createError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Delete user and related data
    await prisma.$transaction([
      // Delete user sessions
      prisma.userSession.deleteMany({ where: { userId: id } }),
      // Delete user profile
      prisma.userProfile.deleteMany({ where: { userId: id } }),
      // Delete user
      prisma.user.delete({ where: { id } })
    ]);

    logger.info('User deleted', { 
      deletedUserId: id, 
      deletedUserEmail: user.email,
      deletedBy: currentUserId 
    });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  })
);

export default router;
