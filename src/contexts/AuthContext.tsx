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
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; error?: string }>;
  register: (
    userData: RegisterData,
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  role?: string;
  location?: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
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
  }, []);

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      // Simulate API call - In real implementation, this would be an actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock authentication logic
      if (
        email === "admin@jdmarcconstructions.com" &&
        password === "admin123"
      ) {
        const mockUser: User = {
          id: "1",
          email: "admin@jdmarcconstructions.com",
          firstName: "Admin",
          lastName: "User",
          role: "admin",
          company: "JD Marc Constructions",
          phone: "+234 803 000 0000",
          location: "Abuja, Nigeria",
          createdAt: new Date().toISOString(),
        };

        const mockToken =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiZW1haWwiOiJhZG1pbkBqZG1hcmNjb25zdHJ1Y3Rpb25zLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTYzMjE1MjQwMCwiZXhwIjoxNjMyMjM4ODAwfQ.mock_signature";

        setUser(mockUser);
        setToken(mockToken);

        localStorage.setItem("jdmarc_token", mockToken);
        localStorage.setItem("jdmarc_user", JSON.stringify(mockUser));

        setIsLoading(false);
        return { success: true };
      } else if (email && password) {
        // Regular user login
        const mockUser: User = {
          id: "2",
          email: email,
          firstName: "John",
          lastName: "Doe",
          role: "user",
          company: "Example Company",
          phone: "+234 803 000 0001",
          location: "Lagos, Nigeria",
          createdAt: new Date().toISOString(),
        };

        const mockToken =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwiZW1haWwiOiJ1c2VyQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE2MzIxNTI0MDAsImV4cCI6MTYzMjIzODgwMH0.mock_signature";

        setUser(mockUser);
        setToken(mockToken);

        localStorage.setItem("jdmarc_token", mockToken);
        localStorage.setItem("jdmarc_user", JSON.stringify(mockUser));

        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: "Invalid email or password" };
      }
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: "Login failed. Please try again." };
    }
  };

  const register = async (
    userData: RegisterData,
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock registration logic
      const mockUser: User = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: "user",
        company: userData.company,
        phone: userData.phone,
        location: userData.location,
        createdAt: new Date().toISOString(),
      };

      const mockToken =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwiZW1haWwiOiJuZXd1c2VyQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE2MzIxNTI0MDAsImV4cCI6MTYzMjIzODgwMH0.mock_signature";

      setUser(mockUser);
      setToken(mockToken);

      localStorage.setItem("jdmarc_token", mockToken);
      localStorage.setItem("jdmarc_user", JSON.stringify(mockUser));

      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return {
        success: false,
        error: "Registration failed. Please try again.",
      };
    }
  };

  const logout = () => {
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
    isLoading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
