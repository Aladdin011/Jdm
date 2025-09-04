import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  Plus,
  Filter,
  Calendar,
  Clock,
  TrendingUp,
  Activity,
  Users,
  Building2,
  Target,
  Zap,
  MoreHorizontal,
  Eye,
  Edit,
  Archive,
  Star,
  CheckCircle2,
  AlertTriangle,
  Timer,
  DollarSign,
  FileText,
  MessageSquare,
  Upload,
  BarChart3,
  PieChart,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Shield,
  ChevronDown,
  ChevronRight,
  Maximize2,
  Minimize2,
  RefreshCw,
  Download,
  Share2,
  Bookmark,
  Grid3X3,
  List,
  SlidersHorizontal,
} from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import { projectAPI, activityAPI } from "@/services/api";
import useAnalytics from "@/hooks/useAnalytics";

// Enhanced interfaces
interface Project {
  id: string;
  name: string;
  status: "planning" | "in_progress" | "review" | "completed" | "on_hold";
  progress: number;
  dueDate: string;
  location: string;
  priority: "low" | "medium" | "high" | "critical";
  description: string;
  budget: number;
  team: Array<{ id: string; name: string; role: string; avatar?: string }>;
  tags: string[];
  client: string;
  type: "residential" | "commercial" | "infrastructure" | "industrial";
  health: "excellent" | "good" | "warning" | "critical";
}

interface Activity {
  id: string;
  type: "project_update" | "document_upload" | "meeting" | "deadline" | "system" | "notification";
  title: string;
  message: string;
  timestamp: string;
  priority: "low" | "medium" | "high";
  projectId?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

interface DashboardMetrics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalRevenue: number;
  monthlyRevenue: number;
  teamMembers: number;
  clientSatisfaction: number;
  onTimeCompletion: number;
  upcomingDeadlines: number;
  overdueTasks: number;
  resourceUtilization: number;
  activeContracts: number;
}

