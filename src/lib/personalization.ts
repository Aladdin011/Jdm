import {
  useAppStore,
  PersonalizationConfig,
  AnalyticsState,
} from "@/stores/appStore";

export interface UserInteraction {
  userId: string;
  sessionId: string;
  timestamp: Date;
  type: "click" | "scroll" | "hover" | "focus" | "form_submit" | "page_view";
  element: string;
  page: string;
  duration?: number;
  value?: string;
  coordinates?: { x: number; y: number };
}

export interface LeadScoringData {
  score: number;
  factors: {
    timeOnSite: number;
    pageDepth: number;
    portfolioEngagement: number;
    contactFormInteraction: number;
    returnVisitor: boolean;
    deviceQuality: number;
    timeOfDay: number;
  };
  classification: "cold" | "warm" | "hot" | "qualified";
}

export interface ConversionData {
  conversionRate: number;
  funnelStep:
    | "awareness"
    | "interest"
    | "consideration"
    | "intent"
    | "evaluation"
    | "purchase";
  timeToConvert: number;
  touchpoints: string[];
  revenue?: number;
}

// Advanced personalization engine
export class PersonalizationEngine {
  private userBehaviorPattern: Map<string, any> = new Map();
  private sessionStartTime: Date = new Date();

  // Analyze user behavior to create personalization profile
  analyzeUserBehavior(interactions: UserInteraction[]): PersonalizationConfig {
    const scrollEvents = interactions.filter((i) => i.type === "scroll");
    const clickEvents = interactions.filter((i) => i.type === "click");
    const timeOnSite = Date.now() - this.sessionStartTime.getTime();

    // Determine scroll behavior
    const avgScrollSpeed = this.calculateScrollSpeed(scrollEvents);
    const scrollBehavior =
      avgScrollSpeed > 1000
        ? "fast"
        : avgScrollSpeed > 500
          ? "slow"
          : "explorer";

    // Determine user type based on behavior patterns
    const userType = this.classifyUserType(interactions, timeOnSite);

    // Get location and device info
    const deviceType = this.detectDeviceType();
    const timeOfDay = this.getTimeOfDay();
    const geoLocation = this.estimateLocation();

    return {
      userType,
      geoLocation,
      deviceType,
      timeOfDay,
      scrollBehavior,
      viewportSize: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };
  }

  private calculateScrollSpeed(scrollEvents: UserInteraction[]): number {
    if (scrollEvents.length < 2) return 0;

    let totalSpeed = 0;
    for (let i = 1; i < scrollEvents.length; i++) {
      const timeDiff =
        scrollEvents[i].timestamp.getTime() -
        scrollEvents[i - 1].timestamp.getTime();
      const scrollDiff = Math.abs(
        (scrollEvents[i].coordinates?.y || 0) -
          (scrollEvents[i - 1].coordinates?.y || 0),
      );
      totalSpeed += scrollDiff / Math.max(timeDiff, 1);
    }

    return totalSpeed / (scrollEvents.length - 1);
  }

  private classifyUserType(
    interactions: UserInteraction[],
    timeOnSite: number,
  ): PersonalizationConfig["userType"] {
    const portfolioViews = interactions.filter((i) =>
      i.page.includes("project"),
    ).length;
    const contactAttempts = interactions.filter((i) =>
      i.element.includes("contact"),
    ).length;
    const servicePageViews = interactions.filter((i) =>
      i.page.includes("service"),
    ).length;

    // Enterprise user indicators
    if (servicePageViews > 3 || contactAttempts > 1 || timeOnSite > 300000) {
      return "enterprise";
    }

    // Returning user indicators
    const hasReturnVisitCookie = localStorage.getItem(
      "builder_aura_return_visitor",
    );
    if (hasReturnVisitCookie || portfolioViews > 5) {
      return "returning";
    }

    return "new";
  }

  private detectDeviceType(): PersonalizationConfig["deviceType"] {
    const width = window.innerWidth;
    const userAgent = navigator.userAgent;

    if (
      /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent,
      )
    ) {
      return width < 768 ? "mobile" : "tablet";
    }

