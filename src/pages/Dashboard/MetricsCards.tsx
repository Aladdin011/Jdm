import { motion } from "framer-motion";
import {
  Building2,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Activity,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { DashboardMetrics } from "./types";
import { itemVariants } from "./constants";

interface MetricsCardsProps {
  metrics: DashboardMetrics;
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const metricsData = [
    {
      icon: Building2,
      label: "Active Projects",
      value: metrics.activeProjects,
      total: metrics.totalProjects,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trend: "+12%",
    },
    {
      icon: DollarSign,
      label: "Monthly Revenue",
      value: `₦${(metrics.monthlyRevenue / 1000000).toFixed(1)}M`,
      total: `₦${(metrics.totalRevenue / 1000000).toFixed(1)}M`,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trend: "+18%",
    },
    {
      icon: Users,
      label: "Team Members",
      value: metrics.teamMembers,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trend: "+5",
    },
    {
      icon: Target,
      label: "Client Satisfaction",
      value: `${metrics.clientSatisfaction}%`,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      trend: "+3%",
    },
    {
      icon: TrendingUp,
      label: "On-Time Completion",
      value: `${metrics.onTimeCompletion}%`,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      trend: "+7%",
    },
    {
      icon: Activity,
      label: "Resource Utilization",
      value: `${metrics.resourceUtilization}%`,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      trend: "+4%",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metricsData.map((metric, index) => (
        <motion.div key={index} variants={itemVariants}>
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`${metric.bgColor} p-3 rounded-lg`}>
                    <metric.icon className={`h-6 w-6 ${metric.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      {metric.label}
                    </p>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-2xl font-bold text-gray-900">
                        {metric.value}
                      </p>
                      {metric.total && (
                        <span className="text-sm text-gray-500">
                          / {metric.total}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-green-600 font-medium">
                  {metric.trend}
                </span>
                <span className="text-xs text-gray-500">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

