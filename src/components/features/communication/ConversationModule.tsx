import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Phone,
  Video,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  X,
  Minimize2,
  Maximize2,
  PhoneOff,
  Mic,
  MicOff,
  VideoOff,
  Users,
  Search,
  Settings,
  Bell,
  BellOff,
  MessageSquare,
  Wifi,
  WifiOff,
  FileText,
  Download,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useCall } from '@/contexts/CallContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWebSocket } from '@/hooks/useWebSocket';
import CallSelectionModal from '@/components/calls/CallSelectionModal';
import VideoCallInterface from '@/components/calls/VideoCallInterface';
import { userAPI } from '@/services/api';

interface ConversationModuleProps {
  className?: string;
  department?: string;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  type: "text" | "system" | "call" | "image" | "file";
  avatar?: string;
  from?: string;
}

export default function ConversationModule({ 
  className = "", 
  department 
}: ConversationModuleProps) {
  const { user } = useAuth();
  const { startCall } = useCall();
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [userSearch, setUserSearch] = useState("");
  
  // State management
  const [activeTab, setActiveTab] = useState<"chat" | "calls">("chat");
  const [showCallModal, setShowCallModal] = useState(false);
  const [callType, setCallType] = useState<"voice" | "video">("video");
  const [newMessage, setNewMessage] = useState("");
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  
  // Messages state - now properly managed
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "System",
      content: "Welcome to the team communication channel!",
      timestamp: new Date(Date.now() - 3600000),
      type: "system",
    },
    {
      id: "2",
      sender: "John Doe",
      content: "Good morning team! Ready for today's project review?",
      timestamp: new Date(Date.now() - 1800000),
      type: "text",
      avatar: "JD",
    },
    {
      id: "3",
      sender: "Jane Smith",
      content: "Yes, I've prepared the latest reports. Should we schedule a call?",
      timestamp: new Date(Date.now() - 900000),
      type: "text",
      avatar: "JS",
    },
    {
      id: "4",
      sender: "System",
      content: "Video call started by John Doe",
      timestamp: new Date(Date.now() - 300000),
      type: "call",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load users list for sidebar
  useEffect(() => {
    const loadUsers = async () => {
      setUsersLoading(true);
      setUsersError(null);
      try {
        const response: any = await userAPI.getAllUsers();
        const list = Array.isArray(response) ? response : response?.data || [];
        setUsers(list);
      } catch (e: any) {
        console.error('Failed to load users:', e);
        setUsersError(e?.message || 'Failed to load users');
      } finally {
        setUsersLoading(false);
      }
    };
    loadUsers();
  }, []);

  // WebSocket integration for real-time communication
  const { 
    sendMessage, 
    initiateCall, 
    markMessageAsRead, 
    joinRoom, 
    leaveRoom,
    isConnected 
  } = useWebSocket({
    onMessage: (message) => {
      console.log('Received message:', message);
      
      // Handle incoming messages - add to messages state
      const newMsg: Message = {
        id: message.id || `msg-${Date.now()}`,
        sender: message.from === user?.id ? `${user?.firstName} ${user?.lastName}` : message.from,
        content: message.content || '',
        timestamp: new Date(message.timestamp || Date.now()),
        type: "text",
        from: message.from,
        avatar: message.from === user?.id ? `${user?.firstName?.[0]}${user?.lastName?.[0]}` : message.from?.substring(0, 2).toUpperCase()
      };
      
      setMessages(prev => [...prev, newMsg]);
      
      // Show notification if not from current user
      if (message.from !== user?.id && isNotificationEnabled) {
        showNotification(
          'New Message',
          `${message.from}: ${message.content}`,
          {
            icon: '/favicon.ico',
            tag: `message-${message.id}`,
            data: { messageId: message.id, sender: message.from }
          }
        );
      }
    },
    onCall: (call) => {
      console.log('Received call event:', call);
      
      // Add call message to chat
      const callMessage: Message = {
        id: `call-${call.id}-${Date.now()}`,
        sender: call.from || 'System',
        content: `${call.type === 'incoming' ? 'Incoming' : 'Outgoing'} call`,
        timestamp: call.timestamp ? new Date(call.timestamp) : new Date(),
        type: 'call',
        from: call.from
      };
      
      setMessages(prev => [...prev, callMessage]);
      
      // Show notification for incoming calls
      if (call.type === 'incoming') {
        showNotification(
          'Incoming Call',
          `${call.from} is calling you`,
          {
            icon: '/favicon.ico',
            tag: `call-${call.id}`,
            requireInteraction: true,
            data: { callId: call.id, caller: call.from }
          }
        );
      }
    },
    onNotification: (notification) => {
      console.log('Received notification:', notification);
      
      // Handle system notifications
      if (notification.type === 'system') {
        const systemMessage: Message = {
          id: `system-${Date.now()}`,
          sender: 'System',
          content: notification.message || notification.title || 'System notification',
          timestamp: new Date(),
          type: 'system'
        };
        
        setMessages(prev => [...prev, systemMessage]);
      }
      
      // Show browser notification
      showNotification(
        notification.title || 'Notification',
        notification.message || notification.body || '',
        {
          icon: '/favicon.ico',
          tag: `notification-${notification.id}`,
          data: notification
        }
      );
    },
    onConnectionChange: (connected) => {
      console.log('Connection status changed:', connected);
      setConnectionStatus(connected);
      
      if (connected) {
        setError(null);
        setRetryCount(0);
        // Add connection restored message
        const connectionMessage: Message = {
          id: `connection-${Date.now()}`,
          sender: 'System',
          content: 'Connection restored',
          timestamp: new Date(),
          type: 'system'
        };
        setMessages(prev => [...prev, connectionMessage]);
      } else {
        // Start retry logic
        if (retryCount < maxRetries) {
          setError(`Connection lost. Retrying... (${retryCount + 1}/${maxRetries})`);
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000 * (retryCount + 1)); // Exponential backoff
        } else {
          setError('Connection failed. Please refresh the page.');
        }
        
        // Add connection lost message
        const connectionMessage: Message = {
          id: `connection-lost-${Date.now()}`,
          sender: 'System',
          content: 'Connection lost. Attempting to reconnect...',
          timestamp: new Date(),
          type: 'system'
        };
        setMessages(prev => [...prev, connectionMessage]);
      }
    }
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Join room on component mount
  useEffect(() => {
    if (department) {
      joinRoom(department);
    } else {
      joinRoom('general');
    }
    
    return () => {
      if (department) {
        leaveRoom(department);
      } else {
        leaveRoom('general');
      }
    };
  }, [department, joinRoom, leaveRoom]);

  // Update connection status
  useEffect(() => {
    setConnectionStatus(isConnected());
  }, [isConnected]);

  // Enhanced notification function with better browser notification support
  const showNotification = (title: string, body: string, options?: NotificationOptions) => {
    if (!isNotificationEnabled) return;

    // Check if browser supports notifications
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        const notification = new Notification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'chat-notification',
          requireInteraction: false,
          silent: false,
          ...options
        });

        // Auto-close notification after 5 seconds
        setTimeout(() => notification.close(), 5000);

        // Handle notification click
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } else if (Notification.permission !== 'denied') {
        // Request permission
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            showNotification(title, body, options);
          }
        });
      }
    }

    // Fallback: Add to browser console for debugging
    console.log(`Notification: ${title} - ${body}`);
  };



  // Helper function to check if two dates are on the same day
  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const handleStartCall = (type: "voice" | "video") => {
    setCallType(type);
    setShowCallModal(true);
  };

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachmentPreview, setAttachmentPreview] = useState<{file: File, url: string} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && !attachmentPreview) || !user) return;

    const messageId = `msg-${Date.now()}`;
    let messageContent = newMessage.trim();
    let messageType: 'text' | 'image' | 'file' = 'text';

    setIsLoading(true);
    setError(null);

    // Handle file attachment
    if (attachmentPreview) {
      // In a real app, you would upload the file to a server first
      // For now, we'll use the object URL we created
      
      if (attachmentPreview.file.type.startsWith('image/')) {
        messageType = 'image';
        messageContent = attachmentPreview.url;
      } else {
        messageType = 'file';
        messageContent = `${attachmentPreview.file.name}|${attachmentPreview.url}`;
      }
    }

    const message: Message = {
      id: messageId,
      sender: `${user.firstName} ${user.lastName}`,
      content: messageContent,
      timestamp: new Date(),
      type: messageType,
      from: user.id,
      avatar: `${user.firstName?.[0]}${user.lastName?.[0]}`
    };

    // Add message to local state immediately for better UX
    setMessages(prev => [...prev, message]);
    
    // Clear input and attachment
    setNewMessage("");
    setAttachmentPreview(null);
    
    try {
      // Send message via WebSocket
      await sendMessage({
        content: messageContent,
        conversationId: department || 'general',
        to: department || 'general',
        from: user.id
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message. Please try again.');
      
      // Remove the message from local state if sending failed
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      
      const url = URL.createObjectURL(file);
      setAttachmentPreview({ file, url });
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const removeAttachment = () => {
    setAttachmentPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <>
      <Card className={`w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 shadow-lg ${className}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[#F97316]" />
              Team Communication
              {department && (
                <Badge variant="secondary" className="text-xs">
                  {department.replace("-", " ").toUpperCase()}
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2">
              {/* Connection Status */}
              <div className="flex items-center gap-1">
                {connectionStatus ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
              </div>
              
              {/* Notification Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsNotificationEnabled(!isNotificationEnabled)}
                className="h-8 w-8 p-0"
              >
                {isNotificationEnabled ? (
                  <Bell className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                ) : (
                  <BellOff className="h-4 w-4 text-gray-400" />
                )}
              </Button>
              
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </Button>
            </div>
          </div>
          
          {/* Error Display */}
          {error && (
            <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          
          {/* Tab Navigation */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mt-3">
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === "chat"
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <MessageCircle className="h-4 w-4 inline mr-2" />
              Chat
            </button>
            <button
              onClick={() => setActiveTab("calls")}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === "calls"
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              <Phone className="h-4 w-4 inline mr-2" />
              Calls
            </button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Error Display */}
          {error && (
            <div className="mx-4 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <WifiOff className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
                </div>
                {error.includes('refresh') && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.reload()}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Refresh
                  </Button>
                )}
              </div>
            </div>
          )}
          
          {activeTab === "chat" && (
            <div className="h-[28rem] flex">
              {/* Sidebar: Users list */}
              <div className="w-64 border-r border-gray-200 dark:border-gray-700 flex flex-col">
                <div className="p-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {usersLoading && (
                    <div className="p-3 text-sm text-gray-500">Loading users...</div>
                  )}
                  {usersError && !usersLoading && (
                    <div className="p-3 text-xs text-red-600">{usersError}</div>
                  )}
                  {!usersLoading && !usersError && (
                    <div className="space-y-1 p-2">
                      {users
                        .filter((u) => {
                          if (!userSearch) return true;
                          const name = [u.firstName, u.lastName].filter(Boolean).join(' ');
                          return (
                            String(name || u.email || '').toLowerCase().includes(userSearch.toLowerCase()) ||
                            String(u.department || '').toLowerCase().includes(userSearch.toLowerCase())
                          );
                        })
                        .map((u) => {
                          const fullName = [u.firstName, u.lastName].filter(Boolean).join(' ') || u.email || 'Unknown';
                          const status = u.isActive ? 'online' : 'offline';
                          return (
                            <button
                              key={u.id}
                              onClick={() => setSelectedUser(u)}
                              className={`w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition ${
                                selectedUser?.id === u.id ? 'bg-gray-100 dark:bg-gray-700' : ''
                              }`}
                            >
                              <div className="relative">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={u.avatarUrl} alt={fullName} />
                                  <AvatarFallback>{fullName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <span className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white ${
                                  status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                                }`} />
                              </div>
                              <div className="flex-1 text-left min-w-0">
                                <p className="text-sm font-medium truncate">{fullName}</p>
                                <p className="text-xs text-gray-500 truncate">
                                  {u.department || 'No department'}
                                </p>
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  )}
                </div>
              </div>

              {/* Chat area */}
              <div className="flex-1 flex flex-col">
                {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => {
                  const showDateSeparator = index === 0 || 
                    !isSameDay(message.timestamp, messages[index - 1].timestamp);
                  
                  return (
                    <div key={message.id}>
                      {showDateSeparator && (
                        <div className="flex justify-center my-4">
                          <Badge variant="secondary" className="text-xs px-3 py-1">
                            {formatDate(message.timestamp)}
                          </Badge>
                        </div>
                      )}
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-2 ${
                          message.type === "system" ? "justify-center" : ""
                        }`}
                      >
                        {message.type !== "system" && (
                          <Avatar className="w-8 h-8 flex-shrink-0">
                            <AvatarFallback className="bg-gray-200 dark:bg-gray-600 text-xs">
                              {message.avatar || message.sender.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={`flex-1 ${message.type === "system" ? "text-center" : ""}`}>
                          {message.type === "system" ? (
                            <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                              {message.content}
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  {message.sender}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatTime(message.timestamp)}
                                </span>
                              </div>
                              <div className={`text-sm p-2 rounded-lg max-w-xs ${
                                message.type === "call" 
                                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                                  : message.from === user?.id
                                  ? "bg-[#F97316] text-white ml-auto"
                                  : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                              }`}>
                                {message.type === 'image' ? (
                                  <div className="mt-2">
                                    <img 
                                      src={message.content} 
                                      alt="Shared image" 
                                      className="max-w-xs rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                                      onClick={() => window.open(message.content, '_blank')}
                                    />
                                  </div>
                                ) : message.type === 'file' ? (
                                  <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                                    <div className="flex items-center space-x-2">
                                      <FileText className="w-5 h-5 text-blue-500" />
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                          {message.content.split('|')[0]}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                          Click to download
                                        </p>
                                      </div>
                                      <button
                                        onClick={() => {
                                          const fileUrl = message.content.split('|')[1];
                                          const fileName = message.content.split('|')[0];
                                          const link = document.createElement('a');
                                          link.href = fileUrl;
                                          link.download = fileName;
                                          link.click();
                                        }}
                                        className="p-1 text-blue-500 hover:text-blue-600 transition-colors"
                                      >
                                        <Download className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  message.content
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      disabled={isLoading || !connectionStatus}
                      className="w-full px-3 py-2 pr-20 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0" 
                        disabled={!connectionStatus}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Paperclip className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0" 
                        disabled={!connectionStatus}
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      >
                        <Smile className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    {/* Emoji Picker */}
                    {showEmojiPicker && (
                      <div className="absolute bottom-full right-0 mb-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
                        <div className="grid grid-cols-8 gap-1">
                          {['😀', '😂', '😍', '🤔', '😢', '😡', '👍', '👎', '❤️', '🎉', '🔥', '💯', '😎', '🤝', '👏', '🙏'].map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => handleEmojiSelect(emoji)}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-lg"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* File Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleFileSelect}
                      accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                    
                    {/* Attachment Preview */}
                    {attachmentPreview && (
                      <div className="absolute bottom-full left-0 right-0 mb-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {attachmentPreview.file.type.startsWith('image/') ? (
                              <img src={attachmentPreview.url} alt="Preview" className="w-12 h-12 object-cover rounded" />
                            ) : (
                              <FileText className="w-8 h-8 text-blue-500" />
                            )}
                            <div>
                              <p className="text-sm font-medium">{attachmentPreview.file.name}</p>
                              <p className="text-xs text-gray-500">{(attachmentPreview.file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={removeAttachment}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={(!newMessage.trim() && !attachmentPreview) || isLoading || !connectionStatus}
                    className="bg-[#F97316] hover:bg-[#F97316]/80 text-white h-10 w-10 p-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              </div>
            </div>
          )}

          {activeTab === "calls" && (
            <div className="p-4 space-y-4">
              {/* Quick Call Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => handleStartCall("voice")}
                  disabled={!connectionStatus}
                  className="h-12 bg-green-500 hover:bg-green-600 text-white flex flex-col items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Phone className="h-5 w-5" />
                  <span className="text-xs">Voice Call</span>
                </Button>
                <Button
                  onClick={() => handleStartCall("video")}
                  disabled={!connectionStatus}
                  className="h-12 bg-blue-500 hover:bg-blue-600 text-white flex flex-col items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Video className="h-5 w-5" />
                  <span className="text-xs">Video Call</span>
                </Button>
              </div>

              {/* Recent Calls */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Recent Calls
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <Video className="h-4 w-4 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Team Standup
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        2 hours ago • 15 min
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      5
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Client Check-in
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Yesterday • 32 min
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      <Users className="h-3 w-3 mr-1" />
                      3
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Call Statistics */}
              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">12</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">This Week</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">3h 45m</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Total Time</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">8.5</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Avg Rating</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Call Selection Modal */}
      {showCallModal && (
        <CallSelectionModal
          isOpen={showCallModal}
          onClose={() => setShowCallModal(false)}
          onStartCall={(callType, target, options) => {
            // Properly integrate with CallContext
            const callId = `${callType}-${target}-${Date.now()}`;
            startCall(callId, { 
              title: options?.title || `${callType} call`, 
              participants: options?.participants || [] 
            });
            setShowCallModal(false);
          }}
          currentDepartment={department}
        />
      )}

      {/* Video Call Interface */}
      <VideoCallInterface />
    </>
  );
}