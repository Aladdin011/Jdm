import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
// Development test accounts
const testAccounts = [
  {
    email: "admin@jdmarc.ng",
    password: "admin123",
    firstName: "Admin",
    lastName: "User",
    role: "admin" as const,
    phone: "+234 808 000 0001",
    location: "Lagos, Nigeria",
    department: "Administration",
  },
  {
    email: "user@jdmarc.ng",
    password: "user123",
    firstName: "Test",
    lastName: "User",
    role: "user" as const,
    phone: "+234 808 000 0002",
    location: "Abuja, Nigeria",
    department: "General",
  },
];

const getTestAccountByEmail = (email: string) => {
  return testAccounts.find((account) => account.email === email);
};

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
    const token = localStorage.getItem("jdmarc_token");

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

    const response = await fetch(`${API_BASE_URL}${endpoint}`, fetchOptions);

    // Read the response text once
    let responseText: string;
    try {
      responseText = await response.text();
    } catch (error) {
      throw new Error("Failed to read response from server");
    }

    // Parse JSON if possible
    let data: any;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch (error) {
      // If JSON parsing fails, treat as plain text response
      data = { message: responseText };
    }

    // Check if response is ok after reading the body
    if (!response.ok) {
      const errorMessage =
        data.message ||
        data.error ||
        responseText ||
        `HTTP ${response.status}: ${response.statusText}`;
      return {
        success: false,
        error: errorMessage,
      };
    }

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
          setToken(storedToken);
          setUser(parsedUser);
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

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string; user?: User }> => {
    setIsLoading(true);

    try {
      // Try API call first
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
        // API failed, use development mode
        console.warn("Backend unavailable, using development mode for login");

        // Test accounts authentication for development
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay

        // Check against test accounts
        const testAccount = getTestAccountByEmail(email);

        if (testAccount && testAccount.password === password) {
          const authenticatedUser: User = {
            id: Date.now().toString(),
            email: testAccount.email,
            firstName: testAccount.firstName,
            lastName: testAccount.lastName,
            role: testAccount.role,
            company: "JD Marc Limited",
            phone: testAccount.phone,
            location: testAccount.location,
            department: testAccount.department,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          const authToken =
            "test_token_" + testAccount.email.split("@")[0] + "_" + Date.now();

          setUser(authenticatedUser);
          setToken(authToken);

          localStorage.setItem("jdmarc_token", authToken);
          localStorage.setItem(
            "jdmarc_user",
            JSON.stringify(authenticatedUser),
          );

          setIsLoading(false);
          return { success: true, user: authenticatedUser };
        } else {
          setIsLoading(false);
          return {
            success: false,
            error: testAccount
              ? "Invalid password. Please check your credentials and try again."
              : "Account not found. Please check your email or contact support.",
          };
        }
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

      // Try real API for registration first
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
        // API failed, use development mode
        console.warn(
          "Backend unavailable, using development mode for registration",
        );

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
    } catch (error) {
      console.error("Registration error:", error);
      setIsLoading(false);
      return {
        success: false,
        error:
          "Registration failed. Please check your connection and try again.",
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
    // Try to call logout endpoint, but don't wait for it
    if (token) {
      apiCall("/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).catch((error) => {
        console.log(
          "Logout API call failed (this is normal in dev mode):",
          error,
        );
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
