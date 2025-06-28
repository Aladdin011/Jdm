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
import {
  Users,
  UserCheck,
  Clock,
  Calendar,
  FileText,
  Mail,
  Phone,
  MapPin,
  Briefcase,
} from "lucide-react";
import DashboardThemeWrapper from "./DashboardThemeWrapper";
import { getDepartmentTheme } from "@/utils/departmentThemes";

interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  joinDate: string;
  status: "active" | "on-leave" | "inactive";
}

interface LeaveRequest {
  id: string;
  employee: string;
  type: "vacation" | "sick" | "personal" | "maternity";
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
  days: number;
}

export default function HRDashboard() {
  const theme = getDepartmentTheme("human-resources");

  const [employees] = useState<Employee[]>([
    {
      id: "1",
      name: "John Doe",
      department: "Project Management",
      position: "Senior Engineer",
      email: "john.doe@jdmarc.com",
      phone: "+234 803 000 0001",
      joinDate: "2023-03-15",
      status: "active",
    },
    {
      id: "2",
      name: "Jane Smith",
      department: "Business Development",
      position: "Sales Manager",
      email: "jane.smith@jdmarc.com",
      phone: "+234 803 000 0002",
      joinDate: "2023-05-20",
      status: "on-leave",
    },
    {
      id: "3",
      name: "Mike Johnson",
      department: "Accounting",
      position: "Financial Analyst",
      email: "mike.johnson@jdmarc.com",
      phone: "+234 803 000 0003",
      joinDate: "2023-01-10",
      status: "active",
    },
  ]);

  const [leaveRequests] = useState<LeaveRequest[]>([
    {
      id: "1",
      employee: "Sarah Williams",
      type: "vacation",
      startDate: "2024-02-15",
      endDate: "2024-02-25",
      status: "pending",
      days: 10,
    },
    {
      id: "2",
      employee: "David Brown",
      type: "sick",
      startDate: "2024-01-28",
      endDate: "2024-01-30",
      status: "approved",
      days: 3,
    },
  ]);

  const [stats] = useState({
    totalEmployees: 45,
    activeEmployees: 42,
    pendingLeave: 5,
    newHires: 3,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "on-leave":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case "vacation":
        return "bg-blue-100 text-blue-800";
      case "sick":
        return "bg-red-100 text-red-800";
      case "personal":
        return "bg-purple-100 text-purple-800";
      case "maternity":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardThemeWrapper
      title="Human Resources Dashboard"
      description="Manage staff, track leave requests, and oversee recruitment"
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
                    Total Employees
                  </p>
                  <p className="text-3xl font-bold theme-text-primary">
                    {stats.totalEmployees}
                  </p>
                </div>
                <div className={`p-3 ${theme.badge.bg} rounded-full`}>
                  <Users className={`h-6 w-6 ${theme.badge.text}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="theme-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Staff
                  </p>
                  <p className="text-3xl font-bold theme-text-primary">
                    {stats.activeEmployees}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="theme-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Pending Leave
                  </p>
                  <p className="text-3xl font-bold theme-text-primary">
                    {stats.pendingLeave}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="theme-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">New Hires</p>
                  <p className="text-3xl font-bold theme-text-primary">
                    {stats.newHires}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Employee Directory */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="theme-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className={`h-5 w-5 ${theme.badge.text}`} />
                  Employee Directory
                </CardTitle>
                <CardDescription>
                  Manage staff information and assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {employees.map((employee) => (
                    <div
                      key={employee.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-amber-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold theme-text-primary">
                            {employee.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {employee.position}
                          </p>
                          <p className="text-sm text-gray-500">
                            {employee.department}
                          </p>
                        </div>
                        <Badge className={getStatusColor(employee.status)}>
                          {employee.status.charAt(0).toUpperCase() +
                            employee.status.slice(1).replace("-", " ")}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 gap-2 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {employee.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {employee.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Joined:{" "}
                          {new Date(employee.joinDate).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <FileText className="h-4 w-4 mr-1" />
                          Profile
                        </Button>
                        <Button size="sm" className={theme.button.primary}>
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
            transition={{ delay: 0.2 }}
          >
            <Card className="theme-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className={`h-5 w-5 ${theme.badge.text}`} />
                  Leave Requests
                </CardTitle>
                <CardDescription>
                  Review and approve employee leave applications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaveRequests.map((request) => (
                    <div
                      key={request.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold theme-text-primary">
                            {request.employee}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getLeaveTypeColor(request.type)}>
                              {request.type.charAt(0).toUpperCase() +
                                request.type.slice(1)}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {request.days} days
                            </span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.charAt(0).toUpperCase() +
                            request.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="text-sm text-gray-600 mb-3">
                        <p>
                          From:{" "}
                          {new Date(request.startDate).toLocaleDateString()} to{" "}
                          {new Date(request.endDate).toLocaleDateString()}
                        </p>
                      </div>

                      {request.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="theme-card mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className={`h-5 w-5 ${theme.badge.text}`} />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className={`w-full ${theme.button.primary}`}>
                  <Users className="h-4 w-4 mr-2" />
                  Add New Employee
                </Button>
                <Button className={`w-full ${theme.button.secondary}`}>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate HR Report
                </Button>
                <Button className={`w-full ${theme.button.secondary}`}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Interview
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardThemeWrapper>
  );
}
