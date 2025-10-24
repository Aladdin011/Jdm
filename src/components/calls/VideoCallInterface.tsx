import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCall } from "@/contexts/CallContext";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Monitor,
  PhoneOff,
  Users,
  Minimize2,
  Maximize2,
  Settings,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function VideoCallInterface() {
  const {
    callState,
    endCall,
    toggleLocalVideo,
    toggleLocalAudio,
    toggleScreenShare,
  } = useCall();

  const [isMinimized, setIsMinimized] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  // Call duration timer
  useEffect(() => {
    if (callState.isInCall) {
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setCallDuration(0);
    }
  }, [callState.isInCall]);

  // Auto-hide controls after inactivity
  useEffect(() => {
    if (!isMinimized) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showControls, isMinimized]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleMouseMove = () => {
    try {
      console.log("Mouse moved, showing controls");
      setShowControls(true);
    } catch (error) {
      console.error("Error showing controls:", error);
    }
  };

  const handleEndCall = () => {
    try {
      console.log("User clicked end call button");
      endCall();
    } catch (error) {
      console.error("Error ending call from UI:", error);
      alert("There was a problem ending the call. Please try again.");
    }
  };

  if (!callState.isInCall) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 bg-black z-50 ${isMinimized ? "w-80 h-60 bottom-4 right-4 top-auto left-auto rounded-xl overflow-hidden shadow-2xl" : ""}`}
        onMouseMove={handleMouseMove}
        style={{ zIndex: 9999 }}
      >
        {/* Call Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{
            y: showControls || isMinimized ? 0 : -50,
            opacity: showControls || isMinimized ? 1 : 0,
          }}
          className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 z-10"
        >
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <Badge className="bg-[#F97316] text-white">
                {callState.department?.replace("-", " ").toUpperCase()} CALL
              </Badge>
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span className="text-sm">
                  {callState.participants.length} participants
                </span>
              </div>
              <div className="text-sm text-gray-300">
                {formatDuration(callDuration)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white hover:bg-white/20"
              >
                {isMinimized ? (
                  <Maximize2 size={16} />
                ) : (
                  <Minimize2 size={16} />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Settings size={16} />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Video Grid */}
        <div className={`h-full ${isMinimized ? "p-2" : "p-4 pt-20 pb-24"}`}>
          <div
            className={`grid h-full gap-2 ${
              callState.participants.length === 1
                ? "grid-cols-1"
                : callState.participants.length === 2
                  ? "grid-cols-2"
                  : callState.participants.length <= 4
                    ? "grid-cols-2 grid-rows-2"
                    : "grid-cols-3 grid-rows-2"
            }`}
          >
            {callState.participants.map((participant, index) => (
              <motion.div
                key={participant.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-gray-800 rounded-lg overflow-hidden"
              >
                {/* Video Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#142E54] to-[#F97316] flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {participant.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                </div>

                {/* Participant Info */}
                <div className="absolute bottom-2 left-2 right-2 bg-black/50 backdrop-blur-sm rounded-md p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white text-sm font-medium truncate">
                      {participant.name}
                    </span>
                    <div className="flex items-center gap-1">
                      {!participant.isAudioEnabled && (
                        <MicOff size={12} className="text-red-400" />
                      )}
                      {!participant.isVideoEnabled && (
                        <VideoOff size={12} className="text-red-400" />
                      )}
                      {participant.isScreenSharing && (
                        <Monitor size={12} className="text-green-400" />
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Local Video (Picture-in-Picture) */}
        {!isMinimized && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute bottom-28 right-4 w-48 h-36 bg-gray-900 rounded-lg overflow-hidden border-2 border-white/20"
          >
            <div className="relative h-full bg-gradient-to-br from-[#F97316] to-[#142E54] flex items-center justify-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">You</span>
              </div>

              {!callState.localVideo && (
                <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                  <VideoOff className="text-white" size={24} />
                </div>
              )}

              <div className="absolute top-2 right-2">
                {!callState.localAudio && (
                  <MicOff size={16} className="text-red-400" />
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Floating Controls */}
        <AnimatePresence>
          {(showControls || isMinimized) && !isMinimized && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
            >
              <div className="bg-black/80 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-3 border border-white/20">
                {/* Microphone Toggle */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    try {
                      console.log("Toggling microphone");
                      toggleLocalAudio();
                    } catch (error) {
                      console.error("Error toggling microphone:", error);
                      alert(
                        "There was a problem with your microphone. Please check your device permissions.",
                      );
                    }
                  }}
                  className={`rounded-full w-12 h-12 ${
                    callState.localAudio
                      ? "bg-white/20 hover:bg-white/30 text-white"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  {callState.localAudio ? (
                    <Mic size={20} />
                  ) : (
                    <MicOff size={20} />
                  )}
                </Button>

                {/* Video Toggle */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    try {
                      console.log("Toggling video");
                      toggleLocalVideo();
                    } catch (error) {
                      console.error("Error toggling video:", error);
                      alert(
                        "There was a problem with your camera. Please check your device permissions.",
                      );
                    }
                  }}
                  className={`rounded-full w-12 h-12 ${
                    callState.localVideo
                      ? "bg-white/20 hover:bg-white/30 text-white"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  {callState.localVideo ? (
                    <Video size={20} />
                  ) : (
                    <VideoOff size={20} />
                  )}
                </Button>

                {/* Screen Share */}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    try {
                      console.log("Toggling screen sharing");
                      toggleScreenShare();
                    } catch (error) {
                      console.error("Error toggling screen share:", error);
                      alert(
                        "There was a problem sharing your screen. Please check your browser permissions.",
                      );
                    }
                  }}
                  className={`rounded-full w-12 h-12 ${
                    callState.isScreenSharing
                      ? "bg-[#F97316] hover:bg-[#F97316]/80 text-white"
                      : "bg-white/20 hover:bg-white/30 text-white"
                  }`}
                >
                  <Monitor size={20} />
                </Button>

                {/* More Options */}
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-full w-12 h-12 bg-white/20 hover:bg-white/30 text-white"
                >
                  <MoreVertical size={20} />
                </Button>

                {/* End Call */}
                <Button
                  size="sm"
                  onClick={handleEndCall}
                  className="rounded-full w-12 h-12 bg-red-600 hover:bg-red-700 text-white ml-2"
                >
                  <PhoneOff size={20} />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimized Controls */}
        {isMinimized && (
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  try {
                    console.log("Toggling microphone (minimized)");
                    toggleLocalAudio();
                  } catch (error) {
                    console.error("Error toggling microphone:", error);
                  }
                }}
                className={`w-8 h-8 ${callState.localAudio ? "text-white" : "text-red-400"}`}
              >
                {callState.localAudio ? (
                  <Mic size={14} />
                ) : (
                  <MicOff size={14} />
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  try {
                    console.log("Toggling video (minimized)");
                    toggleLocalVideo();
                  } catch (error) {
                    console.error("Error toggling video:", error);
                  }
                }}
                className={`w-8 h-8 ${callState.localVideo ? "text-white" : "text-red-400"}`}
              >
                {callState.localVideo ? (
                  <Video size={14} />
                ) : (
                  <VideoOff size={14} />
                )}
              </Button>
            </div>
            <Button
              size="sm"
              onClick={handleEndCall}
              className="w-8 h-8 bg-red-600 hover:bg-red-700 text-white"
            >
              <PhoneOff size={14} />
            </Button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
