import { useEffect, useState } from "react";
import { getTawkToEmbedUrl, TAWK_TO_CONFIG } from "@/config/tawkto";

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

export default function ChatbotPlaceholder() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    // Check if Tawk.to is already loaded
    if (window.Tawk_API && isLoaded) {
      return;
    }

    let scriptElement: HTMLScriptElement | null = null;

    const initializeTawkTo = () => {
      try {
        // Initialize Tawk.to API object
        window.Tawk_API = window.Tawk_API || {};
        window.Tawk_LoadStart = new Date();

        // Configure settings before loading
        window.Tawk_API.customStyle = {
          visibility: {
            desktop: {
              position: 'br',
              xOffset: TAWK_TO_CONFIG.settings.offsetX || 20,
              yOffset: TAWK_TO_CONFIG.settings.offsetY || 20
            },
            mobile: {
              position: 'br',
              xOffset: 10,
              yOffset: 10
            }
          }
        };

        // Set up event handlers
        window.Tawk_API.onLoad = function() {
          console.log("✅ Tawk.to chat widget loaded successfully");
          setIsLoaded(true);
          setLoadError(false);

          // Apply custom styling
          if (TAWK_TO_CONFIG.settings.backgroundColor) {
            try {
              window.Tawk_API.setAttributes({
                name: 'JD Marc Limited Support',
                email: 'support@jdmarclimited.com',
                hash: ''
              });

              // Apply color customization
              window.Tawk_API.customStyle = {
                ...window.Tawk_API.customStyle,
                widget: {
                  color: {
                    background: TAWK_TO_CONFIG.settings.backgroundColor,
                    bubble: TAWK_TO_CONFIG.settings.bubbleColor
                  }
                }
              };
            } catch (styleError) {
              console.warn("⚠️ Tawk.to styling failed:", styleError);
            }
          }
        };

        window.Tawk_API.onBeforeLoad = function() {
          console.log("🔄 Tawk.to widget loading...");
        };

        window.Tawk_API.onChatMaximized = function() {
          console.log("📖 Chat maximized");
        };

        window.Tawk_API.onChatMinimized = function() {
          console.log("📕 Chat minimized");
        };

        window.Tawk_API.onChatHidden = function() {
          console.log("👻 Chat hidden");
        };

        window.Tawk_API.onChatStarted = function() {
          console.log("💬 Chat conversation started");
        };

        window.Tawk_API.onChatEnded = function() {
          console.log("👋 Chat conversation ended");
        };

        // Create and configure the script element
        scriptElement = document.createElement("script");
        scriptElement.async = true;
        scriptElement.src = getTawkToEmbedUrl();
        scriptElement.charset = "UTF-8";
        scriptElement.setAttribute("crossorigin", "*");

        // Add error handling for script loading
        scriptElement.onerror = function(error) {
          console.error("❌ Failed to load Tawk.to script:", error);
          setLoadError(true);
          setIsLoaded(false);
        };

        scriptElement.onload = function() {
          console.log("📦 Tawk.to script loaded");
        };

        // Insert the script into the document head
        const head = document.getElementsByTagName("head")[0];
        if (head) {
          head.appendChild(scriptElement);
        } else {
          // Fallback: insert before first script tag
          const firstScript = document.getElementsByTagName("script")[0];
          if (firstScript && firstScript.parentNode) {
            firstScript.parentNode.insertBefore(scriptElement, firstScript);
          }
        }

        console.log("🚀 Tawk.to initialization started");
        console.log("📋 Using Property ID:", TAWK_TO_CONFIG.PROPERTY_ID);
        console.log("🆔 Using Widget ID:", TAWK_TO_CONFIG.WIDGET_ID);

      } catch (error) {
        console.error("❌ Tawk.to initialization failed:", error);
        setLoadError(true);
        setIsLoaded(false);
      }
    };

    // Initialize with a small delay to ensure DOM is ready
    const initTimer = setTimeout(initializeTawkTo, 100);

    // Cleanup function
    return () => {
      clearTimeout(initTimer);
      
      // Only hide widget, don't remove script to avoid reload issues
      if (window.Tawk_API && typeof window.Tawk_API.hideWidget === 'function') {
        try {
          window.Tawk_API.hideWidget();
        } catch (error) {
          console.warn("⚠️ Error hiding Tawk.to widget:", error);
        }
      }
    };
  }, [isLoaded]);

  // Development mode: show status indicator
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="fixed bottom-4 left-4 z-50 pointer-events-none">
        <div className={`
          px-3 py-1 rounded-full text-xs font-medium transition-all duration-300
          ${isLoaded 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : loadError 
              ? 'bg-red-100 text-red-800 border border-red-200'
              : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
          }
        `}>
          {isLoaded ? '✅ Chat Ready' : loadError ? '❌ Chat Error' : '🔄 Loading Chat...'}
        </div>
      </div>
    );
  }

  // Production mode: no visual indicator
  return null;
}
