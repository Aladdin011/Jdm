// WebSocket service now uses Supabase Realtime instead of socket.io-client
import supabase from "../lib/supabaseClient";
import errorLogger from "../utils/errorLogger";
import type { RealtimeChannel } from "@supabase/supabase-js";

export interface WebSocketMessage {
  id: string;
  type: "call" | "message" | "notification" | "system";
  from: string;
  to: string;
  content: any;
  timestamp: Date;
}

export interface CallEvent {
  id: string;
  from: string;
  to: string;
  type: "incoming" | "accepted" | "rejected" | "ended";
  timestamp: Date;
}

export interface MessageEvent {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: Date;
  conversationId: string;
}

class WebSocketService {
  private channel: RealtimeChannel | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private listeners: Map<string, Function[]> = new Map();
  private isDevMode = true; // Always use dev mode for now
  private mockConnected = false;
  private connectionTimer: number | null = null;
  private devLogCount = 0;

  constructor() {
    this.connect();
  }

  private connect() {
    if (this.isDevMode) {
      // In development mode, simulate connection after a short delay
      this.connectionTimer = setTimeout(() => {
        this.mockConnected = true;
        this.reconnectAttempts = 0;
        this.emit("connected", true);
        this.devInfoLog("🔗 Mock WebSocket connected (Development Mode)");
      }, 1000) as unknown as number;
      return;
    }

    try {
      // Use Supabase Realtime
      this.channel = supabase.channel("main-channel");
      this.setupEventListeners();
      
      this.channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          this.reconnectAttempts = 0;
          this.emit("connected", true);
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          this.emit("connected", false);
          this.handleReconnect();
        }
      });
    } catch (error) {
      errorLogger.error(
        "WebSocketService",
        "connect",
        "Realtime connection failed",
        error as Error,
      );
      this.handleReconnect();
    }
  }

  private setupEventListeners() {
    if (!this.channel) return;

    // Use Supabase Realtime broadcast for events
    this.channel
      .on("broadcast", { event: "incoming_call" }, (payload) => {
        this.emit("incoming_call", payload.payload);
      })
      .on("broadcast", { event: "call_accepted" }, (payload) => {
        this.emit("call_accepted", payload.payload);
      })
      .on("broadcast", { event: "call_rejected" }, (payload) => {
        this.emit("call_rejected", payload.payload);
      })
      .on("broadcast", { event: "call_ended" }, (payload) => {
        this.emit("call_ended", payload.payload);
      })
      .on("broadcast", { event: "new_message" }, (payload) => {
        this.emit("new_message", payload.payload);
      })
      .on("broadcast", { event: "message_read" }, (payload) => {
        this.emit("message_read", payload.payload);
      })
      .on("broadcast", { event: "notification" }, (payload) => {
        this.emit("notification", payload.payload);
      })
      .on("broadcast", { event: "user_online" }, (payload) => {
        this.emit("user_online", payload.payload);
      })
      .on("broadcast", { event: "user_offline" }, (payload) => {
        this.emit("user_offline", payload.payload);
      });
  }

  private handleReconnect() {
    if (this.isDevMode) {
      // In dev mode, just simulate reconnection
      this.mockConnected = false;
      this.emit("connected", false);

      setTimeout(() => {
        this.mockConnected = true;
        this.emit("connected", true);
        this.devInfoLog("🔗 Mock WebSocket reconnected (Development Mode)");
      }, 2000);
      return;
    }

    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay =
        this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

      this.devInfoLog(
        `Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`,
      );

      setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      errorLogger.error(
        "WebSocketService",
        "reconnect_failed",
        "Max reconnection attempts reached",
      );
      this.emit("connection_failed", true);
    }
  }

  private devInfoLog(message: string, metadata?: Record<string, any>) {
    // Limit noisy dev logs to 4 entries per session
    if (this.devLogCount < 4) {
      errorLogger.info("WebSocketService", "dev_info", message, metadata);
      this.devLogCount += 1;
    }
  }

  // Event listener management
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(data));
    }
  }

  // Room management
  joinRoom(roomId: string) {
    if (this.isDevMode) {
      this.devInfoLog(`📍 Joined room: ${roomId} (Mock)`);
      return;
    }

    if (this.channel) {
      this.channel.send({
        type: "broadcast",
        event: "join_room",
        payload: { roomId },
      });
    }
  }

  leaveRoom(roomId: string) {
    if (this.isDevMode) {
      this.devInfoLog(`📍 Left room: ${roomId} (Mock)`);
      return;
    }

    if (this.channel) {
      this.channel.send({
        type: "broadcast",
        event: "leave_room",
        payload: { roomId },
      });
    }
  }

  // Message handling
  sendMessage(
    message: Omit<MessageEvent, "id" | "timestamp"> & { type?: string },
  ) {
    if (this.isDevMode) {
      // In dev mode, simulate message echo for testing
      setTimeout(() => {
        const echoMessage: MessageEvent = {
          ...message,
          id: this.generateId(),
          timestamp: new Date(),
          from: "System",
          content: `Echo: ${message.content}`,
        };
        this.emit("new_message", echoMessage);
      }, 500);
      return;
    }

    if (this.channel) {
      this.channel.send({
        type: "broadcast",
        event: "send_message",
        payload: {
          ...message,
          id: this.generateId(),
          timestamp: new Date(),
        },
      });
    }
  }

  // Call handling
  initiateCall(callData: Omit<CallEvent, "id" | "timestamp">) {
    if (this.isDevMode) {
      this.devInfoLog("📞 Mock call initiated:", { callData });
      return;
    }

    if (this.channel) {
      this.channel.send({
        type: "broadcast",
        event: "initiate_call",
        payload: {
          ...callData,
          id: this.generateId(),
          type: (callData as Partial<CallEvent>).type ?? "incoming",
          timestamp: new Date(),
        },
      });
    }
  }

  acceptCall(callId: string) {
    if (this.isDevMode) {
      this.devInfoLog("📞 Mock call accepted:", { callId });
      return;
    }

    if (this.channel) {
      this.channel.send({
        type: "broadcast",
        event: "accept_call",
        payload: { callId },
      });
    }
  }

  rejectCall(callId: string) {
    if (this.isDevMode) {
      this.devInfoLog("📞 Mock call rejected:", { callId });
      return;
    }

    if (this.channel) {
      this.channel.send({
        type: "broadcast",
        event: "reject_call",
        payload: { callId },
      });
    }
  }

  endCall(callId: string) {
    if (this.isDevMode) {
      this.devInfoLog("📞 Mock call ended:", { callId });
      return;
    }

    if (this.channel) {
      this.channel.send({
        type: "broadcast",
        event: "end_call",
        payload: { callId },
      });
    }
  }

  // Utility methods
  markMessageAsRead(messageId: string) {
    if (this.isDevMode) {
      this.devInfoLog("✅ Mock message marked as read:", { messageId });
      return;
    }

    if (this.channel) {
      this.channel.send({
        type: "broadcast",
        event: "mark_message_read",
        payload: { messageId },
      });
    }
  }

  setUserOnline(userId: string) {
    if (this.isDevMode) {
      this.devInfoLog("🟢 Mock user online:", { userId });
      return;
    }

    if (this.channel) {
      this.channel.send({
        type: "broadcast",
        event: "user_online",
        payload: { userId },
      });
    }
  }

  setUserOffline(userId: string) {
    if (this.isDevMode) {
      this.devInfoLog("🔴 Mock user offline:", { userId });
      return;
    }

    if (this.channel) {
      this.channel.send({
        type: "broadcast",
        event: "user_offline",
        payload: { userId },
      });
    }
  }

  isConnected(): boolean {
    if (this.isDevMode) {
      return this.mockConnected;
    }
    return this.channel !== null;
  }

  disconnect() {
    if (this.connectionTimer) {
      clearTimeout(this.connectionTimer);
      this.connectionTimer = null;
    }

    if (this.isDevMode) {
      this.mockConnected = false;
      this.emit("connected", false);
      this.devInfoLog("🔗 Mock WebSocket disconnected");
      return;
    }

    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Create and export a singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;
