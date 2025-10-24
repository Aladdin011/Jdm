import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Building2, Key, Mail, Lock, Loader2 } from "lucide-react";

interface DepartmentAccount {
  department: string;
  email: string;
  password: string;
  code: string;
  dashboard: string;
}

const departmentAccounts: DepartmentAccount[] = [
  {
    department: "Admin",
    email: "admin@jdmarcng.com",
    password: "Admin@123",
    code: "AD8421",
    dashboard: "AdminDashboard",
  },
  {
    department: "Accounts",
    email: "accounts@jdmarcng.com",
    password: "Acc@123",
    code: "AC5930",
    dashboard: "AccountsDashboard",
  },
  {
    department: "Accounting",
    email: "accounting@jdmarcng.com",
    password: "Acct@123",
    code: "AC1702",
    dashboard: "AccountsDashboard",
  },
  {
    department: "Business Administration",
    email: "busadmin@jdmarcng.com",
    password: "BA@123",
    code: "BA4268",
    dashboard: "BusinessAdministrationDashboard",
  },
  {
    department: "Executive Assistant",
    email: "busdev@jdmarcng.com",
    password: "BD@123",
    code: "EA3127",
    dashboard: "ExecutiveAssistantDashboard",
  },
  {
    department: "Digital Marketing",
    email: "marketing@jdmarcng.com",
    password: "Mkt@123",
    code: "DM7582",
    dashboard: "DigitalMarketingDashboard",
  },
  {
    department: "HR",
    email: "hr@jdmarcng.com",
    password: "Hr@123",
    code: "HR6049",
    dashboard: "HRDashboard",
  },
  {
    department: "Projects",
    email: "projects@jdmarcng.com",
    password: "Proj@123",
    code: "PR1856",
    dashboard: "ProjectDashboard",
  },
  {
    department: "Secretariat",
    email: "secretariat@jdmarcng.com",
    password: "Sec@123",
    code: "SE9273",
    dashboard: "SecretaryDashboard",
  },
  {
    department: "General Users",
    email: "general@jdmarcng.com",
    password: "Gen@123",
    code: "GU3510",
    dashboard: "GeneralDashboard",
  },
];

const DepartmentLoginForm: React.FC = () => {
  const [loginType, setLoginType] = useState<"email" | "code">("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showCompleteLoginButton, setShowCompleteLoginButton] = useState(false);

  const { login, completeLogin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setShowCompleteLoginButton(false);
    setUserId(null);

    try {
      const credentials = {
        identifier: identifier,
        password: password,
      };

      const result = await login(credentials);

      if (result.success && result.userId) {
        // Store userId and show complete login button
        setUserId(String(result.userId));
        setShowCompleteLoginButton(true);
        toast.success(
          "Credentials verified! Click 'Complete Login' to finish.",
        );
      } else if (result.success && result.user) {
        // Direct login success (fallback for older flow)
        toast.success("Login successful! Redirecting to dashboard...");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        toast.error(result.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteLogin = async () => {
    if (!userId) {
      toast.error("No user ID available for completion");
      return;
    }

    setIsLoading(true);

    try {
      const result = await completeLogin(Number(userId));

      if (result.success && result.user) {
        toast.success(
          "Login completed successfully! Redirecting to dashboard...",
        );

        // Reset form state
        setShowCompleteLoginButton(false);
        setUserId(null);
        setIdentifier("");
        setPassword("");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        toast.error(result.error || "Failed to complete login");
      }
    } catch (error) {
      console.error("Complete login error:", error);
      toast.error("An error occurred while completing login");
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (account: DepartmentAccount) => {
    setIdentifier(loginType === "email" ? account.email : account.code);
    setPassword(account.password);
    // Reset completion state when selecting new account
    setShowCompleteLoginButton(false);
    setUserId(null);
    toast.success(
      `Credentials filled for ${account.department}. Click 'Sign In' to verify.`,
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">JD Marc Limited</h1>
          <p className="text-gray-600">Department Login Portal</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Login Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Department Login
              </CardTitle>
              <CardDescription>
                Login with your email or 6-character department code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={loginType}
                onValueChange={(v) => setLoginType(v as "email" | "code")}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="email"
                    className="flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </TabsTrigger>
                  <TabsTrigger value="code" className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Dept Code
                  </TabsTrigger>
                </TabsList>

                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  <TabsContent value="email" className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                        disabled={showCompleteLoginButton}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="code" className="space-y-4">
                    <div>
                      <Label htmlFor="code">Department Code</Label>
                      <Input
                        id="code"
                        type="text"
                        placeholder="Enter 6-character code"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        maxLength={6}
                        required
                        disabled={showCompleteLoginButton}
                      />
                    </div>
                  </TabsContent>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={showCompleteLoginButton}
                    />
                  </div>

                  {!showCompleteLoginButton ? (
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          Sign In
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleCompleteLogin}
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Completing...
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          Complete Login
                        </>
                      )}
                    </Button>
                  )}
                </form>
              </Tabs>
            </CardContent>
          </Card>

          {/* Quick Access */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
              <CardDescription>
                Click any department to fill credentials (Development Mode)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {departmentAccounts.map((account) => (
                  <div
                    key={account.code}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => quickLogin(account)}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {account.department}
                      </div>
                      <div className="text-xs text-gray-500">
                        {loginType === "email"
                          ? account.email
                          : `Code: ${account.code}`}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {account.code}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>© 2024 JD Marc Limited. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default DepartmentLoginForm;
