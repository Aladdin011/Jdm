import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SidebarItem from "./SidebarItem";
import ThemeToggle from "./ThemeToggle";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BarChart3, LayoutDashboard, Shield, Settings, Users, MessageSquare, Bell, Power } from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const navigate = useNavigate();

  return (
    <>
      {/* Backdrop overlay for mobile */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 ${open ? "block" : "hidden"} sm:hidden`}
        aria-hidden={!open}
        onClick={onClose}
      />
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: open ? 0 : -300, opacity: open ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="fixed left-0 top-0 z-50 h-screen w-72 bg-background border-r shadow-sm flex flex-col"
        aria-hidden={!open}
      >
      <div className="px-3 py-4">
        <Button variant="ghost" className="w-full justify-start" onClick={onClose} aria-label="Close sidebar">Close</Button>
      </div>
      <div className="px-3 py-2 space-y-1">
        <SidebarItem label="Dashboard" icon={<LayoutDashboard className="h-5 w-5" />} onClick={() => navigate("/admin")} />
        <SidebarItem label="User Management" icon={<Users className="h-5 w-5" />} onClick={() => navigate("/users")} />
        <SidebarItem label="Manage Staff Accounts" icon={<Users className="h-5 w-5" />} onClick={() => navigate("/users?tab=staff")} />
        <SidebarItem label="Analytics" icon={<BarChart3 className="h-5 w-5" />} onClick={() => navigate("/analytics")} />
        <SidebarItem label="Security Center" icon={<Shield className="h-5 w-5" />} onClick={() => navigate("/security")} />
        <SidebarItem label="System Settings" icon={<Settings className="h-5 w-5" />} onClick={() => navigate("/settings")} />
      </div>
      <div className="mt-auto px-3 py-3 space-y-2">
        <Separator />
        <ThemeToggle />
        <SidebarItem label="Team Communication" icon={<MessageSquare className="h-5 w-5" />} onClick={() => navigate("/communications")} />
        <SidebarItem label="Notifications" icon={<Bell className="h-5 w-5" />} onClick={() => navigate("/notifications")} />
        <SidebarItem label="Sign out" icon={<Power className="h-5 w-5" />} onClick={() => navigate("/logout")} />
      </div>
      </motion.aside>
    </>
  );
}