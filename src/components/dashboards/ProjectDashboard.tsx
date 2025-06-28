import { useState } from "react";
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
import { Progress } from "@/components/ui/progress";
import {
  FolderOpen,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  MapPin,
  DollarSign,
} from "lucide-react";
import DashboardThemeWrapper from "./DashboardThemeWrapper";
import { getDepartmentTheme } from "@/utils/departmentThemes";

interface Project {
  id: string;
  name: string;
  status: "planning" | "in-progress" | "review" | "completed" | "on-hold";
  progress: number;
  dueDate: string;
  budget: string;
  location: string;
  team: string[];
}

export default function ProjectDashboard() {
  const theme = getDepartmentTheme("project-management");

  const [projects] = useState<Project[]>([
    {
      id: "1",
      name: "Lagos Smart City Phase 2",
      status: "in-progress",
      progress: 75,
      dueDate: "2024-03-15",
      budget: "₦125M",
      location: "Lagos, Nigeria",
      team: ["Alice Johnson", "Bob Smith", "Carol Williams"],
    },
    {
      id: "2",
      name: "Abuja Power Grid Upgrade",
      status: "planning",
      progress: 15,
      dueDate: "2024-06-30",
      budget: "₦89M",
      location: "Abuja, Nigeria",
      team: ["David Brown", "Eve Davis"],
    },
    {
      id: "3",
      name: "Port Harcourt Industrial Complex",
      status: "review",
      progress: 95,
      dueDate: "2024-02-28",
      budget: "₦200M",
      location: "Port Harcourt, Nigeria",
      team: ["Frank Miller", "Grace Wilson", "Henry Taylor", "Ivy Chen"],
    },
  ]);

  const [stats] = useState({
    totalProjects: 12,
    activeProjects: 8,
    completedProjects: 4,
    totalBudget: "₦850M",
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "review":
        return "bg-purple-100 text-purple-800";
      case "planning":
        return "bg-yellow-100 text-yellow-800";
      case "on-hold":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardThemeWrapper
      title="Project Management Dashboard"
      description="Oversee projects, track progress, and manage resources"
    >
      <div className="space-y-6">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card className="theme-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Projects
                  </p>
                  <p className="text-3xl font-bold theme-text-primary">
                    {stats.totalProjects}
                  </p>
                </div>
                <div className={`p-3 ${theme.badge.bg} rounded-full`}>
                  <FolderOpen className={`h-6 w-6 ${theme.badge.text}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="theme-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Projects
                  </p>
                  <p className="text-3xl font-bold theme-text-primary">
                    {stats.activeProjects}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="theme-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-3xl font-bold theme-text-primary">
                    {stats.completedProjects}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="theme-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Budget
                  </p>
                  <p className="text-3xl font-bold theme-text-primary">
                    {stats.totalBudget}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Project Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="theme-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className={`h-5 w-5 ${theme.badge.text}`} />
                Active Projects
              </CardTitle>
              <CardDescription>
                Monitor progress and manage project timelines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="border border-gray-200 rounded-lg p-6 hover:border-violet-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold theme-text-primary mb-2">
                          {project.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {project.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Due:{" "}
                            {new Date(project.dueDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {project.budget}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {project.team.length} members
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(project.status)}>
                          {project.status.charAt(0).toUpperCase() +
                            project.status.slice(1).replace("-", " ")}
                        </Badge>
                        <span className="text-2xl font-bold theme-text-primary">
                          {project.progress}%
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">
                          {project.progress}% Complete
                        </span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Team:</span>
                        <div className="flex -space-x-2">
                          {project.team.slice(0, 3).map((member, index) => (
                            <div
                              key={index}
                              className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium"
                              title={member}
                            >
                              {member
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                          ))}
                          {project.team.length > 3 && (
                            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs">
                              +{project.team.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        <Button size="sm" className={theme.button.primary}>
                          Update Progress
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardThemeWrapper>
  );
}
