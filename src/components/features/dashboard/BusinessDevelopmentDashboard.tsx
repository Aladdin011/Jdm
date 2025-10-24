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
import { Progress } from "@/components/ui/progress";
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
  Building,
  Trophy,
  Clock,
  CheckCircle,
  AlertCircle,
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

interface Deal {
  id: string;
  title: string;
  client: string;
  value: number;
  probability: number;
  closeDate: string;
  stage: string;
}

export default function BusinessDevelopmentDashboard() {
  const { user } = useAuth();
  const { isInCall, startCall } = useCall();

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

  const [deals, setDeals] = useState<Deal[]>([
    {
      id: "1",
      title: "Smart City Platform",
      client: "FCT Administration",
      value: 45000000,
      probability: 85,
      closeDate: "2024-02-15",
      stage: "Negotiation",
    },
    {
      id: "2",
      title: "Infrastructure Overhaul",
      client: "Lagos State Govt",
      value: 32000000,
      probability: 60,
      closeDate: "2024-03-01",
      stage: "Proposal",
    },
    {
      id: "3",
      title: "Power Grid Modernization",
      client: "Port Harcourt Industries",
      value: 28000000,
      probability: 75,
      closeDate: "2024-02-28",
      stage: "Negotiation",
    },
  ]);

  const [showAddLead, setShowAddLead] = useState(false);
  const [newLead, setNewLead] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    projectType: "",
    value: "",
    status: "new" as const,
  });

  // Business Development theme colors (existing emerald/green theme)
  const bdThemeColors = {
    primary: "#065f46", // Dark emerald
    secondary: "#ecfdf5", // Very light emerald
    accent: "#10b981", // Emerald
    background: "#f0fdf4", // Light green
    headerBg: "#064e3b", // Very dark emerald
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "contacted":
        return "bg-yellow-100 text-yellow-800";
      case "proposal":
        return "bg-purple-100 text-purple-800";
      case "negotiation":
        return "bg-orange-100 text-orange-800";
      case "won":
        return "bg-green-100 text-green-800";
      case "lost":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddLead = () => {
    if (newLead.name && newLead.company && newLead.email) {
      const lead: Lead = {
        ...newLead,
        id: (leads.length + 1).toString(),
        date: new Date().toISOString().split("T")[0],
      };
      setLeads([...leads, lead]);
      setNewLead({
        name: "",
        company: "",
        email: "",
        phone: "",
        projectType: "",
        value: "",
        status: "new",
      });
      setShowAddLead(false);
    }
  };

  const handleStartCall = (leadId: string) => {
    const lead = leads.find((l) => l.id === leadId);
    if (lead) {
      startCall(`lead-${leadId}`, {
        title: `Call with ${lead.name}`,
        participants: [lead.name],
      });
    }
  };

  const totalLeads = leads.length;
  const activeDeals = deals.length;
  const potentialRevenue = deals.reduce(
    (sum, deal) => sum + (deal.value * deal.probability) / 100,
    0,
  );
  const wonLeads = leads.filter((lead) => lead.status === "won").length;

  return (
    <ModernDashboardLayout
      user={user}
      department="Business Development"
      themeColors={bdThemeColors}
    >
      <div className="space-y-6">
        {/* Business Development Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Total Leads
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalLeads}
                  </p>
                  <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +12% this month
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-full">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Active Deals
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {activeDeals}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">In pipeline</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Handshake className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Potential Revenue
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    ₦{(potentialRevenue / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-sm text-purple-600 mt-1">
                    Weighted pipeline
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Won Deals
                  </p>
                  <p className="text-3xl font-bold text-gray-900">{wonLeads}</p>
                  <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                    <Trophy className="h-3 w-3" />
                    Success rate: {((wonLeads / totalLeads) * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Trophy className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Leads Management */}
          <div className="lg:col-span-8 space-y-6">
            {/* Active Leads */}
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                    <Users className="h-5 w-5 text-emerald-600" />
                    Active Leads
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Prospects in your pipeline
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setShowAddLead(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Lead
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <FileText className="h-4 w-4 mr-2" />
                      Export Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leads.map((lead) => (
                    <motion.div
                      key={lead.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {lead.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {lead.company}
                              </p>
                            </div>
                            <Badge className={getStatusColor(lead.status)}>
                              {lead.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {lead.email}
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {lead.phone}
                            </div>
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4" />
                              {lead.projectType}
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4" />
                              {lead.value}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            Added: {new Date(lead.date).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() => handleStartCall(lead.id)}
                            disabled={isInCall}
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <Phone className="h-4 w-4 mr-1" />
                            {isInCall ? "In Call" : "Call"}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Deal Pipeline */}
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                  <Target className="h-5 w-5 text-emerald-600" />
                  Deal Pipeline
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Active opportunities and their progress
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deals.map((deal) => (
                    <motion.div
                      key={deal.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg border border-emerald-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {deal.title}
                          </h4>
                          <p className="text-sm text-gray-600">{deal.client}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-600">
                            ₦{(deal.value / 1000000).toFixed(1)}M
                          </p>
                          <p className="text-xs text-gray-500">
                            Close:{" "}
                            {new Date(deal.closeDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Probability</span>
                          <span className="font-medium text-emerald-600">
                            {deal.probability}%
                          </span>
                        </div>
                        <Progress value={deal.probability} className="h-2" />
                        <div className="flex items-center justify-between text-xs">
                          <Badge
                            variant="outline"
                            className="border-emerald-200 text-emerald-700"
                          >
                            {deal.stage}
                          </Badge>
                          <span className="text-gray-500">
                            Expected: ₦
                            {(
                              (deal.value * deal.probability) /
                              100 /
                              1000000
                            ).toFixed(1)}
                            M
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                  <Target className="h-5 w-5 text-emerald-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    onClick={() => setShowAddLead(true)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Lead
                  </Button>
                  <Button
                    onClick={() =>
                      startCall("bd-team-meeting", {
                        title: "BD Team Meeting",
                        participants: [],
                      })
                    }
                    disabled={isInCall}
                    variant="outline"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    {isInCall ? "In Meeting" : "Start Team Meeting"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-orange-600 text-orange-600 hover:bg-orange-50"
                  >
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Monthly Target
                    </span>
                    <span className="font-semibold text-emerald-600">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Calls Made</span>
                      <span className="text-sm font-medium">24</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Meetings Scheduled
                      </span>
                      <span className="text-sm font-medium">8</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Proposals Sent
                      </span>
                      <span className="text-sm font-medium">5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        Deals Closed
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        3
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Lead Modal */}
        {showAddLead && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Add New Lead</CardTitle>
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
                  placeholder="Company"
                  value={newLead.company}
                  onChange={(e) =>
                    setNewLead({ ...newLead, company: e.target.value })
                  }
                />
                <Input
                  placeholder="Email"
                  value={newLead.email}
                  onChange={(e) =>
                    setNewLead({ ...newLead, email: e.target.value })
                  }
                />
                <Input
                  placeholder="Phone"
                  value={newLead.phone}
                  onChange={(e) =>
                    setNewLead({ ...newLead, phone: e.target.value })
                  }
                />
                <Input
                  placeholder="Project Type"
                  value={newLead.projectType}
                  onChange={(e) =>
                    setNewLead({ ...newLead, projectType: e.target.value })
                  }
                />
                <Input
                  placeholder="Estimated Value"
                  value={newLead.value}
                  onChange={(e) =>
                    setNewLead({ ...newLead, value: e.target.value })
                  }
                />
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddLead}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    Add Lead
                  </Button>
                  <Button
                    onClick={() => setShowAddLead(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </ModernDashboardLayout>
  );
}
