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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Activity,
  Calendar,
  Download,
  RefreshCw,
  ArrowLeft,
  PieChart,
  LineChart,
  Target,
  Clock,
  Building,
  UserCheck,
  Briefcase,
  AlertCircle,
  CheckCircle,
  Eye,
  MousePointer,
  Smartphone,
  Monitor,
  Globe,
  MapPin,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  changeType: "increase" | "decrease";
  period: string;
  icon: string;
}

interface ChartData {
  name: string;
  value: number;
  color?: string;
}

interface ProjectMetric {
  id: string;
  name: string;
  progress: number;
  status: "on-track" | "at-risk" | "delayed" | "completed";
  budget: number;
  spent: number;
  team: number;
  deadline: string;
}

export default function Analytics() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  const [metrics, setMetrics] = useState<AnalyticsMetric[]>([
    {
      id: "1",
      name: "Total Revenue",
      value: 2450000,
      unit: "₦",
      change: 12.5,
      changeType: "increase",
      period: "vs last month",
      icon: "dollar",
    },
    {
      id: "2",
      name: "Active Projects",
      value: 18,
      unit: "projects",
      change: 3,
      changeType: "increase",
      period: "vs last month",
      icon: "briefcase",
    },
    {
      id: "3",
      name: "Team Members",
      value: 156,
      unit: "members",
      change: 8,
      changeType: "increase",
      period: "vs last month",
      icon: "users",
    },
    {
      id: "4",
      name: "Completion Rate",
      value: 87.5,
      unit: "%",
      change: 2.3,
      changeType: "increase",
      period: "vs last month",
      icon: "target",
    },
  ]);

  const [revenueData, setRevenueData] = useState<ChartData[]>([
    { name: "Jan", value: 1800000 },
    { name: "Feb", value: 2100000 },
    { name: "Mar", value: 1950000 },
    { name: "Apr", value: 2300000 },
    { name: "May", value: 2450000 },
    { name: "Jun", value: 2650000 },
  ]);

  const [projectData, setProjectData] = useState<ChartData[]>([
    { name: "Residential", value: 45, color: "#142E54" },
    { name: "Commercial", value: 30, color: "#A7967E" },
    { name: "Infrastructure", value: 15, color: "#C2CCC5" },
    { name: "Renovation", value: 10, color: "#EAE6DF" },
  ]);

  const [projectMetrics, setProjectMetrics] = useState<ProjectMetric[]>([
    {
      id: "1",
      name: "Lagos Office Complex",
      progress: 75,
      status: "on-track",
      budget: 450000000,
      spent: 337500000,
      team: 24,
      deadline: "2024-08-15",
    },
    {
      id: "2",
      name: "Abuja Residential Estate",
      progress: 45,
      status: "at-risk",
      budget: 680000000,
      spent: 306000000,
      team: 32,
      deadline: "2024-12-20",
    },
    {
      id: "3",
      name: "Port Harcourt Bridge",
      progress: 90,
      status: "on-track",
      budget: 1200000000,
      spent: 1080000000,
      team: 45,
      deadline: "2024-06-30",
    },
    {
      id: "4",
      name: "Kano Shopping Mall",
      progress: 25,
      status: "delayed",
      budget: 320000000,
      spent: 80000000,
      team: 18,
      deadline: "2024-10-15",
    },
  ]);

  const [trafficData, setTrafficData] = useState<ChartData[]>([
    { name: "Desktop", value: 65, color: "#142E54" },
    { name: "Mobile", value: 28, color: "#A7967E" },
    { name: "Tablet", value: 7, color: "#C2CCC5" },
  ]);

  const [locationData, setLocationData] = useState<ChartData[]>([
    { name: "Lagos", value: 35 },
    { name: "Abuja", value: 25 },
    { name: "Port Harcourt", value: 15 },
    { name: "Kano", value: 12 },
    { name: "Ibadan", value: 8 },
    { name: "Others", value: 5 },
  ]);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to load analytics data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Analytics data loaded successfully");
    } catch (error) {
      toast.error("Failed to load analytics data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadAnalyticsData();
  };

  const handleExportData = () => {
    toast.success("Analytics data exported successfully");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-track":
      case "completed":
        return "text-green-600 bg-green-100";
      case "at-risk":
        return "text-yellow-600 bg-yellow-100";
      case "delayed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EAE6DF] to-[#C2CCC5]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A7967E] mx-auto mb-4"></div>
          <p className="text-[#142E54] font-medium">
            Loading analytics data...
          </p>
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
                  <BarChart3 className="h-8 w-8 text-[#A7967E]" />
                  Analytics Dashboard
                </h1>
                <p className="text-[#A7967E] mt-1">
                  Business insights, performance metrics, and data visualization
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32 bg-white/80">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={handleExportData}
                variant="outline"
                className="bg-white/80"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
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

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6"
        >
          {metrics.map((metric) => (
            <Card
              key={metric.id}
              className="border-0 shadow-lg bg-white/90 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {metric.icon === "dollar" && (
                      <DollarSign className="h-5 w-5 text-[#A7967E]" />
                    )}
                    {metric.icon === "briefcase" && (
                      <Briefcase className="h-5 w-5 text-[#A7967E]" />
                    )}
                    {metric.icon === "users" && (
                      <Users className="h-5 w-5 text-[#A7967E]" />
                    )}
                    {metric.icon === "target" && (
                      <Target className="h-5 w-5 text-[#A7967E]" />
                    )}
                    <h3 className="font-medium text-gray-900 text-sm">
                      {metric.name}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-[#142E54]">
                      {metric.unit === "₦"
                        ? formatCurrency(metric.value)
                        : metric.unit === "%"
                          ? `${metric.value}%`
                          : `${formatNumber(metric.value)} ${metric.unit}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {metric.changeType === "increase" ? (
                      <TrendingUp className="h-4 w-4 text-green-600" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        metric.changeType === "increase"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {metric.changeType === "increase" ? "+" : "-"}
                      {metric.change}%
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{metric.period}</p>
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
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger
                    value="overview"
                    className="flex items-center gap-2"
                  >
                    <BarChart3 className="h-4 w-4" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="projects"
                    className="flex items-center gap-2"
                  >
                    <Building className="h-4 w-4" />
                    Projects
                  </TabsTrigger>
                  <TabsTrigger
                    value="revenue"
                    className="flex items-center gap-2"
                  >
                    <DollarSign className="h-4 w-4" />
                    Revenue
                  </TabsTrigger>
                  <TabsTrigger value="team" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Team
                  </TabsTrigger>
                  <TabsTrigger
                    value="performance"
                    className="flex items-center gap-2"
                  >
                    <Activity className="h-4 w-4" />
                    Performance
                  </TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <LineChart className="h-5 w-5" />
                          Revenue Trend
                        </CardTitle>
                        <CardDescription>
                          Monthly revenue over the last 6 months
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64 flex items-end justify-between gap-2">
                          {revenueData.map((item, index) => (
                            <div
                              key={index}
                              className="flex flex-col items-center flex-1"
                            >
                              <div
                                className="bg-[#142E54] rounded-t w-full transition-all duration-300 hover:bg-[#A7967E]"
                                style={{
                                  height: `${(item.value / Math.max(...revenueData.map((d) => d.value))) * 200}px`,
                                }}
                              />
                              <span className="text-xs text-gray-600 mt-2">
                                {item.name}
                              </span>
                              <span className="text-xs font-medium text-[#142E54]">
                                {formatCurrency(item.value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <PieChart className="h-5 w-5" />
                          Project Distribution
                        </CardTitle>
                        <CardDescription>Projects by category</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {projectData.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-4 h-4 rounded"
                                  style={{ backgroundColor: item.color }}
                                />
                                <span className="font-medium">{item.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="h-2 rounded-full"
                                    style={{
                                      width: `${item.value}%`,
                                      backgroundColor: item.color,
                                    }}
                                  />
                                </div>
                                <span className="text-sm font-medium w-8">
                                  {item.value}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Monitor className="h-5 w-5" />
                          Device Usage
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {trafficData.map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                {item.name === "Desktop" && (
                                  <Monitor className="h-4 w-4" />
                                )}
                                {item.name === "Mobile" && (
                                  <Smartphone className="h-4 w-4" />
                                )}
                                {item.name === "Tablet" && (
                                  <Monitor className="h-4 w-4" />
                                )}
                                <span className="text-sm">{item.name}</span>
                              </div>
                              <span className="font-semibold">
                                {item.value}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="h-5 w-5" />
                          Top Locations
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {locationData.slice(0, 5).map((item, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between"
                            >
                              <span className="text-sm">{item.name}</span>
                              <span className="font-semibold">
                                {item.value}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5" />
                          Quick Stats
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">
                              Avg. Project Duration
                            </span>
                            <span className="font-semibold">8.5 months</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Client Satisfaction</span>
                            <span className="font-semibold">94%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">On-time Delivery</span>
                            <span className="font-semibold">87%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Budget Adherence</span>
                            <span className="font-semibold">92%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Projects Tab */}
                <TabsContent value="projects" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    {projectMetrics.map((project) => (
                      <Card key={project.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-[#142E54] text-lg">
                                {project.name}
                              </h3>
                              <p className="text-gray-600 text-sm">
                                Deadline:{" "}
                                {new Date(
                                  project.deadline,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge className={getStatusColor(project.status)}>
                              {project.status.replace("-", " ")}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Progress</p>
                              <div className="flex items-center gap-2">
                                <Progress
                                  value={project.progress}
                                  className="flex-1"
                                />
                                <span className="text-sm font-medium">
                                  {project.progress}%
                                </span>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Budget</p>
                              <p className="font-semibold">
                                {formatCurrency(project.budget)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Spent</p>
                              <p className="font-semibold">
                                {formatCurrency(project.spent)}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Team Size</p>
                              <p className="font-semibold">
                                {project.team} members
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>
                                Budget Utilization:{" "}
                                {Math.round(
                                  (project.spent / project.budget) * 100,
                                )}
                                %
                              </span>
                              <span>
                                Days Remaining:{" "}
                                {Math.ceil(
                                  (new Date(project.deadline).getTime() -
                                    new Date().getTime()) /
                                    (1000 * 60 * 60 * 24),
                                )}
                              </span>
                            </div>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Revenue Tab */}
                <TabsContent value="revenue" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Revenue Breakdown</CardTitle>
                        <CardDescription>
                          Revenue by project category
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span>Residential Projects</span>
                            <span className="font-semibold">
                              {formatCurrency(1102500)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Commercial Projects</span>
                            <span className="font-semibold">
                              {formatCurrency(735000)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Infrastructure</span>
                            <span className="font-semibold">
                              {formatCurrency(367500)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Renovation</span>
                            <span className="font-semibold">
                              {formatCurrency(245000)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Payment Status</CardTitle>
                        <CardDescription>
                          Current payment status overview
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span>Paid</span>
                            </div>
                            <span className="font-semibold">
                              {formatCurrency(2100000)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-yellow-600" />
                              <span>Pending</span>
                            </div>
                            <span className="font-semibold">
                              {formatCurrency(280000)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-red-600" />
                              <span>Overdue</span>
                            </div>
                            <span className="font-semibold">
                              {formatCurrency(70000)}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Team Tab */}
                <TabsContent value="team" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Team Overview</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span>Total Members</span>
                            <span className="font-semibold">156</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Active Projects</span>
                            <span className="font-semibold">18</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Avg. Team Size</span>
                            <span className="font-semibold">8.7 members</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Utilization Rate</span>
                            <span className="font-semibold">87%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Department Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Engineering</span>
                            <span className="font-semibold">45</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Project Management</span>
                            <span className="font-semibold">28</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Administration</span>
                            <span className="font-semibold">32</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Quality Control</span>
                            <span className="font-semibold">18</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Others</span>
                            <span className="font-semibold">33</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Performance Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Productivity Score</span>
                            <span className="font-semibold">92%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Attendance Rate</span>
                            <span className="font-semibold">96%</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Training Hours</span>
                            <span className="font-semibold">1,240</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Satisfaction Score</span>
                            <span className="font-semibold">4.2/5</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Performance Tab */}
                <TabsContent value="performance" className="space-y-6 mt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Key Performance Indicators</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span>Project Completion Rate</span>
                              <span className="font-semibold">87%</span>
                            </div>
                            <Progress value={87} />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span>Client Satisfaction</span>
                              <span className="font-semibold">94%</span>
                            </div>
                            <Progress value={94} />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span>Budget Adherence</span>
                              <span className="font-semibold">92%</span>
                            </div>
                            <Progress value={92} />
                          </div>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span>Quality Score</span>
                              <span className="font-semibold">89%</span>
                            </div>
                            <Progress value={89} />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Monthly Targets</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span>Revenue Target</span>
                            <div className="text-right">
                              <p className="font-semibold">
                                {formatCurrency(2800000)}
                              </p>
                              <p className="text-sm text-gray-600">
                                87% achieved
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Project Milestones</span>
                            <div className="text-right">
                              <p className="font-semibold">24 / 28</p>
                              <p className="text-sm text-gray-600">
                                86% achieved
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Team Utilization</span>
                            <div className="text-right">
                              <p className="font-semibold">87%</p>
                              <p className="text-sm text-gray-600">
                                Target: 85%
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Quality Score</span>
                            <div className="text-right">
                              <p className="font-semibold">89%</p>
                              <p className="text-sm text-gray-600">
                                Target: 90%
                              </p>
                            </div>
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
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-sm">
                    You have read-only access to analytics data. Contact an
                    administrator for advanced analytics features.
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
