// Performance optimization utilities

// Image lazy loading with Intersection Observer
export const createImageObserver = () => {
  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers
    return null;
  }

  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.remove('lazy');
            img.classList.add('loaded');
          }
        }
      });
    },
    {
      root: null,
      rootMargin: '50px',
      threshold: 0.1,
    }
  );
};

// Debounce function for performance optimization
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Throttle function for scroll events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
};

// RequestAnimationFrame throttle for smooth animations
export const rafThrottle = <T extends (...args: any[]) => any>(
  func: T
): ((...args: Parameters<T>) => void) => {
  let rafId: number | null = null;
  return (...args: Parameters<T>) => {
    if (rafId === null) {
      rafId = requestAnimationFrame(() => {
        func(...args);
        rafId = null;
      });
    }
  };
};

// Image optimization utilities
export const getOptimizedImageUrl = (
  url: string,
  width?: number,
  height?: number,
  quality: number = 80,
  format: 'webp' | 'jpg' | 'png' = 'webp'
): string => {
  // Check if it's a Builder.io CDN URL
  if (url.includes('cdn.builder.io')) {
    const params = new URLSearchParams();
    if (width) params.set('width', width.toString());
    if (height) params.set('height', height.toString());
    params.set('quality', quality.toString());
    params.set('format', format);
    
    return `${url}&${params.toString()}`;
  }
  
  // For other URLs, return as-is (could be extended for other CDNs)
  return url;
};

// Generate responsive image srcSet
export const generateSrcSet = (
  url: string,
  sizes: number[] = [320, 640, 960, 1280, 1920]
): string => {
  return sizes
    .map((size) => {
      const optimizedUrl = getOptimizedImageUrl(url, size);
      return `${optimizedUrl} ${size}w`;
    })
    .join(', ');
};

// Preload critical resources with usage tracking
export const preloadResource = (
  href: string,
  as: 'image' | 'font' | 'script' | 'style',
  crossorigin?: boolean
) => {
  // Check if resource is already preloaded
  const existingPreload = document.querySelector(`link[rel="preload"][href="${href}"]`);
  if (existingPreload) return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (crossorigin) link.crossOrigin = 'anonymous';
  
  // Add onload handler to track usage
  link.onload = () => {
    link.dataset.loaded = 'true';
  };
  
  // Remove unused preloads after 10 seconds
  setTimeout(() => {
    if (!link.dataset.loaded && link.parentNode) {
      link.parentNode.removeChild(link);
    }
  }, 10000);
  
  document.head.appendChild(link);
};

// Preload critical images
export const preloadCriticalImages = (imageUrls: string[]) => {
  imageUrls.forEach((url) => {
    const optimizedUrl = getOptimizedImageUrl(url, 1920);
    preloadResource(optimizedUrl, 'image');
  });
};

