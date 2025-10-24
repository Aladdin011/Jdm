import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Send, X } from "lucide-react";
import type { RegisteredUser } from "./UserList";
import { useWebSocket } from "@/hooks/useWebSocket";

interface ChatWindowProps {
  anchorRect: DOMRect;
  user: RegisteredUser;
  onClose?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  anchorRect,
  user,
  onClose,
}) => {
  const { sendMessage, webSocketService } = useWebSocket();
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [messages, setMessages] = useState<
    { id: string; from: string; content: string; timestamp: Date }[]
  >([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const margin = 8;
    const width = 320;
    const height = 260;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let x = anchorRect.left;
    let y = anchorRect.bottom + margin;

    if (x + width > viewportWidth) {
      x = viewportWidth - width - margin;
    }
    if (y + height > viewportHeight) {
      y = anchorRect.top - height - margin;
    }
    setPosition({ x, y });
  }, [anchorRect]);

  useEffect(() => {
    const handleNewMessage = (msg: any) => {
      setMessages((prev) => [
        ...prev,
        {
          id: msg.id || Math.random().toString(36),
          from: msg.from,
          content: msg.content,
          timestamp: new Date(msg.timestamp || Date.now()),
        },
      ]);
    };

    webSocketService.on("new_message", handleNewMessage);
    return () => webSocketService.off("new_message", handleNewMessage);
  }, [webSocketService]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage({
      to: user.email,
      from: "me",
      content: input,
      conversationId: `conv_${user.id}`,
    });
    setMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(36),
        from: "me",
        content: input,
        timestamp: new Date(),
      },
    ]);
    setInput("");
  };

  return (
    <motion.div
      className="fixed z-50 w-[320px] rounded-lg shadow-xl border bg-popover text-popover-foreground"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      style={{ left: position.x, top: position.y }}
    >
      <div className="p-3 border-b flex items-center justify-between">
        <p className="font-semibold text-[#142E54]">
          Chat with {user.firstName}
        </p>
        <button
          className="p-1 rounded hover:bg-muted"
          onClick={onClose}
          aria-label="Close chat"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="p-3 space-y-2">
        <div className="h-40 overflow-y-auto rounded bg-muted p-2 space-y-1">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`text-sm ${m.from === "me" ? "text-[#142E54]" : "text-muted-foreground"}`}
            >
              <span className="font-medium">{m.from}:</span> {m.content}
            </div>
          ))}
          {messages.length === 0 && (
            <p className="text-xs text-muted-foreground">
              No messages yet. Say hello!
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 rounded-md border"
          />
          <button
            onClick={handleSend}
            className="px-3 py-2 rounded-md bg-[#142E54] text-white hover:bg-[#142E54]/90"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatWindow;
