import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Video,
  Phone,
  Users,
  User,
  Building,
  Search,
  Clock,
  Calendar,
  MessageSquare,
  UserPlus,
  Globe,
  Shield,
  Zap,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { userAPI } from "@/services/api";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  department?: string;
  role?: string;
  avatar?: string;
  status?: "online" | "offline" | "busy" | "away";
  lastSeen?: string;
}

interface Department {
  id: string;
  name: string;
  displayName: string;
  description: string;
  memberCount: number;
  icon: React.ReactNode;
  color: string;
}

interface CallSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCall: (
    callType: "department" | "staff" | "general",
    target: string,
    options?: any,
  ) => void;
  currentDepartment?: string;
}

const departments: Department[] = [
  {
    id: "business-administration",
    name: "business-administration",
    displayName: "Business Administration",
    description: "Executive leadership and strategic planning",
    memberCount: 8,
    icon: <Building className="h-4 w-4" />,
    color: "bg-blue-500",
  },
  {
    id: "accounting",
    name: "accounting",
    displayName: "Accounting",
    description: "Financial management and reporting",
    memberCount: 12,
    icon: <Shield className="h-4 w-4" />,
    color: "bg-green-500",
  },
  {
    id: "hr",
    name: "hr",
    displayName: "Human Resources",
    description: "Employee management and development",
    memberCount: 6,
    icon: <Users className="h-4 w-4" />,
    color: "bg-purple-500",
  },
  {
    id: "digital-marketing",
    name: "digital-marketing",
    displayName: "Digital Marketing",
    description: "Brand promotion and digital campaigns",
    memberCount: 10,
    icon: <Zap className="h-4 w-4" />,
    color: "bg-orange-500",
  },
  {
    id: "project-management",
    name: "project-management",
    displayName: "Project Management",
    description: "Project coordination and delivery",
    memberCount: 15,
    icon: <Calendar className="h-4 w-4" />,
    color: "bg-indigo-500",
  },
  {
    id: "secretariat-admin",
    name: "secretariat-admin",
    displayName: "Secretariat",
    description: "Administrative support and coordination",
    memberCount: 4,
    icon: <MessageSquare className="h-4 w-4" />,
    color: "bg-teal-500",
  },
];

// Mock staff data - in a real app, this would come from an API
const mockStaff: StaffMember[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    department: "business-administration",
    role: "CEO",
    status: "online",
    avatar: "/api/placeholder/32/32",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@company.com",
    department: "accounting",
    role: "CFO",
    status: "online",
    avatar: "/api/placeholder/32/32",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@company.com",
    department: "hr",
    role: "HR Director",
    status: "busy",
    avatar: "/api/placeholder/32/32",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@company.com",
    department: "digital-marketing",
    role: "Marketing Manager",
    status: "online",
    avatar: "/api/placeholder/32/32",
  },
  {
    id: "5",
    name: "Lisa Thompson",
    email: "lisa.thompson@company.com",
    department: "project-management",
    role: "Project Director",
    status: "away",
    lastSeen: "5 minutes ago",
  },
];

const mapUserToStaff = (user: any): StaffMember => {
  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") ||
    user.name ||
    user.email ||
    "Unknown";
  return {
    id: String(user.id),
    name: fullName,
    email: user.email,
    department: user.department,
    role: user.role,
    avatar: user.avatarUrl || undefined,
    status: user.isActive ? "online" : "offline",
    lastSeen: user.lastLogin
      ? new Date(user.lastLogin).toLocaleString()
      : undefined,
  };
};

