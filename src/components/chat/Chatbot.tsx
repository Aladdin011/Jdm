import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import ChatMessage, { Message } from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";
import { findBestResponse, welcomeMessage } from "@/data/chatbotKnowledge";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Initialize with welcome message when first opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        const welcomeMsg: Message = {
          id: `msg-${Date.now()}`,
          text: welcomeMessage,
          isUser: false,
          timestamp: new Date(),
          followUp: [
            "What services do you offer?",
            "Where are your offices?",
            "Can I get a project quote?",
          ],
        };
        setMessages([welcomeMsg]);
      }, 500);
    }
  }, [isOpen, messages.length]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || inputValue.trim();
    if (!textToSend) return;

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      text: textToSend,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Show typing indicator
    setIsTyping(true);

    // Simulate AI response delay (500ms as requested)
    setTimeout(() => {
      const response = findBestResponse(textToSend);
      const botMessage: Message = {
        id: `msg-${Date.now()}-bot`,
        text: response.response,
        isUser: false,
        timestamp: new Date(),
        followUp: response.followUp,
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 800); // Slightly longer delay for more realistic feel
  };

  const handleFollowUpClick = (text: string) => {
    handleSend(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#F97316] hover:bg-[#ea6a0a] text-white rounded-full shadow-lg z-50 flex items-center justify-center transition-colors duration-200"
        onClick={toggleChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleChat}
            />

            {/* Chat Container */}
            <motion.div
              className="fixed bottom-24 right-6 w-80 md:w-96 h-[60vh] max-h-[500px] bg-white rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden"
              initial={{ opacity: 0, y: 100, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.8 }}
              transition={{ type: "spring", duration: 0.3 }}
            >
              {/* Header */}
              <div className="bg-[#142E54] text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#F97316] rounded-full flex items-center justify-center">
                    <MessageCircle size={16} />
                  </div>
                  <div>
                    <h3 className="font-semibold">JD Marc Chat</h3>
                    <p className="text-xs text-blue-200">We're here to help!</p>
                  </div>
                </div>
                <button
                  onClick={toggleChat}
                  className="p-1 hover:bg-white/10 rounded transition-colors"
                  aria-label="Close chat"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto bg-gray-50">
                <div className="h-full">
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      onFollowUpClick={handleFollowUpClick}
                    />
                  ))}
                  {isTyping && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t bg-white p-3">
                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-sm"
                    disabled={isTyping}
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!inputValue.trim() || isTyping}
                    className="px-4 py-2 bg-[#F97316] hover:bg-[#ea6a0a] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center justify-center"
                    aria-label="Send message"
                  >
                    <Send size={16} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  For immediate assistance, call +234 (0)8037 065497
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
