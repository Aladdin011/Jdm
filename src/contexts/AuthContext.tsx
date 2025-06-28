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
  department?: string;
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
      // Check if we're in development mode (no backend available)
      const isDevelopment = API_BASE_URL.includes("localhost");

      if (isDevelopment) {
        // Mock token verification for development
        // In development, we'll consider any token that starts with "mock_" as valid
        return tokenToVerify.startsWith("mock_");
      }

      // Production mode - use real API
      const response = await apiCall("/auth/verify", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenToVerify}`,
        },
      });

      return response.success;
    } catch (error) {
      return false;
    }
  };

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string; user?: User }> => {
    setIsLoading(true);

    try {
      // Check if we're in development mode (no backend available)
      const isDevelopment = API_BASE_URL.includes("localhost");

      if (isDevelopment) {
        // Mock authentication for development
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

        // Predefined test users for different departments
        const testUsers: Record<string, User> = {
          "admin@jdmarc.com": {
            id: "1",
            email: "admin@jdmarc.com",
            firstName: "Admin",
            lastName: "User",
            role: "admin",
            company: "JD Marc",
            phone: "+234 803 000 0000",
            location: "Abuja, Nigeria",
            department: "secretariat-admin",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          "business@jdmarc.com": {
            id: "2",
            email: "business@jdmarc.com",
            firstName: "Sarah",
            lastName: "Johnson",
            role: "user",
            company: "JD Marc",
            phone: "+234 803 000 0001",
            location: "Lagos, Nigeria",
            department: "business-development",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          "project@jdmarc.com": {
            id: "3",
            email: "project@jdmarc.com",
            firstName: "Michael",
            lastName: "Chen",
            role: "user",
            company: "JD Marc",
            phone: "+234 803 000 0002",
            location: "Port Harcourt, Nigeria",
            department: "project-management",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          "accounts@jdmarc.com": {
            id: "4",
            email: "accounts@jdmarc.com",
            firstName: "Fatima",
            lastName: "Abdullahi",
            role: "user",
            company: "JD Marc",
            phone: "+234 803 000 0003",
            location: "Kano, Nigeria",
            department: "accounting",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          "hr@jdmarc.com": {
            id: "5",
            email: "hr@jdmarc.com",
            firstName: "David",
            lastName: "Okafor",
            role: "user",
            company: "JD Marc",
            phone: "+234 803 000 0004",
            location: "Enugu, Nigeria",
            department: "human-resources",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          "test@test.com": {
            id: "6",
            email: "test@test.com",
            firstName: "Test",
            lastName: "User",
            role: "user",
            company: "Test Company",
            phone: "+234 803 000 0005",
            location: "Abuja, Nigeria",
            department: "project-management",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        };

        // Check for predefined test users first
        if (
          testUsers[email] &&
          (password === "test123" ||
            (email === "admin@jdmarc.com" && password === "admin123"))
        ) {
          const mockUser = testUsers[email];
          const mockToken = `mock_${mockUser.department}_token_` + Date.now();

          setUser(mockUser);
          setToken(mockToken);

          localStorage.setItem("jdmarc_token", mockToken);
          localStorage.setItem("jdmarc_user", JSON.stringify(mockUser));

          setIsLoading(false);
          return { success: true, user: mockUser };
        }
        // Fallback for any other email/password combination
        else if (email && password) {
          const mockUser: User = {
            id: Date.now().toString(),
            email: email,
            firstName: "Generic",
            lastName: "User",
            role: "user",
            company: "External Company",
            phone: "+234 803 000 0000",
            location: "Lagos, Nigeria",
            department: "project-management",
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const mockToken = "mock_generic_token_" + Date.now();

          setUser(mockUser);
          setToken(mockToken);

          localStorage.setItem("jdmarc_token", mockToken);
          localStorage.setItem("jdmarc_user", JSON.stringify(mockUser));

          setIsLoading(false);
          return { success: true, user: mockUser };
        } else {
          setIsLoading(false);
          return { success: false, error: "Invalid email or password" };
        }
      }

      // Production mode - use real API
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
        setIsLoading(false);
        return {
          success: false,
          error: response.error || "Invalid email or password",
        };
      }
    } catch (error) {
      setIsLoading(false);
      return {
        success: false,
        error: "Login failed. Please try again.",
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

      // Check if we're in development mode (no backend available)
      const isDevelopment = API_BASE_URL.includes("localhost");

      if (isDevelopment) {
        // Mock registration for development
        await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API delay

        // Create mock user from registration data
        const mockUser: User = {
          id: Date.now().toString(), // Generate unique ID
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: "user", // New registrations default to user role
          company: userData.company,
          phone: userData.phone,
          location: userData.location,
          department: userData.department,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const mockToken = "mock_token_" + Date.now();

        setUser(mockUser);
        setToken(mockToken);

        localStorage.setItem("jdmarc_token", mockToken);
        localStorage.setItem("jdmarc_user", JSON.stringify(mockUser));

        setIsLoading(false);
        return { success: true, user: mockUser };
      }

      // Production mode - use real API
      const response = await apiCall<{ user: User; token: string }>(
        "/auth/register",
        {
          method: "POST",
          body: JSON.stringify(userData),
        },
      );

      if (response.success && response.data) {
        const { user: newUser, token: newToken } = response.data;

        setUser(newUser);
        setToken(newToken);

        localStorage.setItem("jdmarc_token", newToken);
        localStorage.setItem("jdmarc_user", JSON.stringify(newUser));

        setIsLoading(false);
        return { success: true, user: newUser };
      } else {
        setIsLoading(false);
        return {
          success: false,
          error: response.error || "Registration failed. Please try again.",
        };
      }
    } catch (error) {
      setIsLoading(false);
      return {
        success: false,
        error: "Registration failed. Please try again.",
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
      // Check if we're in development mode (no backend available)
      const isDevelopment = API_BASE_URL.includes("localhost");

      if (isDevelopment) {
        // Mock token refresh for development
        if (token.startsWith("mock_")) {
          // Generate a new mock token
          const newToken = "mock_refreshed_token_" + Date.now();
          setToken(newToken);
          localStorage.setItem("jdmarc_token", newToken);
          return true;
        }
        return false;
      }

      // Production mode - use real API
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
      return false;
    }
  };

  const logout = () => {
    // Check if we're in development mode (no backend available)
    const isDevelopment = API_BASE_URL.includes("localhost");

    if (!isDevelopment) {
      // Call logout endpoint to invalidate token on server (production only)
      if (token) {
        apiCall("/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).catch(console.error);
      }
    }
    // In development mode, we skip the API call to avoid errors

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
