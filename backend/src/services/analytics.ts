import { prisma } from "@/utils/database";
import { logger } from "@/utils/logger";

interface AnalyticsEvent {
  userId?: string;
  sessionId?: string;
  event: string;
  data?: any;
  timestamp?: Date;
  ip?: string;
  userAgent?: string;
}

// Track user analytics
export const trackUserAnalytics = async (
  userId: string,
  event: string,
  data?: any,
) => {
  try {
    // Update user analytics record
    const analytics = await prisma.userAnalytics.upsert({
      where: { userId },
      update: {
        pageViews: event === "page_view" ? { increment: 1 } : undefined,
        sessionCount: event === "login" ? { increment: 1 } : undefined,
        lastVisit: new Date(),
        conversionEvents: event.includes("conversion")
          ? {
              push: event,
            }
          : undefined,
        interactionData: data
          ? {
              // Merge with existing data
              ...data,
            }
          : undefined,
        updatedAt: new Date(),
      },
      create: {
        userId,
        pageViews: event === "page_view" ? 1 : 0,
        sessionCount: event === "login" ? 1 : 0,
        lastVisit: new Date(),
        conversionEvents: event.includes("conversion") ? [event] : [],
        interactionData: data || {},
      },
    });

    logger.debug("Analytics tracked", {
      userId,
      event,
      timestamp: new Date(),
    });

    return analytics;
  } catch (error) {
    logger.error("Track analytics error:", error);
    throw error;
  }
};

// Get analytics overview
export const getAnalyticsOverview = async (
  timeframe: "day" | "week" | "month" = "week",
) => {
  try {
    const now = new Date();
    const startDate = new Date();

    switch (timeframe) {
      case "day":
        startDate.setDate(now.getDate() - 1);
        break;
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
    }

    const [
      totalUsers,
      activeUsers,
      pageViews,
      averageSessionDuration,
      topPages,
      deviceStats,
      trafficSources,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.userAnalytics.count({
        where: {
          lastVisit: {
            gte: startDate,
          },
        },
      }),
      prisma.userAnalytics.aggregate({
        _sum: { pageViews: true },
        where: {
          updatedAt: {
            gte: startDate,
          },
        },
      }),
      prisma.userAnalytics.aggregate({
        _avg: { totalTimeOnSite: true },
      }),
      getTopPages(startDate),
      getDeviceStats(startDate),
      getTrafficSources(startDate),
    ]);

    return {
      overview: {
        totalUsers,
        activeUsers,
        pageViews: pageViews._sum.pageViews || 0,
        averageSessionDuration: Math.round(
          averageSessionDuration._avg.totalTimeOnSite || 0,
        ),
        timeframe,
      },
      topPages,
      deviceStats,
      trafficSources,
    };
  } catch (error) {
    logger.error("Get analytics overview error:", error);
    throw error;
  }
};

// Get top pages
const getTopPages = async (startDate: Date) => {
  // This would be more complex in a real implementation
  // For now, return mock data based on common patterns
  return [
    { page: "/", views: 1250, percentage: 35 },
    { page: "/projects", views: 890, percentage: 25 },
    { page: "/services", views: 620, percentage: 17 },
    { page: "/about", views: 445, percentage: 12 },
    { page: "/contact", views: 395, percentage: 11 },
  ];
};

// Get device statistics
const getDeviceStats = async (startDate: Date) => {
  const deviceStats = await prisma.userAnalytics.groupBy({
    by: ["deviceType"],
    _count: { id: true },
    where: {
      updatedAt: {
        gte: startDate,
      },
      deviceType: {
        not: null,
      },
    },
  });

  const total = deviceStats.reduce((sum, stat) => sum + stat._count.id, 0);

  return deviceStats.map((stat) => ({
    device: stat.deviceType,
    count: stat._count.id,
    percentage: total > 0 ? Math.round((stat._count.id / total) * 100) : 0,
  }));
};

