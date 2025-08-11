// Tawk.to Configuration
// Replace these values with your actual Tawk.to Property ID and Widget ID
// You can find these values in your Tawk.to dashboard under Admin > Chat Widget

export const TAWK_TO_CONFIG = {
  PROPERTY_ID: import.meta.env.VITE_TAWK_TO_PROPERTY_ID || "YOUR_TAWK_TO_PROPERTY_ID",
  WIDGET_ID: import.meta.env.VITE_TAWK_TO_WIDGET_ID || "YOUR_WIDGET_ID",
  
  // Optional: Customize appearance and behavior
  settings: {
    backgroundColor: "#EE690B", // Match your brand color (arch-orange)
    bubbleColor: "#EE690B",
    offsetX: 20,
    offsetY: 20,
  }
};

// Generate the Tawk.to embed URL
export const getTawkToEmbedUrl = () => {
  return `https://embed.tawk.to/${TAWK_TO_CONFIG.PROPERTY_ID}/${TAWK_TO_CONFIG.WIDGET_ID}`;
};
