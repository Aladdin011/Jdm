import { useEffect } from "react";
import { getTawkToEmbedUrl, TAWK_TO_CONFIG } from "@/config/tawkto";

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

export default function ChatbotPlaceholder() {
  useEffect(() => {
    // Initialize Tawk.to if not already loaded
    if (!window.Tawk_API) {
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();

      // Create and inject the Tawk.to script
      const script = document.createElement("script");
      script.async = true;
      script.src = getTawkToEmbedUrl();
      script.charset = "UTF-8";
      script.setAttribute("crossorigin", "*");

      // Insert the script
      const firstScript = document.getElementsByTagName("script")[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      }

      // Configure Tawk.to settings after load
      window.Tawk_API.onLoad = function() {
        console.log("Tawk.to chat widget loaded");

        // Apply custom styling if available
        if (TAWK_TO_CONFIG.settings.backgroundColor) {
          window.Tawk_API.setAttributes({
            backgroundColor: TAWK_TO_CONFIG.settings.backgroundColor,
            bubbleColor: TAWK_TO_CONFIG.settings.bubbleColor
          });
        }
      };

      // Position the widget
      window.Tawk_API.onChatMaximized = function() {
        console.log("Chat maximized");
      };

      window.Tawk_API.onChatMinimized = function() {
        console.log("Chat minimized");
      };
    }

    return () => {
      // Cleanup if needed
      if (window.Tawk_API && typeof window.Tawk_API.hideWidget === 'function') {
        // window.Tawk_API.hideWidget();
      }
    };
  }, []);

  // Tawk.to will render its own chat widget, so we don't need to return any JSX
  // The widget will appear automatically as a floating button
  return null;
}
