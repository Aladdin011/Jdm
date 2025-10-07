import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
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

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  Shield,
  Loader2,
} from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import useAnalytics from "@/hooks/useAnalytics";
import SeedAccountSelector from "@/components/SeedAccountSelector";
import { SeedAccount } from "@/data/SeedAccounts";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [showCompleteLoginButton, setShowCompleteLoginButton] = useState(false);


  const { verifyCredentials, completeLogin, isLoading, isAuthenticated } = useAuth();
  const { trackBusinessEvent } = useAnalytics();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";
  const enableSeedAccounts = import.meta.env.VITE_ENABLE_SEED_ACCOUNTS === "true";

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Pre-fill admin credentials in development mode (optional; disabled for production hygiene)
  useEffect(() => {
    if (import.meta.env.MODE === 'development' && enableSeedAccounts) {
      const adminAccount = {
        email: "admin@jdmarcng.com",
        password: "Admin@123"
      };
      setEmail(adminAccount.email);
      setPassword(adminAccount.password);
      console.log('🔧 Development mode: Admin credentials pre-filled (manual login required)');
    }
  }, [enableSeedAccounts]);

  const handleSeedAccountSelect = (account: SeedAccount) => {
    setEmail(account.email);
    setPassword(account.password);
    setSuccess(`Credentials filled for ${account.email}. Click Login to continue.`);
    // Remove auto-submission - require explicit user action
  };

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Track login attempt
      trackBusinessEvent.userAuth("login");

      // Basic validation
      if (!email || !password) {
        setError("Please fill in all fields");
        return;
      }

      // Verify email and password
      const result = await verifyCredentials(email, password);

      if (result.success && result.userId) {
        // Show success message and require explicit action to complete login
        setSuccess("Credentials verified! Click 'Complete Login' to continue.");
        setUserId(result.userId);
        setShowCompleteLoginButton(true);
      } else {
        setError(result.error || "Invalid email or password");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      // Provide more user-friendly error message for exceptions
      let errorMessage = error.message || "An unexpected error occurred";
      if (errorMessage.includes("Invalid credentials") || 
          errorMessage.includes("API error")) {
        errorMessage = "Email or password is incorrect. Please try again.";
      }
      setError(errorMessage);
    }
  };

  const handleCompleteLogin = async () => {
    if (!userId) {
      setError("No user ID available. Please try logging in again.");
      return;
    }

    try {
      setError("");
      setSuccess("");
      
      const loginResult = await completeLogin(userId);
      if (loginResult.success) {
        // Track successful login
        trackBusinessEvent.userAuth("login");
        
        setSuccess("Login successful! Redirecting to dashboard...");
        console.log('User logged in successfully:', loginResult.user?.email);
        
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1500);
      } else {
        setError(loginResult.error || "Login completion failed");
        // Reset state on failure
        setUserId(null);
        setShowCompleteLoginButton(false);
      }
    } catch (error: any) {
      console.error("Complete login error:", error);
      setError("Login completion failed. Please try again.");
      // Reset state on error
      setUserId(null);
      setShowCompleteLoginButton(false);
    }
  };



  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-arch-light-blue via-white to-arch-light-blue/30 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-arch-orange to-arch-rust rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-arch-charcoal mb-2">
              Welcome Back
            </h1>
            <p className="text-arch-blue-gray">
              Sign in to access your dashboard
            </p>
          </motion.div>

          <Card className="border-arch-light-blue/50 shadow-xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl text-arch-charcoal">
                Sign In
              </CardTitle>
              <CardDescription className="text-arch-blue-gray">
                Enter your credentials to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInitialSubmit} className="space-y-6">
                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
                    >
                      <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                      <span className="text-red-700 text-sm">{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Success Message */}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-green-700 text-sm">{success}</span>
                  </motion.div>
                )}

                {/* Email Field */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="space-y-2"
                >
                  <Label
                    htmlFor="email"
                    className="text-arch-charcoal font-medium"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-arch-blue-gray" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 border-arch-light-blue/50 focus:border-arch-orange"
                      required
                    />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="space-y-2"
                >
                  <Label
                    htmlFor="password"
                    className="text-arch-charcoal font-medium"
                  >
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-arch-blue-gray" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12 border-arch-light-blue/50 focus:border-arch-orange"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-arch-blue-gray" />
                      ) : (
                        <Eye className="h-4 w-4 text-arch-blue-gray" />
                      )}
                    </Button>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  {!showCompleteLoginButton ? (
                    <Button
                      type="submit"
                      className="w-full h-12 bg-arch-orange hover:bg-arch-rust text-white font-medium"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Signing in...</span>
                        </div>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleCompleteLogin}
                      className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Completing Login...</span>
                        </div>
                      ) : (
                        "Complete Login"
                      )}
                    </Button>
                  )}
                </motion.div>
                
                {enableSeedAccounts && (
                  <div className="mt-4 flex justify-center">
                    <SeedAccountSelector onSelect={handleSeedAccountSelect} />
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>


      </div>
    </PageTransition>
  );
}
