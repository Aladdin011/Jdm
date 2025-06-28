import { useState } from "react";
import { motion } from "framer-motion";
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
  const [leads] = useState<Lead[]>([
    {
      id: "1",
      name: "Ahmed Okonkwo",
      company: "Lagos State Government",
      email: "ahmed.o@lagos.gov.ng",
      phone: "+234 803 123 4567",
      projectType: "Smart City Infrastructure",
      value: "$2.5M",
      status: "proposal",
      date: "2024-01-15",
    },
    {
      id: "2",
      name: "Sarah Johnson",
      company: "Zenith Bank",
      email: "sarah.j@zenithbank.com",
      phone: "+234 805 987 6543",
      projectType: "Office Complex",
      value: "$800K",
      status: "negotiation",
      date: "2024-01-10",
    },
    {
      id: "3",
      name: "Michael Adebayo",
      company: "Federal Housing Authority",
      email: "m.adebayo@fha.gov.ng",
      phone: "+234 807 555 1234",
      projectType: "Residential Development",
      value: "$1.2M",
      status: "contacted",
      date: "2024-01-08",
    },
  ]);

  const [stats] = useState({
    totalLeads: 23,
    activeProposals: 8,
    monthlyRevenue: "$4.2M",
    conversionRate: "32%",
  });

  const [showNewLeadForm, setShowNewLeadForm] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-700";
      case "contacted":
        return "bg-yellow-100 text-yellow-700";
      case "proposal":
        return "bg-purple-100 text-purple-700";
      case "negotiation":
        return "bg-orange-100 text-orange-700";
      case "won":
        return "bg-green-100 text-green-700";
      case "lost":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#142E54] to-[#F97316] rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Business Development</h1>
            <p className="text-blue-100">
              Lead tracking, proposals, and partnership management
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
            <TrendingUp className="h-12 w-12 text-white/80" />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalLeads}
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
                <p className="text-sm font-medium text-gray-600">
                  Active Proposals
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.activeProposals}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Monthly Revenue
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.monthlyRevenue}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Conversion Rate
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.conversionRate}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lead Tracker */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#F97316]" />
                    Lead Tracker
                  </CardTitle>
                  <CardDescription>
                    Track and manage potential clients and projects
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setShowNewLeadForm(!showNewLeadForm)}
                  className="bg-[#F97316] hover:bg-[#F97316]/90"
                >
                  <Plus size={16} className="mr-2" />
                  New Lead
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-[#F97316] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {lead.name}
                        </h3>
                        <p className="text-sm text-gray-600">{lead.company}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {lead.projectType}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge
                          className={`${getStatusColor(lead.status)} mb-2`}
                        >
                          {lead.status.charAt(0).toUpperCase() +
                            lead.status.slice(1)}
                        </Badge>
                        <p className="text-lg font-bold text-green-600">
                          {lead.value}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Mail size={14} />
                          {lead.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone size={14} />
                          {lead.phone}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(lead.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* New Project Request Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-[#F97316]" />
                New Project Request
              </CardTitle>
              <CardDescription>
                Submit new project opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Client Name" />
              <Input placeholder="Company" />
              <Input placeholder="Email" type="email" />
              <Input placeholder="Phone" />
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Project Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="construction">
                    General Construction
                  </SelectItem>
                  <SelectItem value="smart-city">Smart City</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Estimated Value" />
              <Textarea placeholder="Project Description" rows={3} />
              <Button className="w-full bg-[#F97316] hover:bg-[#F97316]/90">
                Submit Request
              </Button>
            </CardContent>
          </Card>

          {/* Partnership Inquiries */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Handshake className="h-5 w-5 text-[#F97316]" />
                Partnership Inquiries
              </CardTitle>
              <CardDescription>
                Recent partnership opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">
                      UK Construction Alliance
                    </h4>
                    <ArrowUpRight size={16} className="text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-600">
                    Joint venture opportunity for London projects
                  </p>
                  <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                </div>

                <div className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">
                      Nigerian Infrastructure Fund
                    </h4>
                    <ArrowUpRight size={16} className="text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-600">
                    Funding partnership for smart city projects
                  </p>
                  <p className="text-xs text-gray-400 mt-1">1 week ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
