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
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Calendar as CalendarIcon,
  Clock,
  TrendingUp,
  TrendingDown,
  Heart,
  Award,
  Target,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  FileText,
  Edit,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Bot,
  Video,
  MessageSquare,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  Download,
  Upload,
  Star,
  ThumbsUp,
  Activity,
  Building,
  GraduationCap,
  Shield,
  Coffee,
  Home,
  Zap,
  BookOpen,
  Bell,
  Plus,
  Minus,
} from "lucide-react";
import DashboardThemeWrapper from "./DashboardThemeWrapper";
import { getDepartmentTheme } from "@/utils/departmentThemes";
import { useCall } from "@/contexts/CallContext";

interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  location: string;
  hireDate: string;
  salary: number;
  status: "active" | "on-leave" | "terminated";
  performanceRating: number;
  leaveBalance: number;
  availabilityStatus: "available" | "busy" | "away" | "in-meeting";
  avatar?: string;
}

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: "annual" | "sick" | "maternity" | "emergency";
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
}

interface RecruitmentPosition {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "full-time" | "part-time" | "contract";
  status: "open" | "interviewing" | "closed";
  applicants: number;
  postedDate: string;
  priority: "high" | "medium" | "low";
}

interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  hoursWorked: number;
  status: "present" | "late" | "absent" | "half-day";
}

interface PerformanceMetric {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  kpiScore: number;
  projectsCompleted: number;
  clientSatisfaction: number;
  teamCollaboration: number;
  overallRating: number;
  period: string;
}

interface HRPolicy {
  id: string;
  title: string;
  category: "leave" | "conduct" | "benefits" | "safety" | "wellness";
  lastUpdated: string;
  status: "active" | "draft" | "archived";
  summary: string;
}

