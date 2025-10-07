import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// API Configuration
// Derive base URL from `VITE_API_URL` when provided, normalize to include `/api` path.
// Fallback to Vite proxy `/api` in development when not provided.
const normalizeApiBaseUrl = (raw?: string): string => {
  const input = (raw || '').trim();
  if (!input) return '/api';

  // If relative path
  if (input.startsWith('/')) {
    // Ensure it includes `/api`
    return input.includes('/api') ? input : input.replace(/\/+$/, '') + '/api';
  }

  // Absolute URL
  try {
    const u = new URL(input);
    const path = u.pathname || '/';
    // Append `/api` if not present at the end
    if (!path.endsWith('/api') && !path.match(/\/(api)(\/|$)/)) {
      u.pathname = path.replace(/\/+$/, '') + '/api';
    }
    // Remove trailing slash for consistency
    const normalized = u.origin + u.pathname.replace(/\/+$/, '');
    return normalized;
  } catch {
    // If URL parsing fails, fallback safely
    return '/api';
  }
};

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);
// Note: Ensure `.env.development` and proxy config align with backend port

// Log API URL configuration for debugging
console.log(`API Base URL configured as: ${API_BASE_URL}`);
if (!import.meta.env.DEV && !import.meta.env.VITE_API_URL) {
  console.warn('VITE_API_URL is not set. Please set it to your production API.');
}
const TOKEN_STORAGE_KEY =
  import.meta.env.VITE_TOKEN_STORAGE_KEY || "builder_aura_auth_token";
const REFRESH_TOKEN_STORAGE_KEY =
  import.meta.env.VITE_REFRESH_TOKEN_STORAGE_KEY || "builder_aura_refresh_token";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Token management
const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};

const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
};

const setTokens = (accessToken: string, refreshToken: string): void => {
  localStorage.setItem(TOKEN_STORAGE_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
};

const clearTokens = (): void => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
          const response = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            {
              refreshToken,
            },
          );

          const { accessToken, refreshToken: newRefreshToken } =
            response.data.data;
          setTokens(accessToken, newRefreshToken);

          // Retry the original request
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        clearTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

// API Response types
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  error?: string;
  code?: string;
}

// Generic API request function
const apiRequest = async <T>(
  method: string,
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<T> => {
  try {
    const response: AxiosResponse<ApiResponse<T>> = await apiClient.request({
      method,
      url: endpoint,
      data,
      ...config,
    });

    // Support both wrapped and unwrapped API responses
    const payload: any = response.data;
    if (payload && typeof payload === 'object') {
      if ('success' in payload) {
        if (payload.success) {
          // If data exists, return it; otherwise return the payload itself
          return (payload.data !== undefined ? (payload.data as T) : (payload as T));
        } else {
          throw new Error(payload.message || payload.error || "API request failed");
        }
      }
      // No success wrapper: return payload directly
      return payload as T;
    }

    // Fallback: return raw payload
    return payload as T;
  } catch (error: any) {
    // Handle network errors
    if (error.code === "NETWORK_ERROR" || error.message === "Network Error") {
      throw new Error(
        "Network connection failed. Please check your internet connection.",
      );
    }

    // Handle timeout errors
    if (error.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please try again.");
    }

    // Handle API errors (prefer message, fallback to error)
    const apiMessage = error.response?.data?.message;
    const apiError = error.response?.data?.error;
    if (apiMessage || apiError) {
      throw new Error(apiMessage || apiError);
    }

    throw error;
  }
};

// Authentication API
export const authAPI = {
  register: async (userData: {
    email: string;
    password: string;
  }) => {
    // Backend route: POST /api/auth/register
    return apiRequest("POST", "/auth/register", userData);
  },

  login: async (credentials: {
    email: string;
    password: string;
    departmentCode?: string;
  }) => {
    // Backend route: POST /api/auth/login
    const response = await apiRequest<{
      user: any;
    }>("POST", "/auth/login", credentials);

    return response;
  },

  logout: async () => {
    try {
      // No explicit backend logout route; clear tokens client-side
      await Promise.resolve();
    } finally {
      clearTokens();
    }
  },

  verifyOTP: async (otpData: {
    email: string;
    otp: string;
    type: "EMAIL_VERIFICATION" | "PASSWORD_RESET" | "LOGIN_VERIFICATION";
  }) => {
    return apiRequest("POST", "/auth/verify-otp", otpData);
  },

  forgotPassword: async (email: string) => {
    return apiRequest("POST", "/auth/forgot-password", { email });
  },

  resetPassword: async (resetData: {
    email: string;
    otp: string;
    newPassword: string;
  }) => {
    return apiRequest("POST", "/auth/reset-password", resetData);
  },

  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    return apiRequest("POST", "/auth/change-password", passwordData);
  },

  getCurrentUser: async () => {
    // Backend protected route: GET /api/auth/profile
    return apiRequest("GET", "/auth/profile");
  },

  resendVerification: async (email: string) => {
    return apiRequest("POST", "/auth/resend-verification", { email });
  },
};

