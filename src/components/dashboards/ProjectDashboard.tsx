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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  FolderOpen,
  Upload,
  Calendar,
  MapPin,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  Camera,
  Wrench,
  TrendingUp,
  Video,
} from "lucide-react";
import { useCall } from "@/contexts/CallContext";

interface Project {
  id: string;
  name: string;
  status: "Planning" | "In Progress" | "Review" | "Completed" | "On Hold";
  progress: number;
  dueDate: string;
  location: string;
  priority: "Low" | "Medium" | "High";
  description: string;
  team: string[];
  budget: string;
}

export default function ProjectDashboard() {
  const { startCall, callState } = useCall();
  const [projects] = useState<Project[]>([
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
      team: ["John Doe", "Jane Smith", "Mike Johnson"],
      budget: "$450,000",
    },
    {
      id: "2",
      name: "Port Harcourt Airport Hotel Renovation",
      status: "Review",
      progress: 90,
      dueDate: "2024-02-28",
      location: "Port Harcourt, Rivers",
      priority: "Medium",
      description: "Complete renovation of airport hospitality facilities",
      team: ["Sarah Williams", "David Brown"],
      budget: "$1,200,000",
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
      team: ["Alex Chen", "Maria Garcia", "James Wilson"],
      budget: "$2,800,000",
    },
  ]);

  const [stats] = useState({
    totalProjects: 12,
    activeProjects: 8,
    completedProjects: 4,
    upcomingDeadlines: 3,
  });

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
            <h1 className="text-3xl font-bold mb-2">Project Management</h1>
            <p className="text-blue-100">
              Track ongoing projects, milestones, and team progress
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => startCall("project-management")}
              disabled={callState.isInCall}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
            >
              <Video size={16} className="mr-2" />
              {callState.isInCall ? "In Call" : "Start Team Call"}
            </Button>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
              <FolderOpen className="h-12 w-12 text-white/80" />
            </div>
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
                <p className="text-sm font-medium text-gray-600">
                  Total Projects
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalProjects}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FolderOpen className="h-6 w-6 text-blue-600" />
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
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.completedProjects}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Due This Week
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.upcomingDeadlines}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project Cards */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-[#F97316]" />
                Active Projects
              </CardTitle>
              <CardDescription>
                Track progress and manage project deliverables
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="border border-gray-200 rounded-lg p-6 hover:border-[#F97316] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {project.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityColor(project.priority)}`}
                        >
                          {project.priority}
                        </span>
                        <Badge className={`${getStatusColor(project.status)}`}>
                          {project.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        {project.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        Due: {new Date(project.dueDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        {project.team.length} team members
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp size={16} />
                        Budget: {project.budget}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex -space-x-2">
                        {project.team.slice(0, 3).map((member, index) => (
                          <div
                            key={index}
                            className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium"
                            title={member}
                          >
                            {member.charAt(0)}
                          </div>
                        ))}
                        {project.team.length > 3 && (
                          <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium">
                            +{project.team.length - 3}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <FileText size={16} className="mr-1" />
                          Details
                        </Button>
                        <Button
                          size="sm"
                          className="bg-[#F97316] hover:bg-[#F97316]/90"
                        >
                          <Wrench size={16} className="mr-1" />
                          Update
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upload & Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Upload Section */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-[#F97316]" />
                Upload Documents
              </CardTitle>
              <CardDescription>
                Upload blueprints, reports, and project files
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#F97316] transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-400">
                  PDF, DOC, JPG up to 10MB
                </p>
              </div>
              <Button className="w-full" variant="outline">
                <Camera size={16} className="mr-2" />
                Take Photo
              </Button>
            </CardContent>
          </Card>

          {/* Milestone Updates */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[#F97316]" />
                Milestone Update
              </CardTitle>
              <CardDescription>
                Report project progress and milestones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Milestone Title" />
              <Textarea placeholder="Progress Description" rows={3} />
              <Input
                type="number"
                placeholder="Progress Percentage"
                min="0"
                max="100"
              />
              <Button className="w-full bg-[#F97316] hover:bg-[#F97316]/90">
                Submit Update
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-[#F97316]" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <Calendar size={16} className="mr-2" />
                  Schedule Meeting
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Users size={16} className="mr-2" />
                  Assign Team Member
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <AlertTriangle size={16} className="mr-2" />
                  Report Issue
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
