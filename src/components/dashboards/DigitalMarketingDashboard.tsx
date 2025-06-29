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
  Megaphone,
  BarChart3,
  Eye,
  MousePointer,
  Share2,
  Calendar,
  PlusCircle,
  Edit,
  TrendingUp,
  Users,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Youtube,
  Globe,
  Camera,
  FileText,
  Target,
} from "lucide-react";
import DashboardThemeWrapper from "./DashboardThemeWrapper";
import { getDepartmentTheme } from "@/utils/departmentThemes";

interface Campaign {
  id: string;
  name: string;
  platform:
    | "facebook"
    | "instagram"
    | "linkedin"
    | "twitter"
    | "youtube"
    | "website";
  status: "draft" | "active" | "paused" | "completed";
  budget: string;
  startDate: string;
  endDate: string;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
}

interface ContentItem {
  id: string;
  title: string;
  type: "blog" | "social-post" | "video" | "infographic" | "case-study";
  status: "draft" | "review" | "approved" | "published";
  platform: string[];
  scheduledDate: string;
  author: string;
}

export default function DigitalMarketingDashboard() {
  const theme = getDepartmentTheme("digital-marketing");

  const [campaigns] = useState<Campaign[]>([
    {
      id: "1",
      name: "JD Marc Infrastructure Solutions",
      platform: "linkedin",
      status: "active",
      budget: "₦500,000",
      startDate: "2024-01-01",
      endDate: "2024-03-31",
      impressions: 45000,
      clicks: 1250,
      ctr: 2.8,
      conversions: 85,
    },
    {
      id: "2",
      name: "Smart City Projects Showcase",
      platform: "facebook",
      status: "active",
      budget: "₦750,000",
      startDate: "2024-01-15",
      endDate: "2024-04-15",
      impressions: 120000,
      clicks: 3200,
      ctr: 2.7,
      conversions: 142,
    },
    {
      id: "3",
      name: "Construction Excellence Videos",
      platform: "youtube",
      status: "paused",
      budget: "₦300,000",
      startDate: "2023-12-01",
      endDate: "2024-02-29",
      impressions: 25000,
      clicks: 890,
      ctr: 3.6,
      conversions: 34,
    },
  ]);

  const [content] = useState<ContentItem[]>([
    {
      id: "1",
      title: "Building Africa's Future: JD Marc's Smart City Vision",
      type: "blog",
      status: "published",
      platform: ["website", "linkedin"],
      scheduledDate: "2024-01-20",
      author: "Content Team",
    },
    {
      id: "2",
      title: "Behind the Scenes: Port Harcourt Project Progress",
      type: "video",
      status: "review",
      platform: ["youtube", "instagram", "facebook"],
      scheduledDate: "2024-01-25",
      author: "Video Team",
    },
    {
      id: "3",
      title: "Construction Safety Best Practices Infographic",
      type: "infographic",
      status: "approved",
      platform: ["instagram", "linkedin", "twitter"],
      scheduledDate: "2024-01-28",
      author: "Design Team",
    },
    {
      id: "4",
      title: "Client Success Story: Lagos State Infrastructure",
      type: "case-study",
      status: "draft",
      platform: ["website", "linkedin"],
      scheduledDate: "2024-02-01",
      author: "Content Team",
    },
  ]);

  const [stats] = useState({
    totalCampaigns: 12,
    activeCampaigns: 8,
    totalReach: "2.3M",
    engagementRate: "4.2%",
  });

  const [newContent, setNewContent] = useState({
    title: "",
    type: "",
    platform: [] as string[],
    scheduledDate: "",
  });

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "facebook":
        return <Facebook className="h-4 w-4" />;
      case "instagram":
        return <Instagram className="h-4 w-4" />;
      case "linkedin":
        return <Linkedin className="h-4 w-4" />;
      case "twitter":
        return <Twitter className="h-4 w-4" />;
      case "youtube":
        return <Youtube className="h-4 w-4" />;
      case "website":
        return <Globe className="h-4 w-4" />;
      default:
        return <Share2 className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "published":
      case "approved":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "review":
        return "bg-yellow-100 text-yellow-800";
      case "paused":
        return "bg-orange-100 text-orange-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "blog":
        return <FileText className="h-4 w-4" />;
      case "video":
        return <Camera className="h-4 w-4" />;
      case "social-post":
        return <Share2 className="h-4 w-4" />;
      case "infographic":
        return <BarChart3 className="h-4 w-4" />;
      case "case-study":
        return <Target className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <DashboardThemeWrapper
      title="Digital Marketing Dashboard"
      description="Manage campaigns, track analytics, and oversee content pipeline"
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
                    Total Campaigns
                  </p>
                  <p className="text-3xl font-bold theme-text-primary">
                    {stats.totalCampaigns}
                  </p>
                </div>
                <div className={`p-3 ${theme.badge.bg} rounded-full`}>
                  <Megaphone className={`h-6 w-6 ${theme.badge.text}`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="theme-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Campaigns
                  </p>
                  <p className="text-3xl font-bold theme-text-primary">
                    {stats.activeCampaigns}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="theme-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Reach
                  </p>
                  <p className="text-3xl font-bold theme-text-primary">
                    {stats.totalReach}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="theme-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Engagement Rate
                  </p>
                  <p className="text-3xl font-bold theme-text-primary">
                    {stats.engagementRate}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <MousePointer className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Campaign Analytics */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="theme-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className={`h-5 w-5 ${theme.badge.text}`} />
                  Campaign Analytics
                </CardTitle>
                <CardDescription>
                  Monitor campaign performance and ROI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div
                      key={campaign.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-orange-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold theme-text-primary">
                            {campaign.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            {getPlatformIcon(campaign.platform)}
                            <span className="text-sm text-gray-600 capitalize">
                              {campaign.platform}
                            </span>
                            <Badge className={getStatusColor(campaign.status)}>
                              {campaign.status.charAt(0).toUpperCase() +
                                campaign.status.slice(1)}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold theme-text-primary">
                            {campaign.budget}
                          </p>
                          <p className="text-sm text-gray-500">Budget</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Impressions</p>
                          <p className="font-semibold">
                            {campaign.impressions.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">Clicks</p>
                          <p className="font-semibold">
                            {campaign.clicks.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">CTR</p>
                          <p className="font-semibold">{campaign.ctr}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Conversions</p>
                          <p className="font-semibold">
                            {campaign.conversions}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t">
                        <div className="text-sm text-gray-600">
                          {new Date(campaign.startDate).toLocaleDateString()} -{" "}
                          {new Date(campaign.endDate).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" className={theme.button.primary}>
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Analytics
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Content Pipeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="theme-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className={`h-5 w-5 ${theme.badge.text}`} />
                  Content Pipeline
                </CardTitle>
                <CardDescription>
                  Manage content creation and publishing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {content.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex items-start gap-2 mb-2">
                      {getContentTypeIcon(item.type)}
                      <div className="flex-1">
                        <h4 className="font-medium theme-text-primary text-sm">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          by {item.author}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mb-2">
                      {item.platform.slice(0, 3).map((platform, index) => (
                        <div
                          key={index}
                          className="p-1 bg-gray-100 rounded"
                          title={platform}
                        >
                          {getPlatformIcon(platform)}
                        </div>
                      ))}
                      {item.platform.length > 3 && (
                        <span className="text-xs text-gray-500">
                          +{item.platform.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(item.status)}>
                        {item.status.charAt(0).toUpperCase() +
                          item.status.slice(1)}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(item.scheduledDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}

                <div className="pt-3 border-t">
                  <Button className={`w-full ${theme.button.primary}`}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Content
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Social Media Overview */}
            <Card className="theme-card mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className={`h-5 w-5 ${theme.badge.text}`} />
                  Social Media Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Facebook className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Facebook</span>
                  </div>
                  <span className="font-semibold">12.5K</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-pink-600" />
                    <span className="text-sm">Instagram</span>
                  </div>
                  <span className="font-semibold">8.2K</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-blue-700" />
                    <span className="text-sm">LinkedIn</span>
                  </div>
                  <span className="font-semibold">15.8K</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Youtube className="h-4 w-4 text-red-600" />
                    <span className="text-sm">YouTube</span>
                  </div>
                  <span className="font-semibold">3.1K</span>
                </div>
                <div className="pt-2 border-t">
                  <Button className={`w-full ${theme.button.secondary}`}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Detailed Analytics
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
