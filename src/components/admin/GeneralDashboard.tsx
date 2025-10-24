import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardActions } from "@/hooks/useDashboardActions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FolderOpen,
  Clock,
  CheckCircle,
  Upload,
  MessageSquare,
  FileText,
  Settings,
  Plus,
  ArrowRight,
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import useAnalytics from "@/hooks/useAnalytics";
import PageTransition from "@/components/ui/PageTransition";

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

export default function GeneralDashboard() {
  const { user } = useAuth();
  const { trackBusinessEvent } = useAnalytics();
  const {
    createProject,
    updateProject,
    deleteProject,
    refreshData,
    exportData,
    customAction,
    isLoading,
    getError,
  } = useDashboardActions("GeneralDashboard");
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    upcomingDeadlines: 0,
  });
  const [isDataLoading, setIsDataLoading] = useState(true);

  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isReportsModalOpen, setReportsModalOpen] = useState(false);
  const [isSupportModalOpen, setSupportModalOpen] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsDataLoading(true);

        // Use mock data
        const mockProjects: ProjectItem[] = [
          {
            id: "1",
            name: "Welcome Project",
            status: "Planning",
            progress: 25,
            dueDate: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            location: "Your Location",
            priority: "Medium",
            description:
              "This is your first project. Get started by adding details and milestones.",
          },
        ];

        const mockActivities: ActivityItem[] = [
          {
            id: "1",
            type: "project_update",
            message:
              "Welcome to JD Marc Limited! Your account has been created successfully.",
            timestamp: new Date().toISOString(),
          },
        ];

        setProjects(mockProjects);
        setActivities(mockActivities);
        setStats({
          totalProjects: mockProjects.length,
          activeProjects: mockProjects.filter((p) => p.status === "In Progress")
            .length,
          completedProjects: mockProjects.filter(
            (p) => p.status === "Completed",
          ).length,
          upcomingDeadlines: mockProjects.filter(
            (p) => new Date(p.dueDate) > new Date() && p.status !== "Completed",
          ).length,
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        // Fallback data
        setProjects([
          {
            id: "1",
            name: "Welcome Project",
            status: "Planning",
            progress: 25,
            dueDate: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            location: "Your Location",
            priority: "Medium",
            description:
              "This is your first project. Get started by adding details and milestones.",
          },
        ]);
        setActivities([
          {
            id: "1",
            type: "project_update",
            message:
              "Welcome to JD Marc Limited! Your account has been created successfully.",
            timestamp: new Date().toISOString(),
          },
        ]);
        setStats({
          totalProjects: 1,
          activeProjects: 0,
          completedProjects: 0,
          upcomingDeadlines: 1,
        });
      } finally {
        setIsDataLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EAE6DF] to-[#C2CCC5]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A7967E] mx-auto mb-4"></div>
          <p className="text-[#142E54] font-medium">
            Loading your dashboard...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-[#EAE6DF] to-[#C2CCC5] p-6">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="max-w-7xl mx-auto space-y-6"
        >
          {/* Welcome Section */}
          <motion.div variants={fadeInUp} className="text-center space-y-4">
            <Badge variant="outline" className="text-lg px-4 py-2">
              Welcome to JD Marc Limited
            </Badge>
            <h1 className="text-4xl font-bold text-[#142E54]">
              Welcome, {user?.firstName}!
            </h1>
            <p className="text-lg text-[#4A5568] max-w-2xl mx-auto">
              Explore your dashboard, manage projects, and stay on top of
              deadlines effortlessly.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                title: "Total Projects",
                count: stats.totalProjects,
                icon: FolderOpen,
                color: "text-blue-600",
              },
              {
                title: "Active Projects",
                count: stats.activeProjects,
                icon: Activity,
                color: "text-green-600",
              },
              {
                title: "Completed",
                count: stats.completedProjects,
                icon: CheckCircle,
                color: "text-purple-600",
              },
              {
                title: "Upcoming",
                count: stats.upcomingDeadlines,
                icon: Clock,
                color: "text-orange-600",
              },
            ].map(({ title, count, icon: Icon, color }) => (
              <Card
                key={title}
                className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition"
              >
                <CardContent className="p-6 flex items-center">
                  <Icon className={`h-8 w-8 ${color}`} />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-[#142E54]">{count}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Get Started */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-lg hover:shadow-xl transition">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-[#142E54]">
                  <Plus className="h-6 w-6" />
                  <span>Create Your First Project</span>
                </CardTitle>
                <CardDescription>
                  Start building by creating your first project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-[#4A5568]">
                  Define project scope, set milestones, and track progress
                  easily.
                </p>
                <Button
                  className="w-full bg-[#142E54] hover:bg-[#1E3A8A] text-white"
                  onClick={async () => {
                    try {
                      await customAction(
                        "createProject",
                        async () => {
                          const newProject = {
                            id: Date.now().toString(),
                            name: "New Project",
                            status: "Planning" as const,
                            progress: 0,
                            dueDate: new Date(
                              Date.now() + 30 * 24 * 60 * 60 * 1000,
                            ).toISOString(),
                            location: "Project Location",
                            priority: "Medium" as const,
                            description: "Project description",
                          };
                          return newProject;
                        },
                        "Project created successfully",
                        "Failed to create project",
                      );
                      await refreshData("projects");
                    } catch (error) {
                      console.error("Error creating project:", error);
                    }
                  }}
                  disabled={isLoading("createProject")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {isLoading("createProject") ? "Creating..." : "New Project"}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-100 border-0 shadow-lg hover:shadow-xl transition">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-[#142E54]">
                  <Settings className="h-6 w-6" />
                  <span>Complete Your Profile</span>
                </CardTitle>
                <CardDescription>
                  Add details to personalize your experience
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-[#4A5568]">
                  Upload logo, add contact details, and set preferences.
                </p>
                <Button
                  variant="outline"
                  className="w-full border-[#142E54] text-[#142E54] hover:bg-[#142E54] hover:text-white"
                  onClick={async () => {
                    try {
                      await customAction(
                        "updateProfile",
                        async () => {
                          console.log("Opening profile update modal");
                          return { success: true };
                        },
                        "Profile update modal opened",
                        "Failed to open profile update",
                      );
                    } catch (error) {
                      console.error("Error opening profile modal:", error);
                    }
                  }}
                  disabled={isLoading("updateProfile")}
                >
                  <ArrowRight className="h-4 w-4 mr-2" />
                  {isLoading("updateProfile") ? "Opening..." : "Update Profile"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <h2 className="text-2xl font-bold text-[#142E54]">
              Recent Activity
            </h2>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                {activities.length > 0 ? (
                  <div className="space-y-4">
                    {activities.slice(0, 5).map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm text-[#4A5568]">
                            {activity.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(activity.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No recent activity</p>
                    <p className="text-sm">
                      Start by creating your first project!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={fadeInUp} className="space-y-4">
            <h2 className="text-2xl font-bold text-[#142E54]">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 border-[#142E54] text-[#142E54] hover:bg-[#142E54] hover:text-white transition"
                onClick={async () => {
                  try {
                    await customAction(
                      "uploadDocument",
                      async () => {
                        console.log("Opening document upload modal");
                        return { success: true };
                      },
                      "Document upload modal opened",
                      "Failed to open upload modal",
                    );
                  } catch (error) {
                    console.error("Error opening upload modal:", error);
                  }
                }}
                disabled={isLoading("uploadDocument")}
              >
                <Upload className="h-6 w-6" />
                <span>
                  {isLoading("uploadDocument")
                    ? "Opening..."
                    : "Upload Documents"}
                </span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 border-[#142E54] text-[#142E54] hover:bg-[#142E54] hover:text-white transition"
                onClick={async () => {
                  try {
                    await customAction(
                      "contactSupport",
                      async () => {
                        console.log("Opening support contact modal");
                        return { success: true };
                      },
                      "Support contact opened",
                      "Failed to open support contact",
                    );
                  } catch (error) {
                    console.error("Error opening support contact:", error);
                  }
                }}
                disabled={isLoading("contactSupport")}
              >
                <MessageSquare className="h-6 w-6" />
                <span>
                  {isLoading("contactSupport")
                    ? "Opening..."
                    : "Contact Support"}
                </span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex-col space-y-2 border-[#142E54] text-[#142E54] hover:bg-[#142E54] hover:text-white transition"
                onClick={async () => {
                  try {
                    await exportData("reports", "pdf");
                  } catch (error) {
                    console.error("Error generating reports:", error);
                  }
                }}
                disabled={isLoading("exportData")}
              >
                <FileText className="h-6 w-6" />
                <span>
                  {isLoading("exportData") ? "Generating..." : "View Reports"}
                </span>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  );
}
