export interface DepartmentTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  card: string;
  text: {
    primary: string;
    secondary: string;
    accent: string;
  };
  gradient: string;
  badge: {
    bg: string;
    text: string;
  };
  button: {
    primary: string;
    secondary: string;
    hover: string;
  };
}

export const departmentThemes: Record<string, DepartmentTheme> = {
  "secretariat-admin": {
    primary: "#1E3A8A", // Deep blue
    secondary: "#3B82F6", // Blue
    accent: "#F59E0B", // Amber
    background: "from-blue-50 to-indigo-50",
    card: "border-blue-200 bg-white shadow-blue-100/50",
    text: {
      primary: "#1E3A8A",
      secondary: "#6B7280",
      accent: "#F59E0B",
    },
    gradient: "from-blue-600 via-indigo-600 to-purple-600",
    badge: {
      bg: "bg-blue-100",
      text: "text-blue-800",
    },
    button: {
      primary: "bg-blue-600 hover:bg-blue-700",
      secondary: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200",
      hover: "hover:bg-blue-50",
    },
  },

  "business-development": {
    primary: "#059669", // Emerald
    secondary: "#10B981", // Green
    accent: "#F97316", // Orange
    background: "from-emerald-50 to-green-50",
    card: "border-emerald-200 bg-white shadow-emerald-100/50",
    text: {
      primary: "#059669",
      secondary: "#6B7280",
      accent: "#F97316",
    },
    gradient: "from-emerald-600 via-green-600 to-teal-600",
    badge: {
      bg: "bg-emerald-100",
      text: "text-emerald-800",
    },
    button: {
      primary: "bg-emerald-600 hover:bg-emerald-700",
      secondary:
        "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200",
      hover: "hover:bg-emerald-50",
    },
  },

  "project-management": {
    primary: "#7C3AED", // Violet
    secondary: "#8B5CF6", // Purple
    accent: "#EF4444", // Red
    background: "from-violet-50 to-purple-50",
    card: "border-violet-200 bg-white shadow-violet-100/50",
    text: {
      primary: "#7C3AED",
      secondary: "#6B7280",
      accent: "#EF4444",
    },
    gradient: "from-violet-600 via-purple-600 to-pink-600",
    badge: {
      bg: "bg-violet-100",
      text: "text-violet-800",
    },
    button: {
      primary: "bg-violet-600 hover:bg-violet-700",
      secondary:
        "bg-violet-50 hover:bg-violet-100 text-violet-700 border-violet-200",
      hover: "hover:bg-violet-50",
    },
  },

  accounting: {
    primary: "#DC2626", // Red
    secondary: "#EF4444", // Light red
    accent: "#059669", // Green
    background: "from-red-50 to-rose-50",
    card: "border-red-200 bg-white shadow-red-100/50",
    text: {
      primary: "#DC2626",
      secondary: "#6B7280",
      accent: "#059669",
    },
    gradient: "from-red-600 via-rose-600 to-pink-600",
    badge: {
      bg: "bg-red-100",
      text: "text-red-800",
    },
    button: {
      primary: "bg-red-600 hover:bg-red-700",
      secondary: "bg-red-50 hover:bg-red-100 text-red-700 border-red-200",
      hover: "hover:bg-red-50",
    },
  },

  "human-resources": {
    primary: "#7C2D12", // Brown
    secondary: "#A3A3A3", // Gray
    accent: "#3B82F6", // Blue
    background: "from-amber-50 to-orange-50",
    card: "border-amber-200 bg-white shadow-amber-100/50",
    text: {
      primary: "#7C2D12",
      secondary: "#6B7280",
      accent: "#3B82F6",
    },
    gradient: "from-amber-600 via-orange-600 to-red-600",
    badge: {
      bg: "bg-amber-100",
      text: "text-amber-800",
    },
    button: {
      primary: "bg-amber-600 hover:bg-amber-700",
      secondary:
        "bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200",
      hover: "hover:bg-amber-50",
    },
  },

  "digital-marketing": {
    primary: "#DB2777", // Pink
    secondary: "#EC4899", // Light pink
    accent: "#F59E0B", // Orange
    background: "from-pink-50 to-rose-50",
    card: "border-pink-200 bg-white shadow-pink-100/50",
    text: {
      primary: "#DB2777",
      secondary: "#6B7280",
      accent: "#F59E0B",
    },
    gradient: "from-pink-600 via-rose-600 to-orange-600",
    badge: {
      bg: "bg-pink-100",
      text: "text-pink-800",
    },
    button: {
      primary: "bg-pink-600 hover:bg-pink-700",
      secondary: "bg-pink-50 hover:bg-pink-100 text-pink-700 border-pink-200",
      hover: "hover:bg-pink-50",
    },
  },

  // Default theme for fallback
  default: {
    primary: "#142E54", // JD Marc Navy
    secondary: "#A7967E", // JD Marc Sage
    accent: "#F97316", // JD Marc Orange
    background: "from-gray-50 to-gray-100",
    card: "border-gray-200 bg-white shadow-gray-100/50",
    text: {
      primary: "#142E54",
      secondary: "#6B7280",
      accent: "#F97316",
    },
    gradient: "from-[#142E54] via-[#A7967E] to-[#F97316]",
    badge: {
      bg: "bg-gray-100",
      text: "text-gray-800",
    },
    button: {
      primary: "bg-[#142E54] hover:bg-[#142E54]/90",
      secondary: "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200",
      hover: "hover:bg-gray-50",
    },
  },
};

export const getDepartmentTheme = (department?: string): DepartmentTheme => {
  if (!department) return departmentThemes.default;
  return departmentThemes[department] || departmentThemes.default;
};

export const getDepartmentDisplayName = (department?: string): string => {
  if (!department) return "General";

  const displayNames: Record<string, string> = {
    "secretariat-admin": "Secretariat & Administration",
    "business-development": "Business Development",
    "project-management": "Project Management",
    accounting: "Accounting & Finance",
    "human-resources": "Human Resources",
  };

  return (
    displayNames[department] ||
    department.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())
  );
};
