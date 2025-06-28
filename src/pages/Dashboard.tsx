import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  FolderOpen as Project,
  Clock,
  CheckCircle,
  AlertCircle,
  Upload,
  MessageSquare,
  BarChart3,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Building,
  Settings,
  FileText,
  TrendingUp,
  Users,
} from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import { projectAPI, activityAPI } from "@/services/api";
import useAnalytics from "@/hooks/useAnalytics";

// Import department-specific dashboards
import SecretariatDashboard from "@/components/dashboards/SecretariatDashboard";
import BusinessDevelopmentDashboard from "@/components/dashboards/BusinessDevelopmentDashboard";
import ProjectDashboard from "@/components/dashboards/ProjectDashboard";
import AccountsDashboard from "@/components/dashboards/AccountsDashboard";
import HRDashboard from "@/components/dashboards/HRDashboard";

interface ProjectItem {
  id: string;
  name: string;
  status: "Planning" | "In Progress" | "Review" | "Completed" | "On Hold";
  progress: number;
  dueDate: string;
  location: string;
  priority: "Low" | "Medium" | "High";
  description: string;
}

interface ActivityItem {
  id: string;
  type: "project_update" | "document_upload" | "meeting" | "deadline";
  message: string;
  timestamp: string;
  projectId?: string;
}

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const { trackBusinessEvent } = useAnalytics();
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    upcomingDeadlines: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Determine which dashboard to show based on user's department
  const getDashboardComponent = () => {
    if (!user) return null;

    // Admin users get secretariat dashboard
    if (isAdmin || user.department === "secretariat-admin") {
      return <SecretariatDashboard />;
    }

    // Route based on department
    switch (user.department) {
      case "business-development":
        return <BusinessDevelopmentDashboard />;
      case "project-management":
        return <ProjectDashboard />;
      case "accounting":
        return <AccountsDashboard />;
      case "human-resources":
        return <HRDashboard />;
      default:
        // General dashboard for users without specific department assignment
        return null;
    }
  };

  // Check if user should see department-specific dashboard
  const showDepartmentDashboard = getDashboardComponent() !== null;

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Check if we're in development mode (no backend available)
      const isDevelopment =
        window.location.hostname === "localhost" ||
        window.location.hostname.includes("builder-project") ||
        window.location.hostname.includes(".fly.dev");

      if (isDevelopment) {
        // Use mock data for development
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate loading

        const mockProjects: ProjectItem[] = [
          {
            id: "1",
            name: "330KVA Power Upgrade",
            status: "In Progress",
            progress: 75,
            dueDate: "2024-03-15",
            location: "Onitsha, Anambra",
            priority: "High",
            description:
              "Critical power infrastructure upgrade for industrial complex",
          },
          {
            id: "2",
            name: "Port Harcourt Airport Hotel Renovation",
            status: "Review",
            progress: 90,
            dueDate: "2024-02-28",
            location: "Port Harcourt, Rivers",
            priority: "Medium",
            description:
              "Complete renovation of airport hospitality facilities",
          },
          {
            id: "3",
            name: "Lagos Smart City Pilot Project",
            status: "Planning",
            progress: 25,
            dueDate: "2024-06-30",
            location: "Lagos, Nigeria",
            priority: "High",
            description:
              "IoT infrastructure and smart city technology implementation",
          },
          {
            id: "4",
            name: "Cross River Ecotourism Center",
            status: "Completed",
            progress: 100,
            dueDate: "2024-01-15",
            location: "Calabar, Cross River",
            priority: "Low",
            description:
              "Sustainable tourism facility with renewable energy systems",
          },
        ];

        const mockActivities: ActivityItem[] = [
          {
            id: "1",
            type: "project_update",
            message:
              "330KVA Power Upgrade: Phase 2 electrical installation completed",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            projectId: "1",
          },
          {
            id: "2",
            type: "document_upload",
            message: "Hotel Renovation: Final inspection report uploaded",
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            projectId: "2",
          },
          {
            id: "3",
            type: "meeting",
            message:
              "Smart City Project: Stakeholder meeting scheduled for next week",
            timestamp: new Date(
              Date.now() - 1 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            projectId: "3",
          },
          {
            id: "4",
            type: "deadline",
            message:
              "Ecotourism Center: Project successfully completed ahead of schedule",
            timestamp: new Date(
              Date.now() - 3 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            projectId: "4",
          },
          {
            id: "5",
            type: "project_update",
            message:
              "New project assignment: Rigid Pavement Road Construction approved",
            timestamp: new Date(
              Date.now() - 7 * 24 * 60 * 60 * 1000,
            ).toISOString(),
          },
        ];

        setProjects(mockProjects);
        setActivities(mockActivities);
        calculateStats(mockProjects);
      } else {
        // Production mode - use real API
        const projectsResponse = await projectAPI.getUserProjects();
        if (projectsResponse.success) {
          setProjects(projectsResponse.data || []);
          calculateStats(projectsResponse.data || []);
        }

        const activitiesResponse = await activityAPI.getUserActivity();
        if (activitiesResponse.success) {
          setActivities(activitiesResponse.data || []);
        }
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      // Fallback to empty arrays if there's an error
      setProjects([]);
      setActivities([]);
      calculateStats([]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (projectList: ProjectItem[]) => {
    const stats = {
      totalProjects: projectList.length,
      activeProjects: projectList.filter((p) => p.status === "In Progress")
        .length,
      completedProjects: projectList.filter((p) => p.status === "Completed")
        .length,
      upcomingDeadlines: projectList.filter((p) => {
        const dueDate = new Date(p.dueDate);
        const now = new Date();
        const diffTime = dueDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7 && diffDays > 0;
      }).length,
    };
    setStats(stats);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-green-600 bg-green-100";
      case "In Progress":
        return "text-blue-600 bg-blue-100";
      case "Review":
        return "text-yellow-600 bg-yellow-100";
      case "On Hold":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600";
      case "Medium":
        return "text-yellow-600";
      default:
        return "text-green-600";
    }
  };

  const handleUploadDocument = () => {
    trackBusinessEvent.downloadContent("dashboard", "upload_initiated");
    // Implement file upload logic
    alert("File upload functionality would be implemented here");
  };

  const handleContactAdmin = () => {
    trackBusinessEvent.contactForm("dashboard");
    // Implement contact admin logic
    alert("Contact admin functionality would be implemented here");
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F97316] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Show department-specific dashboard if user has department assigned */}
          {showDepartmentDashboard ? (
            getDashboardComponent()
          ) : (
            // General dashboard for users without department assignment
            <>
              {/* Welcome Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <div className="bg-gradient-to-r from-[#142E54] to-[#F97316] rounded-xl p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">
                        Welcome back, {user?.firstName}! 👋
                      </h1>
                      <p className="text-blue-100">
                        Here's what's happening with your projects today
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
                        <User className="h-12 w-12 text-white/80" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Core Dashboard Elements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8"
              >
                {/* 👤 Profile Overview */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <User className="h-5 w-5 text-[#F97316]" />
                      👤 Profile Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-semibold text-[#142E54]">
                        {user?.firstName} {user?.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-800">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Department</p>
                      <Badge className="bg-gray-100 text-gray-800">
                        {user?.department
                          ? user.department
                              .replace("-", " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())
                          : "General"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Login</p>
                      <p className="text-sm text-gray-700 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {user?.lastLogin
                          ? new Date(user.lastLogin).toLocaleString()
                          : "Just now"}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* 📈 Activity Summary */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Activity className="h-5 w-5 text-[#F97316]" />
                      📈 Activity Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Active Tasks
                      </span>
                      <Badge variant="secondary">8</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Projects Assigned
                      </span>
                      <Badge variant="secondary">{stats.totalProjects}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Unread Messages
                      </span>
                      <Badge variant="secondary">2</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Due This Week
                      </span>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {stats.upcomingDeadlines}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* 📞 Quick Links */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Target className="h-5 w-5 text-[#F97316]" />
                      📞 Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      onClick={() =>
                        alert("Meeting functionality would be implemented here")
                      }
                      className="w-full justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                      variant="outline"
                      size="sm"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Join Department Meeting
                    </Button>
                    <Button
                      onClick={handleUploadDocument}
                      className="w-full justify-start bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                      variant="outline"
                      size="sm"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Document
                    </Button>
                    <Button
                      onClick={handleContactAdmin}
                      className="w-full justify-start bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
                      variant="outline"
                      size="sm"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact Admin
                    </Button>
                  </CardContent>
                </Card>

                {/* 🚪 Security & Settings */}
                <Card className="border-0 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Settings className="h-5 w-5 text-[#F97316]" />
                      ⚙️ Account Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      onClick={() =>
                        alert(
                          "Settings functionality would be implemented here",
                        )
                      }
                      className="w-full justify-start bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                      variant="outline"
                      size="sm"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings & Preferences
                    </Button>
                    <Button
                      onClick={() => window.location.reload()}
                      className="w-full justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                      variant="outline"
                      size="sm"
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      Refresh Dashboard
                    </Button>
                    <div className="pt-2 border-t">
                      <Button
                        onClick={logout}
                        className="w-full justify-start bg-red-500 hover:bg-red-600 text-white border-0"
                        size="sm"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        🚪 Secure Logout
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Stats Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
              >
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Total Projects
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          {stats.totalProjects}
                        </p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <Project className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Active Projects
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          {stats.activeProjects}
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
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Completed
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          {stats.completedProjects}
                        </p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-full">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-1">
                          Due This Week
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          {stats.upcomingDeadlines}
                        </p>
                      </div>
                      <div className="p-3 bg-red-100 rounded-full">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Assigned Projects */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Project className="h-5 w-5 text-[#F97316]" />
                          Your Assigned Projects
                        </CardTitle>
                        <CardDescription>
                          Projects you're currently working on
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {projects.length > 0 ? (
                            projects.map((project) => (
                              <div
                                key={project.id}
                                className="border border-gray-200 rounded-lg p-4 hover:border-[#F97316] transition-colors"
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <h3 className="font-semibold text-gray-900">
                                      {project.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {project.description}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(
                                        project.priority,
                                      )}`}
                                    >
                                      {project.priority}
                                    </span>
                                    <span
                                      className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(
                                        project.status,
                                      )}`}
                                    >
                                      {project.status}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {project.location}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    Due:{" "}
                                    {new Date(
                                      project.dueDate,
                                    ).toLocaleDateString()}
                                  </div>
                                </div>

                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-[#F97316] h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${project.progress}%` }}
                                  ></div>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">
                                  {project.progress}% complete
                                </p>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <Project className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                              <p>No projects assigned yet</p>
                              <p className="text-sm">
                                Contact your admin to get started
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Recent Activity */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-[#F97316]" />
                          Recent Activity
                        </CardTitle>
                        <CardDescription>
                          Your latest project updates and activities
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {activities.length > 0 ? (
                            activities.slice(0, 5).map((activity) => (
                              <div
                                key={activity.id}
                                className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg"
                              >
                                <div className="p-2 bg-blue-100 rounded-full">
                                  <FileText className="h-4 w-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm text-gray-900">
                                    {activity.message}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {new Date(
                                      activity.timestamp,
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-gray-500">
                              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                              <p>No recent activity</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Profile Card */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5 text-[#F97316]" />
                          Profile Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <span>{user?.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <span>{user?.phone || "Not provided"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Building className="h-4 w-4 text-gray-500" />
                          <span>{user?.company || "Not provided"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{user?.location || "Not provided"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="capitalize">
                            {user?.role} Account
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Quick Actions */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <Card className="border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Settings className="h-5 w-5 text-[#F97316]" />
                          Quick Actions
                        </CardTitle>
                        <CardDescription>
                          Common tasks and shortcuts
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button
                          onClick={handleUploadDocument}
                          className="w-full justify-start bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200"
                          variant="outline"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Documents
                        </Button>
                        <Button
                          onClick={handleContactAdmin}
                          className="w-full justify-start bg-green-50 hover:bg-green-100 text-green-700 border border-green-200"
                          variant="outline"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact Admin
                        </Button>
                        {isAdmin && (
                          <Button
                            onClick={() => (window.location.href = "/admin")}
                            className="w-full justify-start bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200"
                            variant="outline"
                          >
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Admin Panel
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
