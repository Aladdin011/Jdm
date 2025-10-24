import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  label: string;
  icon: ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function SidebarItem({
  label,
  icon,
  active,
  onClick,
  className,
}: SidebarItemProps) {
  return (
    <motion.button
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted",
        className,
      )}
    >
      <span className="h-5 w-5 flex items-center justify-center">{icon}</span>
      <span className="truncate">{label}</span>
    </motion.button>
  );
}
