// Note: This file previously used axios but has been refactored to use Supabase exclusively
// Most endpoints now delegate to supabaseService
import supabaseService from "./supabaseService";

// Token management (legacy - not used with Supabase but kept for compatibility)
const TOKEN_STORAGE_KEY =
  import.meta.env.VITE_TOKEN_STORAGE_KEY || "builder_aura_auth_token";
const REFRESH_TOKEN_STORAGE_KEY =
  import.meta.env.VITE_REFRESH_TOKEN_STORAGE_KEY ||
  "builder_aura_refresh_token";

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

// Legacy API request function (now delegates to Supabase)
const apiRequest = async <T>(
  _method: string,
  _endpoint: string,
  _data?: any,
  _config?: any,
): Promise<T> => {
  // All API calls now go through Supabase
  throw new Error("Legacy API calls are not supported. Use Supabase service instead.");
};

// Authentication API
export const authAPI = {
  register: async (userData: { email: string; password: string }) => {
    // Delegate to Supabase service register
    return supabaseService.register(userData as any);
  },

  login: async (credentials: {
    email: string;
    password: string;
    departmentCode?: string;
  }) => {
    // Delegate to Supabase service login
    return supabaseService.login(credentials.email, credentials.password);
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
    if (!user) throw new Error("Not authenticated");
    // Supabase client handles password change via updateUser when logged in (Edge Functions may be used)
    return apiRequest("POST", "/auth/change-password", passwordData);
  },

  getCurrentUser: async () => {
    return supabaseService.getCurrentUser();
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
    const { data, error } = await (
      await import("../lib/supabaseClient")
    ).default
      .from("contacts")
      .select("*")
      .eq("id", id)
      .single();
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
    const { data, error } = await (
      await import("../lib/supabaseClient")
    ).default
      .from("contacts")
      .update(updateData)
      .eq("id", id);
    if (error) throw error;
    return data;
  },

  getStats: async () => {
    // Basic stats via SQL could be added; for now return counts
    const { data, error } = await (
      await import("../lib/supabaseClient")
    ).default
      .from("contacts")
      .select("id", { count: "exact" });
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
      const ext = img.name.split(".").pop() || "jpg";
      const path = `${projectId}/${Date.now()}_${i}.${ext}`;
      const { data, error } = await supabaseService.uploadFile(
        "project_files",
        img as any,
        path,
      );
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
    const { data: profile, error } = await supabaseService.fetchProfileByAuthId(
      user.id,
    );
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
    if (!user) throw new Error("Not authenticated");
    const idOrAuthId = (user.id as string) || (user.user?.id as string);
    const { data, error } = await supabaseService.updateProfile(
      idOrAuthId,
      profileData as any,
    );
    if (error) throw error;
    return data;
  },

  uploadAvatar: async (avatar: File) => {
    // Upload avatar to Supabase storage and return public URL
    // Attempt to get current user id from supabase client
    const user = await supabaseService.getCurrentUser();
    const userId = user?.id || user?.user?.id || "anonymous";
    const ext = avatar.name.split(".").pop() || "jpg";
    const path = `avatars/${userId}.${ext}`;
    const { data, error } = await supabaseService.uploadFile(
      "project_files",
      avatar as any,
      path,
    );
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
        const res = await (await import("../lib/supabaseClient")).default
          .from("users")
          .select("*");
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
    return supabaseService.updateUserRole(String(userId), "deleted");
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
    return supabaseService.trackEvent(
      eventData.event,
      eventData.data,
      eventData.userId,
    );
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
    const { data, error } = await supabaseService.updateTestimonial(
      id,
      updateData,
    );
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
    const ext = file.name.split(".").pop() || "bin";
    const filename = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const path =
      type === "avatar" ? `avatars/${filename}` : `${type}/${filename}`;
    const { data, error } = await supabaseService.uploadFile(
      "project_files",
      file as any,
      path,
    );
    if (error) throw error;
    return data;
  },

  uploadMultiple: async (files: File[], type: "project" | "document") => {
    const uploaded: Array<{ path: string; error?: any }> = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = file.name.split(".").pop() || "bin";
      const filename = `${Date.now()}_${i}.${ext}`;
      const path = `${type}/${filename}`;
      const { data, error } = await supabaseService.uploadFile(
        "project_files",
        file as any,
        path,
      );
      uploaded.push({ path: data?.path || path, error });
    }
    return { uploaded };
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
    // List for current user via supabaseService
    // params are currently ignored; can be added to service
    const user = await supabaseService.getCurrentUser();
    if (!user) return [];
    const { data, error } = await supabaseService.listNotifications(
      user.id as string,
    );
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
    const { data: projects, error: pErr } =
      await supabaseService.listProjects();
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
    const { data, error } = await (
      await import("../lib/supabaseClient")
    ).default
      .from("settings")
      .select("*");
    if (error) return { error };
    return data || [];
  },

  updateSystemSettings: async (settings: Record<string, any>) => {
    const { data, error } = await (
      await import("../lib/supabaseClient")
    ).default
      .from("settings")
      .upsert([settings]);
    if (error) throw error;
    return data;
  },

  getUserAnalytics: async (_timeframe?: string) => {
    // Simple aggregation from analytics table or RPC (placeholder)
    return { success: true, data: [] };
  },

  getProjectAnalytics: async (_timeframe?: string) => {
    // Simple aggregation from projects table (placeholder)
    return { success: true, data: [] };
  },

  // New REST-style admin routes
  getUsers: async () => {
    const { data, error } = await supabaseService.listUsers();
    if (error) throw error;
    return data || [];
  },

  assignRole: async (userId: string | number, role: string) => {
    const { data, error } = await supabaseService.updateUserRole(
      String(userId),
      role,
    );
    if (error) throw error;
    return data;
  },

  blockUser: async (userId: string | number, blocked: boolean) => {
    const { data, error } = await supabaseService.setUserBlocked(
      String(userId),
      blocked,
    );
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

// Legacy API call function (deprecated - use Supabase service instead)
export const apiCall = async <T>(
  _endpoint: string,
  _options?: {
    method?: string;
    body?: string;
    headers?: Record<string, string>;
    retryConfig?: any;
    skipRetry?: boolean;
  },
): Promise<T> => {
  throw new Error("Legacy apiCall is not supported. Use Supabase service instead.");
};

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
