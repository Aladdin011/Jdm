import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardRouter from "@/components/DashboardRouter";
import { toast } from "sonner";
import { Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageTransition from "@/components/ui/PageTransition";
import { projectAPI, activityAPI } from "@/services/api";
import { handleError, showUserError } from "@/utils/errorHandler";
import { trackEvent } from "@/utils/analytics";

// Import modular components
import { DashboardHeader } from "./DashboardHeader";
import { MetricsCards } from "./MetricsCards";
import { ProjectCard } from "./ProjectCard";
import { ActivityFeed } from "./ActivityFeed";
import { containerVariants, itemVariants, mockProjects, mockActivities, mockMetrics } from "./constants";
import type { Project, Activity, DashboardMetrics } from "./types";

export default function ModernDashboard() {
  const { user, logout } = useAuth();
  const [isInitializing, setIsInitializing] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>(mockMetrics);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notifications, setNotifications] = useState(5);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Initialize dashboard
  useEffect(() => {
    trackEvent(
      "dashboard_access",
      "user_interaction",
      `${user?.department || "unknown"}_department`
    );

    const timer = setTimeout(() => {
      setIsInitializing(false);
      loadDashboardData();
    }, 1500);

    return () => clearTimeout(timer);
  }, [user]);

  // Load dashboard data
  const loadDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Try to load real data from API first
      const [projectsResponse, activitiesResponse] = await Promise.allSettled([
        projectAPI.getProjects(),
        activityAPI.getActivities()
      ]);

      // Handle projects data
      if (projectsResponse.status === 'fulfilled') {
        setProjects(projectsResponse.value);
      } else {
        console.warn('Failed to load projects, using mock data');
        setProjects(mockProjects);
      }

      // Handle activities data
      if (activitiesResponse.status === 'fulfilled') {
        setActivities(activitiesResponse.value);
      } else {
        console.warn('Failed to load activities, using mock data');
        setActivities(mockActivities);
      }

      // Use mock metrics for now (can be replaced with API call later)
      setMetrics(mockMetrics);
    } catch (error: any) {
      const appError = handleError(error, 'Dashboard');
      showUserError(appError, 'Failed to load dashboard');
      
      // Fallback to mock data
      setProjects(mockProjects);
      setActivities(mockActivities);
      setMetrics(mockMetrics);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh dashboard data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
    setIsRefreshing(false);
    toast.success("Dashboard refreshed");
  };

  // Handle search
  const handleSearch = (query: string) => {
    // Implement search logic
  };

  // Handle project view
  const handleViewProject = (project: Project) => {
    setSelectedProject(project);
    toast.info(`Viewing ${project.name}`);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error: any) {
      const appError = handleError(error, 'Logout');
      showUserError(appError, 'Failed to logout');
    }
  };

  // Loading state
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EAE6DF] to-[#C2CCC5]">
        <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A7967E] mx-auto mb-4"></div>
          <p className="text-[#142E54] font-medium text-lg">
            Preparing your dashboard...
          </p>
          <p className="text-gray-600 mt-2 text-sm">
            Loading your personalized experience
          </p>
          <div className="mt-4 w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-[#142E54] animate-pulse rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // Check authentication
  if (!user) {
    console.error("No user data available");
    toast.error("Authentication error. Please log in again.");
    return <Navigate to="/login" replace />;
  }

  // Route to department dashboard if available
  const departmentForRouting = user.department || user.dashboard;
  if (departmentForRouting) {
    return <DashboardRouter />;
  }

  // Main dashboard view
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <DashboardHeader
          user={user}
          notifications={notifications}
          onNotificationClick={() => setShowNotifications(!showNotifications)}
          onSearch={handleSearch}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Welcome Section */}
            <motion.div variants={itemVariants} className="relative">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 text-white overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-3xl font-bold mb-2">
                          Welcome back, {user?.firstName}
                        </h2>
                        <p className="text-blue-100 text-lg">
                          {new Date().toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="bg-white/20 hover:bg-white/30 text-white"
                      >
                        <RefreshCw
                          className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
                        />
                        Refresh
                      </Button>
                      <Button
                        size="sm"
                        className="bg-white text-blue-600 hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Project
                      </Button>
                    </div>
                  </div>
                </div>
                {/* Background decoration */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
                </div>
              </div>
            </motion.div>

            {/* Metrics Cards */}
            <MetricsCards metrics={metrics} />

            {/* Projects and Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Projects List */}
              <div className="lg:col-span-2">
                <motion.div variants={itemVariants}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Active Projects
                    </h2>
                    <Button variant="outline" size="sm">
                      View All →
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {projects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        onView={handleViewProject}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Activity Feed */}
              <div className="lg:col-span-1">
                <ActivityFeed activities={activities} />
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </PageTransition>
  );
}

