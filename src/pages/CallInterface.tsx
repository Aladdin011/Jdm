import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCall } from "@/contexts/CallContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Users,
  Settings,
  MessageSquare,
  Share,
  MoreVertical,
  Minimize2,
  Maximize2,
  Volume2,
  VolumeX,
  UserPlus,
  ArrowLeft,
} from "lucide-react";

interface Participant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isMuted: boolean;
  isVideoOn: boolean;
  isHost: boolean;
  status: "connected" | "connecting" | "disconnected";
}

export default function CallInterface() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { callState, endCall, toggleLocalAudio, toggleLocalVideo } = useCall();
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);

  // Mock participants data
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@jdmarc.com",
      isMuted: false,
      isVideoOn: true,
      isHost: true,
      status: "connected",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@jdmarc.com",
      isMuted: true,
      isVideoOn: false,
      isHost: false,
      status: "connected",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@jdmarc.com",
      isMuted: false,
      isVideoOn: true,
      isHost: false,
      status: "connecting",
    },
  ]);

  // Call duration timer
  useEffect(() => {
    if (callState.isInCall) {
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [callState.isInCall]);

  // Redirect if not in call
  useEffect(() => {
    if (!callState.isInCall) {
      navigate('/dashboard');
    }
  }, [callState.isInCall, navigate]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    endCall();
    navigate('/dashboard');
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    toggleLocalAudio();
  };

  const handleToggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    toggleLocalVideo();
  };

  const handleToggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleLeaveCall = () => {
    navigate('/dashboard');
  };

  if (!callState.isInCall) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')]"></div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 p-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLeaveCall}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <Badge className="bg-[#F97316] text-white px-3 py-1">
            {callState.department?.replace("-", " ").toUpperCase() || "GENERAL"} CALL
          </Badge>
          <div className="flex items-center gap-2 text-gray-300">
            <Users size={16} />
            <span className="text-sm">{participants.length} participants</span>
          </div>
          <div className="text-sm text-gray-300">
            {formatDuration(callDuration)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowParticipants(!showParticipants)}
            className="text-white hover:bg-white/10"
          >
            <Users className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowChat(!showChat)}
            className="text-white hover:bg-white/10"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMinimize}
            className="text-white hover:bg-white/10"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Video Grid */}
          <div className={`${showParticipants || showChat ? 'lg:col-span-3' : 'lg:col-span-4'} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`}>
            {participants.map((participant) => (
              <motion.div
                key={participant.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative bg-gray-800 rounded-xl overflow-hidden aspect-video"
              >
                {participant.isVideoOn ? (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <div className="text-6xl font-bold opacity-20">
                      {participant.name.charAt(0)}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="bg-gray-600 text-white text-xl">
                        {participant.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}

                {/* Participant Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{participant.name}</span>
                      {participant.isHost && (
                        <Badge className="bg-[#F97316] text-white text-xs">HOST</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {participant.isMuted && (
                        <MicOff className="h-4 w-4 text-red-400" />
                      )}
                      {!participant.isVideoOn && (
                        <VideoOff className="h-4 w-4 text-red-400" />
                      )}
                      <div className={`w-2 h-2 rounded-full ${
                        participant.status === 'connected' ? 'bg-green-400' :
                        participant.status === 'connecting' ? 'bg-yellow-400' :
                        'bg-red-400'
                      }`} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sidebar */}
          {(showParticipants || showChat) && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="lg:col-span-1"
            >
              <Card className="bg-gray-800/50 border-gray-700 h-full">
                <CardContent className="p-4 h-full flex flex-col">
                  {showParticipants && (
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-4 text-white">Participants</h3>
                      <div className="space-y-3">
                        {participants.map((participant) => (
                          <div key={participant.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700/50">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback className="bg-gray-600 text-white text-sm">
                                {participant.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-white truncate">
                                  {participant.name}
                                </span>
                                {participant.isHost && (
                                  <Badge className="bg-[#F97316] text-white text-xs">HOST</Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-400 truncate">{participant.email}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              {participant.isMuted && (
                                <MicOff className="h-3 w-3 text-red-400" />
                              )}
                              {!participant.isVideoOn && (
                                <VideoOff className="h-3 w-3 text-red-400" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {showChat && (
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-lg font-semibold mb-4 text-white">Chat</h3>
                      <div className="flex-1 bg-gray-900/50 rounded-lg p-3 mb-4 overflow-y-auto">
                        <p className="text-gray-400 text-sm text-center">Chat functionality coming soon...</p>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Type a message..."
                          className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg px-3 py-2 text-sm"
                        />
                        <Button size="sm" className="bg-[#F97316] hover:bg-[#F97316]/80">
                          Send
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Call Controls */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6"
      >
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="lg"
            onClick={handleToggleMute}
            className={`rounded-full w-14 h-14 ${
              isMuted 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onClick={handleToggleVideo}
            className={`rounded-full w-14 h-14 ${
              !isVideoOn 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            {isVideoOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onClick={handleToggleSpeaker}
            className={`rounded-full w-14 h-14 ${
              !isSpeakerOn 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            {isSpeakerOn ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className="rounded-full w-14 h-14 bg-gray-700 hover:bg-gray-600 text-white"
          >
            <UserPlus className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className="rounded-full w-14 h-14 bg-gray-700 hover:bg-gray-600 text-white"
          >
            <Share className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="lg"
            className="rounded-full w-14 h-14 bg-gray-700 hover:bg-gray-600 text-white"
          >
            <MoreVertical className="h-6 w-6" />
          </Button>

          <Button
            variant="destructive"
            size="lg"
            onClick={handleEndCall}
            className="rounded-full w-14 h-14 bg-red-500 hover:bg-red-600 text-white ml-4"
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}