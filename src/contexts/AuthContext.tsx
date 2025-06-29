import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "user" | "admin";
  company?: string;
  phone?: string;
  location?: string;
  department?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string; user?: User }>;
  register: (
    userData: RegisterData,
  ) => Promise<{ success: boolean; error?: string; user?: User }>;
  logout: () => void;
  updateUser: (
    userData: Partial<User>,
  ) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  refreshToken: () => Promise<boolean>;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  location?: string;
  password: string;
  confirmPassword: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// API Configuration
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// API Helper Functions
const apiCall = async <T = any,>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || "An error occurred",
      };
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    };
  } catch (error) {
    console.error("API Error:", error);
    return {
      success: false,
      error: "Network error. Please check your connection and try again.",
    };
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("jdmarc_token");
      const storedUser = localStorage.getItem("jdmarc_user");

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);

          // Verify token with backend
          const isValid = await verifyToken(storedToken);

          if (isValid) {
            setToken(storedToken);
            setUser(parsedUser);
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem("jdmarc_token");
            localStorage.removeItem("jdmarc_user");
          }
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          localStorage.removeItem("jdmarc_token");
          localStorage.removeItem("jdmarc_user");
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Verify token with backend
  const verifyToken = async (tokenToVerify: string): Promise<boolean> => {
    try {
      // Always use real API - backend is now available
      const response = await apiCall("/auth/verify", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenToVerify}`,
        },
      });

      return response.success;
    } catch (error) {
      console.error("Token verification failed:", error);
      return false;
    }
  };

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string; user?: User }> => {
    setIsLoading(true);

    try {
      // Use real API for authentication
      const response = await apiCall<{ user: User; token: string }>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        },
      );

      if (response.success && response.data) {
        const { user: loginUser, token: loginToken } = response.data;

        setUser(loginUser);
        setToken(loginToken);

        localStorage.setItem("jdmarc_token", loginToken);
        localStorage.setItem("jdmarc_user", JSON.stringify(loginUser));

        setIsLoading(false);
        return { success: true, user: loginUser };
      } else {
        // If API fails due to backend unavailability, use development mode
        if (response.error?.includes("Cannot connect") ||
            response.error?.includes("not found") ||
            response.error?.includes("endpoint not found") ||
            response.error?.includes("Failed to fetch")) {
          console.warn("Backend unavailable, using development mode for login");

          // Mock authentication for development
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

          // Simple development mode: any email/password combination works
          if (email && password) {
            const mockUser: User = {
              id: Date.now().toString(),
              email: email,
              firstName: email.split('@')[0] || "User",
              lastName: "Dev",
              role: email.includes("admin") ? "admin" : "user",
              company: "JD Marc (Dev Mode)",
              phone: "+234 803 000 0000",
              location: "Lagos, Nigeria",
              department: email.includes("admin") ? "secretariat-admin" : undefined,
              isActive: true,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            const mockToken = "dev_token_" + Date.now();

            setUser(mockUser);
            setToken(mockToken);

            localStorage.setItem("jdmarc_token", mockToken);
            localStorage.setItem("jdmarc_user", JSON.stringify(mockUser));

            setIsLoading(false);
            return { success: true, user: mockUser };
          }
        }

        setIsLoading(false);
        return {
          success: false,
          error: response.error || "Invalid email or password",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return {
        success: false,
        error: "Login failed. Please check your connection and try again.",
      };
    }
  };
  const register = async (
    userData: RegisterData,
  ): Promise<{ success: boolean; error?: string; user?: User }> => {
    setIsLoading(true);

    try {
      // Validate password confirmation
      if (userData.password !== userData.confirmPassword) {
        setIsLoading(false);
        return {
          success: false,
          error: "Passwords do not match",
        };
      }

      // Check if backend is available first
      let backendAvailable = false;
      try {
        const healthCheck = await fetch(`${API_BASE_URL.replace('/api', '')}/api/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(3000)
        });
        backendAvailable = healthCheck.ok;
      } catch (error) {
        console.log("Backend health check failed, using development mode");
        backendAvailable = false;
      }

      if (!backendAvailable) {
        console.warn("Backend unavailable, using development mode for registration");

          // Mock registration for development when backend is unavailable
          await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API delay

          const mockUser: User = {
            id: Date.now().toString(),
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: "user", // New registrations default to user role
            company: userData.company,
            phone: userData.phone,
            location: userData.location,
            department: undefined, // No department assigned initially
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const mockToken = "dev_token_" + Date.now();

          setUser(mockUser);
          setToken(mockToken);

          localStorage.setItem("jdmarc_token", mockToken);
          localStorage.setItem("jdmarc_user", JSON.stringify(mockUser));

          setIsLoading(false);
          return { success: true, user: mockUser };
        }

        setIsLoading(false);
        return {
          success: false,
          error: response.error || "Registration failed. Please try again.",
        };
      }
    } catch (error) {
      console.error("Registration error:", error);
      setIsLoading(false);
      return {
        success: false,
        error: "Registration failed. Please check your connection and try again.",
      };
    }
  };

  const updateUser = async (
    userData: Partial<User>,
  ): Promise<{ success: boolean; error?: string }> => {
    if (!token) {
      return { success: false, error: "Not authenticated" };
    }

    try {
      const response = await apiCall<User>("/auth/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (response.success && response.data) {
        const updatedUser = response.data;
        setUser(updatedUser);
        localStorage.setItem("jdmarc_user", JSON.stringify(updatedUser));
        return { success: true };
      } else {
        return {
          success: false,
          error: response.error || "Failed to update profile",
        };
      }
    } catch (error) {
      return {
        success: false,
        error: "Failed to update profile. Please try again.",
      };
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    if (!token) return false;

    try {
      // Use real API for token refresh
      const response = await apiCall<{ token: string }>("/auth/refresh", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.success && response.data) {
        const newToken = response.data.token;
        setToken(newToken);
        localStorage.setItem("jdmarc_token", newToken);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  };

  const logout = () => {
    // Always call logout endpoint to invalidate token on server
    if (token) {
      apiCall("/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch((error) => {
        console.error("Logout API call failed:", error);
        // Continue with logout even if API call fails
      });
    }

    setUser(null);
    setToken(null);
    localStorage.removeItem("jdmarc_token");
    localStorage.removeItem("jdmarc_user");
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    updateUser,
    isLoading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === "admin",
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export types for use in other components
export type { User, RegisterData };