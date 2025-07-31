import express from 'express';
import { z } from 'zod';
import { prisma } from '../utils/database';
import { sendEmail } from '../utils/email';
import { logger } from '../utils/logger';
import { validateContactForm, validatePaginationQuery } from '../middleware/validation';
import { authenticateToken, requireRole } from '../middleware/auth';
import { createLeadScore, updateLeadScore } from '../services/leadScoring';
import { trackUserAnalytics } from '../services/analytics';

const router = express.Router();

// Validation schemas
const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  company: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  projectType: z.enum(['RESIDENTIAL', 'COMMERCIAL', 'INFRASTRUCTURE', 'SMART_CITIES', 'RENOVATION', 'INTERIOR_DESIGN']).optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  location: z.string().optional(),
  source: z.string().optional(),
  honeypot: z.string().optional() // Anti-spam honeypot field
});

const updateContactSchema = z.object({
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL_SENT', 'NEGOTIATING', 'WON', 'LOST', 'ARCHIVED']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  assignedTo: z.string().optional(),
  notes: z.string().optional(),
  followUpDate: z.string().datetime().optional()
});

// Submit contact form
router.post('/submit', optionalAuthMiddleware, validateRequest(contactFormSchema), async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      subject,
      message,
      projectType,
      budget,
      timeline,
      location,
      source,
      honeypot
    } = req.body;

    // Anti-spam: Check honeypot field
    if (honeypot && honeypot.trim() !== '') {
      logger.warn('Spam attempt detected via honeypot', { email, ip: req.ip });
      // Return success to not reveal spam detection
      return res.json({
        success: true,
        message: 'Thank you for your inquiry. We will get back to you soon.'
      });
    }

    // Check for duplicate submissions (same email and message within 5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const duplicateSubmission = await prisma.contactForm.findFirst({
      where: {
        email: email.toLowerCase(),
        message,
        createdAt: {
          gte: fiveMinutesAgo
        }
      }
    });

    if (duplicateSubmission) {
      return res.status(400).json({
        success: false,
        error: 'Duplicate submission detected. Please wait before submitting again.'
      });
    }

    // Determine priority based on project type and budget
    let priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' = 'MEDIUM';
    if (projectType === 'SMART_CITIES' || (budget && budget.includes('$1M') || budget.includes('₦1B'))) {
      priority = 'HIGH';
    } else if (projectType === 'INFRASTRUCTURE') {
      priority = 'HIGH';
    } else if (projectType === 'COMMERCIAL') {
      priority = 'MEDIUM';
    }

    // Generate reference ID
    const referenceId = `JDM-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Create contact form entry
    const contactForm = await prisma.contactForm.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone,
        company,
        subject,
        message,
        projectType,
        budget,
        timeline,
        location,
        source,
        priority,
        userId: req.user?.userId,
        notes: `Reference ID: ${referenceId}`
      }
    });

    // Create or update lead scoring if user is authenticated
    if (req.user?.userId) {
      await updateLeadScore(req.user.userId, {
        contactFormSubmission: true,
        projectType,
        budget,
        company: !!company
      });

      // Track analytics
      await trackUserAnalytics(req.user.userId, 'contact_form_submission', {
        projectType,
        budget,
        timeline,
        source
      });
    } else {
      // For anonymous users, try to find existing user by email
      const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      });

      if (existingUser) {
        await prisma.contactForm.update({
          where: { id: contactForm.id },
          data: { userId: existingUser.id }
        });

        await updateLeadScore(existingUser.id, {
          contactFormSubmission: true,
          projectType,
          budget,
          company: !!company
        });
      }
    }

    // Send confirmation email to user
    await sendEmail({
      to: email,
      template: 'contact-confirmation',
      data: {
        name,
        subject,
        projectType,
        budget,
        timeline,
        referenceId
      }
    });

    // Send notification email to admin/sales team
    const adminEmails = process.env.ADMIN_EMAILS?.split(',') || ['admin@jdmarc.com'];
    await sendEmail({
      to: adminEmails,
      subject: `New Contact Form Submission - ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Reference ID:</strong> ${referenceId}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Company:</strong> ${company || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Project Type:</strong> ${projectType || 'Not specified'}</p>
        <p><strong>Budget:</strong> ${budget || 'Not specified'}</p>
        <p><strong>Timeline:</strong> ${timeline || 'Not specified'}</p>
        <p><strong>Location:</strong> ${location || 'Not specified'}</p>
        <p><strong>Priority:</strong> ${priority}</p>
        <h3>Message:</h3>
        <p>${message}</p>
        <hr>
        <p><small>Submitted at: ${new Date().toISOString()}</small></p>
      `
    });

    // Send real-time notification to admin dashboard
    io.emit('new-contact-form', {
      id: contactForm.id,
      name,
      email,
      subject,
      priority,
      createdAt: contactForm.createdAt
    });

    logger.info('Contact form submitted successfully', {
      contactFormId: contactForm.id,
      email,
      projectType,
      priority,
      referenceId
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your inquiry. We will get back to you within 24-48 hours.',
      data: {
        referenceId,
        contactFormId: contactForm.id
      }
    });

  } catch (error) {
    logger.error('Contact form submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit contact form. Please try again.'
    });
  }
});

// Get all contact forms (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    // Check if user has admin privileges
    if (!['ADMIN', 'SUPER_ADMIN', 'PROJECT_MANAGER'].includes(req.user!.role)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const {
      page = 1,
      limit = 20,
      status,
      priority,
      projectType,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Build where clause
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (priority) {
      where.priority = priority;
    }

    if (projectType) {
      where.projectType = projectType;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { company: { contains: search as string, mode: 'insensitive' } },
        { subject: { contains: search as string, mode: 'insensitive' } },
        { message: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    // Get contact forms with pagination
    const [contactForms, total] = await Promise.all([
      prisma.contactForm.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: {
          [sortBy as string]: sortOrder
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true
            }
          },
          project: {
            select: {
              id: true,
              title: true,
              status: true
            }
          }
        }
      }),
      prisma.contactForm.count({ where })
    ]);

    res.json({
      success: true,
      data: {
        contactForms,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      }
    });

  } catch (error) {
    logger.error('Get contact forms error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact forms'
    });
  }
});

// Get contact form by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const contactForm = await prisma.contactForm.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            avatar: true,
            profile: true
          }
        },
        project: {
          select: {
            id: true,
            title: true,
            status: true,
            category: true
          }
        }
      }
    });

    if (!contactForm) {
      return res.status(404).json({
        success: false,
        error: 'Contact form not found'
      });
    }

    // Check permissions
    const isOwner = contactForm.userId === req.user!.userId;
    const isAdmin = ['ADMIN', 'SUPER_ADMIN', 'PROJECT_MANAGER'].includes(req.user!.role);

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Mark as read if admin is viewing
    if (isAdmin && !contactForm.isRead) {
      await prisma.contactForm.update({
        where: { id },
        data: { isRead: true }
      });
    }

    res.json({
      success: true,
      data: { contactForm }
    });

  } catch (error) {
    logger.error('Get contact form error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact form'
    });
  }
});

// Update contact form (admin only)
router.patch('/:id', authMiddleware, validateRequest(updateContactSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, assignedTo, notes, followUpDate } = req.body;

    // Check admin privileges
    if (!['ADMIN', 'SUPER_ADMIN', 'PROJECT_MANAGER'].includes(req.user!.role)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const contactForm = await prisma.contactForm.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!contactForm) {
      return res.status(404).json({
        success: false,
        error: 'Contact form not found'
      });
    }

    // Update contact form
    const updatedContactForm = await prisma.contactForm.update({
      where: { id },
      data: {
        status,
        priority,
        assignedTo,
        notes,
        followUpDate: followUpDate ? new Date(followUpDate) : undefined,
        updatedAt: new Date()
      }
    });

    // Send status update email if status changed
    if (status && status !== contactForm.status && contactForm.user) {
      const statusMessages = {
        CONTACTED: 'We have received your inquiry and our team will be in touch soon.',
        QUALIFIED: 'Your project has been qualified and we are preparing a detailed response.',
        PROPOSAL_SENT: 'We have sent you a detailed proposal. Please review and let us know if you have any questions.',
        NEGOTIATING: 'We are working on finalizing the project details with you.',
        WON: 'Congratulations! We are excited to work with you on this project.',
        LOST: 'Thank you for considering us for your project.',
        ARCHIVED: 'Your inquiry has been archived.'
      };

      if (statusMessages[status as keyof typeof statusMessages]) {
        await sendEmail({
          to: contactForm.email,
          subject: `Project Update - ${contactForm.subject}`,
          html: `
            <h2>Project Status Update</h2>
            <p>Dear ${contactForm.name},</p>
            <p>${statusMessages[status as keyof typeof statusMessages]}</p>
            <p><strong>Project:</strong> ${contactForm.subject}</p>
            <p><strong>Status:</strong> ${status.replace('_', ' ')}</p>
            ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br>The JD Marc Limited Team</p>
          `
        });
      }
    }

    // Send real-time update
    io.emit('contact-form-updated', {
      id: updatedContactForm.id,
      status: updatedContactForm.status,
      priority: updatedContactForm.priority
    });

    logger.info('Contact form updated', {
      contactFormId: id,
      updatedBy: req.user!.userId,
      changes: { status, priority, assignedTo }
    });

    res.json({
      success: true,
      message: 'Contact form updated successfully',
      data: { contactForm: updatedContactForm }
    });

  } catch (error) {
    logger.error('Update contact form error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update contact form'
    });
  }
});

// Get contact form statistics (admin only)
router.get('/stats/overview', authMiddleware, async (req, res) => {
  try {
    // Check admin privileges
    if (!['ADMIN', 'SUPER_ADMIN', 'PROJECT_MANAGER'].includes(req.user!.role)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const [
      total,
      newCount,
      contactedCount,
      qualifiedCount,
      wonCount,
      lostCount,
      byPriority,
      byProjectType,
      recentSubmissions
    ] = await Promise.all([
      prisma.contactForm.count(),
      prisma.contactForm.count({ where: { status: 'NEW' } }),
      prisma.contactForm.count({ where: { status: 'CONTACTED' } }),
      prisma.contactForm.count({ where: { status: 'QUALIFIED' } }),
      prisma.contactForm.count({ where: { status: 'WON' } }),
      prisma.contactForm.count({ where: { status: 'LOST' } }),
      prisma.contactForm.groupBy({
        by: ['priority'],
        _count: { id: true }
      }),
      prisma.contactForm.groupBy({
        by: ['projectType'],
        _count: { id: true },
        where: { projectType: { not: null } }
      }),
      prisma.contactForm.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
          }
        }
      })
    ]);

    const conversionRate = total > 0 ? (wonCount / total) * 100 : 0;

    res.json({
      success: true,
      data: {
        overview: {
          total,
          new: newCount,
          contacted: contactedCount,
          qualified: qualifiedCount,
          won: wonCount,
          lost: lostCount,
          conversionRate: Number(conversionRate.toFixed(2)),
          recentSubmissions
        },
        byPriority,
        byProjectType
      }
    });

  } catch (error) {
    logger.error('Contact form stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact form statistics'
    });
  }
});

// Delete contact form (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Check admin privileges
    if (!['ADMIN', 'SUPER_ADMIN'].includes(req.user!.role)) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const contactForm = await prisma.contactForm.findUnique({
      where: { id }
    });

    if (!contactForm) {
      return res.status(404).json({
        success: false,
        error: 'Contact form not found'
      });
    }

    await prisma.contactForm.delete({
      where: { id }
    });

    logger.info('Contact form deleted', {
      contactFormId: id,
      deletedBy: req.user!.userId
    });

    res.json({
      success: true,
      message: 'Contact form deleted successfully'
    });

  } catch (error) {
    logger.error('Delete contact form error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete contact form'
    });
  }
});

export default router;