export default function ModernDashboard() {
  const { user, isAdmin, logout } = useAuth();
  const { trackBusinessEvent } = useAnalytics();

  // State management
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    teamMembers: 0,
    clientSatisfaction: 0,
    onTimeCompletion: 0,
    upcomingDeadlines: 0,
    overdueTasks: 0,
    resourceUtilization: 0,
    activeContracts: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("overview");
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Dialog states
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);

  // Auto-refresh effect
  useEffect(() => {
    let refreshInterval: NodeJS.Timeout | null = null;
    
    if (autoRefreshEnabled) {
      refreshInterval = setInterval(() => {
        loadDashboardData();
      }, 5 * 60 * 1000); // 5 minutes
    }
    
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [autoRefreshEnabled, loadDashboardData]);

  // Load dashboard data
  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Simulate realistic data loading
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockProjects: Project[] = [
        {
          id: "1",
          name: "Luxury Residential Complex - Victoria Island",
          status: "in_progress",
          progress: 72,
          dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          location: "Victoria Island, Lagos",
          priority: "high",
          description: "Premium 25-unit residential development with modern amenities",
          budget: 2400000000,
          team: [
            { id: "1", name: "Adebayo Johnson", role: "Project Manager", avatar: "/avatars/01.png" },
            { id: "2", name: "Sarah Okafor", role: "Lead Architect", avatar: "/avatars/02.png" },
            { id: "3", name: "Michael Chen", role: "Civil Engineer", avatar: "/avatars/03.png" },
          ],
          tags: ["residential", "luxury", "high-rise"],
          client: "Premium Properties Ltd",
          type: "residential",
          health: "good",
        },
        {
          id: "2",
          name: "Commercial Plaza - Lekki Phase 1",
          status: "planning",
          progress: 25,
          dueDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
          location: "Lekki Phase 1, Lagos",
          priority: "medium",
          description: "Multi-story commercial complex with retail and office spaces",
          budget: 1800000000,
          team: [
            { id: "4", name: "Folake Adeyemi", role: "Architect", avatar: "/avatars/04.png" },
            { id: "5", name: "Ibrahim Musa", role: "Project Coordinator", avatar: "/avatars/05.png" },
          ],
          tags: ["commercial", "retail", "office"],
          client: "Lekki Developments",
          type: "commercial",
          health: "excellent",
        },
        {
          id: "3",
          name: "Infrastructure - Second Niger Bridge",
          status: "completed",
          progress: 100,
          dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          location: "Onitsha-Asaba Axis",
          priority: "critical",
          description: "Major infrastructure project connecting the Southeast and South-South",
          budget: 15000000000,
          team: [
            { id: "6", name: "Emeka Okonkwo", role: "Lead Engineer", avatar: "/avatars/06.png" },
            { id: "7", name: "Grace Adamu", role: "Quality Control", avatar: "/avatars/07.png" },
          ],
          tags: ["infrastructure", "bridge", "federal"],
          client: "Federal Ministry of Works",
          type: "infrastructure",
          health: "excellent",
        },
      ];

      const mockActivities: Activity[] = [
        {
          id: "1",
          type: "project_update",
          title: "Milestone Completed",
          message: "Foundation work completed for Victoria Island project",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          priority: "high",
          projectId: "1",
        },
        {
          id: "2",
          type: "document_upload",
          title: "Documents Uploaded",
          message: "Structural drawings uploaded for Lekki commercial plaza",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          priority: "medium",
          projectId: "2",
        },
        {
          id: "3",
          type: "meeting",
          title: "Client Meeting",
          message: "Weekly review meeting scheduled with Premium Properties",
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          priority: "high",
        },
        {
          id: "4",
          type: "system",
          title: "System Update",
          message: "Dashboard analytics updated with latest project data",
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          priority: "low",
        },
      ];

      setProjects(mockProjects);
      setActivities(mockActivities);

      // Calculate metrics
      const newMetrics: DashboardMetrics = {
        totalProjects: mockProjects.length,
        activeProjects: mockProjects.filter(p => p.status === "in_progress").length,
        completedProjects: mockProjects.filter(p => p.status === "completed").length,
        totalRevenue: mockProjects.reduce((sum, p) => sum + p.budget, 0),
        monthlyRevenue: 850000000,
        teamMembers: 247,
        clientSatisfaction: 4.8,
        onTimeCompletion: 94,
        upcomingDeadlines: 5,
        overdueTasks: 2,
        resourceUtilization: 87,
        activeContracts: 12,
      };

      setMetrics(newMetrics);

    } catch (error) {
      console.error("Error loading dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Event handlers
  const handleRefresh = useCallback(() => {
    try {
      toast.info("Refreshing dashboard...");
      loadDashboardData();
    } catch (error) {
      console.error('Error during manual refresh:', error);
      toast.error("Failed to refresh dashboard data");
    }
  }, [loadDashboardData]);

  const handleSearch = useCallback((query: string) => {
    try {
      setSearchQuery(query);
      trackBusinessEvent("search_performed", { query, context: "dashboard" });
    } catch (error) {
      console.error('Error during search:', error);
      toast.error("Search functionality encountered an error");
    }
  }, [trackBusinessEvent]);

  const handleQuickAction = useCallback((action: string) => {
    try {
      trackBusinessEvent("quick_action", { action });
      
      switch (action) {
        case "new_project":
          toast.success("Opening new project dialog...");
          // Implementation for new project dialog would go here
          break;
        case "upload_document":
          toast.success("Opening document upload...");
          // Implementation for document upload would go here
          break;
        case "schedule_meeting":
          toast.success("Opening meeting scheduler...");
          // Implementation for meeting scheduler would go here
          break;
        case "view_reports":
          toast.success("Navigating to reports...");
          // Implementation for reports navigation would go here
          break;
        case "invite_member":
          toast.success("Opening team invitation dialog...");
          // Implementation for team invitation would go here
          break;
        case "contact_support":
          toast.success("Opening support contact form...");
          // Implementation for support contact would go here
          break;
        default:
          toast.info(`Action: ${action}`);
      }
    } catch (error) {
      console.error(`Error executing quick action '${action}':`, error);
      toast.error(`Failed to execute action: ${action}`);
    }
  }, [trackBusinessEvent]);

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === "all" || 
                         project.status === selectedFilter ||
                         project.priority === selectedFilter ||
                         project.type === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Status configurations
  const statusConfig = {
    planning: { color: "bg-blue-100 text-blue-800", icon: Clock },
    in_progress: { color: "bg-orange-100 text-orange-800", icon: Timer },
    review: { color: "bg-purple-100 text-purple-800", icon: Eye },
    completed: { color: "bg-green-100 text-green-800", icon: CheckCircle2 },
    on_hold: { color: "bg-gray-100 text-gray-800", icon: AlertTriangle },
  };

  const priorityConfig = {
    low: { color: "text-green-600", bg: "bg-green-50" },
    medium: { color: "text-yellow-600", bg: "bg-yellow-50" },
    high: { color: "text-orange-600", bg: "bg-orange-50" },
    critical: { color: "text-red-600", bg: "bg-red-50" },
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center space-y-6"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
            <Building2 className="absolute inset-0 m-auto h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-800">Loading Dashboard</h3>
            <p className="text-slate-600">Preparing your construction management hub...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
        {/* Modern Header */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60"
        >
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Left section */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-slate-800">JD Marc Hub</h1>
                    <p className="text-xs text-slate-500">Construction Management</p>
                  </div>
                </div>
                
                {/* Search */}
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search projects, clients, locations..."
                    className="pl-10 w-80 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Right section */}
              <div className="flex items-center space-x-3">
                {/* Quick Actions */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowQuickActions(true)}
                  className="hidden md:flex"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Quick Actions
                </Button>

                {/* Refresh */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>

                {/* View Toggle */}
                <div className="flex items-center bg-slate-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-8 w-8 p-0"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-8 w-8 p-0"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>

                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(true)}
                  className="relative"
                >
                  <Bell className="h-4 w-4" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500">
                    {activities.filter(a => a.priority === "high").length}
                  </Badge>
                </Button>

                {/* Fullscreen Toggle */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 px-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                          {user?.firstName?.[0]}{user?.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:block text-left">
                        <p className="text-sm font-medium text-slate-800">{user?.firstName}</p>
                        <p className="text-xs text-slate-500 capitalize">{user?.department || "General"}</p>
                      </div>
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div>
                        <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-slate-500">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setShowSettings(true)}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Shield className="mr-2 h-4 w-4" />
                      Security
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => {
                        try {
                          logout();
                          toast.success('Successfully signed out');
                        } catch (error) {
                          console.error('Error during logout:', error);
                          toast.error('Failed to sign out. Please try again.');
                        }
                      }} 
                      className="text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Welcome Section */}
            <motion.div variants={itemVariants} className="relative">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 text-white overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-3xl font-bold mb-2">
                          Welcome back, {user?.firstName}
                        </h2>
                        <p className="text-blue-100 text-lg">
                          {new Date().toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-6 mt-6">
                        <div className="text-center">
                          <p className="text-2xl font-bold">{metrics.activeProjects}</p>
                          <p className="text-blue-200 text-sm">Active Projects</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">₦{(metrics.monthlyRevenue / 1000000000).toFixed(1)}B</p>
                          <p className="text-blue-200 text-sm">Monthly Revenue</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">{metrics.teamMembers}</p>
                          <p className="text-blue-200 text-sm">Team Members</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="hidden md:block">
                      <div className="w-32 h-32 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <Building2 className="h-16 w-16 text-white/80" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-48" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32" />
              </div>
            </motion.div>

            {/* Metrics Grid */}
            <motion.div variants={itemVariants}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "Total Revenue",
                    value: `₦${(metrics.totalRevenue / 1000000000).toFixed(1)}B`,
                    change: "+12.5%",
                    trend: "up",
                    icon: DollarSign,
                    color: "from-green-500 to-emerald-500"
                  },
                  {
                    title: "Project Health",
                    value: `${metrics.onTimeCompletion}%`,
                    change: "+3.2%",
                    trend: "up",
                    icon: Target,
                    color: "from-blue-500 to-cyan-500"
                  },
                  {
                    title: "Client Satisfaction",
                    value: `${metrics.clientSatisfaction}/5.0`,
                    change: "+0.1",
                    trend: "up",
                    icon: Star,
                    color: "from-purple-500 to-pink-500"
                  },
                  {
                    title: "Resource Utilization",
                    value: `${metrics.resourceUtilization}%`,
                    change: "-2.1%",
                    trend: "down",
                    icon: Activity,
                    color: "from-orange-500 to-red-500"
                  }
                ].map((metric, index) => (
                  <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/60 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center shadow-lg`}>
                          <metric.icon className="h-6 w-6 text-white" />
                        </div>
                        <Badge 
                          variant={metric.trend === "up" ? "default" : "destructive"} 
                          className="text-xs"
                        >
                          {metric.change}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-1">{metric.value}</h3>
                        <p className="text-sm text-slate-600">{metric.title}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>

            {/* Main Content Tabs */}
            <motion.div variants={itemVariants}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <div className="flex items-center justify-between">
                  <TabsList className="grid w-auto grid-cols-4 bg-white/60 backdrop-blur-sm">
                    <TabsTrigger value="overview" className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="projects" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Projects
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="flex items-center gap-2">
                      <PieChart className="h-4 w-4" />
                      Analytics
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Activity
                    </TabsTrigger>
                  </TabsList>

                  {/* Filters */}
                  <div className="flex items-center gap-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="bg-white/60 backdrop-blur-sm">
                          <Filter className="h-4 w-4 mr-2" />
                          Filter
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {["all", "planning", "in_progress", "review", "completed"].map(filter => (
                          <DropdownMenuItem 
                            key={filter}
                            onClick={() => setSelectedFilter(filter)}
                            className={selectedFilter === filter ? "bg-blue-50" : ""}
                          >
                            {filter.charAt(0).toUpperCase() + filter.slice(1).replace("_", " ")}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <TabsContent value="overview" className="space-y-6">
                  {/* Projects Overview */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                      <Card className="border-0 bg-white/60 backdrop-blur-sm">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div>
                              <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-blue-600" />
                                Recent Projects
                              </CardTitle>
                              <CardDescription>Your latest project updates</CardDescription>
                            </div>
                            <Button variant="outline" size="sm">
                              View All
                              <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {filteredProjects.slice(0, 3).map((project) => {
                              const StatusIcon = statusConfig[project.status].icon;
                              return (
                                <div key={project.id} className="flex items-start space-x-4 p-4 rounded-lg bg-slate-50/50 hover:bg-slate-100/50 transition-colors group">
                                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${project.type === 'residential' ? 'from-blue-500 to-blue-600' : project.type === 'commercial' ? 'from-green-500 to-green-600' : 'from-purple-500 to-purple-600'} flex items-center justify-center shadow-sm`}>
                                    <StatusIcon className="h-6 w-6 text-white" />
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between mb-2">
                                      <div>
                                        <h4 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                          {project.name}
                                        </h4>
                                        <p className="text-sm text-slate-600">{project.client}</p>
                                      </div>
                                      <div className="flex items-center space-x-2">
                                        <Badge className={`${statusConfig[project.status].color} text-xs`}>
                                          {project.status.replace("_", " ")}
                                        </Badge>
                                        <Badge className={`${priorityConfig[project.priority].color} ${priorityConfig[project.priority].bg} text-xs`}>
                                          {project.priority}
                                        </Badge>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between text-sm text-slate-600">
                                        <span>Progress: {project.progress}%</span>
                                        <span className="flex items-center">
                                          <MapPin className="h-3 w-3 mr-1" />
                                          {project.location}
                                        </span>
                                      </div>
                                      <Progress value={project.progress} className="h-2" />
                                    </div>
                                    
                                    <div className="flex items-center justify-between mt-3">
                                      <div className="flex items-center space-x-2">
                                        <div className="flex -space-x-2">
                                          {project.team.slice(0, 3).map((member) => (
                                            <Avatar key={member.id} className="h-6 w-6 border-2 border-white">
                                              <AvatarFallback className="text-xs bg-gradient-to-r from-blue-400 to-purple-400 text-white">
                                                {member.name.split(' ').map(n => n[0]).join('')}
                                              </AvatarFallback>
                                            </Avatar>
                                          ))}
                                          {project.team.length > 3 && (
                                            <div className="h-6 w-6 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center">
                                              <span className="text-xs font-medium text-slate-600">+{project.team.length - 3}</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center space-x-1">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Quick Stats Sidebar */}
                    <div className="space-y-6">
                      {/* Activity Feed */}
                      <Card className="border-0 bg-white/60 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Activity className="h-5 w-5 text-green-600" />
                            Live Activity
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ScrollArea className="h-80">
                            <div className="space-y-4">
                              {activities.slice(0, 8).map((activity, index) => (
                                <div key={activity.id} className="flex items-start space-x-3">
                                  <div className={`w-2 h-2 rounded-full mt-2 ${
                                    activity.priority === 'high' ? 'bg-red-500' :
                                    activity.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                                  }`} />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                                    <p className="text-xs text-slate-600 mb-1">{activity.message}</p>
                                    <p className="text-xs text-slate-500">
                                      {new Date(activity.timestamp).toLocaleTimeString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </CardContent>
                      </Card>

                      {/* Quick Actions */}
                      <Card className="border-0 bg-white/60 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-lg">
                            <Zap className="h-5 w-5 text-yellow-600" />
                            Quick Actions
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {[
                              { icon: Plus, label: "New Project", action: "new_project", color: "from-blue-500 to-blue-600" },
                              { icon: Upload, label: "Upload Documents", action: "upload_document", color: "from-green-500 to-green-600" },
                              { icon: Calendar, label: "Schedule Meeting", action: "schedule_meeting", color: "from-purple-500 to-purple-600" },
                              { icon: FileText, label: "Generate Report", action: "view_reports", color: "from-orange-500 to-orange-600" },
                            ].map((item, index) => (
                              <Button
                                key={index}
                                onClick={() => handleQuickAction(item.action)}
                                className={`w-full justify-start bg-gradient-to-r ${item.color} text-white hover:opacity-90 transition-opacity`}
                                size="sm"
                              >
                                <item.icon className="h-4 w-4 mr-3" />
                                {item.label}
                              </Button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="projects" className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">Project Portfolio</h3>
                      <p className="text-slate-600">Manage and track all construction projects</p>
                    </div>
                    <Button onClick={() => handleQuickAction("new_project")} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      New Project
                    </Button>
                  </div>

                  {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {filteredProjects.map((project) => (
                        <Card key={project.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                                  {project.name}
                                </CardTitle>
                                <div className="flex items-center space-x-2">
                                  <Badge className={statusConfig[project.status].color}>
                                    {project.status.replace("_", " ")}
                                  </Badge>
                                  <Badge variant="outline" className={priorityConfig[project.priority].color}>
                                    {project.priority}
                                  </Badge>
                                </div>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Project
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Share2 className="mr-2 h-4 w-4" />
                                    Share
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Archive className="mr-2 h-4 w-4" />
                                    Archive
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-slate-500" />
                                <span className="text-slate-600">{project.team.length} members</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <DollarSign className="h-4 w-4 text-slate-500" />
                                <span className="text-slate-600">₦{(project.budget / 1000000).toFixed(0)}M</span>
                              </div>
                              <div className="flex items-center space-x-2 col-span-2">
                                <MapPin className="h-4 w-4 text-slate-500" />
                                <span className="text-slate-600 truncate">{project.location}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Progress</span>
                                <span className="font-medium text-slate-900">{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} className="h-2" />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex -space-x-2">
                                {project.team.slice(0, 4).map((member) => (
                                  <Avatar key={member.id} className="h-8 w-8 border-2 border-white">
                                    <AvatarFallback className="text-xs bg-gradient-to-r from-blue-400 to-purple-400 text-white">
                                      {member.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                                {project.team.length > 4 && (
                                  <div className="h-8 w-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center">
                                    <span className="text-xs font-medium text-slate-600">+{project.team.length - 4}</span>
                                  </div>
                                )}
                              </div>
                              <div className="text-sm text-slate-500">
                                Due {new Date(project.dueDate).toLocaleDateString()}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-0 bg-white/60 backdrop-blur-sm">
                      <CardContent className="p-0">
                        <div className="space-y-0">
                          {filteredProjects.map((project, index) => (
                            <div key={project.id} className={`p-6 hover:bg-slate-50/50 transition-colors ${index !== filteredProjects.length - 1 ? 'border-b border-slate-200' : ''}`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${project.type === 'residential' ? 'from-blue-500 to-blue-600' : project.type === 'commercial' ? 'from-green-500 to-green-600' : 'from-purple-500 to-purple-600'} flex items-center justify-center`}>
                                    <Building2 className="h-6 w-6 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-slate-900">{project.name}</h4>
                                    <p className="text-sm text-slate-600">{project.client} • {project.location}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-4">
                                  <div className="text-right">
                                    <p className="font-medium text-slate-900">₦{(project.budget / 1000000).toFixed(0)}M</p>
                                    <p className="text-sm text-slate-600">{project.progress}% complete</p>
                                  </div>
                                  <Badge className={statusConfig[project.status].color}>
                                    {project.status.replace("_", " ")}
                                  </Badge>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      try {
                                        // Implement project options menu functionality here
                                        alert(`Options for ${project.name}`);
                                      } catch (error) {
                                        console.error(`Error opening project options: ${error}`);
                                      }
                                    }}
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                  <Card className="border-0 bg-white/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Performance Analytics</CardTitle>
                      <CardDescription>Insights into your construction business performance</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Project Success Rate</span>
                            <span className="text-sm font-medium">{metrics.onTimeCompletion}%</span>
                          </div>
                          <Progress value={metrics.onTimeCompletion} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Resource Utilization</span>
                            <span className="text-sm font-medium">{metrics.resourceUtilization}%</span>
                          </div>
                          <Progress value={metrics.resourceUtilization} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Client Satisfaction</span>
                            <span className="text-sm font-medium">{metrics.clientSatisfaction}/5.0</span>
                          </div>
                          <Progress value={metrics.clientSatisfaction * 20} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Budget Efficiency</span>
                            <span className="text-sm font-medium">92%</span>
                          </div>
                          <Progress value={92} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activity" className="space-y-6">
                  <Card className="border-0 bg-white/60 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-600" />
                        Activity Timeline
                      </CardTitle>
                      <CardDescription>Recent activities and updates across all projects</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {activities.map((activity) => (
                          <div key={activity.id} className="flex items-start space-x-4 pb-6 border-b border-slate-100 last:border-b-0 last:pb-0">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              activity.type === 'project_update' ? 'bg-blue-100 text-blue-600' :
                              activity.type === 'document_upload' ? 'bg-green-100 text-green-600' :
                              activity.type === 'meeting' ? 'bg-purple-100 text-purple-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {activity.type === 'project_update' && <CheckCircle2 className="h-5 w-5" />}
                              {activity.type === 'document_upload' && <Upload className="h-5 w-5" />}
                              {activity.type === 'meeting' && <Calendar className="h-5 w-5" />}
                              {activity.type === 'system' && <Settings className="h-5 w-5" />}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium text-slate-900">{activity.title}</h4>
                                  <p className="text-sm text-slate-600 mt-1">{activity.message}</p>
                                </div>
                                <div className="text-right">
                                  <Badge variant="outline" className={`mb-2 ${
                                    activity.priority === 'high' ? 'text-red-600 border-red-200' :
                                    activity.priority === 'medium' ? 'text-yellow-600 border-yellow-200' :
                                    'text-green-600 border-green-200'
                                  }`}>
                                    {activity.priority}
                                  </Badge>
                                  <p className="text-xs text-slate-500">
                                    {new Date(activity.timestamp).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </motion.div>
        </main>

        {/* Quick Actions Dialog */}
        <Dialog open={showQuickActions} onOpenChange={setShowQuickActions}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Quick Actions</DialogTitle>
              <DialogDescription>Frequently used actions and shortcuts</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
              {[
                { icon: Plus, label: "New Project", action: "new_project", color: "from-blue-500 to-blue-600" },
                { icon: Upload, label: "Upload Document", action: "upload_document", color: "from-green-500 to-green-600" },
                { icon: Calendar, label: "Schedule Meeting", action: "schedule_meeting", color: "from-purple-500 to-purple-600" },
                { icon: Users, label: "Invite Team Member", action: "invite_member", color: "from-orange-500 to-orange-600" },
                { icon: FileText, label: "Generate Report", action: "view_reports", color: "from-red-500 to-red-600" },
                { icon: MessageSquare, label: "Contact Support", action: "contact_support", color: "from-indigo-500 to-indigo-600" },
              ].map((item, index) => (
                <Button
                  key={index}
                  onClick={() => {
                    handleQuickAction(item.action);
                    setShowQuickActions(false);
                  }}
                  className={`h-20 flex-col space-y-2 bg-gradient-to-r ${item.color} text-white hover:opacity-90`}
                >
                  <item.icon className="h-6 w-6" />
                  <span className="text-sm">{item.label}</span>
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Notifications Dialog */}
        <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-96">
              <div className="space-y-4">
                {activities.filter(a => a.priority === "high").map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                    <div>
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-xs text-slate-600">{activity.message}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* Settings Dialog */}
        <Dialog open={showSettings} onOpenChange={setShowSettings}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Dashboard Settings
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Default View Mode</label>
                <div className="flex space-x-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4 mr-2" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4 mr-2" />
                    List
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Auto-refresh</label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    className="rounded" 
                    checked={autoRefreshEnabled}
                    onChange={(e) => {
                      try {
                        const isChecked = e.target.checked;
                        setAutoRefreshEnabled(isChecked);
                        
                        // Implement auto-refresh functionality here
                        if (isChecked) {
                          alert('Auto-refresh enabled. Dashboard will refresh every 5 minutes.');
                          // Logic to set up interval refresh would go here
                        } else {
                          alert('Auto-refresh disabled.');
                          // Logic to clear interval refresh would go here
                        }
                      } catch (error) {
                        console.error(`Error changing auto-refresh setting: ${error}`);
                      }
                    }}
                  />
                  <span className="text-sm">Enable automatic data refresh (every 5 minutes)</span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}