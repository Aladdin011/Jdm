import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import supabaseService from './supabaseService'

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
    // Allow callers to explicitly skip auth via custom header
    const skipAuth = config.headers && (config.headers as any)['X-Skip-Auth'] === 'true';

    // Derive request path to determine if endpoint is public
    const urlPath = (config.url || '').toString();
    const isPublicAuthEndpoint = [
      '/auth/login',
      '/auth/register',
      '/auth/verify-credentials',
      '/auth/refresh',
      '/auth/forgot-password',
      '/auth/reset-password',
      '/auth/verify-otp'
    ].some((ep) => urlPath.endsWith(ep));

    if (!skipAuth && !isPublicAuthEndpoint) {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
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
  register: async (userData: { email: string; password: string }) => {
    // Delegate to Supabase service register
    return supabaseService.register(userData as any)
  },

  login: async (credentials: { email: string; password: string; departmentCode?: string }) => {
    // Delegate to Supabase service login
    return supabaseService.login(credentials.email, credentials.password)
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
    // Supabase handles verification flows differently; keep as a passthrough to Edge Function if needed
    return apiRequest("POST", "/auth/verify-otp", otpData);
  },

  forgotPassword: async (email: string) => {
    // Use Supabase's built-in password reset via auth; fallback to backend endpoint if needed
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
    // Change password via Supabase auth; this may require the user to be signed in
    const user = await supabaseService.getCurrentUser();
    if (!user) throw new Error('Not authenticated');
    // Supabase client handles password change via updateUser when logged in (Edge Functions may be used)
    return apiRequest("POST", "/auth/change-password", passwordData);
  },

  getCurrentUser: async () => {
    return supabaseService.getCurrentUser()
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
    return supabaseService.submitContact(formData);
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
    const { data, error } = await supabaseService.listContacts(params);
    if (error) throw error;
    return data || [];
  },

  getById: async (id: string) => {
    const { data, error } = await (await import('../lib/supabaseClient')).default.from('contacts').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
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
    const { data, error } = await (await import('../lib/supabaseClient')).default.from('contacts').update(updateData).eq('id', id);
    if (error) throw error;
    return data;
  },

  getStats: async () => {
    // Basic stats via SQL could be added; for now return counts
    const { data, error } = await (await import('../lib/supabaseClient')).default.from('contacts').select('id', { count: 'exact' });
    if (error) throw error;
    return { total: data?.length || 0 };
  },

  delete: async (id: string) => {
    const { data, error } = await supabaseService.deleteContact(id);
    if (error) throw error;
    return data;
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
    const { data, error } = await supabaseService.listProjects(params);
    if (error) throw error;
    return data || [];
  },

  getById: async (id: string) => {
    const { data, error } = await supabaseService.getProjectById(id);
    if (error) throw error;
    return data;
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
    return supabaseService.createProject(projectData);
  },

  update: async (id: string, updateData: any) => {
    return supabaseService.updateProject(id, updateData);
  },

  delete: async (id: string) => {
    return supabaseService.deleteProject(id);
  },

  uploadImages: async (projectId: string, images: File[]) => {
    // Upload images to Supabase storage bucket 'project_files' under projectId/
    const uploaded: Array<{ path: string; error?: any }> = [];
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      const ext = img.name.split('.').pop() || 'jpg';
      const path = `${projectId}/${Date.now()}_${i}.${ext}`;
      const { data, error } = await supabaseService.uploadFile('project_files', img as any, path);
      uploaded.push({ path: data?.path || path, error });
    }
    return { uploaded };
  },
};

