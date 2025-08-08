import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";

interface CallParticipant {
  id: string;
  name: string;
  email: string;
  department: string;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isScreenSharing: boolean;
}

interface CallState {
  isInCall: boolean;
  isCallStarted: boolean;
  callId: string | null;
  department: string | null;
  participants: CallParticipant[];
  localVideo: boolean;
  localAudio: boolean;
  isScreenSharing: boolean;
  incomingCall: {
    callId: string;
    from: CallParticipant;
    department: string;
  } | null;
}

interface CallContextType {
  callState: CallState;
  startCall: (department: string) => void;
  joinCall: (callId: string) => void;
  endCall: () => void;
  acceptIncomingCall: () => void;
  declineIncomingCall: () => void;
  toggleLocalVideo: () => void;
  toggleLocalAudio: () => void;
  toggleScreenShare: () => void;
  simulateIncomingCall: (from: CallParticipant, department: string) => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const useCall = () => {
  const context = useContext(CallContext);
  if (context === undefined) {
    throw new Error("useCall must be used within a CallProvider");
  }
  return context;
};

interface CallProviderProps {
  children: ReactNode;
}

export const CallProvider: React.FC<CallProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [callState, setCallState] = useState<CallState>({
    isInCall: false,
    isCallStarted: false,
    callId: null,
    department: null,
    participants: [],
    localVideo: true,
    localAudio: true,
    isScreenSharing: false,
    incomingCall: null,
  });

  // Simulate active calls in departments for demo
  const [activeCalls, setActiveCalls] = useState<Map<string, string>>(
    new Map(),
  );

  const startCall = (department: string) => {
    const callId = `call_${department}_${Date.now()}`;

    if (user) {
      const currentUserParticipant: CallParticipant = {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        department: user.department || department,
        isVideoEnabled: true,
        isAudioEnabled: true,
        isScreenSharing: false,
      };

      setCallState({
        isInCall: true,
        isCallStarted: true,
        callId,
        department,
        participants: [currentUserParticipant],
        localVideo: true,
        localAudio: true,
        isScreenSharing: false,
        incomingCall: null,
      });

      // Add to active calls map
      setActiveCalls((prev) => new Map(prev.set(department, callId)));

      // Simulate other department members being notified
      simulateCallNotifications(department, currentUserParticipant);
    }
  };

  const joinCall = (callId: string) => {
    if (user && callState.incomingCall) {
      const newParticipant: CallParticipant = {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        department: user.department || "",
        isVideoEnabled: true,
        isAudioEnabled: true,
        isScreenSharing: false,
      };

      setCallState((prev) => ({
        ...prev,
        isInCall: true,
        callId,
        participants: [...prev.participants, newParticipant],
        incomingCall: null,
      }));
    }
  };

  const endCall = () => {
    if (callState.department) {
      setActiveCalls((prev) => {
        const newMap = new Map(prev);
        newMap.delete(callState.department!);
        return newMap;
      });
    }

    setCallState({
      isInCall: false,
      isCallStarted: false,
      callId: null,
      department: null,
      participants: [],
      localVideo: true,
      localAudio: true,
      isScreenSharing: false,
      incomingCall: null,
    });
  };

  const acceptIncomingCall = () => {
    if (callState.incomingCall) {
      joinCall(callState.incomingCall.callId);
    }
  };

  const declineIncomingCall = () => {
    setCallState((prev) => ({
      ...prev,
      incomingCall: null,
    }));
  };

  const toggleLocalVideo = () => {
    setCallState((prev) => ({
      ...prev,
      localVideo: !prev.localVideo,
    }));
  };

  const toggleLocalAudio = () => {
    setCallState((prev) => ({
      ...prev,
      localAudio: !prev.localAudio,
    }));
  };

  const toggleScreenShare = () => {
    setCallState((prev) => ({
      ...prev,
      isScreenSharing: !prev.isScreenSharing,
    }));
  };

  const simulateIncomingCall = (from: CallParticipant, department: string) => {
    if (user?.department === department && !callState.isInCall) {
      const callId =
        activeCalls.get(department) || `call_${department}_${Date.now()}`;

      setCallState((prev) => ({
        ...prev,
        incomingCall: {
          callId,
          from,
          department,
        },
      }));
    }
  };

  const simulateCallNotifications = (
    department: string,
    caller: CallParticipant,
  ) => {
    // In a real implementation, this would send notifications via WebSocket/Socket.io
    // For demo purposes, we'll simulate notifications after a delay
    setTimeout(() => {
      if (user?.department === department && user.id !== caller.id) {
        simulateIncomingCall(caller, department);
      }
    }, 2000);
  };

  const value: CallContextType = {
    callState,
    startCall,
    joinCall,
    endCall,
    acceptIncomingCall,
    declineIncomingCall,
    toggleLocalVideo,
    toggleLocalAudio,
    toggleScreenShare,
    simulateIncomingCall,
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};