export default function HRDashboard() {
  const theme = getDepartmentTheme("human-resources");
  const { startCall } = useCall();
  const [activeTab, setActiveTab] = useState("core-hr");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");

  // Sample data
  const [employees] = useState<Employee[]>([
    {
      id: "1",
      employeeId: "EMP-001",
      firstName: "Jude",
      lastName: "Onwudebe",
      email: "jude.onwudebe@jdmarcng.com",
      phone: "+234 803 706 5497",
      department: "Management",
      position: "Managing Director",
      location: "Abuja, Nigeria",
      hireDate: "2023-01-15",
      salary: 2000000,
      status: "active",
      performanceRating: 4.8,
      leaveBalance: 25,
      availabilityStatus: "available",
    },
    {
      id: "2",
      employeeId: "EMP-002",
      firstName: "Sarah",
      lastName: "Okafor",
      email: "sarah.admin@jdmarcng.com",
      phone: "+234 803 000 0003",
      department: "Administration",
      position: "Administrative Manager",
      location: "Abuja, Nigeria",
      hireDate: "2023-04-05",
      salary: 800000,
      status: "active",
      performanceRating: 4.5,
      leaveBalance: 18,
      availabilityStatus: "in-meeting",
    },
    {
      id: "3",
      employeeId: "EMP-003",
      firstName: "Michael",
      lastName: "Adebayo",
      email: "michael.business@jdmarcng.com",
      phone: "+234 803 000 0004",
      department: "Business Development",
      position: "Business Development Manager",
      location: "Lagos, Nigeria",
      hireDate: "2023-03-01",
      salary: 1200000,
      status: "on-leave",
      performanceRating: 4.2,
      leaveBalance: 12,
      availabilityStatus: "away",
    },
    {
      id: "4",
      employeeId: "EMP-004",
      firstName: "Grace",
      lastName: "Nwosu",
      email: "grace.account@jdmarcng.com",
      phone: "+234 803 000 0005",
      department: "Accounting",
      position: "Financial Analyst",
      location: "Abuja, Nigeria",
      hireDate: "2023-05-15",
      salary: 900000,
      status: "active",
      performanceRating: 4.7,
      leaveBalance: 22,
      availabilityStatus: "busy",
    },
    {
      id: "5",
      employeeId: "EMP-005",
      firstName: "David",
      lastName: "Emeka",
      email: "david.hr@jdmarcng.com",
      phone: "+234 803 000 0006",
      department: "Human Resources",
      position: "HR Coordinator",
      location: "Abuja, Nigeria",
      hireDate: "2023-06-10",
      salary: 750000,
      status: "active",
      performanceRating: 4.3,
      leaveBalance: 20,
      availabilityStatus: "available",
    },
  ]);

  const [leaveRequests] = useState<LeaveRequest[]>([
    {
      id: "1",
      employeeId: "EMP-003",
      employeeName: "Michael Adebayo",
      type: "annual",
      startDate: "2024-02-01",
      endDate: "2024-02-07",
      days: 7,
      reason: "Family vacation",
      status: "approved",
      appliedDate: "2024-01-15",
    },
    {
      id: "2",
      employeeId: "EMP-004",
      employeeName: "Grace Nwosu",
      type: "sick",
      startDate: "2024-01-22",
      endDate: "2024-01-23",
      days: 2,
      reason: "Medical appointment and recovery",
      status: "pending",
      appliedDate: "2024-01-20",
    },
    {
      id: "3",
      employeeId: "EMP-002",
      employeeName: "Sarah Okafor",
      type: "emergency",
      startDate: "2024-02-05",
      endDate: "2024-02-05",
      days: 1,
      reason: "Family emergency",
      status: "pending",
      appliedDate: "2024-01-18",
    },
  ]);

  const [recruitmentPositions] = useState<RecruitmentPosition[]>([
    {
      id: "1",
      title: "Senior Project Manager",
      department: "Project Management",
      location: "Abuja, Nigeria",
      type: "full-time",
      status: "open",
      applicants: 24,
      postedDate: "2024-01-10",
      priority: "high",
    },
    {
      id: "2",
      title: "Digital Marketing Specialist",
      department: "Marketing",
      location: "Lagos, Nigeria",
      type: "full-time",
      status: "interviewing",
      applicants: 18,
      postedDate: "2024-01-05",
      priority: "medium",
    },
    {
      id: "3",
      title: "Accountant",
      department: "Accounting",
      location: "Abuja, Nigeria",
      type: "full-time",
      status: "open",
      applicants: 31,
      postedDate: "2024-01-12",
      priority: "high",
    },
  ]);

  const [performanceMetrics] = useState<PerformanceMetric[]>([
    {
      id: "1",
      employeeId: "EMP-001",
      employeeName: "Jude Onwudebe",
      department: "Management",
      kpiScore: 95,
      projectsCompleted: 8,
      clientSatisfaction: 4.8,
      teamCollaboration: 4.9,
      overallRating: 4.8,
      period: "Q4 2023",
    },
    {
      id: "2",
      employeeId: "EMP-002",
      employeeName: "Sarah Okafor",
      department: "Administration",
      kpiScore: 88,
      projectsCompleted: 12,
      clientSatisfaction: 4.5,
      teamCollaboration: 4.7,
      overallRating: 4.5,
      period: "Q4 2023",
    },
    {
      id: "3",
      employeeId: "EMP-004",
      employeeName: "Grace Nwosu",
      department: "Accounting",
      kpiScore: 92,
      projectsCompleted: 15,
      clientSatisfaction: 4.6,
      teamCollaboration: 4.8,
      overallRating: 4.7,
      period: "Q4 2023",
    },
  ]);

  const [hrPolicies] = useState<HRPolicy[]>([
    {
      id: "1",
      title: "Remote Work Policy",
      category: "conduct",
      lastUpdated: "2024-01-15",
      status: "active",
      summary:
        "Guidelines for remote work arrangements and productivity expectations",
    },
    {
      id: "2",
      title: "Employee Wellness Program",
      category: "wellness",
      lastUpdated: "2024-01-10",
      status: "active",
      summary:
        "Comprehensive wellness benefits including health insurance and mental health support",
    },
    {
      id: "3",
      title: "Leave and Vacation Policy",
      category: "leave",
      lastUpdated: "2024-01-05",
      status: "active",
      summary:
        "Updated leave allocation and approval process for all employee types",
    },
  ]);

  const departments = [
    "Management",
    "Administration",
    "Business Development",
    "Project Management",
    "Accounting",
    "Human Resources",
    "Marketing",
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "approved":
      case "present":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
      case "interviewing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
      case "absent":
      case "terminated":
        return "bg-red-100 text-red-800 border-red-200";
      case "on-leave":
      case "late":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "busy":
        return "bg-red-500";
      case "away":
        return "bg-yellow-500";
      case "in-meeting":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      filterDepartment === "all" || employee.department === filterDepartment;

    return matchesSearch && matchesDepartment;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      title: "Total Employees",
      value: employees.length,
      change: "+12%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Active Positions",
      value: recruitmentPositions.filter((p) => p.status === "open").length,
      change: "+3",
      trend: "up",
      icon: Briefcase,
    },
    {
      title: "Pending Leaves",
      value: leaveRequests.filter((l) => l.status === "pending").length,
      change: "-2",
      trend: "down",
      icon: CalendarIcon,
    },
    {
      title: "Avg Performance",
      value: "4.5/5",
      change: "+0.3",
      trend: "up",
      icon: Star,
    },
  ];

  const aiSuggestions = [
    {
      type: "leave",
      message:
        "Grace Nwosu's sick leave request appears genuine based on medical documentation",
      confidence: 92,
      action: "Approve",
    },
    {
      type: "recruitment",
      message:
        "Consider fast-tracking Senior Project Manager position due to upcoming projects",
      confidence: 88,
      action: "Review",
    },
    {
      type: "performance",
      message:
        "Michael Adebayo shows improvement trend - consider for promotion",
      confidence: 85,
      action: "Evaluate",
    },
  ];

  return (
    <DashboardThemeWrapper
      title="Human Resources Management Center"
      description="Comprehensive HR operations, employee management, and organizational development for JD Marc Limited."
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
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search employees..."
                className="pl-10 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={filterDepartment}
              onValueChange={setFilterDepartment}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => startCall("human-resources")}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
            >
              <Video className="h-4 w-4 mr-2" />
              HR Call
            </Button>
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* HR KPI Cards */}
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
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full">
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

        {/* Main HR Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
            <TabsTrigger value="core-hr" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Core HR
            </TabsTrigger>
            <TabsTrigger value="benefits" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Benefits
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              Automation
            </TabsTrigger>
            <TabsTrigger
              value="performance"
              className="flex items-center gap-2"
            >
              <Award className="h-4 w-4" />
              Performance
            </TabsTrigger>
          </TabsList>

          {/* Core HR Tab */}
          <TabsContent value="core-hr" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Employee Records */}
              <div className="lg:col-span-3 space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Users className={`h-5 w-5 ${theme.badge.text}`} />
                        Employee Records
                      </CardTitle>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-amber-500 to-orange-500"
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Employee
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredEmployees.map((employee, index) => (
                        <motion.div
                          key={employee.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                                  {employee.firstName[0]}
                                  {employee.lastName[0]}
                                </div>
                                <div
                                  className={`absolute -bottom-1 -right-1 w-4 h-4 ${getAvailabilityColor(
                                    employee.availabilityStatus,
                                  )} rounded-full border-2 border-white`}
                                />
                              </div>
                              <div>
                                <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                                  {employee.firstName} {employee.lastName}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {employee.position} • {employee.department}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge
                                    className={getStatusColor(employee.status)}
                                  >
                                    {employee.status}
                                  </Badge>
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-yellow-500" />
                                    <span className="text-xs">
                                      {employee.performanceRating}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-slate-800 dark:text-slate-200">
                                {employee.employeeId}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Leave: {employee.leaveBalance} days
                              </p>
                              <div className="flex gap-1 mt-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Phone className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Leave Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className={`h-5 w-5 ${theme.badge.text}`} />
                      Leave Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {leaveRequests.map((request, index) => (
                        <div
                          key={request.id}
                          className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                                {request.employeeName}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {request.type} leave • {request.days} days
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {new Date(
                                  request.startDate,
                                ).toLocaleDateString()}{" "}
                                -{" "}
                                {new Date(request.endDate).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge className={getStatusColor(request.status)}>
                                {request.status}
                              </Badge>
                              {request.status === "pending" && (
                                <div className="flex gap-1 mt-2">
                                  <Button size="sm" variant="outline">
                                    <CheckCircle className="h-3 w-3 text-green-600" />
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <XCircle className="h-3 w-3 text-red-600" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recruitment Tracker */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className={`h-5 w-5 ${theme.badge.text}`} />
                      Recruitment Workflow
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recruitmentPositions.map((position, index) => (
                        <div
                          key={position.id}
                          className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                                {position.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {position.department} • {position.location}
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Badge
                                  className={getStatusColor(position.status)}
                                >
                                  {position.status}
                                </Badge>
                                <Badge
                                  className={getPriorityColor(
                                    position.priority,
                                  )}
                                >
                                  {position.priority} priority
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg text-slate-800 dark:text-slate-200">
                                {position.applicants}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                applicants
                              </p>
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-2"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Attendance Calendar */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className={`h-5 w-5 ${theme.badge.text}`} />
                      Attendance Tracker
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Present Today</span>
                        <span className="font-medium text-green-600">
                          {
                            employees.filter((e) => e.status === "active")
                              .length
                          }
                          /{employees.length}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>On Leave</span>
                        <span className="font-medium text-blue-600">
                          {
                            employees.filter((e) => e.status === "on-leave")
                              .length
                          }
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Directory */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Phone className={`h-5 w-5 ${theme.badge.text}`} />
                      Quick Contacts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {employees.slice(0, 4).map((employee) => (
                        <div
                          key={employee.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${getAvailabilityColor(
                                employee.availabilityStatus,
                              )}`}
                            />
                            <span className="text-sm font-medium">
                              {employee.firstName}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" className="p-1">
                              <Phone className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="p-1">
                              <MessageSquare className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* HR Policies */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className={`h-5 w-5 ${theme.badge.text}`} />
                      HR Updates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {hrPolicies.slice(0, 3).map((policy) => (
                        <div
                          key={policy.id}
                          className="p-3 border border-gray-200 dark:border-slate-600 rounded-lg"
                        >
                          <h4 className="font-medium text-sm text-slate-800 dark:text-slate-200">
                            {policy.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {policy.summary}
                          </p>
                          <Badge
                            className={`mt-2 ${getStatusColor(policy.status)}`}
                          >
                            {policy.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Benefits Tab */}
          <TabsContent value="benefits" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Health Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Enrolled Employees</span>
                      <span className="font-bold">
                        {employees.length - 1}/{employees.length}
                      </span>
                    </div>
                    <Progress value={85} className="h-2" />
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Medical Insurance</span>
                        <span className="text-green-600">Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dental Coverage</span>
                        <span className="text-green-600">Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Life Insurance</span>
                        <span className="text-green-600">Active</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coffee className="h-5 w-5 text-amber-500" />
                    Wellness Programs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-amber-600">72%</p>
                      <p className="text-sm text-gray-600">
                        Participation Rate
                      </p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Fitness Program</span>
                        <span className="font-medium">12 enrolled</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Mental Health</span>
                        <span className="font-medium">8 sessions</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Team Building</span>
                        <span className="font-medium">Monthly</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-blue-500" />
                    Learning & Development
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">₦2.5M</p>
                      <p className="text-sm text-gray-600">Training Budget</p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Courses Completed</span>
                        <span className="font-medium">24</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Certifications</span>
                        <span className="font-medium">8</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Conferences</span>
                        <span className="font-medium">3 upcoming</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Automation Tab */}
          <TabsContent value="automation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className={`h-5 w-5 ${theme.badge.text}`} />
                  AI HR Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiSuggestions.map((suggestion, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-lg border border-amber-200 dark:border-amber-800"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-amber-500 rounded-full">
                          <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-slate-800 dark:text-slate-200 font-medium">
                            {suggestion.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Progress
                              value={suggestion.confidence}
                              className="h-2 flex-1"
                            />
                            <span className="text-sm font-medium text-amber-600">
                              {suggestion.confidence}% confidence
                            </span>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          {suggestion.action}
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className={`h-5 w-5 ${theme.badge.text}`} />
                    Performance Tracking
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {performanceMetrics.map((metric, index) => (
                      <div
                        key={metric.id}
                        className="p-4 border border-gray-200 dark:border-slate-600 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                              {metric.employeeName}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {metric.department} • {metric.period}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="font-bold">
                                {metric.overallRating}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">
                              KPI Score
                            </p>
                            <p className="font-medium">{metric.kpiScore}%</p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">
                              Projects
                            </p>
                            <p className="font-medium">
                              {metric.projectsCompleted}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">
                              Client Score
                            </p>
                            <p className="font-medium">
                              {metric.clientSatisfaction}/5
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">
                              Team Score
                            </p>
                            <p className="font-medium">
                              {metric.teamCollaboration}/5
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">Performance Chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* HR Team Communication */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className={`h-5 w-5 ${theme.badge.text}`} />
                HR Team Communication
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-gray-600 dark:text-gray-400">
                  Connect with HR team, conduct interviews, and staff meetings
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={() => startCall("human-resources")}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Voice Call
                  </Button>
                  <Button
                    onClick={() => startCall("human-resources")}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Interview Call
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    HR Chat
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
