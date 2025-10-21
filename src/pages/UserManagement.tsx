import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { userAPI } from "@/services/api";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Users,
  Shield,
  Search,
  Crown,
  UserCheck,
  UserX,
  Building,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Activity,
  Edit,
  Trash2,
  RefreshCw,
  ArrowLeft,
  UserPlus,
  Settings,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

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
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

interface UserActionState {
  isUpdating: boolean;
  userId: string | null;
}

const DEPARTMENTS = [
  { value: "secretariat-admin", label: "Secretariat/Admin" },
  { value: "business-development", label: "Business Development" },
  { value: "project-management", label: "Project Management" },
  { value: "accounting", label: "Accounting" },
  { value: "human-resources", label: "Human Resources" },
  { value: "digital-marketing", label: "Digital Marketing" },
];

export default function UserManagement() {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [actionState, setActionState] = useState<UserActionState>({
    isUpdating: false,
    userId: null,
  });

  // Load users from API
  useEffect(() => {
    loadUsers();
  }, []);

  // Filter users based on search and filters
  useEffect(() => {
    let filtered = users;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.department?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Role filter
    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Department filter
    if (departmentFilter !== "all") {
      filtered = filtered.filter(
        (user) => user.department === departmentFilter,
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      filtered = filtered.filter((user) => user.isActive === isActive);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter, departmentFilter, statusFilter]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const payload: any = await userAPI.getAllUsers();
      const list: any[] = Array.isArray(payload) ? payload : (payload?.users || payload?.data || []);

      // Normalize backend fields to UI shape
      const normalized: User[] = list.map((u: any) => ({
        id: String(u.id ?? u.userId ?? u.uid ?? ''),
        email: u.email ?? '',
        firstName: u.firstName ?? u.firstname ?? '',
        lastName: u.lastName ?? u.lastname ?? '',
        role: (u.role ?? 'user') as 'user' | 'admin',
        department: u.department ?? u.department_code ?? undefined,
        company: u.company ?? undefined,
        phone: u.phone ?? undefined,
        location: u.location ?? undefined,
        isActive: (u.active ?? u.isActive ?? true) as boolean,
        createdAt: (u.created_at ?? u.createdAt ?? new Date().toISOString()) as string,
        updatedAt: (u.updated_at ?? u.updatedAt ?? new Date().toISOString()) as string,
        lastLogin: u.lastLogin ?? u.last_login ?? undefined,
      }));

      setUsers(normalized);
    } catch (error: any) {
      console.error("Failed to load users:", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to load users. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: "user" | "admin") => {
    setActionState({ isUpdating: true, userId });
    try {
      const response = await userAPI.updateUserRole(userId, newRole);
      if (response.success) {
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user,
          ),
        );
        toast({
          title: "Success",
          description: `User role updated to ${newRole}`,
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Failed to update user role:", error);
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionState({ isUpdating: false, userId: null });
    }
  };

  const updateUserDepartment = async (userId: string, department: string) => {
    setActionState({ isUpdating: true, userId });
    try {
      // Note: This API endpoint may need to be added to your backend
      const response = await userAPI.updateUserDepartment?.(userId, department);

      // supabaseService returns { data, error } objects
      if (response && !response.error) {
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, department } : user,
          ),
        );
        toast({
          title: "Success",
          description: "User department updated successfully",
        });
      } else {
        throw new Error(response.error || "Failed to update department");
      }
    } catch (error) {
      console.error("Failed to update user department:", error);
      toast({
        title: "Error",
        description: "Failed to update user department. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionState({ isUpdating: false, userId: null });
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    setActionState({ isUpdating: true, userId });
    try {
      const response = currentStatus
        ? await userAPI.deactivateUser(userId)
        : await userAPI.activateUser(userId);

      if (response.success) {
        setUsers(
          users.map((user) =>
            user.id === userId ? { ...user, isActive: !currentStatus } : user,
          ),
        );
        toast({
          title: "Success",
          description: `User ${!currentStatus ? "activated" : "deactivated"} successfully`,
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Failed to toggle user status:", error);
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionState({ isUpdating: false, userId: null });
    }
  };

  const deleteUser = async (userId: string) => {
    setActionState({ isUpdating: true, userId });
    try {
      const response = await userAPI.deleteUser(userId);
      if (response.success) {
        setUsers(users.filter((user) => user.id !== userId));
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActionState({ isUpdating: false, userId: null });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDepartmentLabel = (departmentValue?: string) => {
    const dept = DEPARTMENTS.find((d) => d.value === departmentValue);
    return dept?.label || departmentValue || "Not Assigned";
  };

  const isCurrentUserBeingUpdated = (userId: string) => {
    return actionState.isUpdating && actionState.userId === userId;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EAE6DF] to-[#C2CCC5]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#142E54] mx-auto mb-4"></div>
          <p className="text-[#142E54] font-medium">
            Loading user management...
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
            <div className="flex items-center gap-4">
              <Link
                to="/admin"
                className="flex items-center gap-2 text-[#A7967E] hover:text-[#142E54] transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                Back to Admin
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-[#142E54] flex items-center gap-2">
                  <Users className="h-8 w-8 text-[#A7967E]" />
                  User Management
                </h1>
                <p className="text-[#A7967E] mt-1">
                  Manage user accounts, roles, and department assignments
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={loadUsers}
                variant="outline"
                className="border-[#A7967E] text-[#A7967E] hover:bg-[#A7967E] hover:text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#A7967E] uppercase tracking-wide">
                    Total Users
                  </p>
                  <p className="text-3xl font-bold text-[#142E54] mt-2">
                    {users.length}
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
                  <p className="text-sm font-medium text-[#A7967E] uppercase tracking-wide">
                    Admin Users
                  </p>
                  <p className="text-3xl font-bold text-[#142E54] mt-2">
                    {users.filter((u) => u.role === "admin").length}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Crown className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#A7967E] uppercase tracking-wide">
                    Active Users
                  </p>
                  <p className="text-3xl font-bold text-[#142E54] mt-2">
                    {users.filter((u) => u.isActive).length}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#A7967E] uppercase tracking-wide">
                    Unassigned
                  </p>
                  <p className="text-3xl font-bold text-[#142E54] mt-2">
                    {users.filter((u) => !u.department).length}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <UserPlus className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#A7967E]" />
                  <Input
                    placeholder="Search users by name, email, or department..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={departmentFilter}
                    onValueChange={setDepartmentFilter}
                  >
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept.value} value={dept.value}>
                          {dept.label}
                        </SelectItem>
                      ))}
                      <SelectItem value="">Not Assigned</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-[#142E54] flex items-center gap-2">
                <Users className="h-5 w-5" />
                User Accounts ({filteredUsers.length})
              </CardTitle>
              <CardDescription>
                Manage user roles, departments, and account status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          <div>
                            <p className="font-semibold text-[#142E54]">
                              {user.firstName} {user.lastName}
                            </p>
                            {user.phone && (
                              <p className="text-sm text-gray-500">
                                {user.phone}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Select
                              value={user.role}
                              onValueChange={(newRole: "user" | "admin") =>
                                updateUserRole(user.id, newRole)
                              }
                              disabled={
                                user.id === currentUser?.id ||
                                isCurrentUserBeingUpdated(user.id)
                              }
                            >
                              <SelectTrigger className="w-24">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                            {user.role === "admin" && (
                              <Crown className="h-4 w-4 text-purple-600" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select
                            value={user.department || ""}
                            onValueChange={(department) =>
                              updateUserDepartment(user.id, department)
                            }
                            disabled={isCurrentUserBeingUpdated(user.id)}
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Not Assigned" />
                            </SelectTrigger>
                            <SelectContent>
                              {DEPARTMENTS.map((dept) => (
                                <SelectItem key={dept.value} value={dept.value}>
                                  {dept.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={user.isActive ? "default" : "secondary"}
                              className={
                                user.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {user.isActive ? (
                                <>
                                  <UserCheck className="h-3 w-3 mr-1" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <UserX className="h-3 w-3 mr-1" />
                                  Inactive
                                </>
                              )}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{formatDate(user.createdAt)}</p>
                            {user.lastLogin && (
                              <p className="text-gray-500">
                                Last: {formatDate(user.lastLogin)}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {user.id !== currentUser?.id && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    toggleUserStatus(user.id, user.isActive)
                                  }
                                  disabled={isCurrentUserBeingUpdated(user.id)}
                                  className={
                                    user.isActive
                                      ? "border-orange-500 text-orange-600 hover:bg-orange-50"
                                      : "border-green-500 text-green-600 hover:bg-green-50"
                                  }
                                >
                                  {isCurrentUserBeingUpdated(user.id) ? (
                                    <RefreshCw className="h-3 w-3 animate-spin" />
                                  ) : user.isActive ? (
                                    <>
                                      <UserX className="h-3 w-3 mr-1" />
                                      Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="h-3 w-3 mr-1" />
                                      Activate
                                    </>
                                  )}
                                </Button>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-red-500 text-red-600 hover:bg-red-50"
                                      disabled={isCurrentUserBeingUpdated(
                                        user.id,
                                      )}
                                    >
                                      <Trash2 className="h-3 w-3 mr-1" />
                                      Delete
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Delete User Account
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to permanently
                                        delete{" "}
                                        <strong>
                                          {user.firstName} {user.lastName}
                                        </strong>{" "}
                                        ({user.email})? This action cannot be
                                        undone and will remove all associated
                                        data.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => deleteUser(user.id)}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        Delete User
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-[#A7967E] mx-auto mb-4" />
                    <p className="text-[#A7967E] text-lg font-medium">
                      No users found
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Try adjusting your search criteria or filters
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
