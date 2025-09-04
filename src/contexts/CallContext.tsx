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

interface CallOptions {
  title: string;
  participants: string[];
}

interface CallContextType {
  callState: CallState;
  isInCall: boolean;
  startCall: (callId: string, options?: CallOptions) => void;
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

  const startCall = (callId: string, options?: CallOptions) => {
    try {
      console.log('Starting call with ID:', callId, 'Options:', options);
      
      if (!user) {
        console.error('Cannot start call: No authenticated user');
        return;
      }
      
      // Request media permissions
      navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then(stream => {
          console.log('Media permissions granted:', stream.getTracks().map(t => t.kind));
          
          const currentUserParticipant: CallParticipant = {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            department: user.department || "general",
            isVideoEnabled: true,
            isAudioEnabled: true,
            isScreenSharing: false,
          };

          const department = options?.title || user.department || "general";
          console.log('Setting up call for department:', department);

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
        })
        .catch(err => {
          console.error('Media permission error:', err);
          alert('Please allow camera and microphone access to make calls');
        });
    } catch (error) {
      console.error('Error starting call:', error);
    }
  };

  const joinCall = (callId: string) => {
    try {
      console.log('Joining call with ID:', callId);
      
      if (!user) {
        console.error('Cannot join call: No authenticated user');
        return;
      }
      
      if (!callState.incomingCall) {
        console.error('Cannot join call: No incoming call to join');
        return;
      }
      
      // Request media permissions
      navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then(stream => {
          console.log('Media permissions granted for joining call:', stream.getTracks().map(t => t.kind));
          
          const newParticipant: CallParticipant = {
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            department: user.department || "",
            isVideoEnabled: true,
            isAudioEnabled: true,
            isScreenSharing: false,
          };

          setCallState((prev) => {
            console.log('Updating call state to join call');
            return {
              ...prev,
              isInCall: true,
              callId,
              participants: [...prev.participants, newParticipant],
              incomingCall: null,
            };
          });
        })
        .catch(err => {
          console.error('Media permission error when joining call:', err);
          alert('Please allow camera and microphone access to join calls');
        });
    } catch (error) {
      console.error('Error joining call:', error);
    }
  };

  const endCall = () => {
    try {
      console.log('Ending call for department:', callState.department);
      
      if (callState.department) {
        setActiveCalls((prev) => {
          console.log('Removing call from active calls map');
          const newMap = new Map(prev);
          newMap.delete(callState.department!);
          return newMap;
        });
      } else {
        console.warn('Ending call but no department was set');
      }

      // Stop all media tracks if they exist
      try {
        navigator.mediaDevices.getUserMedia({ audio: true, video: true })
          .then(stream => {
            stream.getTracks().forEach(track => {
              track.stop();
              console.log(`Stopped ${track.kind} track`);
            });
          })
          .catch(err => {
            console.warn('Could not access media devices to stop tracks:', err);
          });
      } catch (mediaError) {
        console.warn('Error stopping media tracks:', mediaError);
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
      
      console.log('Call ended successfully');
    } catch (error) {
      console.error('Error ending call:', error);
    }
  };

  const acceptIncomingCall = () => {
    try {
      console.log('Accepting incoming call');
      
      if (callState.incomingCall) {
        console.log(`Accepting call with ID: ${callState.incomingCall.callId}`);
        joinCall(callState.incomingCall.callId);
      } else {
        console.warn('Attempted to accept call but no incoming call exists');
      }
    } catch (error) {
      console.error('Error accepting incoming call:', error);
    }
  };

  const declineIncomingCall = () => {
    try {
      console.log('Declining incoming call');
      
      if (callState.incomingCall) {
        const { department, callId } = callState.incomingCall;
        console.log(`Declining call from department: ${department}, callId: ${callId}`);
      } else {
        console.warn('Attempted to decline call but no incoming call exists');
      }
      
      setCallState((prev) => ({
        ...prev,
        incomingCall: null,
      }));
      
      console.log('Call declined successfully');
    } catch (error) {
      console.error('Error declining incoming call:', error);
    }
  };

  const toggleLocalVideo = () => {
    try {
      console.log('Toggling local video');
      setCallState((prev) => {
        const newState = {
          ...prev,
          localVideo: !prev.localVideo,
        };
        console.log(`Video ${newState.localVideo ? 'enabled' : 'disabled'}`);
        return newState;
      });
    } catch (error) {
      console.error('Error toggling video:', error);
    }
  };

  const toggleLocalAudio = () => {
    try {
      console.log('Toggling local audio');
      setCallState((prev) => {
        const newState = {
          ...prev,
          localAudio: !prev.localAudio,
        };
        console.log(`Audio ${newState.localAudio ? 'enabled' : 'disabled'}`);
        return newState;
      });
    } catch (error) {
      console.error('Error toggling audio:', error);
    }
  };

  const toggleScreenShare = () => {
    try {
      console.log('Toggling screen sharing');
      
      if (!callState.isScreenSharing) {
        // Request screen sharing permission
        navigator.mediaDevices.getDisplayMedia({ video: true })
          .then(stream => {
            console.log('Screen sharing started');
            setCallState((prev) => ({
              ...prev,
              isScreenSharing: true,
            }));
            
            // Add listener for when user stops screen sharing
            const track = stream.getVideoTracks()[0];
            if (track) {
              track.onended = () => {
                console.log('Screen sharing ended by user');
                setCallState((prev) => ({
                  ...prev,
                  isScreenSharing: false,
                }));
              };
            }
          })
          .catch(err => {
            console.error('Screen sharing permission error:', err);
            alert('Please allow screen sharing access');
          });
      } else {
        // Just toggle off
        setCallState((prev) => ({
          ...prev,
          isScreenSharing: false,
        }));
        console.log('Screen sharing stopped');
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
    }
  };

  const simulateIncomingCall = (from: CallParticipant, department: string) => {
    try {
      console.log(`Simulating incoming call from: ${from.name}, department: ${department}`);
      
      if (user?.department === department && !callState.isInCall) {
        const callId =
          activeCalls.get(department) || `call_${department}_${Date.now()}`;
        console.log(`Setting incoming call with ID: ${callId}`);

        setCallState((prev) => ({
          ...prev,
          incomingCall: {
            callId,
            from,
            department,
          },
        }));
      } else {
        console.log(`Incoming call not applicable - department mismatch or already in call`);
      }
    } catch (error) {
      console.error('Error simulating incoming call:', error);
    }
  };

  const simulateCallNotifications = (
    department: string,
    caller: CallParticipant,
  ) => {
    try {
      console.log(`Setting up call notification for department: ${department}, from: ${caller.name}`);
      // In a real implementation, this would send notifications via WebSocket/Socket.io
      // For demo purposes, we'll simulate notifications after a delay
      setTimeout(() => {
        try {
          console.log(`Checking if notification should be sent to current user`);
          if (user?.department === department && user.id !== caller.id) {
            console.log(`Sending notification to user ${user.id} in department ${department}`);
            simulateIncomingCall(caller, department);
          } else {
            console.log(`Notification not applicable for current user`);
          }
        } catch (innerError) {
          console.error('Error in notification timeout callback:', innerError);
        }
      }, 2000);
    } catch (error) {
      console.error('Error setting up call notifications:', error);
    }
  };

  const value: CallContextType = {
    callState,
    isInCall: callState.isInCall,
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
