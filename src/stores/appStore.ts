import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

// Types for personalization and analytics
export interface PersonalizationConfig {
  userType: 'returning' | 'new' | 'enterprise';
  geoLocation: string;
  deviceType: 'mobile' | 'desktop' | 'tablet';
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  scrollBehavior: 'fast' | 'slow' | 'explorer';
  viewportSize: { width: number; height: number };
}

export interface AnalyticsState {
  pageViews: number;
  sessionDuration: number;
  bounceRate: number;
  conversionEvents: string[];
  userJourney: string[];
  lastInteraction: Date;
}

export interface PerformanceMetrics {
  lcp: number;
  fid: number;
  cls: number;
  ttfb: number;
  fcp: number;
}

export interface AppState {
  // Theme and preferences
  theme: 'light' | 'dark' | 'system';
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large';
  
  // Personalization
  personalization: PersonalizationConfig;
  
  // UI State
  isMenuOpen: boolean;
  currentSection: string;
  scrollProgress: number;
  
  // Performance and Analytics
  analytics: AnalyticsState;
  performance: PerformanceMetrics;
  
  // User interaction
  mousePosition: { x: number; y: number };
  isUserIdle: boolean;
  
  // Portfolio and content
  portfolioFilter: string;
  activeProject: string | null;
  
  // Actions
  setTheme: (theme: AppState['theme']) => void;
  setReducedMotion: (reduced: boolean) => void;
  updatePersonalization: (config: Partial<PersonalizationConfig>) => void;
  updateAnalytics: (data: Partial<AnalyticsState>) => void;
  updatePerformance: (metrics: Partial<PerformanceMetrics>) => void;
  setMousePosition: (position: { x: number; y: number }) => void;
  setCurrentSection: (section: string) => void;
  setScrollProgress: (progress: number) => void;
  toggleMenu: () => void;
  setPortfolioFilter: (filter: string) => void;
  setActiveProject: (id: string | null) => void;
  trackUserInteraction: (interaction: string) => void;
  updateUserActivity: () => void;
}

// Helper functions
const detectDeviceType = (): PersonalizationConfig['deviceType'] => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

const getTimeOfDay = (): PersonalizationConfig['timeOfDay'] => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
};

