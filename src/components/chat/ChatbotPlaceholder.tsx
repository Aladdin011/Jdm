import { useEffect } from "react";

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
      script.src = "https://embed.tawk.to/YOUR_TAWK_TO_PROPERTY_ID/YOUR_WIDGET_ID";
      script.charset = "UTF-8";
      script.setAttribute("crossorigin", "*");
      
      // Insert the script
      const firstScript = document.getElementsByTagName("script")[0];
      if (firstScript && firstScript.parentNode) {
        firstScript.parentNode.insertBefore(script, firstScript);
      }

      // Optional: Configure Tawk.to settings
      window.Tawk_API.onLoad = function() {
        console.log("Tawk.to chat widget loaded");
      };

      // Optional: Hide chat widget initially if needed
      // window.Tawk_API.hideWidget();
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
