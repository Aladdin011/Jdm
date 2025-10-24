// Layout Stability Optimizations to Fix High CLS

// Reserve space for dynamic content to prevent layout shifts
export const reserveSpace = (
  element: HTMLElement,
  width?: number,
  height?: number,
) => {
  if (width) element.style.width = `${width}px`;
  if (height) element.style.height = `${height}px`;
  element.style.minHeight = height ? `${height}px` : "auto";
};

// Predefine dimensions for images to prevent CLS
export const setImageDimensions = (
  img: HTMLImageElement,
  width: number,
  height: number,
) => {
  img.style.width = `${width}px`;
  img.style.height = `${height}px`;
  img.style.objectFit = "cover";
  img.style.display = "block";
};

// Add skeleton loading states to prevent layout shifts
export const addSkeletonLoader = (container: HTMLElement) => {
  container.style.background =
    "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)";
  container.style.backgroundSize = "200% 100%";
  container.style.animation = "loading 1.5s infinite";

  // Add CSS animation if not already present
  if (!document.getElementById("skeleton-styles")) {
    const style = document.createElement("style");
    style.id = "skeleton-styles";
    style.textContent = `
      @keyframes loading {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `;
    document.head.appendChild(style);
  }
};

// Remove skeleton loader
export const removeSkeletonLoader = (container: HTMLElement) => {
  container.style.background = "";
  container.style.backgroundSize = "";
  container.style.animation = "";
};

// Optimize font loading to prevent FOIT/FOUT
export const optimizeFontLoading = () => {
  // Add font-display: swap to existing fonts
  const style = document.createElement("style");
  style.textContent = `
    @font-face {
      font-family: 'Inter';
      font-display: swap;
    }
    
    * {
      font-display: swap;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
  `;
  document.head.appendChild(style);
};

// Prevent layout shifts from dynamic content
export const stabilizeLayout = () => {
  // Add CSS to prevent common layout shifts
  const style = document.createElement("style");
  style.id = "layout-stability";
  style.textContent = `
    /* Prevent layout shifts from images */
    img {
      max-width: 100%;
      height: auto;
      display: block;
    }
    
    /* Reserve space for lazy-loaded content */
    .lazy-content {
      min-height: 200px;
      transition: min-height 0.3s ease;
    }
    
    /* Prevent shifts from dynamic text */
    .dynamic-text {
      min-height: 1.2em;
      line-height: 1.2;
    }
    
    /* Stabilize button dimensions */
    button, .btn {
      min-height: 40px;
      min-width: 80px;
    }
    
    /* Prevent shifts from loading states */
    .loading-container {
      min-height: 100px;
      position: relative;
    }
    
    /* Optimize animations to not cause layout shifts */
    * {
      transform: translateZ(0);
      backface-visibility: hidden;
    }
    
    /* Prevent shifts from scrollbars */
    html {
      overflow-y: scroll;
    }
  `;

  if (!document.getElementById("layout-stability")) {
    document.head.appendChild(style);
  }
};

// Initialize layout stability optimizations
export const initializeLayoutStability = () => {
  try {
    stabilizeLayout();
    optimizeFontLoading();

    // Observe layout shifts and log them
    if ("LayoutShift" in window) {
      const observer = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }

        if (clsValue > 0.1) {
          console.warn(`High CLS detected: ${clsValue.toFixed(4)}`);
        }
      });

      observer.observe({ entryTypes: ["layout-shift"] });
    }

  } catch (error) {
    console.warn("Layout stability initialization failed:", error);
  }
};

// Initialize on module load
initializeLayoutStability();

// Legacy export for backward compatibility
export const initLayoutStability = initializeLayoutStability;
