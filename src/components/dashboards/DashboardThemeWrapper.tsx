import { ReactNode, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  getDepartmentTheme,
  getDepartmentDisplayName,
} from "@/utils/departmentThemes";
import {
  User,
  Building,
  MapPin,
  Calendar,
  Video,
  Activity,
  MessageSquare,
  Upload,
  LogOut,
  Settings,
  Phone,
  Mail,
  Clock,
  FileText,
  Users,
  Target,
} from "lucide-react";
import { useCall } from "@/contexts/CallContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface DashboardThemeWrapperProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function DashboardThemeWrapper({
  children,
  title,
  description,
}: DashboardThemeWrapperProps) {
  const { user } = useAuth();
  const { startCall, callState } = useCall();
  const theme = getDepartmentTheme(user?.department);
  const departmentName = getDepartmentDisplayName(user?.department);

  const handleStartCall = () => {
    if (user?.department) {
      startCall(user.department);
    }
  };

  const isInCall =
    callState.isActive && callState.department === user?.department;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.background} pt-20`}>
      <div className="container mx-auto px-4 py-8">
        {/* Department Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div
            className={`bg-gradient-to-r ${theme.gradient} rounded-xl p-6 text-white relative overflow-hidden`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <defs>
                  <pattern
                    id="grid"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 20 0 L 0 0 0 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Building className="h-6 w-6" />
                    </div>
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold">
                        {title || `${departmentName} Dashboard`}
                      </h1>
                      <p className="text-white/90 text-sm md:text-base">
                        {description ||
                          `Welcome back, ${user?.firstName}! Manage your ${departmentName.toLowerCase()} tasks and workflows.`}
                      </p>
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>
                        {user?.firstName} {user?.lastName}
                      </span>
                    </div>
                    {user?.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{user?.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date().toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Team Video Call Button */}
                <div className="hidden md:flex items-center gap-4">
                  <Button
                    onClick={handleStartCall}
                    disabled={isInCall}
                    className={`${theme.button.primary} text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg`}
                  >
                    <Video className="h-4 w-4" />
                    {isInCall ? "In Call" : "Start Team Call"}
                  </Button>
                </div>
              </div>

              {/* Mobile Video Call Button */}
              <div className="md:hidden mt-4">
                <Button
                  onClick={handleStartCall}
                  disabled={isInCall}
                  className={`${theme.button.primary} text-white px-4 py-2 rounded-lg transition-all duration-300 w-full flex items-center justify-center gap-2`}
                >
                  <Video className="h-4 w-4" />
                  {isInCall ? "In Call" : "Start Team Call"}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dashboard Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative"
          style={
            {
              "--theme-primary": theme.primary,
              "--theme-secondary": theme.secondary,
              "--theme-accent": theme.accent,
            } as React.CSSProperties
          }
        >
          {children}
        </motion.div>

        {/* Department Theme Styles */}
        <style jsx>{`
          .theme-card {
            @apply ${theme.card};
          }
          .theme-text-primary {
            color: ${theme.text.primary};
          }
          .theme-text-secondary {
            color: ${theme.text.secondary};
          }
          .theme-text-accent {
            color: ${theme.text.accent};
          }
          .theme-badge {
            @apply ${theme.badge.bg} ${theme.badge.text};
          }
          .theme-button-primary {
            @apply ${theme.button.primary};
          }
          .theme-button-secondary {
            @apply ${theme.button.secondary};
          }
          .theme-hover {
            @apply ${theme.button.hover};
          }
        `}</style>
      </div>
    </div>
  );
}
