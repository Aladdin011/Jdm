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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Key,
  Plus,
  MoreHorizontal,
  RefreshCw,
  Trash2,
  Copy,
  Calendar,
  User,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  EyeOff,
} from "lucide-react";

interface UniqueKey {
  id: string;
  keyValue: string;
  departmentId: string;
  departmentName: string;
  prefix: string;
  assignedTo?: string;
  assignedEmail?: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
  isExpired: boolean;
  lastUsed?: string;
  usageCount: number;
  createdBy: string;
}

interface Department {
  id: string;
  name: string;
  prefix: string;
  description: string;
}

const departments: Department[] = [
  {
    id: "accounting",
    name: "Accounting & Finance",
    prefix: "AC",
    description: "Financial management and reporting",
  },
  {
    id: "hr",
    name: "Human Resources",
    prefix: "HR",
    description: "Personnel and organizational development",
  },
  {
    id: "project-management",
    name: "Project Management",
    prefix: "PM",
    description: "Project oversight and execution",
  },
  {
    id: "business-development",
    name: "Business Development",
    prefix: "BD",
    description: "Strategic growth and partnerships",
  },
  {
    id: "digital-marketing",
    name: "Digital Marketing",
    prefix: "DM",
    description: "Marketing and communications",
  },
  {
    id: "secretariat-admin",
    name: "Secretariat & Administration",
    prefix: "SA",
    description: "Administrative support and coordination",
  },
  {
    id: "business-administration",
    name: "Business Administration",
    prefix: "BA",
    description: "Governance and policy management",
  },
];

