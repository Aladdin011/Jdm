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

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
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
  const [isLoading, setIsLoading] = useState(true);

  // Mock user data
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: "1",
        email: "admin@jdmarcconstructions.com",
        firstName: "Admin",
        lastName: "User",
        role: "admin",
        company: "JD Marc Constructions",
        phone: "+234 803 000 0000",
        location: "Abuja, Nigeria",
        createdAt: "2023-01-15T10:00:00Z",
        lastActive: "2024-01-15T14:30:00Z",
        status: "active",
      },
      {
        id: "2",
        email: "john.doe@example.com",
        firstName: "John",
        lastName: "Doe",
        role: "user",
        company: "ABC Construction Ltd",
        phone: "+234 803 000 0001",
        location: "Lagos, Nigeria",
        createdAt: "2023-02-20T09:15:00Z",
        lastActive: "2024-01-14T16:45:00Z",
        status: "active",
      },
      {
        id: "3",
        email: "sarah.wilson@builders.com",
        firstName: "Sarah",
        lastName: "Wilson",
        role: "user",
        company: "Wilson Builders",
        phone: "+234 803 000 0002",
        location: "Port Harcourt, Nigeria",
        createdAt: "2023-03-10T11:30:00Z",
        lastActive: "2024-01-13T10:20:00Z",
        status: "active",
      },
      {
        id: "4",
        email: "mike.johnson@engineering.com",
        firstName: "Mike",
        lastName: "Johnson",
        role: "admin",
        company: "Johnson Engineering",
        phone: "+234 803 000 0003",
        location: "Kano, Nigeria",
        createdAt: "2023-04-05T08:45:00Z",
        lastActive: "2024-01-12T12:10:00Z",
        status: "active",
      },
      {
        id: "5",
        email: "inactive.user@example.com",
        firstName: "Inactive",
        lastName: "User",
        role: "user",
        company: "Old Company",
        phone: "+234 803 000 0004",
        location: "Kaduna, Nigeria",
        createdAt: "2023-01-01T12:00:00Z",
        lastActive: "2023-12-01T15:30:00Z",
        status: "inactive",
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
      user.company?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRole === "all" || user.role === selectedRole;

    return matchesSearch && matchesRole;
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

  const stats = [
    {
      title: "Total Users",
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
      title: "Active Users",
      value: users.filter((u) => u.status === "active").length.toString(),
      icon: Activity,
      color: "#C2CCC5",
    },
    {
      title: "New This Month",
      value: users
        .filter((u) => {
          const userDate = new Date(u.createdAt);
          const now = new Date();
          return (
            userDate.getMonth() === now.getMonth() &&
            userDate.getFullYear() === now.getFullYear()
          );
        })
        .length.toString(),
      icon: Plus,
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
          <p className="text-[#142E54] font-medium">Loading admin panel...</p>
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
                Admin Panel
              </h1>
              <p className="text-[#A7967E] mt-1">
                Welcome back, {currentUser?.firstName}! Manage users and system
                settings.
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

        {/* User Management */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-[#142E54] flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                  <CardDescription>
                    Manage user accounts, roles, and permissions
                  </CardDescription>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#A7967E]" />
                    <Input
                      placeholder="Search users..."
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
                    <option value="user">Users</option>
                    <option value="admin">Admins</option>
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
                            <div className="flex items-center gap-2 mt-1">
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-[#A7967E]">
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
                          {user.company && (
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              {user.company}
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
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete the user account for{" "}
                                    {user.firstName} {user.lastName} (
                                    {user.email}).
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Delete User
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
                      No users found matching your criteria.
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
