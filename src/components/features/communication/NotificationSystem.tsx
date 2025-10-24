import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Phone, MessageSquare, X, Check, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCall } from "@/contexts/CallContext";
import { useWebSocket } from "@/hooks/useWebSocket";

interface Notification {
  id: string;
  type: "call" | "message" | "system";
  title: string;
  message: string;
  timestamp: Date;
  priority: "low" | "medium" | "high";
  read: boolean;
  actionable?: boolean;
  callId?: string;
  sender?: string;
  avatar?: string;
}

interface NotificationSystemProps {
  className?: string;
}

export default function NotificationSystem({
  className = "",
}: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { callState, acceptIncomingCall, declineIncomingCall } = useCall();

  // WebSocket integration for real-time notifications
  const { acceptCall, rejectCall } = useWebSocket({
    onMessage: (message) => {
      // Add message notification
      const notification: Notification = {
        id: message.id,
        type: "message",
        title: "New Message",
        message: `${message.from}: ${message.content}`,
        timestamp: message.timestamp,
        priority: "medium",
        read: false,
        sender: message.from,
      };
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    },
    onCall: (call) => {
      // Add call notification
      const notification: Notification = {
        id: call.id,
        type: "call",
        title: call.type === "incoming" ? "Incoming Call" : "Call Update",
        message: `Call from ${call.from}`,
        timestamp: call.timestamp,
        priority: "high",
        read: false,
        actionable: true,
        sender: call.from,
        callId: call.id,
      };
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    },
    onNotification: (notification) => {
      // Add system notification
      setNotifications((prev) => [notification, ...prev]);
      if (!notification.read) {
        setUnreadCount((prev) => prev + 1);
      }
    },
  });

  // Mock notifications for demonstration
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: "1",
        type: "call",
        title: "Incoming Call",
        message: "Sarah Johnson is calling you",
        timestamp: new Date(),
        priority: "high",
        read: false,
        actionable: true,
        callId: "call-1",
        sender: "Sarah Johnson",
        avatar: "SJ",
      },
      {
        id: "2",
        type: "message",
        title: "New Message",
        message: "You have 3 new messages from the HR team",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        priority: "medium",
        read: false,
        sender: "HR Team",
      },
      {
        id: "3",
        type: "system",
        title: "Meeting Reminder",
        message: "Team standup meeting starts in 15 minutes",
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        priority: "medium",
        read: true,
      },
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter((n) => !n.read).length);
  }, []);

  // Add incoming call notification
  useEffect(() => {
    if (callState.incomingCall) {
      const callNotification: Notification = {
        id: `call-${callState.incomingCall.callId}`,
        type: "call",
        title: "Incoming Call",
        message: `${callState.incomingCall.from.name} is calling you`,
        timestamp: new Date(),
        priority: "high",
        read: false,
        actionable: true,
        callId: callState.incomingCall.callId,
        sender: callState.incomingCall.from.name,
      };

      setNotifications((prev) => [callNotification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    }
  }, [callState.incomingCall]);

  const handleAcceptCall = (callId: string) => {
    // Accept call via WebSocket
    acceptCall(callId);
    // Also use the existing call context
    acceptIncomingCall();
    markAsRead(callId);
    removeNotification(`call-${callId}`);
  };

  const handleRejectCall = (callId: string) => {
    // Reject call via WebSocket
    rejectCall(callId);
    // Also use the existing call context
    declineIncomingCall();
    removeNotification(`call-${callId}`);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const removeNotification = (notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    const notification = notifications.find((n) => n.id === notificationId);
    if (notification && !notification.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "call":
        return <Phone className="h-4 w-4" />;
      case "message":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      default:
        return "bg-blue-500";
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        className="relative p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notifications Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-full mt-2 w-80 z-50"
          >
            <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
              <CardContent className="p-0">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-semibold text-sm">Notifications</h3>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={markAllAsRead}
                        className="text-xs h-6 px-2"
                      >
                        Mark all read
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No notifications</p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className={`p-4 hover:bg-gray-50 transition-colors ${
                            !notification.read ? "bg-blue-50/50" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Icon */}
                            <div
                              className={`p-2 rounded-full ${getPriorityColor(notification.priority)} text-white`}
                            >
                              {getNotificationIcon(notification.type)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="text-sm font-medium truncate">
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                )}
                              </div>

                              <p className="text-xs text-gray-600 mb-2">
                                {notification.message}
                              </p>

                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400">
                                  {formatTimestamp(notification.timestamp)}
                                </span>

                                {/* Action Buttons for Calls */}
                                {notification.actionable &&
                                  notification.callId && (
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          handleRejectCall(notification.callId!)
                                        }
                                        className="h-6 px-2 text-xs"
                                      >
                                        Decline
                                      </Button>
                                      <Button
                                        size="sm"
                                        onClick={() =>
                                          handleAcceptCall(notification.callId!)
                                        }
                                        className="h-6 px-2 text-xs bg-green-600 hover:bg-green-700"
                                      >
                                        Accept
                                      </Button>
                                    </div>
                                  )}
                              </div>
                            </div>

                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                removeNotification(notification.id)
                              }
                              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className="p-3 border-t bg-gray-50">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllNotifications}
                      className="w-full text-xs h-6"
                    >
                      Clear all notifications
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
