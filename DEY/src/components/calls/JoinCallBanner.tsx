import { motion, AnimatePresence } from "framer-motion";
import { useCall } from "@/contexts/CallContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Users, X, Video } from "lucide-react";
import { useState, useEffect } from "react";

export default function JoinCallBanner() {
  const { callState, joinCall } = useCall();
  const { user } = useAuth();
  const [showBanner, setShowBanner] = useState(false);
  const [activeCall, setActiveCall] = useState<{
    department: string;
    callId: string;
    participants: number;
  } | null>(null);

  // Mock active calls for departments (in real app, this would come from WebSocket)
  useEffect(() => {
    // Simulate checking for active calls in user's department
    const checkActiveCalls = () => {
      if (user?.department && !callState.isInCall && !callState.incomingCall) {
        // Simulate an active call in the user's department
        // In real implementation, this would be received via WebSocket
        const mockActiveCall = {
          department: user.department,
          callId: `call_${user.department}_active`,
          participants: Math.floor(Math.random() * 4) + 1, // 1-4 participants
        };

        // Show banner for 50% chance if not already in a call
        if (Math.random() > 0.7 && !showBanner) {
          setActiveCall(mockActiveCall);
          setShowBanner(true);
        }
      }
    };

    const interval = setInterval(checkActiveCalls, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [
    user?.department,
    callState.isInCall,
    callState.incomingCall,
    showBanner,
  ]);

  const handleJoinCall = () => {
    if (activeCall) {
      joinCall(activeCall.callId);
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    setActiveCall(null);
  };

  // Don't show banner if user is already in a call or has incoming call
  if (
    !showBanner ||
    !activeCall ||
    callState.isInCall ||
    callState.incomingCall
  ) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-20 left-1/2 transform -translate-x-1/2 z-40 w-full max-w-md mx-4"
      >
        <div className="bg-gradient-to-r from-[#142E54] to-[#F97316] rounded-xl shadow-2xl p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              {/* Animated call icon */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0"
              >
                <Video size={20} />
              </motion.div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className="bg-white/20 text-white text-xs">
                    ACTIVE CALL
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Users size={12} />
                    <span className="text-xs">{activeCall.participants}</span>
                  </div>
                </div>

                <h4 className="font-semibold text-sm truncate">
                  {activeCall.department.replace("-", " ").toUpperCase()} Team
                  Call
                </h4>
                <p className="text-xs text-white/80">
                  Your department is in a video call
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                onClick={handleJoinCall}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white h-8 px-3"
              >
                <Phone size={14} className="mr-1" />
                Join
              </Button>

              <Button
                onClick={handleDismiss}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <X size={14} />
              </Button>
            </div>
          </div>

          {/* Progress bar animation */}
          <motion.div
            className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="h-full bg-white/40 rounded-full"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
