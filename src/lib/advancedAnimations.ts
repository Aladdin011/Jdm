import { animate, stagger } from 'motion';
import { useAppStore } from '@/stores/appStore';

// Animation configurations based on performance and accessibility
export interface AnimationConfig {
  duration?: number;
  easing?: string | number[];
  delay?: number;
  stagger?: number;
  respectReducedMotion?: boolean;
}

// Performance-optimized easing curves
export const easingCurves = {
  smooth: [0.25, 0.46, 0.45, 0.94],
  snappy: [0.68, -0.55, 0.265, 1.55],
  gentle: [0.25, 0.1, 0.25, 1],
  dramatic: [0.87, 0, 0.13, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
} as const;

// Advanced animation system
export class AdvancedAnimations {
  private observers: Map<Element, IntersectionObserver> = new Map();
  private performanceMode: 'high' | 'medium' | 'low' = 'high';
  
  constructor() {
    this.detectPerformanceMode();
  }
  
  private detectPerformanceMode() {
    if (typeof window === 'undefined') return;
    
    const connection = (navigator as any).connection;
    const deviceMemory = (navigator as any).deviceMemory;
    
    // Detect based on device capabilities
    if (deviceMemory && deviceMemory < 4) {
      this.performanceMode = 'low';
    } else if (connection && connection.effectiveType === '3g') {
      this.performanceMode = 'medium';
    }
  }
  
  // Hardware-accelerated transforms only
  smoothScroll(target: number, container?: Element): Promise<void> {
    const element = container || window;
    const config = this.getOptimizedConfig({ duration: 800, easing: easingCurves.smooth });
    
    return animate(
      element,
      { scrollTop: target },
      config
    ).finished;
  }
  
  // Intersection Observer + CSS transforms for reveal animations
  revealOnScroll(
    elements: Element | Element[], 
    config: AnimationConfig = {}
  ): () => void {
    const elementsArray = Array.isArray(elements) ? elements : [elements];
    const optimizedConfig = this.getOptimizedConfig(config);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.performRevealAnimation(entry.target, optimizedConfig);
            observer.unobserve(entry.target);
          }
        });
      },
      { 
        threshold: 0.1, 
        rootMargin: '50px',
      }
    );
    
    elementsArray.forEach(el => {
      observer.observe(el);
      this.observers.set(el, observer);
    });
    
    // Return cleanup function
    return () => {
      elementsArray.forEach(el => {
        const obs = this.observers.get(el);
        if (obs) {
          obs.unobserve(el);
          this.observers.delete(el);
        }
      });
    };
  }
  
  private performRevealAnimation(element: Element, config: AnimationConfig) {
    if (this.performanceMode === 'low') {
      // Simple opacity fade for low-performance devices
      animate(element, { opacity: [0, 1] }, { duration: 300 });
      return;
    }
    
    // Full animation for capable devices
    animate(
      element,
      { 
        opacity: [0, 1], 
        y: [50, 0],
        scale: [0.95, 1]
      },
      {
        duration: config.duration || 600,
        easing: config.easing || easingCurves.gentle,
        delay: config.delay || 0,
      }
    );
  }
  
  // Staggered animations for lists
  staggerIn(
    elements: Element[],
    config: AnimationConfig = {}
  ): Promise<void> {
    const optimizedConfig = this.getOptimizedConfig(config);
    
    return animate(
      elements,
      { opacity: [0, 1], y: [30, 0] },
      {
        duration: optimizedConfig.duration || 400,
        delay: stagger(optimizedConfig.stagger || 0.1),
        easing: optimizedConfig.easing || easingCurves.gentle,
      }
    ).finished;
  }
  
  // Text reveal animation with character stagger
  revealText(
    element: Element,
    config: AnimationConfig = {}
  ): Promise<void> {
    const text = element.textContent || '';
    const chars = text.split('');
    
    // Create spans for each character
    element.innerHTML = chars
      .map(char => `<span style="display: inline-block; opacity: 0;">${char === ' ' ? '&nbsp;' : char}</span>`)
      .join('');
    
    const charElements = element.querySelectorAll('span');
    const optimizedConfig = this.getOptimizedConfig(config);
    
    return animate(
      charElements,
      { opacity: [0, 1], y: [20, 0] },
      {
        duration: optimizedConfig.duration || 500,
        delay: stagger(optimizedConfig.stagger || 0.02),
        easing: optimizedConfig.easing || easingCurves.gentle,
      }
    ).finished;
  }
  
  // Morphing animations
  morphElement(
    element: Element,
    fromState: Record<string, any>,
    toState: Record<string, any>,
    config: AnimationConfig = {}
  ): Promise<void> {
    const optimizedConfig = this.getOptimizedConfig(config);
    
    // Apply initial state
    Object.assign((element as HTMLElement).style, fromState);
    
    return animate(
      element,
      toState,
      {
        duration: optimizedConfig.duration || 800,
        easing: optimizedConfig.easing || easingCurves.smooth,
      }
    ).finished;
  }
  
  // Parallax scrolling with performance optimization
  createParallax(
    elements: { element: Element; speed: number }[],
    container?: Element
  ): () => void {
    if (this.performanceMode === 'low') {
      // Skip parallax on low-performance devices
      return () => {};
    }
    
    let ticking = false;
    
    const updateParallax = () => {
      const scrolled = container?.scrollTop || window.pageYOffset;
      
      elements.forEach(({ element, speed }) => {
        const yPos = scrolled * speed;
        (element as HTMLElement).style.transform = `translate3d(0, ${yPos}px, 0)`;
      });
      
      ticking = false;
    };
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };
    
    const scrollContainer = container || window;
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }
  
  // Magnetic hover effect
  createMagneticHover(element: Element, strength: number = 0.3): () => void {
    if (this.performanceMode === 'low') return () => {};
    
    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;
      
      animate(
        element,
        { x: deltaX, y: deltaY },
        { duration: 400, easing: easingCurves.gentle }
      );
    };
    
    const handleMouseLeave = () => {
      animate(
        element,
        { x: 0, y: 0 },
        { duration: 600, easing: easingCurves.smooth }
      );
    };
    
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }
  
  // Timeline animations for complex sequences
  async createTimeline(animations: Array<{
    element: Element | Element[];
    keyframes: Record<string, any>;
    options?: AnimationConfig;
  }>): Promise<void> {
    // Execute animations in sequence
    for (const { element, keyframes, options = {} } of animations) {
      await animate(
        element,
        keyframes,
        this.getOptimizedConfig(options)
      ).finished;
    }
  }
  
  // Get optimized config based on performance mode and accessibility
  private getOptimizedConfig(config: AnimationConfig): any {
    const reducedMotion = useAppStore.getState().reducedMotion;
    
    if (reducedMotion && config.respectReducedMotion !== false) {
      return {
        ...config,
        duration: 0,
        delay: 0,
        stagger: 0,
      };
    }
    
    // Adjust based on performance mode
    const performanceMultiplier = {
      high: 1,
      medium: 0.7,
      low: 0.3,
    }[this.performanceMode];
    
    return {
      ...config,
      duration: (config.duration || 600) * performanceMultiplier,
      delay: (config.delay || 0) * performanceMultiplier,
      stagger: (config.stagger || 0.1) * performanceMultiplier,
    };
  }
  
  // Cleanup all observers
  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }
}

// Singleton instance
export const advancedAnimations = new AdvancedAnimations();

// Hook for using advanced animations
export const useAdvancedAnimations = () => {
  return advancedAnimations;
};

// CSS-in-JS styles for hardware acceleration
export const acceleratedStyles = {
  willChange: 'transform, opacity',
  transform: 'translateZ(0)',
  backfaceVisibility: 'hidden' as const,
  perspective: '1000px',
};
