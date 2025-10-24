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
  HardHat,
  Loader2,
  Sparkles,
} from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import useAnalytics from "@/hooks/useAnalytics";
import SeedAccountSelector from "@/components/auth/SeedAccountSelector";
import { SeedAccount } from "@/data/SeedAccounts";
import { CityBackground } from "@/components/auth/ui/CityBackground";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [showCompleteLoginButton, setShowCompleteLoginButton] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { verifyCredentials, completeLogin, isLoading, isAuthenticated } =
    useAuth();
  const { trackBusinessEvent } = useAnalytics();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";
  const enableSeedAccounts =
    import.meta.env.VITE_ENABLE_SEED_ACCOUNTS === "true";

  // Redirect if already authenticated (after auth bootstrap)
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, from]);

  // Pre-fill admin credentials in development mode
  useEffect(() => {
    if (import.meta.env.MODE === "development" && enableSeedAccounts) {
      const adminAccount = {
        email: "admin@jdmarcng.com",
        password: "Admin@123",
      };
      setEmail(adminAccount.email);
      setPassword(adminAccount.password);
    }
  }, [enableSeedAccounts]);

  const handleSeedAccountSelect = (account: SeedAccount) => {
    setEmail(account.email);
    setPassword(account.password);
    setSuccess(
      `Credentials filled for ${account.email}. Click Login to continue.`,
    );
  };

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      trackBusinessEvent.userAuth("login");

      if (!email || !password) {
        setError("Please fill in all fields");
        return;
      }

      const result = await verifyCredentials(email, password);

      if (result.success && result.userId) {
        setSuccess("Credentials verified! Click 'Complete Login' to continue.");
        setUserId(result.userId);
        setShowCompleteLoginButton(true);
      } else {
        setError(result.error || "Invalid email or password");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage = error.message || "An unexpected error occurred";
      if (
        errorMessage.includes("Invalid credentials") ||
        errorMessage.includes("API error")
      ) {
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
      <div id="main-content" className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" role="main">
        {/* Cityscape Background */}
        <CityBackground className="z-0" />
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20 z-10"></div>

        <div className="w-full max-w-md relative z-20">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-8"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex items-center justify-center mb-4"
            >
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-500/30 backdrop-blur-sm border border-orange-400/30">
                  <HardHat className="h-8 w-8 text-white" />
                </div>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-2xl blur-sm"
                />
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl font-bold text-white mb-2 drop-shadow-lg"
            >
              Build With Precision
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-white/80 text-base drop-shadow-md"
            >
              Access your construction dashboard
            </motion.p>
          </motion.div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            whileHover={{ y: -2 }}
            className="relative"
          >
            {/* Enhanced Glassmorphism Background */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl glass-card-hover"></div>
            
            {/* Subtle Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-blue-500/5 rounded-2xl blur-xl opacity-70"></div>
            
            <Card className="relative bg-transparent border-none shadow-none backdrop-blur-sm">
              <CardHeader className="text-center pb-4 pt-6">
                <CardTitle className="text-heading-1 font-semibold text-white text-shadow-glass-strong">
                  Site Access
                </CardTitle>
                <CardDescription className="text-body text-white/80 text-shadow-glass">
                  Enter your credentials to continue
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-6">
                <form onSubmit={handleInitialSubmit} className="space-y-5">
                  {/* Status Messages */}
                  <div role="alert" aria-live="assertive" aria-atomic="true">
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="status-error flex items-center gap-3"
                        >
                          <AlertCircle className="h-4 w-4 text-red-300 flex-shrink-0" aria-hidden="true" />
                          <span className="text-body-small text-red-100 text-shadow-glass">{error}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div role="status" aria-live="polite" aria-atomic="true">
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="status-success flex items-center gap-3"
                      >
                        <CheckCircle className="h-4 w-4 text-green-300 flex-shrink-0" aria-hidden="true" />
                        <span className="text-body-small text-green-100 text-shadow-glass">{success}</span>
                      </motion.div>
                    )}
                  </div>

                  {/* Email Field */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    whileFocus={{ scale: 1.02 }}
                    className="space-y-2"
                  >
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-white/90 drop-shadow-sm"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-blue-500/10 rounded-xl blur-sm opacity-60"></div>
                      <div className="relative bg-white/15 border border-white/25 rounded-xl focus-within:border-orange-400/60 focus-within:bg-white/20 transition-all duration-300 backdrop-blur-sm input-focus-glow">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-12 h-12 bg-transparent border-none text-white placeholder-white/50 focus:ring-0 focus:outline-none drop-shadow-sm"
                          required
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Password Field */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    whileHover={{ scale: 1.02 }}
                    whileFocus={{ scale: 1.02 }}
                    className="space-y-2"
                  >
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-white/90 drop-shadow-sm"
                    >
                      Password
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-blue-500/10 rounded-xl blur-sm opacity-60"></div>
                      <div className="relative bg-white/15 border border-white/25 rounded-xl focus-within:border-orange-400/60 focus-within:bg-white/20 transition-all duration-300 backdrop-blur-sm input-focus-glow">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/70" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-12 pr-12 h-12 bg-transparent border-none text-white placeholder-white/50 focus:ring-0 focus:outline-none drop-shadow-sm"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-12 px-4 py-2 hover:bg-transparent text-white/70 hover:text-white"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          aria-pressed={showPassword}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" aria-hidden="true" />
                          ) : (
                            <Eye className="h-5 w-5" aria-hidden="true" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </div>
                  </motion.div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                  >
                    {!showCompleteLoginButton ? (
                      <Button
                        type="submit"
                        className="btn-arch-primary w-full focus-arch"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={handleCompleteLogin}
                        className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all duration-300"
                        disabled={isLoading}
                        aria-busy={isLoading}
                        aria-live="polite"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                            <span>Completing Login...</span>
                            <span className="sr-only">Please wait, completing your login</span>
                          </div>
                        ) : (
                          "Complete Access"
                        )}
                      </Button>
                    )}
                  </motion.div>
                  
                  {/* Seed Account Selector */}
                  {enableSeedAccounts && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="flex justify-center pt-4"
                    >
                      <SeedAccountSelector onSelect={handleSeedAccountSelect} />
                    </motion.div>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-6"
          >
            <p className="text-white/60 text-sm drop-shadow-sm">
              Secure construction management portal
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