// Get traffic sources
const getTrafficSources = async (startDate: Date) => {
  const sourceStats = await prisma.userAnalytics.groupBy({
    by: ["utmSource"],
    _count: { id: true },
    where: {
      updatedAt: {
        gte: startDate,
      },
      utmSource: {
        not: null,
      },
    },
  });

  const total = sourceStats.reduce((sum, stat) => sum + stat._count.id, 0);

  return sourceStats.map((stat) => ({
    source: stat.utmSource,
    count: stat._count.id,
    percentage: total > 0 ? Math.round((stat._count.id / total) * 100) : 0,
  }));
};

// Track page view
export const trackPageView = async (
  userId: string,
  page: string,
  data?: any,
) => {
  return await trackUserAnalytics(userId, "page_view", {
    page,
    timestamp: new Date(),
    ...data,
  });
};

// Track conversion event
export const trackConversion = async (
  userId: string,
  conversionType: string,
  value?: number,
  data?: any,
) => {
  return await trackUserAnalytics(userId, `conversion_${conversionType}`, {
    conversionType,
    value,
    timestamp: new Date(),
    ...data,
  });
};

// Get user journey
export const getUserJourney = async (userId: string) => {
  try {
    const analytics = await prisma.userAnalytics.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });

    if (!analytics) {
      return null;
    }

    // Get contact forms
    const contactForms = await prisma.contactForm.findMany({
      where: { userId },
      select: {
        id: true,
        subject: true,
        projectType: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Get projects
    const projects = await prisma.project.findMany({
      where: { clientId: userId },
      select: {
        id: true,
        title: true,
        status: true,
        budget: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      user: analytics.user,
      analytics: {
        pageViews: analytics.pageViews,
        sessionCount: analytics.sessionCount,
        totalTimeOnSite: analytics.totalTimeOnSite,
        lastVisit: analytics.lastVisit,
        deviceType: analytics.deviceType,
        browser: analytics.browser,
        country: analytics.country,
        utmSource: analytics.utmSource,
        conversionEvents: analytics.conversionEvents,
      },
      contactForms,
      projects,
      journey: buildUserJourney(analytics, contactForms, projects),
    };
  } catch (error) {
    logger.error("Get user journey error:", error);
    throw error;
  }
};

// Build user journey timeline
const buildUserJourney = (
  analytics: any,
  contactForms: any[],
  projects: any[],
) => {
  const events = [];

  // Add registration event
  events.push({
    type: "registration",
    timestamp: analytics.user.createdAt,
    description: "User registered",
  });

  // Add contact form events
  contactForms.forEach((form) => {
    events.push({
      type: "contact_form",
      timestamp: form.createdAt,
      description: `Submitted inquiry: ${form.subject}`,
      data: {
        projectType: form.projectType,
        status: form.status,
      },
    });
  });

  // Add project events
  projects.forEach((project) => {
    events.push({
      type: "project",
      timestamp: project.createdAt,
      description: `Project started: ${project.title}`,
      data: {
        status: project.status,
        budget: project.budget,
      },
    });
  });

  // Add conversion events
  analytics.conversionEvents.forEach((event: string) => {
    events.push({
      type: "conversion",
      timestamp: analytics.lastVisit, // Approximate
      description: `Conversion: ${event.replace("conversion_", "")}`,
    });
  });

  // Sort by timestamp
  return events.sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );
};

// Real-time analytics event
export const trackRealTimeEvent = async (event: AnalyticsEvent) => {
  try {
    // Log the event
    logger.info("Real-time analytics event", event);

    // If user is identified, update their analytics
    if (event.userId) {
      await trackUserAnalytics(event.userId, event.event, event.data);
    }

    // You could also push to a real-time analytics service here
    // like Google Analytics, Mixpanel, etc.

    return true;
  } catch (error) {
    logger.error("Track real-time event error:", error);
    return false;
  }
};

export default {
  trackUserAnalytics,
  getAnalyticsOverview,
  trackPageView,
  trackConversion,
  getUserJourney,
  trackRealTimeEvent,
};
