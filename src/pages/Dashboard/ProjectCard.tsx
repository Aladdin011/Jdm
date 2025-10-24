import { motion } from "framer-motion";
import {
  MapPin,
  Calendar,
  MoreHorizontal,
  Eye,
  Edit,
  Archive,
  Users,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Project } from "./types";
import { statusConfig, priorityConfig, cardVariants } from "./constants";

interface ProjectCardProps {
  project: Project;
  onView: (project: Project) => void;
  onEdit?: (project: Project) => void;
  onArchive?: (project: Project) => void;
}

export function ProjectCard({
  project,
  onView,
  onEdit,
  onArchive,
}: ProjectCardProps) {
  const status = statusConfig[project.status];
  const priority = priorityConfig[project.priority];

  return (
    <motion.div variants={cardVariants} whileHover="hover">
      <Card className="h-full hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Badge className={status.color} variant="outline">
                  <span className="mr-1">{status.icon}</span>
                  {status.label}
                </Badge>
                <Badge className={priority.color} variant="outline">
                  <span className="mr-1">{priority.icon}</span>
                  {priority.label}
                </Badge>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
                {project.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {project.description}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onView(project)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                {onEdit && (
                  <DropdownMenuItem onClick={() => onEdit(project)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Project
                  </DropdownMenuItem>
                )}
                {onArchive && (
                  <DropdownMenuItem onClick={() => onArchive(project)}>
                    <Archive className="mr-2 h-4 w-4" />
                    Archive
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progress
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {project.progress}%
              </span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600 truncate">{project.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">
                {new Date(project.dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">
                ₦{(project.budget / 1000000).toFixed(1)}M
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">{project.team.length} members</span>
            </div>
          </div>

          {/* Team Avatars */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex -space-x-2">
              {project.team.slice(0, 4).map((member, idx) => (
                <Avatar key={idx} className="h-8 w-8 border-2 border-white">
                  <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              ))}
              {project.team.length > 4 && (
                <div className="h-8 w-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    +{project.team.length - 4}
                  </span>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(project)}
              className="text-blue-600 hover:text-blue-700"
            >
              View Details →
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