// Web Vitals tracking
export const trackWebVitals = () => {
  if (typeof window === 'undefined') return;

  try {
    // Check for PerformanceObserver support
    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not supported');
      return;
    }

    // Track FCP (First Contentful Paint)
    try {
      const observer = new PerformanceObserver((list) => {
        try {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name === 'first-contentful-paint') {
              console.log('FCP:', entry.startTime);
              // Send to analytics
              if (window.gtag) {
                window.gtag('event', 'web_vitals', {
                  event_category: 'Performance',
                  event_label: 'First Contentful Paint',
                  value: Math.round(entry.startTime),
                });
              }
            }
          });
        } catch (error) {
          console.warn('FCP tracking error:', error);
        }
      });

      observer.observe({ entryTypes: ['paint'] });
    } catch (error) {
      console.warn('FCP observer setup failed:', error);
    }

    // Track LCP (Largest Contentful Paint)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        try {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          console.log('LCP:', lastEntry.startTime);

          if (window.gtag) {
            window.gtag('event', 'web_vitals', {
              event_category: 'Performance',
              event_label: 'Largest Contentful Paint',
              value: Math.round(lastEntry.startTime),
            });
          }
        } catch (error) {
          console.warn('LCP tracking error:', error);
        }
      });

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (error) {
      console.warn('LCP observer setup failed:', error);
    }

    // Track CLS (Cumulative Layout Shift)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        try {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          console.log('CLS:', clsValue);

          if (window.gtag) {
            window.gtag('event', 'web_vitals', {
              event_category: 'Performance',
              event_label: 'Cumulative Layout Shift',
              value: Math.round(clsValue * 1000),
            });
          }
        } catch (error) {
          console.warn('CLS tracking error:', error);
        }
      });

      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (error) {
      console.warn('CLS observer setup failed:', error);
    }

    // Track FID (First Input Delay)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        try {
          const firstInput = list.getEntries()[0];
          if (firstInput) {
            const processingTime = (firstInput as any).processingStart - firstInput.startTime;
            console.log('FID:', processingTime);

            if (window.gtag) {
              window.gtag('event', 'web_vitals', {
                event_category: 'Performance',
                event_label: 'First Input Delay',
                value: Math.round(processingTime),
              });
            }
          }
        } catch (error) {
          console.warn('FID tracking error:', error);
        }
      });

      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (error) {
      console.warn('FID observer setup failed:', error);
    }
  } catch (error) {
    console.warn('Web Vitals tracking initialization failed:', error);
  }
};

// Resource hints for better performance
export const addResourceHints = () => {
  try {
    const useLocalFonts = String((import.meta as any).env?.VITE_USE_LOCAL_FONTS).toLowerCase() === 'true';
    // DNS prefetch for external domains
    const dnsPrefetchDomains = [
      ...(useLocalFonts ? [] : ['//fonts.googleapis.com', '//fonts.gstatic.com']),
      '//cdn.builder.io',
      '//images.unsplash.com',
    ];

    dnsPrefetchDomains.forEach((domain) => {
      try {
        // Check if already exists
        const existing = document.querySelector(`link[rel="dns-prefetch"][href="${domain}"]`);
        if (!existing) {
          const link = document.createElement('link');
          link.rel = 'dns-prefetch';
          link.href = domain;
          document.head.appendChild(link);
        }
      } catch (error) {
        console.warn(`Failed to add DNS prefetch for ${domain}:`, error);
      }
    });

    // Preconnect to critical domains
    const preconnectDomains = useLocalFonts
      ? ['https://cdn.builder.io']
      : ['https://fonts.googleapis.com', 'https://cdn.builder.io'];

    preconnectDomains.forEach((domain) => {
      try {
        // Check if already exists
        const existing = document.querySelector(`link[rel="preconnect"][href="${domain}"]`);
        if (!existing) {
          const link = document.createElement('link');
          link.rel = 'preconnect';
          link.href = domain;
          link.crossOrigin = 'anonymous';
          document.head.appendChild(link);
        }
      } catch (error) {
        console.warn(`Failed to add preconnect for ${domain}:`, error);
      }
    });
  } catch (error) {
    console.warn('Resource hints setup failed:', error);
  }
};

// Code splitting utilities
export const loadComponentAsync = <T>(
  importFunc: () => Promise<{ default: T }>
): Promise<T> => {
  return importFunc().then((module) => module.default);
};

// Memory management
export const cleanupEventListeners = (
  element: Element | Window,
  events: Array<{ type: string; listener: EventListener; options?: boolean | AddEventListenerOptions }>
) => {
  events.forEach(({ type, listener, options }) => {
    element.removeEventListener(type, listener, options);
  });
};

