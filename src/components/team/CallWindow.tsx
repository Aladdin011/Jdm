import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { PhoneOff } from "lucide-react";
import type { RegisteredUser } from "./UserList";

interface CallWindowProps {
  user: RegisteredUser;
  anchorRect: DOMRect;
  onClose: () => void;
}

const CallWindow: React.FC<CallWindowProps> = ({
  user,
  anchorRect,
  onClose,
}) => {
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const margin = 8;
    const width = 320;
    const height = 220;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let x = anchorRect.right + margin;
    let y = anchorRect.top;

    if (x + width > viewportWidth) {
      x = anchorRect.left - width - margin;
    }
    if (y + height > viewportHeight) {
      y = viewportHeight - height - margin;
    }

    setPosition({ x, y });
  }, [anchorRect]);

  return (
    <motion.div
      className="fixed z-50 w-[320px] rounded-lg shadow-xl border bg-popover text-popover-foreground"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      style={{ left: position.x, top: position.y }}
    >
      <div className="p-3 border-b">
        <p className="font-semibold text-[#142E54]">
          Calling {user.firstName} {user.lastName}
        </p>
        <p className="text-xs text-muted-foreground">
          {user.department || "—"}
        </p>
      </div>
      <div className="p-3 space-y-2">
        <div className="h-36 rounded bg-muted flex items-center justify-center text-sm text-muted-foreground">
          Call interface placeholder
        </div>
        <button
          className="w-full px-3 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 flex items-center justify-center gap-2"
          onClick={onClose}
        >
          <PhoneOff className="h-4 w-4" />
          End Call
        </button>
      </div>
    </motion.div>
  );
};

export default CallWindow;
