import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Shield,
  Activity,
  Settings,
  Search,
  UserPlus,
  FileText,
  Calendar,
  Bell,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  activeProjects: number;
  pendingApprovals: number;
  systemAlerts: number;
}

export default function SecretariatDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 42,
    activeProjects: 8,
    pendingApprovals: 5,
    systemAlerts: 2,
  });

  const [recentActivities] = useState([
    {
      id: 1,
      user: "John Doe",
      action: "Registered new account",
      time: "5 minutes ago",
      type: "user",
    },
    {
      id: 2,
      user: "Jane Smith",
      action: "Updated project status",
      time: "1 hour ago",
      type: "project",
    },
    {
      id: 3,
      user: "Mike Johnson",
      action: "Submitted expense report",
      time: "2 hours ago",
      type: "finance",
    },
    {
      id: 4,
      user: "Sarah Williams",
      action: "Completed project milestone",
      time: "3 hours ago",
      type: "project",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#142E54] to-[#F97316] rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Secretariat & Admin Panel
            </h1>
            <p className="text-blue-100">
              Manage users, departments, and system administration
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
            <Shield className="h-12 w-12 text-white/80" />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalUsers}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Active Projects
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.activeProjects}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Pending Approvals
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.pendingApprovals}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  System Alerts
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.systemAlerts}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Management */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#F97316]" />
                User Management
              </CardTitle>
              <CardDescription>
                Assign departments and manage user roles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <Input
                    placeholder="Search users..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button className="bg-[#F97316] hover:bg-[#F97316]/90">
                  <UserPlus size={16} className="mr-2" />
                  Add User
                </Button>
              </div>

              {/* Quick Department Assignment */}
              <div className="space-y-3 border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900">
                  Quick Department Assignment
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select User" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john">John Doe</SelectItem>
                      <SelectItem value="jane">Jane Smith</SelectItem>
                      <SelectItem value="mike">Mike Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Assign Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business-dev">
                        Business Development
                      </SelectItem>
                      <SelectItem value="project-mgmt">
                        Project Management
                      </SelectItem>
                      <SelectItem value="accounting">Accounting</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" variant="outline">
                  Assign Department
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* System Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-[#F97316]" />
                System Activity
              </CardTitle>
              <CardDescription>
                Recent activity logs and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg"
                  >
                    <div
                      className={`p-2 rounded-full ${
                        activity.type === "user"
                          ? "bg-blue-100"
                          : activity.type === "project"
                            ? "bg-green-100"
                            : "bg-yellow-100"
                      }`}
                    >
                      {activity.type === "user" ? (
                        <Users size={16} className="text-blue-600" />
                      ) : activity.type === "project" ? (
                        <CheckCircle size={16} className="text-green-600" />
                      ) : (
                        <FileText size={16} className="text-yellow-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.user}
                      </p>
                      <p className="text-xs text-gray-600">{activity.action}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Admin Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-[#F97316]" />
              Administrative Actions
            </CardTitle>
            <CardDescription>
              System management and configuration tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                className="h-20 flex flex-col items-center justify-center space-y-2"
                variant="outline"
              >
                <Bell className="h-6 w-6" />
                <span>Send Notifications</span>
              </Button>
              <Button
                className="h-20 flex flex-col items-center justify-center space-y-2"
                variant="outline"
              >
                <Calendar className="h-6 w-6" />
                <span>Schedule Meetings</span>
              </Button>
              <Button
                className="h-20 flex flex-col items-center justify-center space-y-2"
                variant="outline"
              >
                <FileText className="h-6 w-6" />
                <span>Generate Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
