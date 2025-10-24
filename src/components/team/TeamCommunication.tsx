import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Phone,
  Video,
  Send,
  Paperclip,
  Smile,
  Wifi,
  WifiOff,
  Users,
  Search,
  Settings as SettingsIcon,
  Bell,
  BellOff,
  Filter,
  Sparkles,
  MoreHorizontal,
} from "lucide-react";
import { useCall } from "@/contexts/CallContext";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserList, { RegisteredUser } from "./UserList";
import UserPopup from "@/components/team/UserPopup";
import CallWindow from "@/components/team/CallWindow";
import ChatWindow from "@/components/team/ChatWindow";
import TeamSettings, { TeamPreferences } from "@/components/team/TeamSettings";
import CallSelectionModal from "@/components/calls/CallSelectionModal";
import CallMiniWidget from "@/components/calls/CallMiniWidget";
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/features/common/ThemeToggle";

interface TeamCommunicationProps {
  users: RegisteredUser[];
  isLoading?: boolean;
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

const TeamCommunication: React.FC<TeamCommunicationProps> = ({
  users,
  isLoading,
  department,
}) => {
  const { user } = useAuth();
  const { startCall, callState, endCall } = useCall();

  const [hoverUser, setHoverUser] = useState<RegisteredUser | null>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const [selectedUser, setSelectedUser] = useState<RegisteredUser | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedDept, setSelectedDept] = useState<string>("All");
  const [userSearch, setUserSearch] = useState("");
  const [prefs, setPrefs] = useState<TeamPreferences>({
    enableChat: true,
    enableCall: true,
    notifications: { sound: true, muteAll: false },
    availability: "Online",
    blockedUsers: [],
  });