const getSystemPreference = (): AppState['theme'] => {
  if (typeof window === 'undefined') return 'light';
  
  const stored = localStorage.getItem('theme') as AppState['theme'];
  if (stored) return stored;
  
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

// Create the store with advanced features
export const useAppStore = create<AppState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state
      theme: getSystemPreference(),
      reducedMotion: typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      fontSize: 'medium',
      
      personalization: {
        userType: 'new',
        geoLocation: '',
        deviceType: detectDeviceType(),
        timeOfDay: getTimeOfDay(),
        scrollBehavior: 'slow',
        viewportSize: { 
          width: typeof window !== 'undefined' ? window.innerWidth : 1920, 
          height: typeof window !== 'undefined' ? window.innerHeight : 1080 
        },
      },
      
      isMenuOpen: false,
      currentSection: 'hero',
      scrollProgress: 0,
      
      analytics: {
        pageViews: 0,
        sessionDuration: 0,
        bounceRate: 0,
        conversionEvents: [],
        userJourney: [],
        lastInteraction: new Date(),
      },
      
      performance: {
        lcp: 0,
        fid: 0,
        cls: 0,
        ttfb: 0,
        fcp: 0,
      },
      
      mousePosition: { x: 0, y: 0 },
      isUserIdle: false,
      portfolioFilter: 'all',
      activeProject: null,
      
      // Actions
      setTheme: (theme) => {
        set({ theme });
        if (typeof window !== 'undefined') {
          localStorage.setItem('theme', theme);
          updateCSSCustomProperties(theme);
        }
      },
      
      setReducedMotion: (reducedMotion) => {
        set({ reducedMotion });
        if (typeof window !== 'undefined') {
          document.documentElement.style.setProperty(
            '--motion-duration', 
            reducedMotion ? '0ms' : 'var(--motion-duration-default)'
          );
        }
      },
      
      updatePersonalization: (config) => {
        set(state => ({
          personalization: { ...state.personalization, ...config }
        }));
      },
      
      updateAnalytics: (data) => {
        set(state => ({
          analytics: { ...state.analytics, ...data }
        }));
      },
      
      updatePerformance: (metrics) => {
        set(state => ({
          performance: { ...state.performance, ...metrics }
        }));
      },
      
      setMousePosition: (mousePosition) => {
        set({ mousePosition });
      },
      
      setCurrentSection: (currentSection) => {
        set({ currentSection });
        get().trackUserInteraction(`section-${currentSection}`);
      },
      
      setScrollProgress: (scrollProgress) => {
        set({ scrollProgress });
      },
      
      toggleMenu: () => {
        set(state => ({ isMenuOpen: !state.isMenuOpen }));
        get().trackUserInteraction('menu-toggle');
      },
      
      setPortfolioFilter: (portfolioFilter) => {
        set({ portfolioFilter });
        get().trackUserInteraction(`filter-${portfolioFilter}`);
      },
      
      setActiveProject: (activeProject) => {
        set({ activeProject });
        if (activeProject) {
          get().trackUserInteraction(`project-${activeProject}`);
        }
      },
      
      trackUserInteraction: (interaction) => {
        const state = get();
        const updatedJourney = [...state.analytics.userJourney, interaction].slice(-50); // Keep last 50 interactions
        
        set(state => ({
          analytics: {
            ...state.analytics,
            userJourney: updatedJourney,
            lastInteraction: new Date(),
          }
        }));
      },
      
      updateUserActivity: () => {
        set({ isUserIdle: false });
        get().trackUserInteraction('user-active');
      },
    })),
    {
      name: 'app-store',
      partialize: (state) => ({
        theme: state.theme,
        reducedMotion: state.reducedMotion,
        fontSize: state.fontSize,
        portfolioFilter: state.portfolioFilter,
      }),
    }
  )
);

// Helper function to update CSS custom properties
const updateCSSCustomProperties = (theme: AppState['theme']) => {
  const root = document.documentElement;
  
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  // Update theme-specific variables
  const themeColors = theme === 'dark' ? {
    '--background': '222.2 84% 4.9%',
    '--foreground': '210 40% 98%',
    '--primary': '217.2 91.2% 59.8%',
  } : {
    '--background': '0 0% 100%',
    '--foreground': '222.2 84% 4.9%',
    '--primary': '221.2 83.2% 53.3%',
  };
  
  Object.entries(themeColors).forEach(([property, value]) => {
    root.style.setProperty(property, value);
  });
};

// Performance monitoring hook
export const usePerformanceMonitoring = () => {
  const updatePerformance = useAppStore(state => state.updatePerformance);
  
  // Monitor Core Web Vitals
  if (typeof window !== 'undefined') {
    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
      onCLS(metric => updatePerformance({ cls: metric.value }));
      onFID(metric => updatePerformance({ fid: metric.value }));
      onFCP(metric => updatePerformance({ fcp: metric.value }));
      onLCP(metric => updatePerformance({ lcp: metric.value }));
      onTTFB(metric => updatePerformance({ ttfb: metric.value }));
    });
  }
};

// Real-time optimization hook
export const useRealTimeOptimization = () => {
  const analytics = useAppStore(state => state.analytics);
  const personalization = useAppStore(state => state.personalization);
  const updatePersonalization = useAppStore(state => state.updatePersonalization);
  
  // Adjust experience based on user behavior
  const optimizeExperience = () => {
    const { scrollBehavior } = personalization;
    const { bounceRate } = analytics;
    
    // If bounce rate is high, reduce animation intensity
    if (bounceRate > 0.5) {
      updatePersonalization({ scrollBehavior: 'fast' });
    }
    
    // Optimize based on device performance
    const deviceMemory = (navigator as any).deviceMemory;
    if (deviceMemory && deviceMemory < 4) {
      updatePersonalization({ scrollBehavior: 'fast' });
    }
  };
  
  return { optimizeExperience };
};
