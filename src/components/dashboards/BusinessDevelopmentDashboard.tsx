import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useCall } from "@/contexts/CallContext";
import ModernDashboardLayout from "./ModernDashboardLayout";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TrendingUp,
  Users,
  DollarSign,
  Target,
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  ArrowUpRight,
  Handshake,
  MoreHorizontal,
  Video,
  Eye,
  Edit,
} from "lucide-react";

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  projectType: string;
  value: string;
  status: "new" | "contacted" | "proposal" | "negotiation" | "won" | "lost";
  date: string;
}

export default function BusinessDevelopmentDashboard() {
  const { startCall, callState } = useCall();
  const theme = getDepartmentTheme("business-development");

  const [leads, setLeads] = useState<Lead[]>([
    {
      id: "1",
      name: "Ahmed Ibrahim",
      company: "Lagos State Construction",
      email: "ahmed@lagosstate.gov.ng",
      phone: "+234 803 000 0001",
      projectType: "Infrastructure Development",
      value: "₦2.5M",
      status: "negotiation",
      date: "2024-01-15",
    },
    {
      id: "2",
      name: "Sarah Okoye",
      company: "Abuja Municipal Corp",
      email: "sarah@abujamunicipal.gov.ng",
      phone: "+234 803 000 0002",
      projectType: "Smart City Integration",
      value: "₦8.2M",
      status: "proposal",
      date: "2024-01-18",
    },
    {
      id: "3",
      name: "Michael Chen",
      company: "Port Harcourt Industries",
      email: "m.chen@phindustries.com",
      phone: "+234 803 000 0003",
      projectType: "Power Grid Upgrade",
      value: "₦15.7M",
      status: "contacted",
      date: "2024-01-20",
    },
  ]);

  const [stats] = useState({
    totalLeads: 12,
    activeProposals: 8,
    monthlyRevenue: "₦45.2M",
    conversionRate: "68%",
  });

  const [newLead, setNewLead] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    projectType: "",
    value: "",
  });

  const handleStartCall = () => {
    startCall("business-development");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "won":
        return "bg-green-100 text-green-800";
      case "negotiation":
        return "bg-blue-100 text-blue-800";
      case "proposal":
        return "bg-purple-100 text-purple-800";
      case "contacted":
        return "bg-yellow-100 text-yellow-800";
      case "new":
        return "bg-gray-100 text-gray-800";
      case "lost":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const addNewLead = () => {
    if (newLead.name && newLead.company && newLead.email) {
      const lead: Lead = {
        id: Date.now().toString(),
        ...newLead,
        status: "new",
        date: new Date().toISOString().split("T")[0],
      };
      setLeads([lead, ...leads]);
      setNewLead({
        name: "",
        company: "",
        email: "",
        phone: "",
        projectType: "",
        value: "",
      });
    }
  };

  return (
    <DashboardThemeWrapper
      title="Business Development Dashboard"
      description="Track leads, manage proposals, and drive revenue growth"
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
                    Total Leads
                  </p>
                  <p className="text-3xl font-bold theme-text-primary">
                    {stats.totalLeads}
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
                    Active Proposals
                  </p>
                  <p className="text-3xl font-bold theme-text-primary">
                    {stats.activeProposals}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="theme-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Monthly Revenue
                  </p>
                  <p className="text-3xl font-bold theme-text-primary">
                    {stats.monthlyRevenue}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="theme-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Conversion Rate
                  </p>
                  <p className="text-3xl font-bold theme-text-primary">
                    {stats.conversionRate}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lead Management */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="theme-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Handshake className={`h-5 w-5 ${theme.badge.text}`} />
                  Active Leads
                </CardTitle>
                <CardDescription>
                  Track and manage your sales pipeline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold theme-text-primary">
                            {lead.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {lead.company}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(lead.status)}>
                            {lead.status.charAt(0).toUpperCase() +
                              lead.status.slice(1)}
                          </Badge>
                          <span className="text-lg font-bold text-emerald-600">
                            {lead.value}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {lead.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {lead.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(lead.date).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          {lead.projectType}
                        </span>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Mail className="h-4 w-4 mr-1" />
                            Contact
                          </Button>
                          <Button size="sm" className={theme.button.primary}>
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Add New Lead */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="theme-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className={`h-5 w-5 ${theme.badge.text}`} />
                  Add New Lead
                </CardTitle>
                <CardDescription>
                  Capture new business opportunities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Contact Name"
                  value={newLead.name}
                  onChange={(e) =>
                    setNewLead({ ...newLead, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Company Name"
                  value={newLead.company}
                  onChange={(e) =>
                    setNewLead({ ...newLead, company: e.target.value })
                  }
                />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={newLead.email}
                  onChange={(e) =>
                    setNewLead({ ...newLead, email: e.target.value })
                  }
                />
                <Input
                  placeholder="Phone Number"
                  value={newLead.phone}
                  onChange={(e) =>
                    setNewLead({ ...newLead, phone: e.target.value })
                  }
                />
                <Select
                  value={newLead.projectType}
                  onValueChange={(value) =>
                    setNewLead({ ...newLead, projectType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Project Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="infrastructure">
                      Infrastructure Development
                    </SelectItem>
                    <SelectItem value="smart-city">
                      Smart City Integration
                    </SelectItem>
                    <SelectItem value="power-grid">
                      Power Grid Upgrade
                    </SelectItem>
                    <SelectItem value="residential">
                      Residential Construction
                    </SelectItem>
                    <SelectItem value="commercial">
                      Commercial Buildings
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Estimated Value (₦)"
                  value={newLead.value}
                  onChange={(e) =>
                    setNewLead({ ...newLead, value: e.target.value })
                  }
                />
                <Button
                  onClick={addNewLead}
                  className={`w-full ${theme.button.primary}`}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lead
                </Button>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="theme-card mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className={`h-5 w-5 ${theme.badge.text}`} />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">This Month</span>
                  <span className="font-semibold theme-text-primary">
                    ₦12.4M
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pipeline Value</span>
                  <span className="font-semibold theme-text-primary">
                    ₦28.9M
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Win Rate</span>
                  <span className="font-semibold theme-text-accent">68%</span>
                </div>
                <div className="pt-2 border-t">
                  <Button className={`w-full ${theme.button.secondary}`}>
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </DashboardThemeWrapper>
  );
}
