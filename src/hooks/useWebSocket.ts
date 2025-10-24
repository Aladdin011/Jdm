import { useEffect, useRef, useCallback } from "react";
import webSocketService, {
  WebSocketMessage,
  CallEvent,
  MessageEvent,
} from "../services/websocket";

interface UseWebSocketOptions {
  onMessage?: (message: MessageEvent) => void;
  onCall?: (call: CallEvent) => void;
  onNotification?: (notification: any) => void;
  onConnectionChange?: (connected: boolean) => void;
  autoConnect?: boolean;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const {
    onMessage,
    onCall,
    onNotification,
    onConnectionChange,
    autoConnect = true,
  } = options;

  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (!autoConnect) return;

    // Set up event listeners
    const handleMessage = (message: MessageEvent) => {
      optionsRef.current.onMessage?.(message);
    };

    const handleIncomingCall = (call: CallEvent) => {
      optionsRef.current.onCall?.(call);
    };

    const handleCallAccepted = (call: CallEvent) => {
      optionsRef.current.onCall?.(call);
    };

    const handleCallRejected = (call: CallEvent) => {
      optionsRef.current.onCall?.(call);
    };

    const handleCallEnded = (call: CallEvent) => {
      optionsRef.current.onCall?.(call);
    };

    const handleNotification = (notification: any) => {
      optionsRef.current.onNotification?.(notification);
    };

    const handleConnectionChange = (connected: boolean) => {
      optionsRef.current.onConnectionChange?.(connected);
    };

    // Register event listeners
    webSocketService.on("new_message", handleMessage);
    webSocketService.on("incoming_call", handleIncomingCall);
    webSocketService.on("call_accepted", handleCallAccepted);
    webSocketService.on("call_rejected", handleCallRejected);
    webSocketService.on("call_ended", handleCallEnded);
    webSocketService.on("notification", handleNotification);
    webSocketService.on("connected", handleConnectionChange);

    // Cleanup function
    return () => {
      webSocketService.off("new_message", handleMessage);
      webSocketService.off("incoming_call", handleIncomingCall);
      webSocketService.off("call_accepted", handleCallAccepted);
      webSocketService.off("call_rejected", handleCallRejected);
      webSocketService.off("call_ended", handleCallEnded);
      webSocketService.off("notification", handleNotification);
      webSocketService.off("connected", handleConnectionChange);
    };
  }, [autoConnect]);

  // Memoized functions to prevent unnecessary re-renders
  const sendMessage = useCallback(
    (message: Omit<MessageEvent, "id" | "timestamp">) => {
      if (!webSocketService.isConnected()) {
        console.warn(
          "WebSocket not connected. Message will be queued for later delivery.",
        );
        // In a real app, you might queue messages or show a notification
        return false;
      }
      webSocketService.sendMessage(message);
      return true;
    },
    [],
  );

  const initiateCall = useCallback(
    (callData: Omit<CallEvent, "id" | "timestamp" | "type">) => {
      if (!webSocketService.isConnected()) {
        console.warn("WebSocket not connected. Cannot initiate call.");
        return false;
      }
      webSocketService.initiateCall(callData);
      return true;
    },
    [],
  );

  const acceptCall = useCallback((callId: string) => {
    if (!webSocketService.isConnected()) {
      console.warn("WebSocket not connected. Cannot accept call.");
      return false;
    }
    webSocketService.acceptCall(callId);
    return true;
  }, []);

  const rejectCall = useCallback((callId: string) => {
    if (!webSocketService.isConnected()) {
      console.warn("WebSocket not connected. Cannot reject call.");
      return false;
    }
    webSocketService.rejectCall(callId);
    return true;
  }, []);

  const endCall = useCallback((callId: string) => {
    if (!webSocketService.isConnected()) {
      console.warn("WebSocket not connected. Cannot end call.");
      return false;
    }
    webSocketService.endCall(callId);
    return true;
  }, []);

  const markMessageAsRead = useCallback((messageId: string) => {
    if (!webSocketService.isConnected()) {
      // This is less critical, can fail silently
      return false;
    }
    webSocketService.markMessageAsRead(messageId);
    return true;
  }, []);

  const joinRoom = useCallback((roomId: string) => {
    if (!webSocketService.isConnected()) {
      console.warn("WebSocket not connected. Cannot join room.");
      return false;
    }
    webSocketService.joinRoom(roomId);
    return true;
  }, []);

  const leaveRoom = useCallback((roomId: string) => {
    if (!webSocketService.isConnected()) {
      console.warn("WebSocket not connected. Cannot leave room.");
      return false;
    }
    webSocketService.leaveRoom(roomId);
    return true;
  }, []);

  const isConnected = useCallback(() => {
    return webSocketService.isConnected();
  }, []);

  return {
    sendMessage,
    initiateCall,
    acceptCall,
    rejectCall,
    endCall,
    markMessageAsRead,
    joinRoom,
    leaveRoom,
    isConnected,
    webSocketService,
  };
};

export default useWebSocket;
