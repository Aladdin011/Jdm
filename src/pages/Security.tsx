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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  Lock,
  Eye,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  Users,
  Globe,
  Clock,
  Search,
  Filter,
  Download,
  RefreshCw,
  ArrowLeft,
  Key,
  Fingerprint,
  Wifi,
  Server,
  Database,
  FileText,
  Bell,
  Settings,
  Zap,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SecurityLog {
  id: string;
  timestamp: string;
  event: string;
  user: string;
  ipAddress: string;
  location: string;
  status: "success" | "failed" | "warning";
  details: string;
}

interface SecurityMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: "good" | "warning" | "critical";
  trend: "up" | "down" | "stable";
  lastUpdated: string;
}

interface ThreatAlert {
  id: string;
  type: "malware" | "intrusion" | "suspicious" | "policy";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
  affectedSystems: string[];
}

export default function Security() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [timeRange, setTimeRange] = useState("24h");

  const [securityMetrics, setSecurityMetrics] = useState<SecurityMetric[]>([
    {
      id: "1",
      name: "Active Sessions",
      value: 156,
      unit: "sessions",
      status: "good",
      trend: "stable",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Failed Login Attempts",
      value: 12,
      unit: "attempts",
      status: "warning",
      trend: "up",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Security Score",
      value: 87,
      unit: "%",
      status: "good",
      trend: "up",
      lastUpdated: new Date().toISOString(),
    },
    {
      id: "4",
      name: "Threats Blocked",
      value: 3,
      unit: "threats",
      status: "good",
      trend: "down",
      lastUpdated: new Date().toISOString(),
    },
  ]);

  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([
    {
      id: "1",
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      event: "User Login",
      user: "admin@jdmarc.ng",
      ipAddress: "192.168.1.100",
      location: "Lagos, Nigeria",
      status: "success",
      details: "Successful login from trusted device",
    },
    {
      id: "2",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      event: "Failed Login",
      user: "unknown@example.com",
      ipAddress: "203.0.113.45",
      location: "Unknown",
      status: "failed",
      details: "Invalid credentials - account locked after 3 attempts",
    },
    {
      id: "3",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      event: "Password Change",
      user: "user@jdmarc.ng",
      ipAddress: "192.168.1.105",
      location: "Abuja, Nigeria",
      status: "success",
      details: "Password updated successfully",
    },
    {
      id: "4",
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      event: "Suspicious Activity",
      user: "test@jdmarc.ng",
      ipAddress: "198.51.100.23",
      location: "Unknown",
      status: "warning",
      details: "Multiple rapid login attempts detected",
    },
  ]);

  const [threatAlerts, setThreatAlerts] = useState<ThreatAlert[]>([
    {
      id: "1",
      type: "suspicious",
      severity: "medium",
      title: "Unusual Login Pattern",
      description:
        "Multiple login attempts from different locations within short timeframe",
      timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
      resolved: false,
      affectedSystems: ["Authentication System"],
    },
    {
      id: "2",
      type: "policy",
      severity: "low",
      title: "Password Policy Violation",
      description: "User attempted to set weak password",
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      resolved: true,
      affectedSystems: ["User Management"],
    },
  ]);

  useEffect(() => {
    loadSecurityData();
  }, [timeRange]);

  const loadSecurityData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to load security data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Security data loaded successfully");
    } catch (error) {
      toast.error("Failed to load security data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadSecurityData();
  };

  const handleResolveAlert = async (alertId: string) => {
    try {
      setThreatAlerts((prev) =>
        prev.map((alert) =>
          alert.id === alertId ? { ...alert, resolved: true } : alert,
        ),
      );
      toast.success("Alert resolved successfully");
    } catch (error) {
      toast.error("Failed to resolve alert");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
      case "good":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "failed":
      case "critical":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "text-blue-600 bg-blue-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "high":
        return "text-orange-600 bg-orange-100";
      case "critical":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const filteredLogs = securityLogs.filter((log) => {
    const matchesSearch =
      log.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.includes(searchQuery);
    const matchesFilter = filterStatus === "all" || log.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EAE6DF] to-[#C2CCC5]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A7967E] mx-auto mb-4"></div>
          <p className="text-[#142E54] font-medium">Loading security data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EAE6DF] to-[#C2CCC5] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="bg-white/80"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-[#142E54] flex items-center gap-2">
                  <Shield className="h-8 w-8 text-[#A7967E]" />
                  Security Center
                </h1>
                <p className="text-[#A7967E] mt-1">
                  Monitor security events, access logs, and threat detection
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32 bg-white/80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleRefresh}
                variant="outline"
                className="bg-white/80"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Security Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
        >
          {securityMetrics.map((metric) => (
            <Card
              key={metric.id}
              className="border-0 shadow-lg bg-white/90 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {metric.name === "Active Sessions" && (
                      <Users className="h-5 w-5 text-[#A7967E]" />
                    )}
                    {metric.name === "Failed Login Attempts" && (
                      <XCircle className="h-5 w-5 text-[#A7967E]" />
                    )}
                    {metric.name === "Security Score" && (
                      <Shield className="h-5 w-5 text-[#A7967E]" />
                    )}
                    {metric.name === "Threats Blocked" && (
                      <AlertTriangle className="h-5 w-5 text-[#A7967E]" />
                    )}
                    <h3 className="font-medium text-gray-900 text-sm">
                      {metric.name}
                    </h3>
                  </div>
                  <Badge className={getStatusColor(metric.status)}>
                    {metric.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-[#142E54]">
                      {metric.value}
                      <span className="text-sm font-normal text-gray-600 ml-1">
                        {metric.unit}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {metric.trend === "up" && (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    )}
                    {metric.trend === "down" && (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    {metric.trend === "stable" && (
                      <Activity className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger
                    value="overview"
                    className="flex items-center gap-2"
                  >
                    <Shield className="h-4 w-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="logs" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Access Logs
                  </TabsTrigger>
                  <TabsTrigger
                    value="threats"
                    className="flex items-center gap-2"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Threat Alerts
                  </TabsTrigger>
                  <TabsTrigger
                    value="monitoring"
                    className="flex items-center gap-2"
                  >
                    <Activity className="h-4 w-4" />
                    Monitoring
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Lock className="h-5 w-5" />
                          Security Status
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span>Overall Security Score</span>
                            <span className="font-semibold">87%</span>
                          </div>
                          <Progress value={87} className="h-2" />
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span>Firewall Active</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span>SSL Enabled</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4 text-yellow-600" />
                              <span>2FA Partial</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span>Backups Current</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5" />
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {securityLogs.slice(0, 4).map((log) => (
                            <div
                              key={log.id}
                              className="flex items-center justify-between p-2 rounded border"
                            >
                              <div className="flex items-center gap-3">
                                <Badge className={getStatusColor(log.status)}>
                                  {log.status}
                                </Badge>
                                <div>
                                  <p className="font-medium text-sm">
                                    {log.event}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    {log.user}
                                  </p>
                                </div>
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(log.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Access Logs Tab */}
                <TabsContent value="logs" className="space-y-6 mt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search logs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select
                      value={filterStatus}
                      onValueChange={setFilterStatus}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="success">Success</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>

                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Event</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>IP Address</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredLogs.map((log) => (
                          <TableRow key={log.id}>
                            <TableCell className="font-mono text-sm">
                              {new Date(log.timestamp).toLocaleString()}
                            </TableCell>
                            <TableCell className="font-medium">
                              {log.event}
                            </TableCell>
                            <TableCell>{log.user}</TableCell>
                            <TableCell className="font-mono">
                              {log.ipAddress}
                            </TableCell>
                            <TableCell>{log.location}</TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(log.status)}>
                                {log.status}
                              </Badge>
                            </TableCell>
                            <TableCell
                              className="max-w-xs truncate"
                              title={log.details}
                            >
                              {log.details}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* Threat Alerts Tab */}
                <TabsContent value="threats" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    {threatAlerts.map((alert) => (
                      <Card
                        key={alert.id}
                        className={`border-l-4 ${
                          alert.severity === "critical"
                            ? "border-l-red-500"
                            : alert.severity === "high"
                              ? "border-l-orange-500"
                              : alert.severity === "medium"
                                ? "border-l-yellow-500"
                                : "border-l-blue-500"
                        }`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge
                                  className={getSeverityColor(alert.severity)}
                                >
                                  {alert.severity.toUpperCase()}
                                </Badge>
                                <Badge variant="outline">{alert.type}</Badge>
                                {alert.resolved && (
                                  <Badge className="text-green-600 bg-green-100">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Resolved
                                  </Badge>
                                )}
                              </div>
                              <h3 className="font-semibold text-[#142E54] mb-1">
                                {alert.title}
                              </h3>
                              <p className="text-gray-600 text-sm mb-2">
                                {alert.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {new Date(alert.timestamp).toLocaleString()}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Server className="h-3 w-3" />
                                  {alert.affectedSystems.join(", ")}
                                </span>
                              </div>
                            </div>
                            {!alert.resolved && (
                              <Button
                                size="sm"
                                onClick={() => handleResolveAlert(alert.id)}
                                className="bg-[#142E54] hover:bg-[#142E54]/90"
                              >
                                Resolve
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Monitoring Tab */}
                <TabsContent value="monitoring" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Globe className="h-5 w-5" />
                          Network Security
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span>Firewall Status</span>
                            <Badge className="text-green-600 bg-green-100">
                              Active
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>DDoS Protection</span>
                            <Badge className="text-green-600 bg-green-100">
                              Enabled
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>SSL Certificate</span>
                            <Badge className="text-green-600 bg-green-100">
                              Valid
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>VPN Connections</span>
                            <span className="font-semibold">23 Active</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Database className="h-5 w-5" />
                          Data Protection
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span>Encryption Status</span>
                            <Badge className="text-green-600 bg-green-100">
                              AES-256
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Backup Status</span>
                            <Badge className="text-green-600 bg-green-100">
                              Current
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Data Integrity</span>
                            <Badge className="text-green-600 bg-green-100">
                              Verified
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Last Backup</span>
                            <span className="font-semibold">2 hours ago</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Access Control Notice */}
        {!isAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertTriangle className="h-5 w-5" />
                  <p className="text-sm">
                    You have read-only access to security information. Contact
                    an administrator for security management actions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