// Contact Form API
export const contactAPI = {
  submit: async (formData: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    subject: string;
    message: string;
    projectType?: string;
    budget?: string;
    timeline?: string;
    location?: string;
    source?: string;
  }) => {
    return apiRequest("POST", "/contact/submit", formData);
  },

  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    projectType?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    return apiRequest("GET", "/contact", null, { params });
  },

  getById: async (id: string) => {
    return apiRequest("GET", `/contact/${id}`);
  },

  update: async (
    id: string,
    updateData: {
      status?: string;
      priority?: string;
      assignedTo?: string;
      notes?: string;
      followUpDate?: string;
    },
  ) => {
    return apiRequest("PATCH", `/contact/${id}`, updateData);
  },

  getStats: async () => {
    return apiRequest("GET", "/contact/stats/overview");
  },

  delete: async (id: string) => {
    return apiRequest("DELETE", `/contact/${id}`);
  },
};

// Projects API
export const projectsAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    return apiRequest("GET", "/projects", null, { params });
  },

  getById: async (id: string) => {
    return apiRequest("GET", `/projects/${id}`);
  },

  create: async (projectData: {
    title: string;
    description: string;
    category: string;
    location: string;
    budget?: number;
    startDate?: string;
    estimatedEndDate?: string;
    features?: string[];
    tags?: string[];
  }) => {
    return apiRequest("POST", "/projects", projectData);
  },

  update: async (id: string, updateData: any) => {
    return apiRequest("PUT", `/projects/${id}`, updateData);
  },

  delete: async (id: string) => {
    return apiRequest("DELETE", `/projects/${id}`);
  },

  uploadImages: async (projectId: string, images: File[]) => {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`images`, image);
    });

    return apiRequest("POST", `/projects/${projectId}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

// Users API
export const usersAPI = {
  getProfile: async () => {
    return apiRequest("GET", "/auth/profile");
  },

  updateProfile: async (profileData: {
    email?: string;
    password?: string;
    department?: string;
  }) => {
    return apiRequest("PUT", "/auth/update-user", profileData);
  },

  uploadAvatar: async (avatar: File) => {
    const formData = new FormData();
    formData.append("avatar", avatar);

    return apiRequest("POST", "/users/upload-avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  getAll: async (params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    return apiRequest("GET", "/admin/users", null, { params });
  },
  
  // Additional methods for UserManagement.tsx
  getAllUsers: async () => {
    // Use public authenticated users route for general user directory
    // Normalize to return an array of users
    const payload = await apiRequest<{ users: any[] }>("GET", "/users");
    return payload?.users || [];
  },
  
  updateUserRole: async (userId: string | number, role: string) => {
    return apiRequest("PUT", `/admin/users/${userId}/role`, { role });
  },
  
  updateUserDepartment: async (userId: string | number, department: string) => {
    return apiRequest("PUT", `/admin/users/${userId}/department`, { department });
  },
  
  activateUser: async (userId: string | number) => {
    return apiRequest("POST", `/admin/users/${userId}/block`, { blocked: false });
  },
  
  deactivateUser: async (userId: string | number) => {
    return apiRequest("POST", `/admin/users/${userId}/block`, { blocked: true });
  },
  
  deleteUser: async (userId: string | number) => {
    return apiRequest("DELETE", `/admin/users/${userId}`);
  },
};

// Analytics API
export const analyticsAPI = {
  getOverview: async (timeframe?: "day" | "week" | "month") => {
    return apiRequest("GET", "/analytics/overview", null, {
      params: { timeframe },
    });
  },

  getUserJourney: async (userId: string) => {
    return apiRequest("GET", `/analytics/user/${userId}`);
  },

  trackEvent: async (eventData: {
    event: string;
    data?: any;
    userId?: string;
  }) => {
    return apiRequest("POST", "/analytics/track", eventData);
  },

  getLeadScoring: async () => {
    return apiRequest("GET", "/analytics/lead-scoring");
  },
};

// Testimonials API
export const testimonialsAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    approved?: boolean;
    featured?: boolean;
    rating?: number;
  }) => {
    return apiRequest("GET", "/testimonials", null, { params });
  },

  getById: async (id: string) => {
    return apiRequest("GET", `/testimonials/${id}`);
  },

  create: async (testimonialData: {
    name: string;
    email: string;
    company?: string;
    position?: string;
    location?: string;
    rating: number;
    testimonial: string;
    projectName?: string;
    projectValue?: string;
    projectDuration?: string;
  }) => {
    return apiRequest("POST", "/testimonials", testimonialData);
  },

  update: async (id: string, updateData: any) => {
    return apiRequest("PUT", `/testimonials/${id}`, updateData);
  },

  delete: async (id: string) => {
    return apiRequest("DELETE", `/testimonials/${id}`);
  },
};

// File Upload API
export const uploadAPI = {
  uploadFile: async (file: File, type: "avatar" | "project" | "document") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    return apiRequest("POST", "/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  uploadMultiple: async (files: File[], type: "project" | "document") => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("type", type);

    return apiRequest("POST", "/upload/multiple", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

// Notifications API
export const notificationsAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    isRead?: boolean;
  }) => {
    return apiRequest("GET", "/notifications", null, { params });
  },

  markAsRead: async (id: string) => {
    return apiRequest("PATCH", `/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    return apiRequest("PATCH", "/notifications/read-all");
  },

  delete: async (id: string) => {
    return apiRequest("DELETE", `/notifications/${id}`);
  },
};

