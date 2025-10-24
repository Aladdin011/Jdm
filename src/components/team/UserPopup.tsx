import React, { useEffect, useRef, useState } from "react";
import { motion, useDragControls } from "framer-motion";
import { Phone, MessageSquare, X } from "lucide-react";
import type { RegisteredUser } from "./UserList";

interface UserPopupProps {
  user: RegisteredUser;
  anchorRect: DOMRect;
  onCall: () => void;
  onChat: () => void;
  onClose: () => void;
}

const UserPopup: React.FC<UserPopupProps> = ({
  user,
  anchorRect,
  onCall,
  onChat,
  onClose,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    // Position near anchor, adjust for viewport
    const margin = 8;
    const width = 280;
    const height = 160;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let x = anchorRect.left + margin;
    let y = anchorRect.bottom + margin;

    if (x + width > viewportWidth) {
      x = viewportWidth - width - margin;
    }
    if (y + height > viewportHeight) {
      y = anchorRect.top - height - margin;
    }
    setPosition({ x, y });
  }, [anchorRect]);

  return (
    <motion.div
      ref={popupRef}
      className="fixed z-50 w-[280px] rounded-lg shadow-xl border bg-popover text-popover-foreground"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      style={{ left: position.x, top: position.y }}
      drag
      dragControls={dragControls}
      dragMomentum={false}
    >
      <div className="p-3 border-b flex items-center justify-between">
        <div>
          <p className="font-semibold text-[#142E54]">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-muted-foreground">
            {user.role} • {user.department || "—"}
          </p>
        </div>
        <button
          className="p-1 rounded hover:bg-muted"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="p-3 flex items-center justify-between gap-2">
        <button
          className="flex-1 px-3 py-2 rounded-md bg-[#142E54] text-white hover:bg-[#142E54]/90 flex items-center justify-center gap-2"
          onClick={onCall}
        >
          <Phone className="h-4 w-4" />
          Call
        </button>
        <button
          className="flex-1 px-3 py-2 rounded-md bg-[#A7967E] text-white hover:bg-[#A7967E]/90 flex items-center justify-center gap-2"
          onClick={onChat}
        >
          <MessageSquare className="h-4 w-4" />
          Chat
        </button>
      </div>
    </motion.div>
  );
};

export default UserPopup;