    return width < 1024 ? "tablet" : "desktop";
  }

  private getTimeOfDay(): PersonalizationConfig["timeOfDay"] {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  }

  private estimateLocation(): string {
    // In a real implementation, you'd use IP geolocation
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return timezone.split("/")[1] || "Unknown";
  }

  // Content adaptation based on personalization
  adaptContent(config: PersonalizationConfig) {
    return {
      heroMessage: this.adaptHeroMessage(config),
      ctaText: this.optimizeCTAText(config),
      portfolioLayout: this.selectOptimalLayout(config),
      animationIntensity: this.calculateAnimationLevel(config),
      colorTheme: this.selectColorTheme(config),
      contentPriority: this.prioritizeContent(config),
    };
  }

  private adaptHeroMessage(config: PersonalizationConfig): string {
    const { userType, timeOfDay, geoLocation } = config;

    if (userType === "enterprise") {
      return "Transforming Africa's Infrastructure";
    }

    if (geoLocation.includes("Lagos") || geoLocation.includes("Abuja")) {
      return "Building Nigeria's Future Cities";
    }

    switch (timeOfDay) {
      case "morning":
        return "Building Africa's Future Cities";
      case "afternoon":
        return "Innovative Construction Solutions";
      case "evening":
        return "Sustainable Urban Development";
      default:
        return "Building Africa's Future Cities";
    }
  }

  private optimizeCTAText(config: PersonalizationConfig): string {
    const { userType, deviceType, timeOfDay } = config;

    if (userType === "enterprise") return "Schedule Consultation";
    if (deviceType === "mobile") return "View Projects";
    if (timeOfDay === "evening") return "Learn More";

    return "Explore Our Work";
  }

  private selectOptimalLayout(
    config: PersonalizationConfig,
  ): "grid" | "list" | "masonry" {
    const { deviceType, scrollBehavior } = config;

    if (deviceType === "mobile") return "list";
    if (scrollBehavior === "explorer") return "masonry";

    return "grid";
  }

  private calculateAnimationLevel(
    config: PersonalizationConfig,
  ): "minimal" | "moderate" | "full" {
    const { deviceType, scrollBehavior } = config;

    if (deviceType === "mobile" || scrollBehavior === "fast") return "minimal";
    if (scrollBehavior === "explorer") return "full";

    return "moderate";
  }

  private selectColorTheme(
    config: PersonalizationConfig,
  ): "warm" | "cool" | "neutral" {
    const { timeOfDay, userType } = config;

    if (userType === "enterprise") return "neutral";
    if (timeOfDay === "evening") return "warm";

    return "cool";
  }

  private prioritizeContent(config: PersonalizationConfig): string[] {
    const { userType, deviceType } = config;

    if (userType === "enterprise") {
      return ["services", "portfolio", "testimonials", "contact"];
    }

    if (deviceType === "mobile") {
      return ["hero", "portfolio", "contact"];
    }

    return [
      "hero",
      "about",
      "portfolio",
      "services",
      "testimonials",
      "contact",
    ];
  }
}

// Lead scoring algorithm
export class LeadScoringEngine {
  calculateLeadScore(
    interaction: UserInteraction,
    analytics: AnalyticsState,
  ): LeadScoringData {
    const factors = {
      timeOnSite: this.scoreTimeOnSite(analytics.sessionDuration),
      pageDepth: this.scorePageDepth(analytics.userJourney.length),
      portfolioEngagement: this.scorePortfolioEngagement(analytics.userJourney),
      contactFormInteraction: this.scoreContactInteraction(
        analytics.userJourney,
      ),
      returnVisitor: this.scoreReturnVisitor(),
      deviceQuality: this.scoreDeviceQuality(),
      timeOfDay: this.scoreTimeOfDay(),
    };

    const score = Object.values(factors).reduce(
      (sum, factor) => sum + factor,
      0,
    );
    const classification = this.classifyLead(score);

    return { score, factors, classification };
  }

  private scoreTimeOnSite(duration: number): number {
    if (duration > 300000) return 25; // 5+ minutes
    if (duration > 120000) return 20; // 2+ minutes
    if (duration > 60000) return 15; // 1+ minute
    if (duration > 30000) return 10; // 30+ seconds
    return 5;
  }

