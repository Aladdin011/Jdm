// Dashboard Type Definitions

export interface Project {
  id: string;
  name: string;
  status: "planning" | "in_progress" | "review" | "completed" | "on_hold";
  progress: number;
  dueDate: string;
  location: string;
  priority: "low" | "medium" | "high" | "critical";
  description: string;
  client: string;
  budget: number;
  team: Array<{
    id: string;
    name: string;
    role: string;
    avatar?: string;
  }>;
  tags: string[];
  milestones?: Array<{
    id: string;
    name: string;
    completed: boolean;
    dueDate: string;
  }>;
}

export interface Activity {
  id: string;
  type:
    | "project_update"
    | "milestone_completed"
    | "team_joined"
    | "comment_added"
    | "file_uploaded"
    | "status_changed"
    | "deadline_approaching"
    | "budget_alert";
  title: string;
  description: string;
  timestamp: string;
  user?: {
    name: string;
    avatar?: string;
  };
  projectId?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface DashboardMetrics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalRevenue: number;
  monthlyRevenue: number;
  teamMembers: number;
  clientSatisfaction: number;
  onTimeCompletion: number;
  upcomingDeadlines: number;
  resourceUtilization: number;
  activeContracts: number;
}

export interface ViewMode {
  layout: "grid" | "list";
  filters: {
    status: string[];
    priority: string[];
    search: string;
  };
  sortBy: "name" | "dueDate" | "progress" | "priority";
  sortOrder: "asc" | "desc";
}

export interface DashboardState {
  projects: Project[];
  recentActivities: Activity[];
  metrics: DashboardMetrics;
  viewMode: ViewMode;
  selectedProject: Project | null;
  isLoading: boolean;
  isRefreshing: boolean;
  notifications: number;
  showNotifications: boolean;
}

