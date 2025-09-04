import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useCall } from "@/contexts/CallContext";
import ModernDashboardLayout from "./ModernDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  Shield,
  Settings,
  Activity,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Crown,
  Building,
  UserCheck,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Phone,
  Video,
  MessageSquare,
  FileText,
  Download,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Database,
  Lock,
  Globe,
  Server,
} from "lucide-react";

interface AdminTask {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
  assignee?: string;
  dueDate: string;
}

interface SystemMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: "good" | "warning" | "critical";
  lastUpdated: string;
}

interface DepartmentPerformance {
  department: string;
  kpi: number;
  employees: number;
  activeProjects: number;
  satisfaction: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { isInCall, startCall } = useCall();
  
  const [adminTasks] = useState<AdminTask[]>([
    {
      id: "1",
      title: "System Security Audit",
      description: "Quarterly security review and vulnerability assessment",
      priority: "high",
      status: "pending",
      assignee: "IT Team",
      dueDate: "2024-01-20",
    },
    {
      id: "2",
      title: "Employee Performance Reviews",
      description: "Complete Q4 performance evaluations for all departments",
      priority: "medium",
      status: "in-progress",
      assignee: "HR Department",
      dueDate: "2024-01-25",
    },
    {
      id: "3",
      title: "Budget Planning 2024",
      description: "Finalize department budgets for the upcoming fiscal year",
      priority: "high",
      status: "pending",
      assignee: "Finance Team",
      dueDate: "2024-01-30",
    },
    {
      id: "4",
      title: "System Backup Verification",
      description: "Verify integrity of all system backups",
      priority: "medium",
      status: "completed",
      assignee: "IT Team",
      dueDate: "2024-01-15",
    },
  ]);

  const [systemMetrics] = useState<SystemMetric[]>([
    {
      id: "1",
      name: "Server Uptime",
      value: 99.9,
      unit: "%",
      status: "good",
      lastUpdated: "2024-01-15 14:30",
    },
    {
      id: "2",
      name: "Database Performance",
      value: 85,
      unit: "%",
      status: "good",
      lastUpdated: "2024-01-15 14:28",
    },
    {
      id: "3",
      name: "Storage Usage",
      value: 78,
      unit: "%",
      status: "warning",
      lastUpdated: "2024-01-15 14:25",
    },
    {
      id: "4",
      name: "Active Users",
      value: 156,
      unit: "users",
      status: "good",
      lastUpdated: "2024-01-15 14:30",
    },
  ]);

  const [departmentPerformance] = useState<DepartmentPerformance[]>([
    {
      department: "Business Development",
      kpi: 94.5,
      employees: 12,
      activeProjects: 8,
      satisfaction: 4.8,
    },
    {
      department: "Project Management",
      kpi: 89.2,
      employees: 18,
      activeProjects: 15,
      satisfaction: 4.6,
    },
    {
      department: "Human Resources",
      kpi: 92.1,
      employees: 8,
      activeProjects: 3,
      satisfaction: 4.9,
    },
    {
      department: "Accounting",
      kpi: 96.8,
      employees: 6,
      activeProjects: 4,
      satisfaction: 4.7,
    },
    {
      department: "Digital Marketing",
      kpi: 87.3,
      employees: 10,
      activeProjects: 12,
      satisfaction: 4.5,
    },
  ]);

