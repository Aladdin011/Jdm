// API Service for JD Marc Application
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem("jdmarc_token");
};

// Generic API call function
export const apiCall = async <T = any>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> => {
  try {
    const token = getAuthToken();

    // Prepare headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers as Record<string, string>),
    };

    // Prepare the fetch options
    const fetchOptions: RequestInit = {
      ...options,
      headers,
    };

    console.log(`Making API call to: ${API_BASE_URL}${endpoint}`);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);

    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      // Handle specific error cases
      if (response.status === 404) {
        return {
          success: false,
          error:
            "API endpoint not found. Please check if the backend server is running.",
        };
      }

      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage =
          errorData.message ||
          errorData.error ||
          `HTTP ${response.status}: ${response.statusText}`;
      } catch {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }

    const data = await response.json();

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    };
  } catch (error) {
    console.error("API Error:", error);

    // Handle specific network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        success: false,
        error:
          "Cannot connect to the backend server. Please ensure the server is running on port 5000.",
      };
    }

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Network error. Please check your connection and try again.",
    };
  }
};

// Auth API calls
export const authAPI = {
  login: (email: string, password: string) =>
    apiCall("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (userData: any) =>
    apiCall("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  verify: () =>
    apiCall("/auth/verify", {
      method: "POST",
    }),

  refresh: () =>
    apiCall("/auth/refresh", {
      method: "POST",
    }),

  logout: () =>
    apiCall("/auth/logout", {
      method: "POST",
    }),

  updateProfile: (userData: any) =>
    apiCall("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    }),
};

// User management API calls (Admin only)
export const userAPI = {
  getAllUsers: () =>
    apiCall("/admin/users", {
      method: "GET",
    }),

  getUserById: (userId: string) =>
    apiCall(`/admin/users/${userId}`, {
      method: "GET",
    }),

  updateUserRole: (userId: string, role: "user" | "admin") =>
    apiCall(`/admin/users/${userId}/role`, {
      method: "PUT",
      body: JSON.stringify({ role }),
    }),

  updateUserDepartment: (userId: string, department: string) =>
    apiCall(`/admin/users/${userId}/department`, {
      method: "PUT",
      body: JSON.stringify({ department }),
    }),

  deactivateUser: (userId: string) =>
    apiCall(`/admin/users/${userId}/deactivate`, {
      method: "PUT",
    }),

  activateUser: (userId: string) =>
    apiCall(`/admin/users/${userId}/activate`, {
      method: "PUT",
    }),

  deleteUser: (userId: string) =>
    apiCall(`/admin/users/${userId}`, {
      method: "DELETE",
    }),
};

// Project management API calls
export const projectAPI = {
  getUserProjects: () =>
    apiCall("/projects/user", {
      method: "GET",
    }),

  getAllProjects: () =>
    apiCall("/admin/projects", {
      method: "GET",
    }),

  getProjectById: (projectId: string) =>
    apiCall(`/projects/${projectId}`, {
      method: "GET",
    }),

  createProject: (projectData: any) =>
    apiCall("/admin/projects", {
      method: "POST",
      body: JSON.stringify(projectData),
    }),

  updateProject: (projectId: string, projectData: any) =>
    apiCall(`/admin/projects/${projectId}`, {
      method: "PUT",
      body: JSON.stringify(projectData),
    }),

  updateProjectStatus: (projectId: string, status: string) =>
    apiCall(`/projects/${projectId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),

  assignUserToProject: (projectId: string, userId: string) =>
    apiCall(`/admin/projects/${projectId}/assign`, {
      method: "POST",
      body: JSON.stringify({ userId }),
    }),

  removeUserFromProject: (projectId: string, userId: string) =>
    apiCall(`/admin/projects/${projectId}/unassign`, {
      method: "DELETE",
      body: JSON.stringify({ userId }),
    }),
};

// Activity/Logs API calls
export const activityAPI = {
  getUserActivity: () =>
    apiCall("/activity/user", {
      method: "GET",
    }),

  getSystemLogs: () =>
    apiCall("/admin/logs", {
      method: "GET",
    }),

  getUserLogs: (userId: string) =>
    apiCall(`/admin/logs/user/${userId}`, {
      method: "GET",
    }),
};

// File upload API calls
export const fileAPI = {
  uploadDocument: (file: File, projectId?: string) => {
    const formData = new FormData();
    formData.append("file", file);
    if (projectId) {
      formData.append("projectId", projectId);
    }

    return apiCall("/files/upload", {
      method: "POST",
      headers: {
        // Don't set Content-Type for FormData, let browser set it
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });
  },

  getFile: (fileId: string) =>
    apiCall(`/files/${fileId}`, {
      method: "GET",
    }),

  deleteFile: (fileId: string) =>
    apiCall(`/files/${fileId}`, {
      method: "DELETE",
    }),
};

// Contact/Support API calls
export const contactAPI = {
  sendMessage: (messageData: any) =>
    apiCall("/contact/message", {
      method: "POST",
      body: JSON.stringify(messageData),
    }),

  getMessages: () =>
    apiCall("/admin/messages", {
      method: "GET",
    }),

  markMessageAsRead: (messageId: string) =>
    apiCall(`/admin/messages/${messageId}/read`, {
      method: "PUT",
    }),
};

export default {
  auth: authAPI,
  user: userAPI,
  project: projectAPI,
  activity: activityAPI,
  file: fileAPI,
  contact: contactAPI,
};
