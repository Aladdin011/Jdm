import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X, Wifi, WifiOff } from "lucide-react";
import { Button } from "./button";

export default function DevelopmentModeIndicator() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if we're in development mode by detecting mock tokens
    const token = localStorage.getItem("builder_aura_token");
    const isDevMode =
      token?.startsWith("dev_token_") || token?.startsWith("mock_");

    // Only show if in dev mode and not dismissed
    const dismissed = localStorage.getItem("dev_mode_dismissed");

    if (isDevMode && !dismissed && !isDismissed) {
      setIsVisible(true);
    }
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    localStorage.setItem("dev_mode_dismissed", "true");
  };

  const handleCheckConnection = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/health", {
        method: "GET",
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (response.ok) {
        alert(
          "✅ Backend connection successful! Please refresh the page to use the live API.",
        );
      } else {
        alert(
          "❌ Backend server responded but API might not be configured correctly.",
        );
      }
    } catch (error) {
      alert(
        "❌ Cannot connect to backend server. Please ensure it's running on http://localhost:5000",
      );
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <WifiOff className="h-5 w-5" />
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">Development Mode Active</p>
                  <p className="text-sm text-amber-100">
                    Backend API unavailable. Using mock authentication and data.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleCheckConnection}
                  size="sm"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <Wifi className="h-4 w-4 mr-1" />
                  Test Connection
                </Button>
                <Button
                  onClick={handleDismiss}
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