// Users API
export const usersAPI = {
  getProfile: async () => {
    // Return the combined auth user and profile row
    const user = await supabaseService.getCurrentUser();
    if (!user) return null;
    const { data: profile, error } = await supabaseService.fetchProfileByAuthId(user.id);
    if (error) throw error;
    return { user, profile };
  },

  updateProfile: async (profileData: {
    email?: string;
    password?: string;
    department?: string;
  }) => {
    // Update profile using supabaseService; password changes may require Auth flows
    const user = await supabaseService.getCurrentUser();
    if (!user) throw new Error('Not authenticated');
    const idOrAuthId = (user.id as string) || (user.user?.id as string);
    const { data, error } = await supabaseService.updateProfile(idOrAuthId, profileData as any);
    if (error) throw error;
    return data;
  },

  uploadAvatar: async (avatar: File) => {
    // Upload avatar to Supabase storage and return public URL
    // Attempt to get current user id from supabase client
    const user = await supabaseService.getCurrentUser();
    const userId = user?.id || user?.user?.id || 'anonymous';
    const ext = avatar.name.split('.').pop() || 'jpg';
    const path = `avatars/${userId}.${ext}`;
    const { data, error } = await supabaseService.uploadFile('project_files', avatar as any, path);
    return { data, error };
  },

  getAll: async (params?: {
    page?: number;
    limit?: number;
    role?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const { data, error } = await supabaseService.listUsers();
    if (error) throw error;
    return data || [];
  },
  
  // Additional methods for UserManagement.tsx
  getAllUsers: async () => {
    // Query the public.users table directly via supabase
    const { data, error } = await (async () => {
      try {
        // Reuse supabase client via supabaseService
        const res = await (await import('../lib/supabaseClient')).default.from('users').select('*');
        return { data: res.data, error: res.error };
      } catch (err) {
        return { data: null, error: err };
      }
    })();

    if (error) return [];
    return data || [];
  },
  
  updateUserRole: async (userId: string | number, role: string) => {
    return supabaseService.updateUserRole(String(userId), role);
  },
  
  updateUserDepartment: async (userId: string | number, department: string) => {
    return supabaseService.updateUserDepartment(String(userId), department);
  },
  
  activateUser: async (userId: string | number) => {
    return supabaseService.setUserBlocked(String(userId), false);
  },
  
  deactivateUser: async (userId: string | number) => {
    return supabaseService.setUserBlocked(String(userId), true);
  },
  
  deleteUser: async (userId: string | number) => {
    // Soft-delete: set role to 'deleted' or remove profile row. For safety, set role.
    return supabaseService.updateUserRole(String(userId), 'deleted');
  },
};

// Analytics API
export const analyticsAPI = {
  getOverview: async (timeframe?: "day" | "week" | "month") => {
    // Simple wrapper: you can extend to aggregate by timeframe
    return { success: true };
  },

  getUserJourney: async (userId: string) => {
    const { data, error } = await supabaseService.getUserAnalytics(userId);
    if (error) throw error;
    return data || [];
  },

  trackEvent: async (eventData: {
    event: string;
    data?: any;
    userId?: string;
  }) => {
    return supabaseService.trackEvent(eventData.event, eventData.data, eventData.userId);
  },

  getLeadScoring: async () => {
    const { data, error } = await supabaseService.getLeadScoring();
    if (error) throw error;
    return data || [];
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
    const { data, error } = await supabaseService.listTestimonials(params);
    if (error) throw error;
    return data || [];
  },

  getById: async (id: string) => {
    const { data, error } = await supabaseService.getTestimonialById(id);
    if (error) throw error;
    return data;
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
    return supabaseService.submitTestimonial(testimonialData);
  },

  update: async (id: string, updateData: any) => {
    const { data, error } = await supabaseService.updateTestimonial(id, updateData);
    if (error) throw error;
    return data;
  },

  delete: async (id: string) => {
    const { data, error } = await supabaseService.deleteTestimonial(id);
    if (error) throw error;
    return data;
  },
};

// File Upload API
export const uploadAPI = {
  uploadFile: async (file: File, type: "avatar" | "project" | "document") => {
    // Use Supabase storage for uploads
    const ext = file.name.split('.').pop() || 'bin';
    const filename = `${Date.now()}_${Math.random().toString(36).slice(2,8)}.${ext}`;
    const path = type === 'avatar' ? `avatars/${filename}` : `${type}/${filename}`;
    const { data, error } = await supabaseService.uploadFile('project_files', file as any, path);
    if (error) throw error;
    return data;
  },

  uploadMultiple: async (files: File[], type: "project" | "document") => {
    const uploaded: Array<{ path: string; error?: any }> = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split('.').pop() || 'bin';
      const filename = `${Date.now()}_${i}.${ext}`;
      const path = `${type}/${filename}`;
      const { data, error } = await supabaseService.uploadFile('project_files', file as any, path);
      uploaded.push({ path: data?.path || path, error });
    }
    return { uploaded };
  },
};

