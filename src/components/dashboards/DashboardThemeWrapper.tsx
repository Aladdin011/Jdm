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
  const { user, logout } = useAuth();
  const { startCall, callState } = useCall();
  const navigate = useNavigate();
  const theme = getDepartmentTheme(user?.department);
  const departmentName = getDepartmentDisplayName(user?.department);
  const [lastLogin, setLastLogin] = useState<string>("");
  const [activitySummary, setActivitySummary] = useState({
    tasks: 5,
    projects: 3,
    messages: 2,
    upcomingDeadlines: 1,
  });

  useEffect(() => {
    // Set last login time (mock data for demo)
    const loginTime =
      localStorage.getItem("jdmarc_last_login") || new Date().toISOString();
    setLastLogin(new Date(loginTime).toLocaleString());

    // Save current login time
    localStorage.setItem("jdmarc_last_login", new Date().toISOString());
  }, []);

  const handleStartCall = () => {
    if (user?.department) {
      startCall(user.department);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleUploadDocument = () => {
    // Implement document upload
    alert("Document upload functionality would be implemented here");
  };

  const handleContactAdmin = () => {
    // Implement admin contact
    alert("Contact admin functionality would be implemented here");
  };

  const handleSettings = () => {
    // Implement settings
    alert("Settings functionality would be implemented here");
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

        {/* Core Dashboard Elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8"
        >
          {/* 👤 Profile Overview */}
          <Card className="theme-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className={`h-5 w-5 ${theme.badge.text}`} />
                👤 Profile Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold theme-text-primary">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-800">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <Badge className={`${theme.badge.bg} ${theme.badge.text}`}>
                  {departmentName}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Login</p>
                <p className="text-sm text-gray-700 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {lastLogin}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 📈 Activity Summary */}
          <Card className="theme-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className={`h-5 w-5 ${theme.badge.text}`} />
                📈 Activity Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Tasks</span>
                <Badge variant="secondary">{activitySummary.tasks}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Projects Assigned</span>
                <Badge variant="secondary">{activitySummary.projects}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Unread Messages</span>
                <Badge variant="secondary">{activitySummary.messages}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Due This Week</span>
                <Badge className="bg-yellow-100 text-yellow-800">
                  {activitySummary.upcomingDeadlines}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* 📞 Quick Links */}
          <Card className="theme-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className={`h-5 w-5 ${theme.badge.text}`} />
                📞 Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                onClick={handleStartCall}
                disabled={isInCall}
                className={`w-full justify-start ${theme.button.secondary}`}
                size="sm"
              >
                <Video className="h-4 w-4 mr-2" />
                {isInCall ? "In Call" : "Join Department Meeting"}
              </Button>
              <Button
                onClick={handleUploadDocument}
                className={`w-full justify-start ${theme.button.secondary}`}
                size="sm"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
              <Button
                onClick={handleContactAdmin}
                className={`w-full justify-start ${theme.button.secondary}`}
                size="sm"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact Admin
              </Button>
            </CardContent>
          </Card>

          {/* 🚪 Security & Settings */}
          <Card className="theme-card">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className={`h-5 w-5 ${theme.badge.text}`} />
                ⚙️ Account Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                onClick={handleSettings}
                className={`w-full justify-start ${theme.button.secondary}`}
                size="sm"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings & Preferences
              </Button>
              <Button
                onClick={() => navigate("/dashboard")}
                className={`w-full justify-start ${theme.button.secondary}`}
                size="sm"
              >
                <Activity className="h-4 w-4 mr-2" />
                View Full Dashboard
              </Button>
              <Separator className="my-2" />
              <Button
                onClick={handleLogout}
                className="w-full justify-start bg-red-500 hover:bg-red-600 text-white border-0"
                size="sm"
              >
                <LogOut className="h-4 w-4 mr-2" />
                🚪 Secure Logout
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Dashboard Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
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
