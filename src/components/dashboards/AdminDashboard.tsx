import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  Users,
  Shield,
  UserPlus,
  Edit,
  Trash2,
  Search,
  Settings,
  Activity,
  Crown,
  UserMinus,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Building,
  Briefcase,
  UserCheck,
  DollarSign,
  Heart,
  Megaphone,
  Eye,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  LineChart,
  Video,
  MessageSquare,
  Bell,
  Plus,
  Filter,
  Download,
  Upload,
  Key,
  RefreshCw,
  MoreVertical,
  Lock,
  Unlock,
  Database,
  Server,
  Wifi,
  HardDrive,
  Cpu,
  Monitor,
  FileText,
  Folder,
  Archive,
  Globe,
  Key,
} from "lucide-react";
import DashboardThemeWrapper from "./DashboardThemeWrapper";
import { getDepartmentTheme } from "@/utils/departmentThemes";
import { useCall } from "@/contexts/CallContext";
import UniqueKeyManager from "@/components/admin/UniqueKeyManager";
import { useAuth } from "@/contexts/AuthContext";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin" | "staff";
  department: string;
  company: string;
  phone: string;
  location: string;
  createdAt: string;
  lastActive: string;
  status: "active" | "inactive" | "suspended";
  onboardingStatus: "completed" | "in-progress" | "pending";
  loginCount: number;
  avatar?: string;
}

interface AccessLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  ipAddress: string;
  timestamp: string;
  status: "success" | "failed" | "blocked";
  location: string;
  device: string;
}

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: "good" | "warning" | "critical";
  trend: "up" | "down" | "stable";
}

interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  details: string;
  timestamp: string;
  severity: "low" | "medium" | "high" | "critical";
}