  private scorePageDepth(pageCount: number): number {
    if (pageCount > 10) return 20;
    if (pageCount > 5) return 15;
    if (pageCount > 3) return 10;
    return 5;
  }

  private scorePortfolioEngagement(journey: string[]): number {
    const portfolioInteractions = journey.filter(
      (action) => action.includes("project") || action.includes("portfolio"),
    ).length;

    return Math.min(portfolioInteractions * 5, 20);
  }

  private scoreContactInteraction(journey: string[]): number {
    const contactInteractions = journey.filter(
      (action) =>
        action.includes("contact") ||
        action.includes("form") ||
        action.includes("consultation"),
    ).length;

    return Math.min(contactInteractions * 10, 30);
  }

  private scoreReturnVisitor(): number {
    return localStorage.getItem("builder_aura_return_visitor") ? 15 : 0;
  }

  private scoreDeviceQuality(): number {
    const connection = (navigator as any).connection;
    const deviceMemory = (navigator as any).deviceMemory;

    let score = 5; // Base score

    if (deviceMemory && deviceMemory >= 8) score += 5;
    if (connection && connection.effectiveType === "4g") score += 5;

    return score;
  }

  private scoreTimeOfDay(): number {
    const hour = new Date().getHours();
    // Business hours score higher
    if (hour >= 9 && hour <= 17) return 10;
    if (hour >= 8 && hour <= 20) return 5;
    return 2;
  }

  private classifyLead(score: number): LeadScoringData["classification"] {
    if (score >= 80) return "qualified";
    if (score >= 60) return "hot";
    if (score >= 40) return "warm";
    return "cold";
  }
}

// Real-time optimization system
export class RealTimeOptimizer {
  private optimizationRules: Map<string, (data: any) => void> = new Map();

  constructor() {
    this.initializeOptimizationRules();
  }

  private initializeOptimizationRules() {
    // High bounce rate optimization
    this.optimizationRules.set("high_bounce_rate", (data) => {
      if (data.bounceRate > 0.7) {
        const { updatePersonalization } = useAppStore.getState();
        updatePersonalization({
          scrollBehavior: "fast", // Reduce animation complexity
        });
      }
    });

    // Low CTA click rate optimization
    this.optimizationRules.set("low_cta_click", (data) => {
      if (data.ctaClickRate < 0.02) {
        // Trigger A/B test for new CTA variants
        this.testNewCtaVariants();
      }
    });

    // Page load performance optimization
    this.optimizationRules.set("slow_performance", (data) => {
      if (data.lcp > 2500) {
        // LCP > 2.5s
        const { updatePersonalization } = useAppStore.getState();
        updatePersonalization({
          scrollBehavior: "fast", // Reduce resource usage
        });
      }
    });
  }

  optimizeInRealTime(analyticsData: any) {
    this.optimizationRules.forEach((rule, key) => {
      try {
        rule(analyticsData);
      } catch (error) {
        console.warn(`Optimization rule ${key} failed:`, error);
      }
    });
  }

  private testNewCtaVariants() {
    const variants = [
      "Start Your Project",
      "Get Free Consultation",
      "Explore Solutions",
      "Request Proposal",
      "Book Discovery Call",
    ];

    // Store new variants for A/B testing
    localStorage.setItem("cta_test_variants", JSON.stringify(variants));
  }
}

// Export singleton instances
export const personalizationEngine = new PersonalizationEngine();
export const leadScoringEngine = new LeadScoringEngine();
export const realTimeOptimizer = new RealTimeOptimizer();

// React hooks for easy usage
export const usePersonalization = () => {
  const { personalization, analytics, updatePersonalization } = useAppStore();

  const adaptContent = (interactions: UserInteraction[]) => {
    const updatedPersonalization =
      personalizationEngine.analyzeUserBehavior(interactions);
    updatePersonalization(updatedPersonalization);
    return personalizationEngine.adaptContent(updatedPersonalization);
  };

  return { personalization, adaptContent };
};

export const useLeadScoring = () => {
  const { analytics } = useAppStore();

  const calculateScore = (interaction: UserInteraction) => {
    return leadScoringEngine.calculateLeadScore(interaction, analytics);
  };

  return { calculateScore };
};