export default function CallSelectionModal({
  isOpen,
  onClose,
  onStartCall,
  currentDepartment,
}: CallSelectionModalProps) {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCallType, setSelectedCallType] = useState<"video" | "voice">(
    "video",
  );
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<StaffMember[]>([]);
  const [filteredDepartments, setFilteredDepartments] =
    useState<Department[]>(departments);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response: any = await userAPI.getAllUsers();
        const users = Array.isArray(response) ? response : response?.data || [];
        const mapped = users.map(mapUserToStaff);
        setStaff(mapped);
        setFilteredStaff(mapped);
      } catch (e: any) {
        console.error("Failed to load users for call selection:", e);
        setError(e?.message || "Failed to load users");
      } finally {
        setIsLoading(false);
      }
    };
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchTerm) {
      setFilteredStaff(
        staff.filter((member) =>
          [member.name, member.role, member.email]
            .filter(Boolean)
            .some((field) =>
              String(field).toLowerCase().includes(searchTerm.toLowerCase()),
            ),
        ),
      );
      setFilteredDepartments(
        departments.filter(
          (dept) =>
            dept.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            dept.description.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      );
    } else {
      setFilteredStaff(staff);
      setFilteredDepartments(departments);
    }
  }, [searchTerm, staff]);

  const handleDepartmentCall = (department: Department) => {
    onStartCall("department", department.name, {
      title: `${department.displayName} Department Meeting`,
      participants: staff
        .filter((member) => member.department === department.name)
        .map((member) => member.id),
      callType: selectedCallType,
    });
    onClose();
  };

  const handleStaffCall = (staff: StaffMember) => {
    onStartCall("staff", staff.id, {
      title: `Call with ${staff.name}`,
      participants: [staff.id],
      callType: selectedCallType,
      targetUser: staff,
    });
    onClose();
  };

  const handleGeneralCall = () => {
    onStartCall("general", "all-staff", {
      title: "All Staff Meeting",
      participants: staff.map((member) => member.id),
      callType: selectedCallType,
    });
    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "busy":
        return "bg-red-500";
      case "away":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string, lastSeen?: string) => {
    switch (status) {
      case "online":
        return "Online";
      case "busy":
        return "Busy";
      case "away":
        return lastSeen ? `Away - ${lastSeen}` : "Away";
      default:
        return "Offline";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Start a Call
          </DialogTitle>
          <DialogDescription>
            Choose who you'd like to call - a specific department, individual
            staff member, or everyone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Call Type Selection */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <span className="text-sm font-medium">Call Type:</span>
            <div className="flex gap-2">
              <Button
                variant={selectedCallType === "video" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCallType("video")}
                className="gap-2"
              >
                <Video className="h-4 w-4" />
                Video Call
              </Button>
              <Button
                variant={selectedCallType === "voice" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCallType("voice")}
                className="gap-2"
              >
                <Phone className="h-4 w-4" />
                Voice Call
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search departments, staff members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Tabs for different call types */}
          <Tabs defaultValue="departments" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="departments" className="gap-2">
                <Building className="h-4 w-4" />
                Departments
              </TabsTrigger>
              <TabsTrigger value="staff" className="gap-2">
                <User className="h-4 w-4" />
                Staff Members
              </TabsTrigger>
              <TabsTrigger value="general" className="gap-2">
                <Globe className="h-4 w-4" />
                General Meeting
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="departments"
              className="space-y-4 max-h-96 overflow-y-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDepartments.map((department) => (
                  <motion.div
                    key={department.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleDepartmentCall(department)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${department.color} text-white`}
                        >
                          {department.icon}
                        </div>
                        <div>
                          <h3 className="font-medium">
                            {department.displayName}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {department.description}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Users className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {department.memberCount} members
                            </span>
                          </div>
                        </div>
                      </div>
                      {currentDepartment === department.name && (
                        <Badge variant="secondary" className="text-xs">
                          Your Dept
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent
              value="staff"
              className="space-y-4 max-h-96 overflow-y-auto"
            >
              {isLoading && (
                <div className="flex items-center justify-center py-8 text-sm text-gray-500">
                  Loading staff...
                </div>
              )}
              {error && !isLoading && (
                <div className="text-center py-6 text-red-600 text-sm">
                  {error}
                </div>
              )}
              {!isLoading && !error && (
                <div className="space-y-2">
                  {filteredStaff.length === 0 ? (
                    <div className="text-center py-8 text-sm text-gray-500">
                      No staff found.
                    </div>
                  ) : (
                    filteredStaff.map((staff) => (
                      <motion.div
                        key={staff.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center justify-between p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleStaffCall(staff)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={staff.avatar}
                                alt={staff.name}
                              />
                              <AvatarFallback>
                                {staff.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div
                              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(staff.status || "offline")}`}
                            />
                          </div>
                          <div>
                            <h3 className="font-medium">{staff.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {staff.role || "User"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {departments.find(
                                (d) => d.name === staff.department,
                              )?.displayName ||
                                staff.department ||
                                "No department"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant={
                              (staff.status || "offline") === "online"
                                ? "default"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {getStatusText(
                              staff.status || "offline",
                              staff.lastSeen,
                            )}
                          </Badge>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="general" className="space-y-4">
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  All Staff Meeting
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Start a company-wide meeting that will notify all staff
                  members across all departments. Perfect for announcements,
                  all-hands meetings, or emergency communications.
                </p>
                <Button
                  onClick={handleGeneralCall}
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white gap-2"
                >
                  {selectedCallType === "video" ? (
                    <Video className="h-5 w-5" />
                  ) : (
                    <Phone className="h-5 w-5" />
                  )}
                  Start All Staff{" "}
                  {selectedCallType === "video" ? "Video" : "Voice"} Meeting
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