export default function AdminDashboard() {
  const theme = getDepartmentTheme("secretariat-admin");
  const { startCall, callState } = useCall();
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Sample data
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      email: "jude.onwudebe@jdmarcng.com",
      firstName: "Jude",
      lastName: "Onwudebe",
      role: "admin",
      department: "Managing Director",
      company: "JD Marc Limited",
      phone: "+234 803 706 5497",
      location: "Abuja, Nigeria",
      createdAt: "2023-01-15T10:00:00Z",
      lastActive: "2024-01-20T14:30:00Z",
      status: "active",
      onboardingStatus: "completed",
      loginCount: 247,
    },
    {
      id: "2",
      email: "sarah.admin@jdmarcng.com",
      firstName: "Sarah",
      lastName: "Okafor",
      role: "staff",
      department: "Secretariat/Admin",
      company: "JD Marc Limited",
      phone: "+234 803 000 0003",
      location: "Abuja, Nigeria",
      createdAt: "2023-04-05T08:45:00Z",
      lastActive: "2024-01-20T12:10:00Z",
      status: "active",
      onboardingStatus: "completed",
      loginCount: 156,
    },
    {
      id: "3",
      email: "michael.business@jdmarcng.com",
      firstName: "Michael",
      lastName: "Adebayo",
      role: "staff",
      department: "Business Development",
      company: "JD Marc Limited",
      phone: "+234 803 000 0004",
      location: "Lagos, Nigeria",
      createdAt: "2023-03-01T12:00:00Z",
      lastActive: "2024-01-19T15:30:00Z",
      status: "active",
      onboardingStatus: "in-progress",
      loginCount: 89,
    },
    {
      id: "4",
      email: "grace.account@jdmarcng.com",
      firstName: "Grace",
      lastName: "Nwosu",
      role: "staff",
      department: "Accounting",
      company: "JD Marc Limited",
      phone: "+234 803 000 0005",
      location: "Abuja, Nigeria",
      createdAt: "2023-05-15T09:00:00Z",
      lastActive: "2024-01-18T11:20:00Z",
      status: "active",
      onboardingStatus: "completed",
      loginCount: 134,
    },
    {
      id: "5",
      email: "david.hr@jdmarcng.com",
      firstName: "David",
      lastName: "Emeka",
      role: "staff",
      department: "Human Resources",
      company: "JD Marc Limited",
      phone: "+234 803 000 0006",
      location: "Abuja, Nigeria",
      createdAt: "2023-06-10T14:30:00Z",
      lastActive: "2024-01-17T09:45:00Z",
      status: "active",
      onboardingStatus: "completed",
      loginCount: 98,
    },
    {
      id: "6",
      email: "joy.marketing@jdmarcng.com",
      firstName: "Joy",
      lastName: "Okoro",
      role: "staff",
      department: "Digital Marketing",
      company: "JD Marc Limited",
      phone: "+234 803 000 0007",
      location: "Lagos, Nigeria",
      createdAt: "2023-07-20T16:15:00Z",
      lastActive: "2024-01-16T13:30:00Z",
      status: "suspended",
      onboardingStatus: "pending",
      loginCount: 45,
    },
  ]);

  const accessLogs: AccessLog[] = [
    {
      id: "1",
      userId: "1",
      userName: "Jude Onwudebe",
      action: "Login",
      ipAddress: "197.210.85.45",
      timestamp: "2024-01-20T14:30:00Z",
      status: "success",
      location: "Abuja, Nigeria",
      device: "Chrome on Windows",
    },
    {
      id: "2",
      userId: "2",
      userName: "Sarah Okafor",
      action: "Dashboard Access",
      ipAddress: "197.210.85.46",
      timestamp: "2024-01-20T12:10:00Z",
      status: "success",
      location: "Abuja, Nigeria",
      device: "Firefox on MacOS",
    },
    {
      id: "3",
      userId: "6",
      userName: "Joy Okoro",
      action: "Failed Login",
      ipAddress: "105.112.45.23",
      timestamp: "2024-01-20T10:15:00Z",
      status: "failed",
      location: "Lagos, Nigeria",
      device: "Chrome on Android",
    },
    {
      id: "4",
      userId: "3",
      userName: "Michael Adebayo",
      action: "File Download",
      ipAddress: "105.112.45.67",
      timestamp: "2024-01-19T15:30:00Z",
      status: "success",
      location: "Lagos, Nigeria",
      device: "Safari on iPhone",
    },
  ];

  const auditLogs: AuditLog[] = [
    {
      id: "1",
      userId: "1",
      userName: "Jude Onwudebe",
      action: "User Role Updated",
      resource: "User Management",
      details: "Changed Grace Nwosu role from User to Staff",
      timestamp: "2024-01-20T13:45:00Z",
      severity: "medium",
    },
    {
      id: "2",
      userId: "2",
      userName: "Sarah Okafor",
      action: "System Settings Modified",
      resource: "System Configuration",
      details: "Updated backup schedule to daily",
      timestamp: "2024-01-20T11:20:00Z",
      severity: "high",
    },
    {
      id: "3",
      userId: "1",
      userName: "Jude Onwudebe",
      action: "User Account Suspended",
      resource: "User Management",
      details: "Suspended Joy Okoro account due to policy violation",
      timestamp: "2024-01-19T16:30:00Z",
      severity: "critical",
    },
  ];

  const systemMetrics: SystemMetric[] = [
    {
      name: "CPU Usage",
      value: 67,
      unit: "%",
      status: "warning",
      trend: "up",
    },
    {
      name: "Memory Usage",
      value: 45,
      unit: "%",
      status: "good",
      trend: "stable",
    },
    {
      name: "Disk Usage",
      value: 78,
      unit: "%",
      status: "warning",
      trend: "up",
    },
    {
      name: "Network Load",
      value: 23,
      unit: "Mbps",
      status: "good",
      trend: "down",
    },
  ];

  const departments = [
    "Secretariat/Admin",
    "Business Development",
    "Project Management",
    "Accounting",
    "Human Resources",
    "Digital Marketing",
    "Managing Director",
  ];

  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case "Secretariat/Admin":
        return <Settings className="h-4 w-4" />;
      case "Business Development":
        return <Briefcase className="h-4 w-4" />;
      case "Project Management":
        return <Building className="h-4 w-4" />;
      case "Accounting":
        return <DollarSign className="h-4 w-4" />;
      case "Human Resources":
        return <Heart className="h-4 w-4" />;
      case "Digital Marketing":
        return <Megaphone className="h-4 w-4" />;
      case "Managing Director":
        return <Crown className="h-4 w-4" />;
      default:
        return <UserCheck className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "suspended":
        return "bg-red-100 text-red-800 border-red-200";
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "blocked":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "critical":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              status:
                user.status === "active"
                  ? "suspended"
                  : user.status === "suspended"
                    ? "active"
                    : "active",
            }
          : user,
      ),
    );
  };

  const handleUpdateRole = (
    userId: string,
    newRole: "user" | "admin" | "staff",
  ) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user,
      ),
    );
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole === "all" || user.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      change: "+12%",
      trend: "up",
    },
    {
      title: "Active Sessions",
      value: users.filter((u) => u.status === "active").length,
      icon: Activity,
      change: "+5%",
      trend: "up",
    },
    {
      title: "System Health",
      value: 97,
      unit: "%",
      icon: Shield,
      change: "+2%",
      trend: "up",
    },
    {
      title: "Failed Logins",
      value: accessLogs.filter((log) => log.status === "failed").length,
      icon: AlertTriangle,
      change: "-15%",
      trend: "down",
    },
  ];

  return (
    <DashboardThemeWrapper
      title="System Administration Dashboard"
      description="Comprehensive user management, system monitoring, and security oversight for JD Marc Limited."
    >
      <div className="space-y-6">
        {/* Top Controls */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-500" />
              <Select
                value={selectedTimeRange}
                onValueChange={setSelectedTimeRange}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">1D</SelectItem>
                  <SelectItem value="7d">7D</SelectItem>
                  <SelectItem value="30d">30D</SelectItem>
                  <SelectItem value="90d">90D</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => startCall("secretariat-admin")}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
            >
              <Video className="h-4 w-4 mr-2" />
              Admin Call
            </Button>
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                      {stat.value}
                      {stat.unit && (
                        <span className="text-lg text-gray-500 ml-1">
                          {stat.unit}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="mt-2 flex items-center">
                  <TrendingUp
                    className={`h-4 w-4 mr-1 ${
                      stat.trend === "up"
                        ? "text-green-500"
                        : stat.trend === "down"
                          ? "text-red-500 rotate-180"
                          : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      stat.trend === "up"
                        ? "text-green-600"
                        : stat.trend === "down"
                          ? "text-red-600"
                          : "text-gray-600"
                    }`}
                  >
                    {stat.change} vs last period
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Dashboard Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-6 lg:w-fit lg:grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="keys" className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              Keys
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Logs
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              System
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* System Health */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className={`h-5 w-5 ${theme.badge.text}`} />
                      System Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {systemMetrics.map((metric, index) => (
                        <div
                          key={index}
                          className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                              {metric.name}
                            </span>
                            <TrendingUp
                              className={`h-4 w-4 ${
                                metric.trend === "up"
                                  ? "text-red-500"
                                  : metric.trend === "down"
                                    ? "text-green-500 rotate-180"
                                    : "text-gray-500"
                              }`}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-2xl font-bold ${getMetricStatusColor(
                                metric.status,
                              )}`}
                            >
                              {metric.value}
                            </span>
                            <span className="text-sm text-gray-500">
                              {metric.unit}
                            </span>
                          </div>
                          <Progress
                            value={metric.value}
                            className={`h-2 mt-2 ${
                              metric.status === "critical"
                                ? "[&>div]:bg-red-500"
                                : metric.status === "warning"
                                  ? "[&>div]:bg-yellow-500"
                                  : "[&>div]:bg-green-500"
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className={`h-5 w-5 ${theme.badge.text}`} />
                      Recent User Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {accessLogs.slice(0, 5).map((log, index) => (
                        <div
                          key={log.id}
                          className="flex items-center justify-between p-3 border border-gray-200 dark:border-slate-600 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                log.status === "success"
                                  ? "bg-green-500"
                                  : log.status === "failed"
                                    ? "bg-red-500"
                                    : "bg-yellow-500"
                              }`}
                            />
                            <div>
                              <p className="font-medium text-slate-800 dark:text-slate-200">
                                {log.userName}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {log.action} • {log.device}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(log.status)}>
                              {log.status}
                            </Badge>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(log.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className={`h-5 w-5 ${theme.badge.text}`} />
                      System Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                              High CPU Usage
                            </p>
                            <p className="text-xs text-yellow-600 dark:text-yellow-300">
                              Server load at 67% - consider optimization
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-red-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-red-800 dark:text-red-200">
                              Failed Login Attempts
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-300">
                              Multiple failed attempts from 105.112.45.23
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-green-800 dark:text-green-200">
                              Backup Completed
                            </p>
                            <p className="text-xs text-green-600 dark:text-green-300">
                              Daily backup successful at 02:00 AM
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className={`h-5 w-5 ${theme.badge.text}`} />
                      Onboarding Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {["completed", "in-progress", "pending"].map((status) => {
                        const count = users.filter(
                          (u) => u.onboardingStatus === status,
                        ).length;
                        const percentage = (count / users.length) * 100;
                        return (
                          <div key={status} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium capitalize">
                                {status.replace("-", " ")}
                              </span>
                              <span className="text-sm text-gray-600">
                                {count} users
                              </span>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                User Management
              </h3>
              <Button
                onClick={handleCreateUser}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Create User
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {filteredUsers.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="p-6 border border-gray-200 dark:border-slate-600 rounded-xl space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                            {user.firstName[0]}
                            {user.lastName[0]}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                              {user.firstName} {user.lastName}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : user.role === "staff"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                            }
                          >
                            {user.role === "admin" && (
                              <Crown className="h-3 w-3 mr-1" />
                            )}
                            {user.role.toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          {getDepartmentIcon(user.department)}
                          <span>{user.department}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{user.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{user.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          <span>{user.loginCount} logins</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-600">
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>
                            Joined:{" "}
                            {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                          <span>
                            Last Active:{" "}
                            {new Date(user.lastActive).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-2" />
                                Manage
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleToggleUserStatus(user.id)}
                              >
                                {user.status === "active" ? (
                                  <Lock className="h-4 w-4 mr-2" />
                                ) : (
                                  <Unlock className="h-4 w-4 mr-2" />
                                )}
                                {user.status === "active"
                                  ? "Suspend"
                                  : "Activate"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateRole(user.id, "admin")
                                }
                                disabled={user.role === "admin"}
                              >
                                <Crown className="h-4 w-4 mr-2" />
                                Make Admin
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateRole(user.id, "staff")
                                }
                                disabled={user.role === "staff"}
                              >
                                <Users className="h-4 w-4 mr-2" />
                                Make Staff
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Login Patterns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Login Analytics Chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Department Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-center">
                      <PieChart className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">
                        Department Analytics Chart
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Access Logs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Access Logs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {accessLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 border border-gray-200 dark:border-slate-600 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {log.userName}
                          </span>
                          <Badge className={getStatusColor(log.status)}>
                            {log.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {log.action} • {log.ipAddress}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Audit Logs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Audit Trail
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {auditLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 border border-gray-200 dark:border-slate-600 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {log.action}
                          </span>
                          <Badge
                            className={
                              log.severity === "critical"
                                ? "bg-red-100 text-red-800"
                                : log.severity === "high"
                                  ? "bg-orange-100 text-orange-800"
                                  : log.severity === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-800"
                            }
                          >
                            {log.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {log.details}
                        </p>
                        <p className="text-xs text-gray-500">
                          {log.userName} •{" "}
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {systemMetrics.map((metric, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Cpu className="h-5 w-5" />
                      {metric.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold">
                          {metric.value}
                        </span>
                        <span className="text-lg text-gray-500">
                          {metric.unit}
                        </span>
                      </div>
                      <Progress
                        value={metric.value}
                        className={`h-3 ${
                          metric.status === "critical"
                            ? "[&>div]:bg-red-500"
                            : metric.status === "warning"
                              ? "[&>div]:bg-yellow-500"
                              : "[&>div]:bg-green-500"
                        }`}
                      />
                      <div className="flex items-center justify-between text-sm">
                        <span
                          className={`font-medium ${getMetricStatusColor(metric.status)}`}
                        >
                          {metric.status.toUpperCase()}
                        </span>
                        <div className="flex items-center gap-1">
                          <TrendingUp
                            className={`h-4 w-4 ${
                              metric.trend === "up"
                                ? "text-red-500"
                                : metric.trend === "down"
                                  ? "text-green-500 rotate-180"
                                  : "text-gray-500"
                            }`}
                          />
                          <span className="text-gray-500">{metric.trend}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Admin Communication Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className={`h-5 w-5 ${theme.badge.text}`} />
                Admin Communication Hub
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-gray-600 dark:text-gray-400">
                  Connect with system administrators and department heads
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => startCall("secretariat-admin")}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Voice Call
                  </Button>
                  <Button
                    onClick={() => startCall("secretariat-admin")}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Video Call
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Admin Chat
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardThemeWrapper>
  );
}