export default function UniqueKeyManager() {
  const [uniqueKeys, setUniqueKeys] = useState<UniqueKey[]>([]);
  const [filteredKeys, setFilteredKeys] = useState<UniqueKey[]>([]);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [assignedEmail, setAssignedEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [showKeyValues, setShowKeyValues] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockKeys: UniqueKey[] = [
      {
        id: "1",
        keyValue: "AC1234",
        departmentId: "accounting",
        departmentName: "Accounting & Finance",
        prefix: "AC",
        assignedTo: "John Doe",
        assignedEmail: "john.doe@jdmarcng.com",
        createdAt: "2024-01-15T10:00:00Z",
        expiresAt: "2024-01-22T10:00:00Z",
        isActive: true,
        isExpired: false,
        lastUsed: "2024-01-20T14:30:00Z",
        usageCount: 5,
        createdBy: "Admin User",
      },
      {
        id: "2",
        keyValue: "HR5678",
        departmentId: "hr",
        departmentName: "Human Resources",
        prefix: "HR",
        assignedTo: "Jane Smith",
        assignedEmail: "jane.smith@jdmarcng.com",
        createdAt: "2024-01-10T09:00:00Z",
        expiresAt: "2024-01-17T09:00:00Z",
        isActive: false,
        isExpired: true,
        lastUsed: "2024-01-16T11:15:00Z",
        usageCount: 12,
        createdBy: "Admin User",
      },
      {
        id: "3",
        keyValue: "PM9012",
        departmentId: "project-management",
        departmentName: "Project Management",
        prefix: "PM",
        assignedTo: "Mike Johnson",
        assignedEmail: "mike.johnson@jdmarcng.com",
        createdAt: "2024-01-18T14:00:00Z",
        expiresAt: "2024-01-25T14:00:00Z",
        isActive: true,
        isExpired: false,
        usageCount: 2,
        createdBy: "Admin User",
      },
    ];

    setUniqueKeys(mockKeys);
    setFilteredKeys(mockKeys);
  }, []);

  // Filter keys based on search and filters
  useEffect(() => {
    let filtered = uniqueKeys;

    if (searchTerm) {
      filtered = filtered.filter(
        (key) =>
          key.keyValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
          key.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          key.assignedEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          key.departmentName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((key) => {
        switch (filterStatus) {
          case "active":
            return key.isActive && !key.isExpired;
          case "expired":
            return key.isExpired;
          case "inactive":
            return !key.isActive;
          default:
            return true;
        }
      });
    }

    if (filterDepartment !== "all") {
      filtered = filtered.filter(
        (key) => key.departmentId === filterDepartment,
      );
    }

    setFilteredKeys(filtered);
  }, [uniqueKeys, searchTerm, filterStatus, filterDepartment]);

  const generateUniqueKey = async () => {
    if (!selectedDepartment) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const department = departments.find((d) => d.id === selectedDepartment);
      if (!department) return;

      // Generate 4-digit random number
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const keyValue = `${department.prefix}${randomNum}`;

      const newKey: UniqueKey = {
        id: Date.now().toString(),
        keyValue,
        departmentId: selectedDepartment,
        departmentName: department.name,
        prefix: department.prefix,
        assignedTo: assignedTo || undefined,
        assignedEmail: assignedEmail || undefined,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
        isExpired: false,
        usageCount: 0,
        createdBy: "Current Admin", // In real app, use actual admin user
      };

      setUniqueKeys((prev) => [newKey, ...prev]);
      setIsGenerateModalOpen(false);
      setSelectedDepartment("");
      setAssignedTo("");
      setAssignedEmail("");
    } catch (error) {
      console.error("Failed to generate key:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const revokeKey = async (keyId: string) => {
    setUniqueKeys((prev) =>
      prev.map((key) => (key.id === keyId ? { ...key, isActive: false } : key)),
    );
  };

  const regenerateKey = async (keyId: string) => {
    const existingKey = uniqueKeys.find((k) => k.id === keyId);
    if (!existingKey) return;

    // Generate new 4-digit number
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newKeyValue = `${existingKey.prefix}${randomNum}`;

    setUniqueKeys((prev) =>
      prev.map((key) =>
        key.id === keyId
          ? {
              ...key,
              keyValue: newKeyValue,
              createdAt: new Date().toISOString(),
              expiresAt: new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000,
              ).toISOString(),
              isActive: true,
              isExpired: false,
              usageCount: 0,
            }
          : key,
      ),
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // In real app, show toast notification
  };

  const getStatusBadge = (key: UniqueKey) => {
    if (key.isExpired) {
      return (
        <Badge variant="destructive" className="gap-1">
          <Clock className="h-3 w-3" />
          Expired
        </Badge>
      );
    }
    if (!key.isActive) {
      return (
        <Badge variant="secondary" className="gap-1">
          <AlertTriangle className="h-3 w-3" />
          Revoked
        </Badge>
      );
    }
    return (
      <Badge variant="default" className="gap-1 bg-green-500">
        <CheckCircle className="h-3 w-3" />
        Active
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDaysUntilExpiry = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-arch-charcoal flex items-center gap-2">
            <Key className="h-6 w-6 text-arch-orange" />
            UniqueKey Management
          </h2>
          <p className="text-arch-blue-gray">
            Generate and manage 7-day access keys for staff departments
          </p>
        </div>

        <Dialog
          open={isGenerateModalOpen}
          onOpenChange={setIsGenerateModalOpen}
        >
          <DialogTrigger asChild>
            <Button className="bg-arch-orange hover:bg-arch-rust text-white">
              <Plus className="h-4 w-4 mr-2" />
              Generate New Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-arch-orange" />
                Generate UniqueKey
              </DialogTitle>
              <DialogDescription>
                Create a new 7-day access key for a department
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select
                  value={selectedDepartment}
                  onValueChange={setSelectedDepartment}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-6 bg-arch-orange/20 rounded text-xs font-mono flex items-center justify-center text-arch-orange">
                            {dept.prefix}
                          </div>
                          <span>{dept.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedTo">Assigned To (Optional)</Label>
                <Input
                  id="assignedTo"
                  placeholder="Staff member name"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedEmail">Email (Optional)</Label>
                <Input
                  id="assignedEmail"
                  type="email"
                  placeholder="staff@jdmarcng.com"
                  value={assignedEmail}
                  onChange={(e) => setAssignedEmail(e.target.value)}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2 text-blue-700">
                  <Shield className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-medium mb-1">Key Details:</p>
                    <ul className="space-y-1">
                      <li>
                        • Format:{" "}
                        {selectedDepartment
                          ? departments.find((d) => d.id === selectedDepartment)
                              ?.prefix || "XX"
                          : "XX"}
                        #### (prefix + 4 digits)
                      </li>
                      <li>• Expires: 7 days from creation</li>
                      <li>• Single use per login session</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsGenerateModalOpen(false)}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={generateUniqueKey}
                  disabled={!selectedDepartment || isLoading}
                  className="flex-1 bg-arch-orange hover:bg-arch-rust text-white"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Generating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Generate Key
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search keys, staff, or email..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="inactive">Revoked</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filterDepartment}
              onValueChange={setFilterDepartment}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setShowKeyValues(!showKeyValues)}
              className="gap-2"
            >
              {showKeyValues ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              {showKeyValues ? "Hide" : "Show"} Keys
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Keys Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Active UniqueKeys ({filteredKeys.length})</span>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredKeys.map((key, index) => (
                    <motion.tr
                      key={key.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="group"
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="font-mono text-sm bg-arch-light-blue/20 px-2 py-1 rounded">
                            {showKeyValues ? key.keyValue : "••••••"}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(key.keyValue)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-4 bg-arch-orange/20 rounded text-xs font-mono flex items-center justify-center text-arch-orange">
                            {key.prefix}
                          </div>
                          <span className="text-sm">{key.departmentName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {key.assignedTo ? (
                          <div>
                            <div className="font-medium text-sm">
                              {key.assignedTo}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {key.assignedEmail}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            Unassigned
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(key)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">
                            {formatDate(key.expiresAt)}
                          </div>
                          {!key.isExpired && (
                            <div className="text-xs text-muted-foreground">
                              {getDaysUntilExpiry(key.expiresAt)} days left
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="text-sm font-medium">
                            {key.usageCount}
                          </div>
                          {key.lastUsed && (
                            <div className="text-xs text-muted-foreground">
                              Last: {formatDate(key.lastUsed)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => copyToClipboard(key.keyValue)}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Key
                            </DropdownMenuItem>
                            {key.isActive && !key.isExpired && (
                              <DropdownMenuItem
                                onClick={() => regenerateKey(key.id)}
                              >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Regenerate
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {key.isActive && (
                              <DropdownMenuItem
                                onClick={() => revokeKey(key.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Revoke
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>

            {filteredKeys.length === 0 && (
              <div className="text-center py-12">
                <Key className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  No UniqueKeys Found
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm ||
                  filterStatus !== "all" ||
                  filterDepartment !== "all"
                    ? "Try adjusting your search or filters"
                    : "Generate your first UniqueKey to get started"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
