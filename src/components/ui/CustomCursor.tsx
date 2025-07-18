import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CustomCursorProps {
  position: { x: number; y: number };
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ position }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorType, setCursorType] = useState<
    "default" | "text" | "link" | "button" | "image"
  >("default");

  useEffect(() => {
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    const handleElementHover = (e: Event) => {
      const target = e.target as HTMLElement;

      // Detect different cursor states
      if (
        target.tagName === "A" ||
        target.closest("a") ||
        target.classList.contains("cursor-link")
      ) {
        setCursorType("link");
        setIsHovering(true);
      } else if (
        target.tagName === "BUTTON" ||
        target.closest("button") ||
        target.classList.contains("cursor-button")
      ) {
        setCursorType("button");
        setIsHovering(true);
      } else if (
        target.tagName === "IMG" ||
        target.closest("img") ||
        target.classList.contains("cursor-image")
      ) {
        setCursorType("image");
        setIsHovering(true);
      } else if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.classList.contains("cursor-text")
      ) {
        setCursorType("text");
        setIsHovering(true);
      } else {
        setCursorType("default");
        setIsHovering(false);
      }
    };

    const handleElementLeave = () => {
      setCursorType("default");
      setIsHovering(false);
    };

    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Add hover listeners to all interactive elements
    const interactiveElements = document.querySelectorAll(
      "a, button, input, textarea, [data-cursor], .cursor-link, .cursor-button, .cursor-image, .cursor-text",
    );

    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", handleElementHover);
      el.addEventListener("mouseleave", handleElementLeave);
    });

    return () => {
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleElementHover);
        el.removeEventListener("mouseleave", handleElementLeave);
      });
    };
  }, []);

  const getCursorSize = () => {
    switch (cursorType) {
      case "link":
      case "button":
        return 40;
      case "text":
        return 20;
      case "image":
        return 60;
      default:
        return 30;
    }
  };

  const getCursorColor = () => {
    switch (cursorType) {
      case "link":
        return "bg-blue-500";
      case "button":
        return "bg-orange-500";
      case "text":
        return "bg-green-500";
      case "image":
        return "bg-purple-500";
      default:
        return "bg-slate-800";
    }
  };

  // Hide on mobile devices
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) return null;

  return (
    <>
      {/* Main cursor */}
      <motion.div
        className={`fixed top-0 left-0 pointer-events-none z-50 mix-blend-difference ${getCursorColor()}`}
        style={{
          width: getCursorSize(),
          height: getCursorSize(),
          borderRadius: "50%",
          transform: `translate(-50%, -50%)`,
          left: position.x,
          top: position.y,
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isVisible ? 0.8 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
      />

      {/* Cursor trail */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-40 bg-slate-400 rounded-full mix-blend-difference"
        style={{
          width: 8,
          height: 8,
          transform: `translate(-50%, -50%)`,
          left: position.x,
          top: position.y,
        }}
        animate={{
          opacity: isVisible ? 0.6 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          mass: 0.8,
        }}
      />

      {/* Cursor text indicator */}
      {cursorType !== "default" && isHovering && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-50 text-white text-xs font-medium px-2 py-1 bg-black rounded-md"
          style={{
            transform: `translate(-50%, -150%)`,
            left: position.x,
            top: position.y,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
        >
          {cursorType === "link" && "Click to navigate"}
          {cursorType === "button" && "Click to interact"}
          {cursorType === "text" && "Click to edit"}
          {cursorType === "image" && "Click to view"}
        </motion.div>
      )}
    </>
  );
};
