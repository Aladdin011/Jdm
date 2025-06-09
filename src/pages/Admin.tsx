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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users,
  Shield,
  Trash2,
  Search,
  Plus,
  Settings,
  Activity,
  Crown,
  UserMinus,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Building,
  Briefcase,
  UserCheck,
  DollarSign,
  Heart,
  Megaphone,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { departments } from "@/data/team";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
  department?: string;
  company?: string;
  phone?: string;
  location?: string;
  createdAt: string;
  lastActive?: string;
  status: "active" | "inactive";
}

export default function Admin() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<"all" | "user" | "admin">(
    "all",
  );
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);

  // Mock user data with JD Marc departments
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: "1",
        email: "jude.onwudebe@jdmarcng.com",
        firstName: "Jude",
        lastName: "Onwudebe",
        role: "admin",
        department: "Managing Director",
        company: "JD Marc Construction",
        phone: "+234 803 706 5497",
        location: "Abuja, Nigeria",
        createdAt: "2023-01-15T10:00:00Z",
        lastActive: "2024-01-15T14:30:00Z",
        status: "active",
      },
      {
        id: "2",
        email: "donatus.oduopara@jdmarcng.com",
        firstName: "Donatus",
        lastName: "Oduopara",
        role: "admin",
        department: "Project",
        company: "JD Marc Construction",
        phone: "+234 803 000 0001",
        location: "Abuja, Nigeria",
        createdAt: "2023-01-15T10:00:00Z",
        lastActive: "2024-01-14T16:45:00Z",
        status: "active",
      },
      {
        id: "3",
        email: "james.abel@jdmarcng.com",
        firstName: "James",
        lastName: "Abel",
        role: "admin",
        department: "Project",
        company: "JD Marc Construction",
        phone: "+234 803 000 0002",
        location: "Abuja, Nigeria",
        createdAt: "2023-01-15T10:00:00Z",
        lastActive: "2024-01-13T10:20:00Z",
        status: "active",
      },
      {
        id: "4",
        email: "sarah.admin@jdmarcng.com",
        firstName: "Sarah",
        lastName: "Okafor",
        role: "user",
        department: "Secretariat/Admin",
        company: "JD Marc Construction",
        phone: "+234 803 000 0003",
        location: "Abuja, Nigeria",
        createdAt: "2023-04-05T08:45:00Z",
        lastActive: "2024-01-12T12:10:00Z",
        status: "active",
      },
      {
        id: "5",
        email: "michael.business@jdmarcng.com",
        firstName: "Michael",
        lastName: "Adebayo",
        role: "user",
        department: "Business Development",
        company: "JD Marc Construction",
        phone: "+234 803 000 0004",
        location: "Lagos, Nigeria",
        createdAt: "2023-03-01T12:00:00Z",
        lastActive: "2024-01-11T15:30:00Z",
        status: "active",
      },
      {
        id: "6",
        email: "grace.account@jdmarcng.com",
        firstName: "Grace",
        lastName: "Nwosu",
        role: "user",
        department: "Account",
        company: "JD Marc Construction",
        phone: "+234 803 000 0005",
        location: "Abuja, Nigeria",
        createdAt: "2023-05-15T09:00:00Z",
        lastActive: "2024-01-10T11:20:00Z",
        status: "active",
      },
      {
        id: "7",
        email: "david.hr@jdmarcng.com",
        firstName: "David",
        lastName: "Emeka",
        role: "user",
        department: "Human Resources (HR)",
        company: "JD Marc Construction",
        phone: "+234 803 000 0006",
        location: "Abuja, Nigeria",
        createdAt: "2023-06-10T14:30:00Z",
        lastActive: "2024-01-09T09:45:00Z",
        status: "active",
      },
      {
        id: "8",
        email: "joy.marketing@jdmarcng.com",
        firstName: "Joy",
        lastName: "Okoro",
        role: "user",
        department: "Digital Marketing",
        company: "JD Marc Construction",
        phone: "+234 803 000 0007",
        location: "Lagos, Nigeria",
        createdAt: "2023-07-20T16:15:00Z",
        lastActive: "2024-01-08T13:30:00Z",
        status: "active",
      },
    ];

    setTimeout(() => {
      setUsers(mockUsers);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesDepartment =
      selectedDepartment === "all" || user.department === selectedDepartment;

    return matchesSearch && matchesRole && matchesDepartment;
  });

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const handleToggleRole = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, role: user.role === "admin" ? "user" : "admin" }
          : user,
      ),
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case "Secretariat/Admin":
        return <Settings className="h-4 w-4" />;
      case "Business Development":
        return <Briefcase className="h-4 w-4" />;
      case "Project":
        return <Building className="h-4 w-4" />;
      case "Account":
        return <DollarSign className="h-4 w-4" />;
      case "Human Resources (HR)":
        return <Heart className="h-4 w-4" />;
      case "Digital Marketing":
        return <Megaphone className="h-4 w-4" />;
      case "Managing Director":
        return <Crown className="h-4 w-4" />;
      default:
        return <UserCheck className="h-4 w-4" />;
    }
  };

  const stats = [
    {
      title: "Total Staff",
      value: users.length.toString(),
      icon: Users,
      color: "#A7967E",
    },
    {
      title: "Admin Users",
      value: users.filter((u) => u.role === "admin").length.toString(),
      icon: Crown,
      color: "#142E54",
    },
    {
      title: "Active Departments",
      value: new Set(users.map((u) => u.department)).size.toString(),
      icon: Building,
      color: "#C2CCC5",
    },
    {
      title: "Active Users",
      value: users.filter((u) => u.status === "active").length.toString(),
      icon: Activity,
      color: "#A7967E",
    },
  ];

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
            Loading JD Marc admin panel...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAE6DF] to-[#C2CCC5]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-[#A7967E]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold text-[#142E54] flex items-center gap-2">
                <Shield className="h-8 w-8 text-[#A7967E]" />
                JD Marc Admin Panel
              </h1>
              <p className="text-[#A7967E] mt-1">
                Welcome back, {currentUser?.firstName}! Manage staff and
                department operations.
              </p>
            </div>
            <Button
              className="text-white"
              style={{ backgroundColor: "#A7967E" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#C2CCC5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#A7967E";
              }}
            >
              <Settings className="h-4 w-4 mr-2" />
              System Settings
            </Button>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#A7967E] uppercase tracking-wide">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-[#142E54] mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className="p-3 rounded-full"
                    style={{ backgroundColor: `${stat.color}20` }}
                  >
                    <stat.icon
                      className="h-6 w-6"
                      style={{ color: stat.color }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Departments Overview */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#142E54]">
                Department Structure
              </CardTitle>
              <CardDescription>
                JD Marc Construction organizational departments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departments.map((dept) => (
                  <div
                    key={dept.id}
                    className="p-4 border border-[#A7967E]/20 rounded-lg"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {getDepartmentIcon(dept.name)}
                      <h4 className="font-semibold text-[#142E54]">
                        {dept.name}
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {dept.description}
                    </p>
                    <p className="text-xs text-accent font-medium">
                      {dept.hodRole}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Staff Management */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <CardTitle className="text-[#142E54] flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Staff Management
                  </CardTitle>
                  <CardDescription>
                    Manage JD Marc Construction staff accounts and departments
                  </CardDescription>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#A7967E]" />
                    <Input
                      placeholder="Search staff..."
                      className="pl-10 w-full sm:w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Role Filter */}
                  <select
                    className="px-3 py-2 border border-[#A7967E]/30 rounded-md focus:outline-none focus:border-[#A7967E] focus:ring-1 focus:ring-[#A7967E]"
                    value={selectedRole}
                    onChange={(e) =>
                      setSelectedRole(
                        e.target.value as "all" | "user" | "admin",
                      )
                    }
                  >
                    <option value="all">All Roles</option>
                    <option value="user">Staff</option>
                    <option value="admin">Admin</option>
                  </select>

                  {/* Department Filter */}
                  <select
                    className="px-3 py-2 border border-[#A7967E]/30 rounded-md focus:outline-none focus:border-[#A7967E] focus:ring-1 focus:ring-[#A7967E]"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    <option value="all">All Departments</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.name}>
                        {dept.name}
                      </option>
                    ))}
                    <option value="Managing Director">Managing Director</option>
                  </select>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 border border-[#A7967E]/20 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      {/* User Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-[#142E54] text-lg">
                              {user.firstName} {user.lastName}
                            </h4>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <Badge
                                variant="secondary"
                                className={`${
                                  user.role === "admin"
                                    ? "bg-[#142E54] text-white"
                                    : "bg-[#A7967E] text-white"
                                }`}
                              >
                                {user.role === "admin" ? (
                                  <Crown className="h-3 w-3 mr-1" />
                                ) : (
                                  <Users className="h-3 w-3 mr-1" />
                                )}
                                {user.role.toUpperCase()}
                              </Badge>
                              {user.department && (
                                <Badge
                                  variant="outline"
                                  className="border-[#A7967E] text-[#A7967E]"
                                >
                                  {getDepartmentIcon(user.department)}
                                  <span className="ml-1">
                                    {user.department}
                                  </span>
                                </Badge>
                              )}
                              <Badge
                                variant="secondary"
                                className={`${
                                  user.status === "active"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {user.status}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-[#A7967E]">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {user.phone}
                            </div>
                          )}
                          {user.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              {user.location}
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Joined {formatDate(user.createdAt)}
                          </div>
                          {user.lastActive && (
                            <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4" />
                              Last active {formatDate(user.lastActive)}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {user.id !== currentUser?.id && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleRole(user.id)}
                              className="border-[#A7967E] text-[#A7967E] hover:bg-[#A7967E] hover:text-white"
                            >
                              {user.role === "admin" ? (
                                <>
                                  <UserMinus className="h-4 w-4 mr-1" />
                                  Demote
                                </>
                              ) : (
                                <>
                                  <Crown className="h-4 w-4 mr-1" />
                                  Promote
                                </>
                              )}
                            </Button>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Remove
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently remove {user.firstName}{" "}
                                    {user.lastName} ({user.email}) from the JD
                                    Marc Construction system.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Remove Staff
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {filteredUsers.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-[#A7967E] mx-auto mb-4" />
                    <p className="text-[#A7967E]">
                      No staff found matching your criteria.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
