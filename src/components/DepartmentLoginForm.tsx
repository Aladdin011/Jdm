import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  { department: "Admin", email: "admin@jdmarcng.com", password: "Admin@123", code: "84217", dashboard: "AdminDashboard" },
  { department: "Accounts", email: "accounts@jdmarcng.com", password: "Acc@123", code: "59304", dashboard: "AccountsDashboard" },
  { department: "Accounting", email: "accounting@jdmarcng.com", password: "Acct@123", code: "17026", dashboard: "AccountingDashboard" },
  { department: "Business Administration", email: "busadmin@jdmarcng.com", password: "BA@123", code: "42689", dashboard: "BusinessAdministrationDashboard" },
  { department: "Business Development", email: "busdev@jdmarcng.com", password: "BD@123", code: "31275", dashboard: "BusinessDevelopmentDashboard" },
  { department: "Digital Marketing", email: "marketing@jdmarcng.com", password: "Mkt@123", code: "75820", dashboard: "DigitalMarketingDashboard" },
  { department: "HR", email: "hr@jdmarcng.com", password: "Hr@123", code: "60491", dashboard: "HRDashboard" },
  { department: "Projects", email: "projects@jdmarcng.com", password: "Proj@123", code: "18562", dashboard: "ProjectDashboard" },
  { department: "Secretariat", email: "secretariat@jdmarcng.com", password: "Sec@123", code: "92734", dashboard: "SecretariatDashboard" },
  { department: "General Users", email: "general@jdmarcng.com", password: "Gen@123", code: "35108", dashboard: "GeneralDashboard" }
];

const DepartmentLoginForm: React.FC = () => {
  const [loginType, setLoginType] = useState<'email' | 'code'>('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const credentials = {
        identifier: identifier,
        password: password
      };

      const result = await login(credentials);

      if (result.success) {
        toast.success("Login successful! Redirecting to dashboard...");
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        toast.error(result.error || "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = (account: DepartmentAccount) => {
    setIdentifier(loginType === 'email' ? account.email : account.code);
    setPassword(account.password);
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
                Login with your email or 5-digit department code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={loginType} onValueChange={(v) => setLoginType(v as 'email' | 'code')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email" className="flex items-center gap-2">
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
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="code" className="space-y-4">
                    <div>
                      <Label htmlFor="code">Department Code</Label>
                      <Input
                        id="code"
                        type="text"
                        placeholder="Enter 5-digit code"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        maxLength={5}
                        required
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
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Login
                      </>
                    )}
                  </Button>
                </form>
              </Tabs>
            </CardContent>
          </Card>

          {/* Quick Access */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Access</CardTitle>
              <CardDescription>
                Click any department for quick login (Development Mode)
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
                      <div className="font-medium text-sm">{account.department}</div>
                      <div className="text-xs text-gray-500">
                        {loginType === 'email' ? account.email : `Code: ${account.code}`}
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