// Admin API
export const adminAPI = {
  getDashboard: async () => {
    return apiRequest("GET", "/admin/dashboard");
  },

  getSystemHealth: async () => {
    return apiRequest("GET", "/admin/health");
  },

  getSystemSettings: async () => {
    return apiRequest("GET", "/admin/settings");
  },

  updateSystemSettings: async (settings: Record<string, any>) => {
    return apiRequest("PUT", "/admin/settings", settings);
  },

  getUserAnalytics: async (timeframe?: string) => {
    return apiRequest("GET", "/admin/analytics/users", null, {
      params: { timeframe },
    });
  },

  getProjectAnalytics: async (timeframe?: string) => {
    return apiRequest("GET", "/admin/analytics/projects", null, {
      params: { timeframe },
    });
  },

  // New REST-style admin routes
  getUsers: async () => {
    return apiRequest("GET", "/admin/users");
  },
  
  assignRole: async (userId: string | number, role: string) => {
    return apiRequest("PUT", `/admin/users/${userId}/role`, { role });
  },
  
  blockUser: async (userId: string | number, blocked: boolean) => {
    return apiRequest("POST", `/admin/users/${userId}/block`, { blocked });
  },
};

// Utility functions
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const getAuthToken = (): string | null => {
  return getToken();
};

export const clearAuthentication = (): void => {
  clearTokens();
};

// Retry configuration
interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  retryableStatuses: number[];
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  retryableStatuses: [408, 429, 500, 502, 503, 504]
};

// Sleep utility for delays
const sleep = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// Calculate exponential backoff delay
const calculateDelay = (attempt: number, config: RetryConfig): number => {
  const delay = config.baseDelay * Math.pow(2, attempt - 1);
  const jitter = Math.random() * 0.1 * delay; // Add 10% jitter
  return Math.min(delay + jitter, config.maxDelay);
};

