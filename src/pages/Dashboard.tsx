import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  Calendar,
  TrendingUp,
  Bell,
  Settings,
  LogOut,
  Search,
  Plus,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  MapPin,
  Shield,
} from "lucide-react";

export default function Dashboard() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const stats = [
    {
      title: "Active Projects",
      value: "12",
      change: "+2.5%",
      trend: "up",
      icon: Building2,
      color: "#A7967E",
    },
    {
      title: "Team Members",
      value: "48",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "#142E54",
    },
    {
      title: "Completed This Month",
      value: "7",
      change: "+18%",
      trend: "up",
      icon: CheckCircle,
      color: "#C2CCC5",
    },
    {
      title: "Total Revenue",
      value: "₦2.4M",
      change: "+8.2%",
      trend: "up",
      icon: DollarSign,
      color: "#A7967E",
    },
  ];

  const recentProjects = [
    {
      id: 1,
      name: "Skyline Tower Complex",
      client: "Urban Development Corp",
      status: "In Progress",
      progress: 75,
      deadline: "Dec 2024",
      location: "Abuja",
      budget: "₦450M",
    },
    {
      id: 2,
      name: "Modern Shopping Center",
      client: "Retail Innovations Ltd",
      status: "Planning",
      progress: 25,
      deadline: "Mar 2025",
      location: "Lagos",
      budget: "₦320M",
    },
    {
      id: 3,
      name: "Residential Estate Phase 2",
      client: "Housing Solutions",
      status: "Completed",
      progress: 100,
      deadline: "Completed",
      location: "Port Harcourt",
      budget: "₦180M",
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Project milestone completed",
      project: "Skyline Tower Complex",
      time: "2 hours ago",
      type: "success",
    },
    {
      id: 2,
      action: "New team member added",
      project: "Modern Shopping Center",
      time: "4 hours ago",
      type: "info",
    },
    {
      id: 3,
      action: "Budget review required",
      project: "Residential Estate Phase 2",
      time: "1 day ago",
      type: "warning",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAE6DF] to-[#C2CCC5]">
      {/* Top Navigation */}
      <motion.nav
        className="bg-white shadow-lg border-b border-[#A7967E]/20"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <div className="flex items-center mr-2">
                <div className="text-2xl font-bold mr-1 text-[#4A90E2]">JD</div>
                <div className="text-xl font-bold text-[#142E54]">MARC</div>
              </div>
              <span className="ml-2 text-xl font-bold text-[#142E54]">
                CONSTRUCTIONS
              </span>
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#A7967E]" />
                <input
                  type="text"
                  placeholder="Search projects, team members..."
                  className="w-full pl-10 pr-4 py-2 border border-[#A7967E]/30 rounded-lg focus:outline-none focus:border-[#A7967E] focus:ring-1 focus:ring-[#A7967E]"
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <Button
                size="sm"
                className="text-white"
                style={{ backgroundColor: "#A7967E" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#C2CCC5";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#A7967E";
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                New Project
              </Button>

              {isAdmin && (
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-[#142E54] text-[#142E54] hover:bg-[#142E54] hover:text-white"
                >
                  <Link to="/admin">
                    <Shield className="h-4 w-4 mr-1" />
                    Admin Panel
                  </Link>
                </Button>
              )}

              <Button variant="ghost" size="sm" className="text-[#142E54]">
                <Bell className="h-4 w-4" />
              </Button>

              <Button variant="ghost" size="sm" className="text-[#142E54]">
                <Settings className="h-4 w-4" />
              </Button>

              {/* User Profile */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#A7967E] flex items-center justify-center text-white font-bold">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-[#142E54]">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-[#A7967E]">{user?.role}</p>
                    {isAdmin && <Shield className="h-3 w-3 text-[#142E54]" />}
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-[#142E54] hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-[#142E54] mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-[#A7967E]">
            Here's what's happening with your construction projects today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#A7967E] uppercase tracking-wide">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-[#142E54] mt-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                      <span className="text-sm text-green-600 font-medium">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div
                    className="p-3 rounded-full"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <stat.icon
                      className="h-6 w-6"
                      style={{ color: stat.color }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Projects */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-[#142E54]">
                      Recent Projects
                    </CardTitle>
                    <CardDescription>
                      Your latest construction projects
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#A7967E] hover:text-[#142E54]"
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="p-4 border border-[#A7967E]/20 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-[#142E54]">
                          {project.name}
                        </h4>
                        <p className="text-sm text-[#A7967E]">
                          {project.client}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`${
                          project.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : project.status === "In Progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {project.status}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#A7967E]">Progress</span>
                        <span className="font-medium text-[#142E54]">
                          {project.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${project.progress}%`,
                            backgroundColor:
                              project.status === "Completed"
                                ? "#10B981"
                                : "#A7967E",
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center text-sm text-[#A7967E]">
                          <MapPin className="h-3 w-3 mr-1" />
                          {project.location}
                        </div>
                        <div className="flex items-center text-sm text-[#A7967E]">
                          <Calendar className="h-3 w-3 mr-1" />
                          {project.deadline}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-[#142E54]">
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest updates from your projects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div
                      className={`p-2 rounded-full ${
                        activity.type === "success"
                          ? "bg-green-100"
                          : activity.type === "warning"
                            ? "bg-yellow-100"
                            : "bg-blue-100"
                      }`}
                    >
                      {activity.type === "success" && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      {activity.type === "warning" && (
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      )}
                      {activity.type === "info" && (
                        <Users className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#142E54]">
                        {activity.action}
                      </p>
                      <p className="text-sm text-[#A7967E]">
                        {activity.project}
                      </p>
                      <div className="flex items-center mt-1">
                        <Clock className="h-3 w-3 text-[#A7967E] mr-1" />
                        <span className="text-xs text-[#A7967E]">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#142E54]">Quick Actions</CardTitle>
              <CardDescription>
                Frequently used actions and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Plus, label: "New Project", color: "#A7967E" },
                  { icon: Users, label: "Add Team Member", color: "#142E54" },
                  {
                    icon: Calendar,
                    label: "Schedule Meeting",
                    color: "#C2CCC5",
                  },
                  {
                    icon: BarChart3,
                    label: "Generate Report",
                    color: "#A7967E",
                  },
                ].map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="h-20 flex flex-col items-center justify-center space-y-2 border border-[#A7967E]/20 hover:shadow-md transition-all"
                  >
                    <action.icon
                      className="h-6 w-6"
                      style={{ color: action.color }}
                    />
                    <span className="text-sm font-medium text-[#142E54]">
                      {action.label}
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
