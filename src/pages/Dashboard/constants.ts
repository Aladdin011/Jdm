// Dashboard Constants and Animation Variants

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

export const cardVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 15,
    },
  },
  hover: {
    scale: 1.02,
    y: -5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
    },
  },
};

export const statusConfig = {
  planning: {
    label: "Planning",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    icon: "📋",
  },
  in_progress: {
    label: "In Progress",
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
    icon: "⚡",
  },
  review: {
    label: "Review",
    color: "bg-purple-100 text-purple-700 border-purple-200",
    icon: "👀",
  },
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-700 border-green-200",
    icon: "✅",
  },
  on_hold: {
    label: "On Hold",
    color: "bg-gray-100 text-gray-700 border-gray-200",
    icon: "⏸️",
  },
};

export const priorityConfig = {
  low: {
    label: "Low",
    color: "bg-gray-100 text-gray-700",
    icon: "⬇️",
  },
  medium: {
    label: "Medium",
    color: "bg-blue-100 text-blue-700",
    icon: "➡️",
  },
  high: {
    label: "High",
    color: "bg-orange-100 text-orange-700",
    icon: "⬆️",
  },
  critical: {
    label: "Critical",
    color: "bg-red-100 text-red-700",
    icon: "🔥",
  },
};

export const activityTypeConfig = {
  project_update: { color: "text-blue-600", bgColor: "bg-blue-50" },
  milestone_completed: { color: "text-green-600", bgColor: "bg-green-50" },
  team_joined: { color: "text-purple-600", bgColor: "bg-purple-50" },
  comment_added: { color: "text-yellow-600", bgColor: "bg-yellow-50" },
  file_uploaded: { color: "text-indigo-600", bgColor: "bg-indigo-50" },
  status_changed: { color: "text-orange-600", bgColor: "bg-orange-50" },
  deadline_approaching: { color: "text-red-600", bgColor: "bg-red-50" },
  budget_alert: { color: "text-pink-600", bgColor: "bg-pink-50" },
};

export const mockProjects = [
  {
    id: "1",
    name: "Smart City Infrastructure",
    status: "in_progress" as const,
    progress: 68,
    dueDate: "2024-06-15",
    location: "Lagos, Nigeria",
    priority: "critical" as const,
    description:
      "Comprehensive smart city infrastructure development including IoT sensors, traffic management, and public Wi-Fi deployment",
    client: "Lagos State Government",
    budget: 25000000,
    team: [
      { id: "1", name: "Adebayo Ogunlesi", role: "Project Manager" },
      { id: "2", name: "Chiamaka Nwosu", role: "Lead Engineer" },
      { id: "3", name: "Ibrahim Yusuf", role: "Systems Architect" },
    ],
    tags: ["IoT", "Infrastructure", "Smart City"],
  },
  {
    id: "2",
    name: "Residential Complex Phase 2",
    status: "planning" as const,
    progress: 25,
    dueDate: "2024-08-30",
    location: "Abuja, Nigeria",
    priority: "high" as const,
    description:
      "200-unit luxury residential complex with modern amenities, green spaces, and sustainable design",
    client: "Vertex Development Ltd",
    budget: 45000000,
    team: [
      { id: "4", name: "Ngozi Okafor", role: "Architect" },
      { id: "5", name: "Tunde Bakare", role: "Civil Engineer" },
    ],
    tags: ["Residential", "Luxury", "Sustainable"],
  },
  {
    id: "3",
    name: "Corporate Headquarters",
    status: "review" as const,
    progress: 92,
    dueDate: "2024-05-10",
    location: "Port Harcourt, Nigeria",
    priority: "medium" as const,
    description:
      "15-story modern office building with state-of-the-art facilities and eco-friendly design",
    client: "PetroNova Industries",
    budget: 68000000,
    team: [
      { id: "6", name: "Fatima Abdullahi", role: "Senior PM" },
      { id: "7", name: "Emeka Obi", role: "Structural Engineer" },
    ],
    tags: ["Commercial", "Corporate", "High-rise"],
  },
];

export const mockActivities = [
  {
    id: "1",
    type: "milestone_completed" as const,
    title: "Foundation work completed",
    description: "Smart City Infrastructure project reached 70% completion",
    timestamp: "2024-04-10T14:30:00Z",
    user: { name: "Chiamaka Nwosu" },
    projectId: "1",
  },
  {
    id: "2",
    type: "team_joined" as const,
    title: "New team member added",
    description: "Ibrahim Yusuf joined as Systems Architect",
    timestamp: "2024-04-10T10:15:00Z",
    user: { name: "Adebayo Ogunlesi" },
    projectId: "1",
  },
  {
    id: "3",
    type: "deadline_approaching" as const,
    title: "Deadline reminder",
    description: "Corporate Headquarters review deadline in 30 days",
    timestamp: "2024-04-09T09:00:00Z",
    projectId: "3",
  },
  {
    id: "4",
    type: "file_uploaded" as const,
    title: "Design documents uploaded",
    description: "Updated architectural plans for Residential Complex Phase 2",
    timestamp: "2024-04-08T16:45:00Z",
    user: { name: "Ngozi Okafor" },
    projectId: "2",
  },
];

export const mockMetrics = {
  totalProjects: 24,
  activeProjects: 8,
  completedProjects: 12,
  totalRevenue: 156000000,
  monthlyRevenue: 12500000,
  teamMembers: 156,
  clientSatisfaction: 94,
  onTimeCompletion: 89,
  upcomingDeadlines: 3,
  resourceUtilization: 78,
  activeContracts: 18,
};