  // Communication state
  const [activeTab, setActiveTab] = useState<"chat" | "calls">("chat");
  const [showCallModal, setShowCallModal] = useState(false);
  const [callType, setCallType] = useState<"voice" | "video">("video");
  const [newMessage, setNewMessage] = useState("");
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Messages state - sample initial content
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "System",
      content: "Welcome to the team communication channel!",
      timestamp: new Date(Date.now() - 3600000),
      type: "system",
    },
  ]);

  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // WebSocket integration for real-time chat
  const {
    sendMessage: wsendMessage,
    isConnected,
    joinRoom,
  } = useWebSocket({
    onMessage: (message) => {
      if (message && message.content) {
        const newMsg: Message = {
          id: `msg-${Date.now()}`,
          sender: message.from || "Unknown",
          content: message.content,
          timestamp: new Date(),
          type: "text",
          from: message.from,
          avatar: message.from?.charAt(0)?.toUpperCase() || "U",
        };
        setMessages((prev) => [...prev, newMsg]);

        if (isNotificationEnabled) {
          showNotification(`New message from ${newMsg.sender}`, newMsg.content);
        }
      }
    },
    onCall: (call) => {
      try {
        const isIncoming = call?.type === "incoming";
        const title = isIncoming ? "Incoming Call" : "Call Update";
        const fromName =
          (call as any)?.from?.name || (call as any)?.from || "Unknown";
        const message = isIncoming
          ? `${fromName} is calling you`
          : `Call status: ${call?.type || "updated"}`;
        if (isNotificationEnabled) {
          showNotification(title, message);
        }
        setMessages((prev) => [
          ...prev,
          {
            id: `sys-${Date.now()}`,
            sender: "System",
            content: `${title}: ${message}`,
            timestamp: new Date(),
            type: "system",
          },
        ]);
      } catch (e) {
        console.warn("Failed to handle call event:", e);
      }
    },
    onConnectionChange: (connected) => {
      setConnectionStatus(connected);
    },
  });

  // Browser notification helper
  const showNotification = (
    title: string,
    body: string,
    options: NotificationOptions = {},
  ) => {
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        const notification = new Notification(title, {
          body,
          icon: "/favicon.ico",
          badge: "/favicon.ico",
          tag: "chat-notification",
          requireInteraction: false,
          silent: false,
          ...options,
        });
        setTimeout(() => notification.close(), 5000);
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            showNotification(title, body, options);
          }
        });
      }
    }
    console.log(`Notification: ${title} - ${body}`);
  };

  useEffect(() => {
    try {
      if (isConnected && (department || "general")) {
        joinRoom(department || "general");
      }
    } catch (e) {
      console.warn("Failed to join room:", e);
    }
  }, [isConnected, department, joinRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Keyboard shortcuts for efficiency: Cmd/Ctrl+K focuses search, Cmd/Ctrl+Shift+S opens settings
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (isMod && e.shiftKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        setShowSettings(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleUserHover = (user: RegisteredUser | null) => {
    setHoverUser(user);
  };

  const handleUserClick = (user: RegisteredUser, rect: DOMRect) => {
    setSelectedUser(user);
    setAnchorRect(rect);
    setShowPopup(true);
  };

  const handleStartCall = (user?: RegisteredUser) => {
    if (!prefs.enableCall) return;
    if (user) {
      const callId = `call_${user.id}_${Date.now()}`;
      startCall(callId, {
        title: user.department || "general",
        participants: [user.email],
      });
    } else {
      setCallType("video");
      setShowCallModal(true);
    }
  };

  const handleStartCallType = (type: "voice" | "video") => {
    setCallType(type);
    setShowCallModal(true);
  };

  const handleOpenChat = (user: RegisteredUser) => {
    if (!prefs.enableChat) return;
    wsendMessage({
      to: user.email,
      from: user?.id || "me",
      content: "Initiated chat",
      conversationId: `conv_${user.id}`,
    });
    setShowChat(true);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    const messageId = `msg-${Date.now()}`;
    setIsChatLoading(true);
    setError(null);
    const message: Message = {
      id: messageId,
      sender: `${user.firstName} ${user.lastName}`,
      content: newMessage.trim(),
      timestamp: new Date(),
      type: "text",
      from: user.id,
      avatar: `${user.firstName?.[0]}${user.lastName?.[0]}`,
    };
    setMessages((prev) => [...prev, message]);
    setNewMessage("");
    try {
      await wsendMessage({
        content: message.content,
        conversationId: department || "general",
        to: department || "general",
        from: user.id,
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      setError("Failed to send message. Please try again.");
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } finally {
      setIsChatLoading(false);
    }
  };

  // Overflow and drawer states/handlers
  const [showEmojiDrawer, setShowEmojiDrawer] = useState(false);
  const [showAttachDrawer, setShowAttachDrawer] = useState(false);
  const [showControlsDrawer, setShowControlsDrawer] = useState(false);
  const [showModernUiBadge, setShowModernUiBadge] = useState(false);
  const emojis = ["😀", "🙂", "😊", "😂", "😍", "😎", "🤔", "🙌", "👍", "🎉"];
  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => `${prev}${emoji}`);
  };
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handlePickFile = () => {
    fileInputRef.current?.click();
  };
  const handleFileSelected: React.ChangeEventHandler<HTMLInputElement> = (
    e,
  ) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const messageId = `file-${Date.now()}`;
    const msg: Message = {
      id: messageId,
      sender: `${user.firstName} ${user.lastName}`,
      content: file.name,
      timestamp: new Date(),
      type: "file",
      from: user.id,
      avatar: `${user.firstName?.[0]}${user.lastName?.[0]}`,
    };
    setMessages((prev) => [...prev, msg]);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setAnchorRect(null);
  };

  const departments = useMemo(() => {
    const set = new Set<string>();
    users.forEach((u) => set.add(u.department || "Unassigned"));
    return ["All", ...Array.from(set).sort()];
  }, [users]);

  const filteredUsers = useMemo(() => {
    let filtered = users;
    if (selectedDept && selectedDept !== "All") {
      filtered = filtered.filter(
        (u) => (u.department || "Unassigned") === selectedDept,
      );
    }
    if (userSearch.trim()) {
      const search = userSearch.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.firstName.toLowerCase().includes(search) ||
          u.lastName.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search) ||
          (u.department || "").toLowerCase().includes(search),
      );
    }
    return filtered;
  }, [users, selectedDept, userSearch]);

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="offcanvas" variant="inset">
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-[#F97316]" />
              <span className="text-sm font-semibold">Communication</span>
            </div>
            <SidebarTrigger className="h-6 w-6" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          {/* Removed duplicate Navigate controls to avoid redundancy with Tabs */}
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>Departments</SidebarGroupLabel>
            <SidebarGroupContent>
              <ScrollArea className="h-40">
                <div className="flex flex-wrap gap-2 p-2">
                  {departments.map((d) => (
                    <Button
                      key={d}
                      size="sm"
                      variant={selectedDept === d ? "default" : "outline"}
                      className={`h-7 ${selectedDept === d ? "bg-[#F97316] hover:bg-[#ea580c] text-white" : ""}`}
                      onClick={() => setSelectedDept(d)}
                      aria-pressed={selectedDept === d}
                      aria-label={`Filter by ${d}`}
                      disabled={!!isLoading}
                    >
                      {d}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        {/* Removed sidebar footer toggles; header retains settings/notifications */}
      </Sidebar>
      <SidebarInset>
        <Card
          className="w-full max-w-6xl mx-auto bg-white dark:bg-gray-900 shadow-2xl"
          ref={containerRef}
        >
          <CardHeader className="pb-3 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-orange-50 to-transparent dark:from-gray-800/40">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-[#F97316]" />
                Team Communication
                {department && (
                  <Badge variant="secondary" className="text-xs">
                    {department.replace("-", " ").toUpperCase()}
                  </Badge>
                )}
                {showModernUiBadge && (
                  <Badge variant="secondary" className="text-[10px]">
                    Modern UI
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center gap-2">
                <div
                  className="flex items-center gap-1"
                  aria-live="polite"
                  aria-label={connectionStatus ? "Online" : "Offline"}
                >
                  {connectionStatus ? (
                    <Wifi className="h-4 w-4 text-green-500" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-red-500" />
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setIsNotificationEnabled(!isNotificationEnabled)
                  }
                  aria-pressed={isNotificationEnabled}
                  aria-label={
                    isNotificationEnabled
                      ? "Disable notifications"
                      : "Enable notifications"
                  }
                  className="h-8 w-8 p-0"
                >
                  {isNotificationEnabled ? (
                    <Bell className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  ) : (
                    <BellOff className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettings(true)}
                  aria-label="Open team settings"
                  className="h-8 w-8 p-0"
                >
                  <SettingsIcon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </Button>
                {/* Header overflow menu to access call shortcuts and controls */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      aria-label="More header actions"
                    >
                      <MoreHorizontal className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleStartCallType("voice")}
                    >
                      <Phone className="mr-2 h-4 w-4" /> Start voice call
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStartCallType("video")}
                    >
                      <Video className="mr-2 h-4 w-4" /> Start video call
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setActiveTab("chat")}>
                      Go to Chat
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setActiveTab("calls")}>
                      Go to Calls
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={showModernUiBadge}
                      onCheckedChange={(val) => setShowModernUiBadge(!!val)}
                    >
                      Show Modern UI badge
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setShowControlsDrawer(true)}
                    >
                      Open Controls Drawer
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <SidebarTrigger className="h-7 w-7" />
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search members, departments..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  ref={searchInputRef}
                  className="pl-9 h-8 text-sm"
                  aria-label="Global search"
                />
              </div>
              <ThemeToggle />
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as "chat" | "calls")}
            >
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="calls" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Calls
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[620px]">
                  {/* User List */}
                  <div className="lg:col-span-1">
                    <div className="h-full border rounded-lg bg-gray-50 dark:bg-gray-800 flex flex-col">
                      <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              Team Members
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {filteredUsers.length} members
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto">
                        {filteredUsers.length > 0 ? (
                          <UserList
                            users={filteredUsers}
                            isLoading={!!isLoading}
                            onHover={handleUserHover}
                            onUserClick={handleUserClick}
                          />
                        ) : (
                          <div className="h-full flex items-center justify-center p-6 text-center">
                            <div>
                              <Users className="h-8 w-8 mx-auto text-gray-400" />
                              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                No team members found
                              </p>
                              <p className="text-xs text-gray-400">
                                Try adjusting search or filters
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Chat Area */}
                  <div className="lg:col-span-2">
                    <div className="h-full border rounded-lg bg-white dark:bg-gray-900 flex flex-col">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          Channel:{" "}
                          <span className="font-medium">
                            {department || "general"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                          <Wifi
                            className={`h-3.5 w-3.5 ${connectionStatus ? "text-green-500" : "text-red-500"}`}
                          />
                          {connectionStatus ? "Connected" : "Disconnected"}
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => {
                          const previousMessage = messages[index - 1];
                          const showDateSeparator =
                            !previousMessage ||
                            !isSameDay(
                              message.timestamp,
                              previousMessage.timestamp,
                            );
                          return (
                            <div key={message.id}>
                              {showDateSeparator && (
                                <div className="flex items-center justify-center my-4">
                                  <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-xs text-gray-500 dark:text-gray-400">
                                    {message.timestamp.toDateString()}
                                  </div>
                                </div>
                              )}
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex gap-3 items-start ${
                                  message.type === "system"
                                    ? "justify-center"
                                    : ""
                                } ${
                                  message.from === user?.id ? "justify-end" : ""
                                }`}
                              >
                                {message.type !== "system" &&
                                  message.from !== user?.id && (
                                    <Avatar className="h-8 w-8">
                                      {(() => {
                                        const ext = "jpg";
                                        const publicUrl =
                                          supabaseService.getPublicUrl(
                                            "project_files",
                                            `avatars/${message.from}.${ext}`,
                                          );
                                        return (
                                          <AvatarImage
                                            src={
                                              publicUrl ||
                                              `/api/avatar/${message.from}`
                                            }
                                          />
                                        );
                                      })()}
                                      <AvatarFallback className="text-xs">
                                        {message.avatar ||
                                          message.sender.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                  )}
                                <div
                                  className={`flex-1 max-w-xs lg:max-w-md ${
                                    message.from === user?.id
                                      ? "text-right"
                                      : ""
                                  }`}
                                >
                                  {message.type === "system" ? (
                                    <div className="text-center text-sm text-gray-500 dark:text-gray-400 italic">
                                      {message.content}
                                    </div>
                                  ) : (
                                    <>
                                      <div className="flex items-baseline gap-2 mb-1">
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                          {message.from === user?.id
                                            ? "You"
                                            : message.sender}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          {message.timestamp.toLocaleTimeString(
                                            [],
                                            {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            },
                                          )}
                                        </span>
                                      </div>
                                      <div
                                        className={`inline-block p-3 rounded-2xl text-sm shadow-sm ${
                                          message.from === user?.id
                                            ? "bg-gradient-to-br from-[#F97316] to-[#ea580c] text-white"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                                        }`}
                                      >
                                        {message.content}
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
                      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                        {error && (
                          <div className="mb-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-600 dark:text-red-400">
                            {error}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <div className="flex-1 relative">
                            <Input
                              placeholder="Type a message..."
                              value={newMessage}
                              onChange={(e) => setNewMessage(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSendMessage();
                                }
                              }}
                              disabled={isChatLoading || !connectionStatus}
                              className="pr-24"
                              aria-label="Message input"
                            />
                            {/* Overflow menu trigger */}
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    aria-label="More"
                                  >
                                    <Sparkles className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                  align="end"
                                  className="w-48"
                                >
                                  <DropdownMenuLabel>
                                    Quick Actions
                                  </DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => setShowEmojiDrawer(true)}
                                  >
                                    <Smile className="mr-2 h-4 w-4" /> Add emoji
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => setShowAttachDrawer(true)}
                                  >
                                    <Paperclip className="mr-2 h-4 w-4" />{" "}
                                    Attach file
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          <Button
                            onClick={handleSendMessage}
                            disabled={
                              !newMessage.trim() ||
                              isChatLoading ||
                              !connectionStatus
                            }
                            className="bg-[#F97316] hover:bg-[#ea580c]"
                            aria-label="Send message"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            onChange={handleFileSelected}
                          />
                        </div>
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          Press Enter to send, Shift+Enter for a new line.
                        </div>
                        {/* Emoji Drawer */}
                        <Drawer
                          open={showEmojiDrawer}
                          onOpenChange={setShowEmojiDrawer}
                        >
                          <DrawerContent>
                            <DrawerHeader>
                              <DrawerTitle>Select emoji</DrawerTitle>
                            </DrawerHeader>
                            <div className="px-4 pb-4">
                              <div className="grid grid-cols-10 gap-2">
                                {emojis.map((e) => (
                                  <Button
                                    key={e}
                                    variant="ghost"
                                    className="h-9"
                                    onClick={() => handleEmojiSelect(e)}
                                    aria-label={`Insert ${e}`}
                                  >
                                    {e}
                                  </Button>
                                ))}
                              </div>
                            </div>
                            <DrawerFooter>
                              <DrawerClose asChild>
                                <Button variant="outline">Close</Button>
                              </DrawerClose>
                            </DrawerFooter>
                          </DrawerContent>
                        </Drawer>
                        {/* Attachments Drawer */}
                        <Drawer
                          open={showAttachDrawer}
                          onOpenChange={setShowAttachDrawer}
                        >
                          <DrawerContent>
                            <DrawerHeader>
                              <DrawerTitle>Attach a file</DrawerTitle>
                            </DrawerHeader>
                            <div className="px-4 pb-4 space-y-3">
                              <Button
                                variant="default"
                                onClick={handlePickFile}
                                aria-label="Choose file"
                              >
                                <Paperclip className="mr-2 h-4 w-4" /> Choose
                                file
                              </Button>
                              <p className="text-xs text-muted-foreground">
                                Supported types: images, docs, videos.
                              </p>
                            </div>
                            <DrawerFooter>
                              <DrawerClose asChild>
                                <Button variant="outline">Close</Button>
                              </DrawerClose>
                            </DrawerFooter>
                          </DrawerContent>
                        </Drawer>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="calls" className="p-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      onClick={() => handleStartCallType("voice")}
                      disabled={!connectionStatus}
                      className="h-12 bg-green-500 hover:bg-green-600 text-white flex flex-col items-center justify-center gap-1"
                      aria-label="Start voice call"
                    >
                      <Phone className="h-5 w-5" />
                      <span className="text-xs">Voice Call</span>
                    </Button>
                    <Button
                      onClick={() => handleStartCallType("video")}
                      disabled={!connectionStatus}
                      className="h-12 bg-blue-500 hover:bg-blue-600 text-white flex flex-col items-center justify-center gap-1"
                      aria-label="Start video call"
                    >
                      <Video className="h-5 w-5" />
                      <span className="text-xs">Video Call</span>
                    </Button>
                  </div>

                  {/* Placeholder for recent calls/statistics */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        12
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Calls Today
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        3h
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Total Duration
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        8
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Participants
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>

          <AnimatePresence>
            {showPopup && selectedUser && anchorRect && (
              <UserPopup
                user={selectedUser}
                anchorRect={anchorRect}
                onClose={handleClosePopup}
                onCall={() => handleStartCall(selectedUser)}
                onChat={() => handleOpenChat(selectedUser)}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {callState.isInCall && selectedUser && anchorRect && (
              <CallWindow
                anchorRect={anchorRect}
                user={selectedUser}
                onClose={() => endCall()}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showChat && selectedUser && anchorRect && (
              <ChatWindow
                anchorRect={anchorRect}
                user={selectedUser}
                onClose={() => setShowChat(false)}
              />
            )}
          </AnimatePresence>

          <CallSelectionModal
            isOpen={showCallModal}
            onClose={() => setShowCallModal(false)}
            onStartCall={(callType, target, options) => {
              const callId = `${callType}-${target}-${Date.now()}`;
              startCall(callId, {
                title: options?.title || `${callType} call`,
                participants: options?.participants || [],
              });
              setShowCallModal(false);
            }}
            currentDepartment={department}
          />

          {/* Controls Drawer reintroducing previously removed header actions and navigation */}
          <Drawer
            open={showControlsDrawer}
            onOpenChange={setShowControlsDrawer}
          >
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Quick Controls</DrawerTitle>
              </DrawerHeader>
              <div className="px-4 pb-4 space-y-4">
                <div>
                  <div className="text-sm font-medium mb-2">Calls</div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => handleStartCallType("voice")}
                      className="h-10"
                      aria-label="Start voice call"
                    >
                      <Phone className="mr-2 h-4 w-4" /> Voice
                    </Button>
                    <Button
                      onClick={() => handleStartCallType("video")}
                      className="h-10"
                      aria-label="Start video call"
                    >
                      <Video className="mr-2 h-4 w-4" /> Video
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-2">Navigation</div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("chat")}
                      aria-label="Go to Chat"
                    >
                      Chat
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("calls")}
                      aria-label="Go to Calls"
                    >
                      Calls
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowSettings(true)}
                      aria-label="Open Settings"
                    >
                      Settings
                    </Button>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-2">Display</div>
                  <div className="flex items-center gap-2">
                    <DropdownMenuCheckboxItem
                      checked={showModernUiBadge}
                      onCheckedChange={(val) => setShowModernUiBadge(!!val)}
                    >
                      Show Modern UI badge
                    </DropdownMenuCheckboxItem>
                  </div>
                </div>
              </div>
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button variant="outline">Close</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          <TeamSettings
            open={showSettings}
            onOpenChange={setShowSettings}
            preferences={prefs}
            onChange={setPrefs}
          />

          <CallMiniWidget />
        </Card>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default TeamCommunication;