// Enhanced API call function with retry logic and fault tolerance
export const apiCall = async <T>(
  endpoint: string,
  options?: {
    method?: string;
    body?: string;
    headers?: Record<string, string>;
    retryConfig?: Partial<RetryConfig>;
    skipRetry?: boolean;
  }
): Promise<T> => {
  const config = { ...DEFAULT_RETRY_CONFIG, ...options?.retryConfig };
  const skipRetry = options?.skipRetry || false;
  let lastError: any;

  for (let attempt = 1; attempt <= (skipRetry ? 1 : config.maxRetries + 1); attempt++) {
    try {
      const method = options?.method || 'GET';
      const data = options?.body ? JSON.parse(options.body) : undefined;
      const requestConfig: AxiosRequestConfig = {
        headers: options?.headers,
        timeout: 30000, // 30 second timeout
      };

      console.log(`[Attempt ${attempt}] Making API call to: ${API_BASE_URL}${endpoint}`);

      const response: AxiosResponse<ApiResponse<T>> = await apiClient.request({
        method,
        url: endpoint,
        data,
        ...requestConfig,
      });

      console.log(`[Success] API call to ${endpoint} completed successfully`);

      // Support both wrapped and unwrapped API responses
      const payload: any = response.data;
      if (payload && typeof payload === 'object') {
        if ('success' in payload) {
          if (payload.success) {
            // If data exists, return it; otherwise return the payload itself
            return (payload.data !== undefined ? (payload.data as T) : (payload as T));
          } else {
            throw new Error(payload.message || payload.error || "API request failed");
          }
        }
        // No success wrapper: return payload directly
        return payload as T;
      }

      // Fallback: return raw payload
      return payload as T;

    } catch (error: any) {
      lastError = error;
      const isLastAttempt = attempt === (skipRetry ? 1 : config.maxRetries + 1);
      
      console.error(`[Attempt ${attempt}] Error calling ${endpoint}:`, {
        status: error.response?.status,
        message: error.message,
        code: error.code
      });

      // Handle specific error types
      if (error.code === "NETWORK_ERROR" || error.message === "Network Error") {
        if (isLastAttempt) {
          console.error(`[Final] Network error when calling ${endpoint}:`, error);
          throw new Error(
            "Network connection failed. Please check your internet connection and try again."
          );
        }
      }
      // Handle timeout errors
      else if (error.code === "ECONNABORTED") {
        if (isLastAttempt) {
          console.error(`[Final] Timeout error when calling ${endpoint}:`, error);
          throw new Error("Request timeout. The server is taking too long to respond.");
        }
      }
      // Handle 404 errors (don't retry)
      else if (error.response?.status === 404) {
        console.error(`[Final] 404 Not Found error when calling ${endpoint}:`, error);
        throw new Error(
          `API endpoint not found: ${endpoint}. The requested resource may not exist on the server.`
        );
      }
      // Handle 401 errors (don't retry)
      else if (error.response?.status === 401) {
        console.error(`[Final] 401 Unauthorized error when calling ${endpoint}:`, error);
        throw new Error("Authentication failed. Please log in again.");
      }
      // Handle 403 errors (don't retry)
      else if (error.response?.status === 403) {
        console.error(`[Final] 403 Forbidden error when calling ${endpoint}:`, error);
        throw new Error("Access denied. You don't have permission to access this resource.");
      }
      // Handle rate limiting with specific retry logic
      else if (error.response?.status === 429) {
        const retryAfter = error.response.headers['retry-after'];
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : calculateDelay(attempt, config);
        
        if (isLastAttempt) {
          console.error(`[Final] Rate limit exceeded for ${endpoint}`);
          throw new Error(
            `Too many requests. Please wait ${Math.ceil(waitTime / 1000)} seconds and try again.`
          );
        }
        
        console.log(`[Retry] Rate limited. Waiting ${waitTime}ms before retry ${attempt + 1}`);
        await sleep(waitTime);
        continue;
      }
      // Handle other retryable errors
      else if (config.retryableStatuses.includes(error.response?.status)) {
        if (isLastAttempt) {
          const apiMessage = error.response?.data?.message;
          const apiError = error.response?.data?.error;
          const errorMsg = apiMessage || apiError || `Server error (${error.response?.status})`;
          console.error(`[Final] Server error when calling ${endpoint}:`, errorMsg);
          throw new Error(errorMsg);
        }
        
        const delay = calculateDelay(attempt, config);
        console.log(`[Retry] Server error. Waiting ${delay}ms before retry ${attempt + 1}`);
        await sleep(delay);
        continue;
      }
      // Handle non-retryable API errors
      else {
        const apiMessage = error.response?.data?.message;
        const apiError = error.response?.data?.error;
        
        if (apiMessage || apiError) {
          // Improve error messages for specific endpoints
          if (endpoint === '/auth/verify-credentials' && (apiMessage || apiError).includes('Invalid credentials')) {
            console.error(`[Final] Auth error when calling ${endpoint}:`, 'Invalid credentials');
            throw new Error('Invalid credentials');
          }
          console.error(`[Final] API error when calling ${endpoint}:`, apiMessage || apiError);
          throw new Error(apiMessage || apiError);
        }
        
        console.error(`[Final] Unhandled error when calling ${endpoint}:`, error);
        throw error;
      }
    }
  }

  // This should never be reached, but just in case
  throw lastError || new Error(`Failed to complete request to ${endpoint} after ${config.maxRetries} attempts`);
};

// Export the configured axios instance for direct use if needed
export { apiClient };

// Default export
// Export individual APIs for backward compatibility
export const projectAPI = projectsAPI;
export const activityAPI = analyticsAPI;
export const userAPI = usersAPI;

export default {
  authAPI,
  contactAPI,
  projectsAPI,
  usersAPI,
  analyticsAPI,
  testimonialsAPI,
  uploadAPI,
  notificationsAPI,
  adminAPI,
  isAuthenticated,
  getAuthToken,
  clearAuthentication,
};