// Service Worker registration for PWA
export const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const swPath = (import.meta as any).env?.BASE_URL
        ? (import.meta as any).env.BASE_URL + 'sw.js'
        : (window as any).__vite_base__
          ? (window as any).__vite_base__ + 'sw.js'
          : '/sw.js';
      const registration = await navigator.serviceWorker.register(swPath);
      console.log('Service Worker registered:', registration);
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              // Show update notification to user
              console.log('New content available, please refresh.');
            }
          });
        }
      });
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Dev-only cleanup to avoid SW interference with Vite HMR and module loading
export const unregisterDevServiceWorkers = async () => {
  if (!import.meta.env.PROD && 'serviceWorker' in navigator) {
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) {
        await reg.unregister();
      }
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }
      console.log('Dev: Unregistered service workers and cleared caches to prevent module fetch issues.');
    } catch (error) {
      console.warn('Dev: Service worker cleanup failed:', error);
    }
  }
};

// Cache management
export const cacheResource = async (
  cacheName: string,
  resources: string[]
): Promise<void> => {
  if ('caches' in window) {
    const cache = await caches.open(cacheName);
    await cache.addAll(resources);
  }
};

// Font loading optimization
export const optimizeFontLoading = () => {
  try {
    // Force remote Google Fonts and disable local fonts to avoid OTS errors
    const useLocalFonts = false;

    // When using local fonts via bundled imports (e.g., @fontsource), avoid injecting any external stylesheets
    if (useLocalFonts) {
      // Ensure font-display: swap is applied broadly
      const fontDisplayCSS = `
        html { text-rendering: optimizeLegibility; }
        body { font-synthesis-weight: none; }
        @font-face { font-display: swap; }
      `;

      const existingFontStyle = document.querySelector('#font-display-optimization');
      if (!existingFontStyle) {
        const style = document.createElement('style');
        style.id = 'font-display-optimization';
        style.textContent = fontDisplayCSS;
        document.head.appendChild(style);
      }
      return; // Skip external injection when local fonts are used
    }

    // Fallback: inject Google Fonts stylesheet when not using local fonts
    const fontUrl = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap';
    const existingPreload = document.querySelector(`link[href="${fontUrl}"]`);
    if (!existingPreload) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = fontUrl;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);

      const styleLink = document.createElement('link');
      styleLink.rel = 'stylesheet';
      styleLink.href = fontUrl;
      styleLink.crossOrigin = 'anonymous';
      document.head.appendChild(styleLink);
    }
  } catch (error) {
    console.warn('Font loading optimization failed:', error);
  }
};

// Critical CSS inlining
export const inlineCriticalCSS = (css: string) => {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};

// Async script loading
export const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

// Bundle size analysis helper
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Bundle analysis would be available in production build');
  }
};

// Global performance configuration
export const initializePerformanceOptimizations = () => {
  try {
    // Ensure dev environment is clean of any SW that may have persisted
    try {
      unregisterDevServiceWorkers();
    } catch (error) {
      console.warn('Dev SW cleanup failed:', error);
    }
    // Add resource hints
    try {
      addResourceHints();
    } catch (error) {
      console.warn('Resource hints setup failed:', error);
    }

    // Track web vitals
    try {
      trackWebVitals();
    } catch (error) {
      console.warn('Web vitals tracking setup failed:', error);
    }

    // Optimize font loading
    try {
      optimizeFontLoading();
    } catch (error) {
      console.warn('Font loading optimization failed:', error);
    }

    // Register service worker only in production
    if (import.meta.env.PROD) {
      try {
        registerServiceWorker();
      } catch (error) {
        console.warn('Service worker registration failed:', error);
      }
    }

    // Preload critical images (customize based on your needs)
    try {
      const criticalImages = [
        'https://cdn.builder.io/api/v1/image/assets%2F751ea84be0da437c8dd3f1bf04173189%2F6fe8dede446d44e5b3f61dac8e245b53?alt=media&token=2cd3aa20-e283-42dd-ad0a-b327725825be&apiKey=751ea84be0da437c8dd3f1bf04173189',
      ];

      // Disable critical images preload to reduce unused preloads
      // preloadCriticalImages(criticalImages);
    } catch (error) {
      console.warn('Critical images preload failed:', error);
    }
  } catch (error) {
    console.warn('Performance optimizations initialization failed:', error);
  }
};

// TypeScript declarations removed - already declared in useAnalytics.ts
