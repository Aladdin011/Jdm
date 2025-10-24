import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useCall } from "@/contexts/CallContext";
import { useDashboardActions } from "@/hooks/useDashboardActions";
import ModernDashboardLayout from "./ModernDashboardLayout";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Users,
  Clock,
  CheckCircle,
  Plus,
  Mail,
  Phone,
  FileText,
  Video,
  Eye,
  Edit,
  AlertCircle,
  User,
  Briefcase,
  MessageSquare,
  Settings,
  MoreHorizontal,
  CalendarDays,
  Bell,
  Archive,
  MapPin,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  status: "pending" | "in-progress" | "completed";
  dueDate: string;
  assignedBy: string;
  category: string;
}

interface Meeting {
  id: string;
  title: string;
  participants: string[];
  date: string;
  time: string;
  location: string;
  status: "scheduled" | "ongoing" | "completed";
}

interface Contact {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  lastContact: string;
}

export default function ExecutiveAssistantDashboard() {
  const { user } = useAuth();
  const { isInCall, startCall } = useCall();
  const {
    createProject,
    updateProject,
    deleteProject,
    refreshData,
    exportData,
    customAction,
    isLoading,
    getError,
  } = useDashboardActions("ExecutiveAssistantDashboard");

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Prepare Board Meeting Materials",
      description: "Compile quarterly reports and presentation slides",
      priority: "high",
      status: "in-progress",
      dueDate: "2024-01-25",
      assignedBy: "CEO",
      category: "Meeting Preparation",
    },
    {
      id: "2",
      title: "Schedule Client Meetings",
      description: "Coordinate meetings with key clients for Q1",
      priority: "medium",
      status: "pending",
      dueDate: "2024-01-28",
      assignedBy: "Sales Director",
      category: "Scheduling",
    },
    {
      id: "3",
      title: "Travel Arrangements",
      description: "Book flights and hotels for Lagos conference",
      priority: "high",
      status: "completed",
      dueDate: "2024-01-20",
      assignedBy: "Executive Team",
      category: "Travel",
    },
  ]);

  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: "1",
      title: "Executive Team Meeting",
      participants: ["CEO", "COO", "CFO", "CTO"],
      date: "2024-01-24",
      time: "09:00",
      location: "Conference Room A",
      status: "scheduled",
    },
    {
      id: "2",
      title: "Client Presentation",
      participants: ["Lagos State Govt", "Project Team"],
      date: "2024-01-25",
      time: "14:00",
      location: "Virtual Meeting",
      status: "scheduled",
    },
  ]);

  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Ahmed Ibrahim",
      title: "Director",
      company: "Lagos State Construction",
      email: "ahmed@lagosstate.gov.ng",
      phone: "+234 803 000 0001",
      lastContact: "2024-01-20",
    },
    {
      id: "2",
      name: "Sarah Okoye",
      title: "Project Manager",
      company: "Abuja Municipal Corp",
      email: "sarah@abujamunicipal.gov.ng",
      phone: "+234 803 000 0002",
      lastContact: "2024-01-18",
    },
  ]);

  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as "high" | "medium" | "low",
    dueDate: "",
    assignedBy: "",
    category: "",
  });

  // Executive Assistant theme colors (professional blue/gray theme)
  const eaThemeColors = {
    primary: "#1e40af", // Blue
    secondary: "#f1f5f9", // Light blue-gray
    accent: "#3b82f6", // Bright blue
    background: "#f8fafc", // Very light blue-gray
    headerBg: "#1e3a8a", // Dark blue
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddTask = async () => {
    if (newTask.title && newTask.description) {
      try {
        const taskData = await customAction(
          "addTask",
          async () => {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return {
              ...newTask,
              id: Date.now().toString(),
              status: "pending",
            };
          },
          "Task added successfully",
          "Failed to add task",
        );

        setTasks((prev) => [...prev, taskData as Task]);
        setNewTask({
          title: "",
          description: "",
          priority: "medium" as const,
          dueDate: "",
          assignedBy: "",
          category: "",
        });
        setShowAddTask(false);
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  const handleStartCall = (contactId: string) => {
    const contact = contacts.find((c) => c.id === contactId);
    if (contact) {
      startCall(`contact-${contactId}`, {
        title: `Call with ${contact.name}`,
        participants: [contact.name],
      });
    }
  };

  const handleGenerateReport = async () => {
    await customAction(
      "exportData",
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return { success: true };
      },
      "Report generated successfully",
      "Failed to generate report",
    );
  };

  const handleScheduleMeeting = async () => {
    await customAction(
      "scheduleMeeting",
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        return { success: true };
      },
      "Meeting scheduled successfully",
      "Failed to schedule meeting",
    );
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === "completed",
  ).length;
  const pendingTasks = tasks.filter((task) => task.status === "pending").length;
  const upcomingMeetings = meetings.filter(
    (meeting) => meeting.status === "scheduled",
  ).length;

  return (
    <ModernDashboardLayout
      user={user}
      department="Executive Assistant"
      themeColors={eaThemeColors}
    >
      <div className="space-y-6">
        {/* Executive Assistant Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Tasks
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalTasks}
                  </p>
                  <p className="text-sm text-blue-600 flex items-center gap-1 mt-1">
                    <CheckCircle className="h-3 w-3" />
                    {completedTasks} completed
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Briefcase className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Pending Tasks
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {pendingTasks}
                  </p>
                  <p className="text-sm text-orange-600 mt-1">
                    Requires attention
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Upcoming Meetings
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {upcomingMeetings}
                  </p>
                  <p className="text-sm text-purple-600 mt-1">This week</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <CalendarDays className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Completion Rate
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalTasks > 0
                      ? Math.round((completedTasks / totalTasks) * 100)
                      : 0}
                    %
                  </p>
                  <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                    <CheckCircle className="h-3 w-3" />
                    Excellent performance
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Tasks Management */}
          <div className="lg:col-span-8 space-y-6">
            {/* Active Tasks */}
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    Active Tasks
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Your current assignments and responsibilities
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setShowAddTask(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Task
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="h-4 w-4 mr-2" />
                      Export Tasks
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tasks.map((task) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {task.title}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {task.description}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Badge
                                className={getPriorityColor(task.priority)}
                              >
                                {task.priority}
                              </Badge>
                              <Badge className={getStatusColor(task.status)}>
                                {task.status}
                              </Badge>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Assigned by: {task.assignedBy}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Due: {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2">
                              <Archive className="h-4 w-4" />
                              {task.category}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Meetings */}
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-blue-600" />
                  Upcoming Meetings
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Scheduled meetings and appointments
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {meetings.map((meeting) => (
                    <motion.div
                      key={meeting.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {meeting.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {meeting.participants.join(", ")}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-blue-200 text-blue-700"
                        >
                          {meeting.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(meeting.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {meeting.time}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {meeting.location}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    onClick={() => setShowAddTask(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Task
                  </Button>
                  <Button
                    onClick={handleScheduleMeeting}
                    disabled={isLoading("scheduleMeeting")}
                    variant="outline"
                    className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                  >
                    <CalendarDays className="h-4 w-4 mr-2" />
                    {isLoading("scheduleMeeting")
                      ? "Scheduling..."
                      : "Schedule Meeting"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-green-600 text-green-600 hover:bg-green-50"
                    onClick={handleGenerateReport}
                    disabled={isLoading("exportData")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {isLoading("exportData")
                      ? "Generating..."
                      : "Generate Report"}
                  </Button>
                  <Button
                    onClick={() =>
                      startCall("ea-team-meeting", {
                        title: "EA Team Meeting",
                        participants: [],
                      })
                    }
                    disabled={isInCall}
                    variant="outline"
                    className="w-full border-orange-600 text-orange-600 hover:bg-orange-50"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    {isInCall ? "In Meeting" : "Start Team Meeting"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Key Contacts */}
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Key Contacts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {contacts.slice(0, 3).map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {contact.name}
                        </p>
                        <p className="text-sm text-gray-600">{contact.title}</p>
                        <p className="text-xs text-gray-500">
                          {contact.company}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          onClick={() => handleStartCall(contact.id)}
                          disabled={isInCall}
                          size="sm"
                          variant="ghost"
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Task Modal */}
        {showAddTask && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Add New Task</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Task Title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                />
                <Textarea
                  placeholder="Task Description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                />
                <Select
                  value={newTask.priority}
                  onValueChange={(value) =>
                    setNewTask({
                      ...newTask,
                      priority: value as "high" | "medium" | "low",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  type="date"
                  placeholder="Due Date"
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                />
                <Input
                  placeholder="Assigned By"
                  value={newTask.assignedBy}
                  onChange={(e) =>
                    setNewTask({ ...newTask, assignedBy: e.target.value })
                  }
                />
                <Input
                  placeholder="Category"
                  value={newTask.category}
                  onChange={(e) =>
                    setNewTask({ ...newTask, category: e.target.value })
                  }
                />
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddTask}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={isLoading("addTask")}
                  >
                    {isLoading("addTask") ? "Adding..." : "Add Task"}
                  </Button>
                  <Button
                    onClick={() => setShowAddTask(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ModernDashboardLayout>
  );
}
