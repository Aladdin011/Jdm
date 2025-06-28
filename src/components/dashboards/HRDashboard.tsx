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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  UserPlus,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Mail,
  Phone,
  MapPin,
  Building,
  Award,
  TrendingUp,
  AlertTriangle,
  Video,
} from "lucide-react";
import { useCall } from "@/contexts/CallContext";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  joinDate: string;
  status: "active" | "on_leave" | "inactive";
  location: string;
}

interface LeaveRequest {
  id: string;
  employee: string;
  type: "sick" | "vacation" | "personal" | "maternity";
  startDate: string;
  endDate: string;
  days: number;
  status: "pending" | "approved" | "rejected";
  reason: string;
}

export default function HRDashboard() {
  const { startCall, callState } = useCall();
  const [employees] = useState<Employee[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@jdmarc.com",
      phone: "+234 803 123 4567",
      department: "Project Management",
      position: "Senior Project Manager",
      joinDate: "2022-03-15",
      status: "active",
      location: "Abuja",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@jdmarc.com",
      phone: "+234 805 987 6543",
      department: "Business Development",
      position: "Business Development Manager",
      joinDate: "2021-11-08",
      status: "active",
      location: "Lagos",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike.johnson@jdmarc.com",
      phone: "+234 807 555 1234",
      department: "Accounting",
      position: "Financial Analyst",
      joinDate: "2023-01-20",
      status: "on_leave",
      location: "Port Harcourt",
    },
  ]);

  const [leaveRequests] = useState<LeaveRequest[]>([
    {
      id: "1",
      employee: "Mike Johnson",
      type: "sick",
      startDate: "2024-01-20",
      endDate: "2024-01-22",
      days: 3,
      status: "pending",
      reason: "Medical treatment",
    },
    {
      id: "2",
      employee: "Sarah Williams",
      type: "vacation",
      startDate: "2024-02-10",
      endDate: "2024-02-17",
      days: 7,
      status: "pending",
      reason: "Family vacation",
    },
    {
      id: "3",
      employee: "David Brown",
      type: "personal",
      startDate: "2024-01-15",
      endDate: "2024-01-15",
      days: 1,
      status: "approved",
      reason: "Personal appointment",
    },
  ]);

  const [stats] = useState({
    totalEmployees: 42,
    activeEmployees: 38,
    pendingRequests: 5,
    onLeave: 4,
  });

  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "on_leave":
        return "bg-yellow-100 text-yellow-700";
      case "inactive":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getLeaveStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case "sick":
        return "text-red-600";
      case "vacation":
        return "text-blue-600";
      case "personal":
        return "text-purple-600";
      case "maternity":
        return "text-pink-600";
      default:
        return "text-gray-600";
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
            <h1 className="text-3xl font-bold mb-2">Human Resources</h1>
            <p className="text-blue-100">
              Staff management, recruitment, and leave requests
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => startCall("human-resources")}
              disabled={callState.isInCall}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
            >
              <Video size={16} className="mr-2" />
              {callState.isInCall ? "In Call" : "Start Team Call"}
            </Button>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
              <Users className="h-12 w-12 text-white/80" />
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
                  Total Employees
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalEmployees}
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
                  Active Staff
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.activeEmployees}
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
                <p className="text-sm font-medium text-gray-600">
                  Pending Requests
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.pendingRequests}
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
                <p className="text-sm font-medium text-gray-600">On Leave</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.onLeave}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Employee Directory */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#F97316]" />
                    Employee Directory
                  </CardTitle>
                  <CardDescription>
                    View and manage staff information
                  </CardDescription>
                </div>
                <Button className="bg-[#F97316] hover:bg-[#F97316]/90">
                  <UserPlus size={16} className="mr-2" />
                  Add Employee
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <Input
                    placeholder="Search employees..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                {employees.map((employee) => (
                  <div
                    key={employee.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-[#F97316] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {employee.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {employee.position}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {employee.department}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(employee.status)}`}>
                        {employee.status
                          .replace("_", " ")
                          .charAt(0)
                          .toUpperCase() +
                          employee.status.replace("_", " ").slice(1)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-1">
                        <Mail size={14} />
                        {employee.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone size={14} />
                        {employee.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        {employee.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        Joined:{" "}
                        {new Date(employee.joinDate).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        View Profile
                      </Button>
                      <Button
                        size="sm"
                        className="bg-[#F97316] hover:bg-[#F97316]/90"
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Leave Management */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          {/* Leave Requests */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#F97316]" />
                Leave Requests
              </CardTitle>
              <CardDescription>Pending leave request approvals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaveRequests.map((request) => (
                  <div
                    key={request.id}
                    className="border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {request.employee}
                        </h4>
                        <p
                          className={`text-sm font-medium ${getLeaveTypeColor(request.type)}`}
                        >
                          {request.type.charAt(0).toUpperCase() +
                            request.type.slice(1)}{" "}
                          Leave
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {request.reason}
                        </p>
                      </div>
                      <Badge
                        className={`${getLeaveStatusColor(request.status)}`}
                      >
                        {request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="text-xs text-gray-600 mb-3">
                      <p>
                        {new Date(request.startDate).toLocaleDateString()} -{" "}
                        {new Date(request.endDate).toLocaleDateString()}
                      </p>
                      <p>{request.days} days</p>
                    </div>

                    {request.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 flex-1"
                        >
                          <CheckCircle size={14} className="mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <XCircle size={14} className="mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recruitment Status */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[#F97316]" />
                Recruitment Status
              </CardTitle>
              <CardDescription>Current hiring progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Civil Engineer</p>
                    <p className="text-xs text-gray-500">5 candidates</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700">
                    Interviewing
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Project Coordinator</p>
                    <p className="text-xs text-gray-500">12 applications</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700">
                    Screening
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Marketing Specialist</p>
                    <p className="text-xs text-gray-500">Position filled</p>
                  </div>
                  <Badge className="bg-green-100 text-green-700">Hired</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-[#F97316]" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <UserPlus size={16} className="mr-2" />
                  Post New Job
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar size={16} className="mr-2" />
                  Schedule Interview
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Mail size={16} className="mr-2" />
                  Send Announcement
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Building size={16} className="mr-2" />
                  Department Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