  const adminThemeColors = {
    primary: "#1e40af", // Rich blue
    secondary: "#f8fafc", // Pale gray
    accent: "#3b82f6",
    background: "#f1f5f9",
    headerBg: "#0f172a", // Dark blue for header
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-500 bg-red-50 text-red-700";
      case "medium":
        return "border-yellow-500 bg-yellow-50 text-yellow-700";
      case "low":
        return "border-green-500 bg-green-50 text-green-700";
      default:
        return "border-gray-500 bg-gray-50 text-gray-700";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSystemStatusColor = (status: string) => {
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

  const handleStartSystemMeeting = () => {
    startCall("admin-system-meeting", {
      title: "Admin System Review Meeting",
      participants: [],
    });
  };

  return (
    <ModernDashboardLayout
      user={user}
      department="Administration"
      themeColors={adminThemeColors}
    >
      <div className="space-y-6">
        {/* Admin Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Tasks */}
          <div className="lg:col-span-2">
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-gray-900">Administrative Tasks</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">System and organizational tasks requiring attention</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg border-l-4 ${getPriorityColor(task.priority)}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{task.title}</h4>
                            <Badge className={getStatusColor(task.status)}>
                              {task.status.replace("-", " ")}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            {task.assignee && (
                              <div className="flex items-center gap-1">
                                <UserCheck className="h-3 w-3" />
                                {task.assignee}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => alert(`Viewing task: ${task.title}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => alert(`Editing task: ${task.title}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Metrics */}
          <div>
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                  <Server className="h-5 w-5 text-blue-600" />
                  System Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {systemMetrics.map((metric) => (
                    <div key={metric.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">{metric.name}</h4>
                        <p className="text-xs text-gray-500">
                          Updated: {metric.lastUpdated}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`font-bold ${getSystemStatusColor(metric.status)}`}>
                          {metric.value}{metric.unit}
                        </p>
                        <div className={`w-2 h-2 rounded-full inline-block ${
                          metric.status === "good" ? "bg-green-500" :
                          metric.status === "warning" ? "bg-yellow-500" :
                          "bg-red-500"
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Department Performance Overview */}
        <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Department Performance Overview
            </CardTitle>
            <p className="text-sm text-gray-600">Real-time KPIs and metrics across all departments</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {departmentPerformance.map((dept) => (
                <motion.div
                  key={dept.department}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 text-sm">{dept.department}</h4>
                    <Building className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">KPI</span>
                        <span className="font-semibold text-blue-600">{dept.kpi}%</span>
                      </div>
                      <Progress value={dept.kpi} className="h-1 mt-1" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Staff</span>
                        <p className="font-semibold text-gray-900">{dept.employees}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Projects</span>
                        <p className="font-semibold text-gray-900">{dept.activeProjects}</p>
                      </div>
                    </div>
                    <div className="text-xs">
                      <span className="text-gray-500">Satisfaction</span>
                      <p className="font-semibold text-yellow-600">{dept.satisfaction}/5.0</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Admin Tools & Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">User Management</h3>
              <p className="text-sm text-gray-600 mb-4">Manage staff accounts and permissions</p>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => alert('User Management functionality would be implemented here')}
              >
                Manage Users
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-4">
                <Settings className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">System Settings</h3>
              <p className="text-sm text-gray-600 mb-4">Configure system parameters</p>
              <Button 
                variant="outline" 
                className="w-full border-green-600 text-green-600 hover:bg-green-50"
                onClick={() => alert('System Settings functionality would be implemented here')}
              >
                Settings
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Security Center</h3>
              <p className="text-sm text-gray-600 mb-4">Monitor security and access logs</p>
              <Button 
                variant="outline" 
                className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                onClick={() => alert('Security Center functionality would be implemented here')}
              >
                Security
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-orange-100 rounded-full w-fit mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
              <p className="text-sm text-gray-600 mb-4">View detailed system analytics</p>
              <Button 
                variant="outline" 
                className="w-full border-orange-600 text-orange-600 hover:bg-orange-50"
                onClick={() => alert('Analytics functionality would be implemented here')}
              >
                Analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action Section */}
        <Card className="border-0 bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2">System Administration Meeting</h3>
                <p className="text-blue-100 mb-4">
                  Schedule a meeting to discuss system updates, security reviews, and department coordination.
                </p>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={handleStartSystemMeeting}
                    disabled={isInCall}
                    className="bg-white text-blue-600 hover:bg-blue-50"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    {isInCall ? "In Meeting" : "Start Meeting"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-white text-white hover:bg-white/10"
                    onClick={() => alert('Send Announcement functionality would be implemented here')}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Announcement
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="p-4 bg-white/10 rounded-full">
                  <Crown className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ModernDashboardLayout>
  );
}