// Notifications API
export const notificationsAPI = {
  getAll: async (params?: { page?: number; limit?: number; type?: string; isRead?: boolean }) => {
    // List for current user via supabaseService
    // params are currently ignored; can be added to service
    const user = await supabaseService.getCurrentUser();
    if (!user) return [];
    const { data, error } = await supabaseService.listNotifications(user.id as string);
    if (error) throw error;
    return data || [];
  },

  markAsRead: async (id: string) => {
    return supabaseService.markNotificationRead(id);
  },

  markAllAsRead: async () => {
    // Could be implemented by updating all notifications for user; not yet needed
    return { success: true };
  },

  delete: async (id: string) => {
    // Soft-delete not implemented; mark as read for now
    return supabaseService.markNotificationRead(id);
  },
};

// Admin API
export const adminAPI = {
  getDashboard: async () => {
    // Dashboard data can be aggregated via RPCs or client queries. Fallback: return simple counts
    const { data: users, error: uErr } = await supabaseService.listUsers();
    const { data: projects, error: pErr } = await supabaseService.listProjects();
    if (uErr || pErr) throw uErr || pErr;
    return { users: users?.length || 0, projects: projects?.length || 0 };
  },

  getSystemHealth: async () => {
    // Basic health: ensure Supabase project reachable
    try {
      const user = await supabaseService.getCurrentUser();
      return { ok: true, user: !!user };
    } catch (err) {
      return { ok: false, error: err };
    }
  },

  getSystemSettings: async () => {
    // Settings are stored in a settings table or could be stored in project config. Return placeholder
    const { data, error } = await (await import('../lib/supabaseClient')).default.from('settings').select('*');
    if (error) return { error };
    return data || [];
  },

  updateSystemSettings: async (settings: Record<string, any>) => {
    const { data, error } = await (await import('../lib/supabaseClient')).default.from('settings').upsert([settings]);
    if (error) throw error;
    return data;
  },

  getUserAnalytics: async (timeframe?: string) => {
    // Simple aggregation from analytics table or RPC
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
    const { data, error } = await supabaseService.updateUserRole(String(userId), role);
    if (error) throw error;
    return data;
  },
  
  blockUser: async (userId: string | number, blocked: boolean) => {
    const { data, error } = await supabaseService.setUserBlocked(String(userId), blocked);
    if (error) throw error;
    return data;
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

// Notifications API
 

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
        const apiMessage = error.response?.data?.message;
        const apiError = error.response?.data?.error;
        const errText = apiMessage || apiError || 'Unauthorized';

        // Preserve specific message for credential verification flow
        if (endpoint === '/auth/verify-credentials') {
          console.error(`[Final] 401 on verify-credentials:`, errText);
          // Map known backend responses to friendly messages
          if (String(errText).toLowerCase().includes('invalid credentials')) {
            throw new Error('Invalid credentials');
          }
          if (String(errText).toLowerCase().includes('deactivated')) {
            throw new Error('Account is deactivated');
          }
          // Fallback to backend-provided text
          throw new Error(errText);
        }

        console.error(`[Final] 401 Unauthorized error when calling ${endpoint}:`, errText);
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
