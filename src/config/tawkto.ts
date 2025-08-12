// Tawk.to Configuration
// Replace these values with your actual Tawk.to Property ID and Widget ID
// You can find these values in your Tawk.to dashboard under Admin > Chat Widget

// Validate environment variables
const validateTawkConfig = () => {
  const propertyId = import.meta.env.VITE_TAWK_TO_PROPERTY_ID || "6857837019acdf191aa65414";
  const widgetId = import.meta.env.VITE_TAWK_TO_WIDGET_ID || "1iuatis6a";

  if (!propertyId || !widgetId) {
    console.warn("⚠️ Tawk.to configuration missing. Please set VITE_TAWK_TO_PROPERTY_ID and VITE_TAWK_TO_WIDGET_ID environment variables.");
  }

  return { propertyId, widgetId };
};

const { propertyId, widgetId } = validateTawkConfig();

export const TAWK_TO_CONFIG = {
  PROPERTY_ID: propertyId,
  WIDGET_ID: widgetId,

  // Configuration validation
  isValid: !!(propertyId && widgetId),

  // Optional: Customize appearance and behavior
  settings: {
    backgroundColor: "#EE690B", // Match your brand color (arch-orange)
    bubbleColor: "#EE690B",
    textColor: "#FFFFFF",
    offsetX: 20,
    offsetY: 20,

    // Additional settings
    chatbubbleSettings: {
      backgroundColor: "#EE690B",
      ctaText: "Need help? Chat with us!",
      ctaColor: "#FFFFFF"
    },

    // Widget positioning
    visibility: {
      desktop: {
        position: 'br', // bottom-right
        xOffset: 20,
        yOffset: 20
      },
      mobile: {
        position: 'br',
        xOffset: 10,
        yOffset: 10
      }
    }
  },
};

// Generate the Tawk.to embed URL with validation
export const getTawkToEmbedUrl = () => {
  if (!TAWK_TO_CONFIG.isValid) {
    console.error("❌ Cannot generate Tawk.to embed URL: Invalid configuration");
    return null;
  }

  const url = `https://embed.tawk.to/${TAWK_TO_CONFIG.PROPERTY_ID}/${TAWK_TO_CONFIG.WIDGET_ID}`;
  console.log("🔗 Tawk.to embed URL:", url);
  return url;
};

// Helper function to check if Tawk.to should be enabled
export const isTawkToEnabled = () => {
  return TAWK_TO_CONFIG.isValid &&
         TAWK_TO_CONFIG.PROPERTY_ID !== "your-property-id" &&
         TAWK_TO_CONFIG.WIDGET_ID !== "your-widget-id";
};

// Debug function for development
export const debugTawkConfig = () => {
  if (import.meta.env.DEV) {
    console.group("🔧 Tawk.to Configuration Debug");
    console.log("Property ID:", TAWK_TO_CONFIG.PROPERTY_ID);
    console.log("Widget ID:", TAWK_TO_CONFIG.WIDGET_ID);
    console.log("Is Valid:", TAWK_TO_CONFIG.isValid);
    console.log("Is Enabled:", isTawkToEnabled());
    console.log("Embed URL:", getTawkToEmbedUrl());
    console.log("Environment:", import.meta.env.MODE);
    console.groupEnd();
  }
};
