import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCall } from "@/contexts/CallContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Users,
  Maximize2,
  X,
} from "lucide-react";

interface CallMiniWidgetProps {
  onClose?: () => void;
}

export default function CallMiniWidget({ onClose }: CallMiniWidgetProps) {
  const navigate = useNavigate();
  const { callState, endCall, toggleLocalAudio, toggleLocalVideo } = useCall();

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  // Call duration timer
  useEffect(() => {
    if (callState.isInCall) {
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [callState.isInCall]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const handleEndCall = () => {
    endCall();
    onClose?.();
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    toggleLocalAudio();
  };

  const handleToggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toggleLocalVideo();
  };

  const handleMaximize = () => {
    navigate("/call");
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (!callState.isInCall) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <motion.div
          className={`bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl shadow-2xl text-white transition-all duration-300 ${
            isMinimized ? "w-16 h-16" : "w-80"
          }`}
          layout
        >
          {isMinimized ? (
            // Minimized state - just a small circle with call indicator
            <div className="w-full h-full flex items-center justify-center relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMinimize}
                className="w-full h-full rounded-xl bg-[#F97316] hover:bg-[#F97316]/80 text-white"
              >
                <Phone className="h-5 w-5" />
              </Button>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          ) : (
            // Expanded state
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <Badge className="bg-[#F97316] text-white text-xs">
                    {callState.department?.replace("-", " ").toUpperCase() ||
                      "CALL"}
                  </Badge>
                  <span className="text-xs text-gray-300">
                    {formatDuration(callDuration)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMinimize}
                    className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Participants Preview */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex -space-x-2">
                  {callState.participants
                    .slice(0, 3)
                    .map((participant, index) => (
                      <Avatar
                        key={participant.id}
                        className="w-6 h-6 border-2 border-gray-700"
                      >
                        <AvatarFallback className="bg-gray-600 text-white text-xs">
                          {participant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  {callState.participants.length > 3 && (
                    <div className="w-6 h-6 bg-gray-600 rounded-full border-2 border-gray-700 flex items-center justify-center">
                      <span className="text-xs text-white">
                        +{callState.participants.length - 3}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-300">
                  <Users className="h-3 w-3" />
                  <span>{callState.participants.length}</span>
                </div>
              </div>

              {/* Call Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleMute}
                    className={`h-8 w-8 p-0 rounded-full ${
                      isMuted
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-gray-700 hover:bg-gray-600 text-white"
                    }`}
                  >
                    {isMuted ? (
                      <MicOff className="h-3 w-3" />
                    ) : (
                      <Mic className="h-3 w-3" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleToggleVideo}
                    className={`h-8 w-8 p-0 rounded-full ${
                      !isVideoOn
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-gray-700 hover:bg-gray-600 text-white"
                    }`}
                  >
                    {isVideoOn ? (
                      <Video className="h-3 w-3" />
                    ) : (
                      <VideoOff className="h-3 w-3" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMaximize}
                    className="h-8 w-8 p-0 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    <Maximize2 className="h-3 w-3" />
                  </Button>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleEndCall}
                  className="h-8 w-8 p-0 rounded-full bg-red-500 hover:bg-red-600 text-white"
                >
                  <PhoneOff className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
