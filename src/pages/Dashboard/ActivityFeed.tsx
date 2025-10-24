import { motion } from "framer-motion";
import {
  CheckCircle2,
  Users,
  MessageSquare,
  Upload,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Edit,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Activity } from "./types";
import { activityTypeConfig, itemVariants } from "./constants";

interface ActivityFeedProps {
  activities: Activity[];
}

const activityIcons = {
  project_update: Edit,
  milestone_completed: CheckCircle2,
  team_joined: Users,
  comment_added: MessageSquare,
  file_uploaded: Upload,
  status_changed: TrendingUp,
  deadline_approaching: AlertTriangle,
  budget_alert: DollarSign,
};

export function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {activities.map((activity) => {
                const Icon = activityIcons[activity.type];
                const config = activityTypeConfig[activity.type];
                const timeAgo = getTimeAgo(activity.timestamp);

                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={`${config.bgColor} p-2 rounded-lg`}>
                      <Icon className={`h-4 w-4 ${config.color}`} />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <span className="text-xs text-gray-500">{timeAgo}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {activity.description}
                      </p>
                      {activity.user && (
                        <div className="flex items-center space-x-2 mt-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                              {activity.user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-gray-500">
                            {activity.user.name}
                          </span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diff = now.getTime() - time.getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

