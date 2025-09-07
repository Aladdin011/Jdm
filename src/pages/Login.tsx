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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  Shield,
  Key,
  Loader2,
} from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import useAnalytics from "@/hooks/useAnalytics";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [uniqueKey, setUniqueKey] = useState("");
  const [showUniqueKeyModal, setShowUniqueKeyModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isValidatingKey, setIsValidatingKey] = useState(false);
  const [keyValidationAttempts, setKeyValidationAttempts] = useState(0);
  const [userId, setUserId] = useState<number | null>(null);

  const { verifyCredentials, verifyDepartmentCode, completeLogin, isLoading, isAuthenticated } = useAuth();
  const { trackBusinessEvent } = useAnalytics();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Reset form when modal closes
  useEffect(() => {
    if (!showUniqueKeyModal) {
      setUniqueKey("");
      setError("");
      setKeyValidationAttempts(0);
    }
  }, [showUniqueKeyModal]);

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // Step 1: Verify email and password
    const result = await verifyCredentials(email, password);

    if (result.success) {
      if (result.requiresDepartmentCode) {
        // Staff member - show department code modal
        setUserId(result.userId!);
        setSelectedDepartment(result.department!);
        setShowUniqueKeyModal(true);
      } else {
        // Non-staff (admin/general) - complete login directly
        const loginResult = await completeLogin(result.userId!);
        if (loginResult.success) {
          setSuccess("Login successful! Redirecting to dashboard...");
          setTimeout(() => {
            navigate(from, { replace: true });
          }, 1000);
        } else {
          setError(loginResult.error || "Login failed");
        }
      }
    } else {
      setError(result.error || "Invalid credentials");
    }
  };

  const handleUniqueKeySubmit = async () => {
    if (!uniqueKey) {
      setError("Please enter your department code");
      return;
    }

    if (!userId) {
      setError("Session expired. Please try logging in again.");
      return;
    }

    setIsValidatingKey(true);
    setError("");

    try {
      const result = await verifyDepartmentCode(userId, uniqueKey);

      if (result.success) {
        setSuccess("Department code verified! Redirecting to dashboard...");
        setShowUniqueKeyModal(false);
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1000);
      } else {
        setKeyValidationAttempts((prev) => prev + 1);

        // Handle specific error messages from backend
        if (result.error === 'expired code') {
          setError("Your department code has expired. Please contact your administrator.");
        } else if (result.error === 'invalid code') {
          setError("Invalid department code. Please check and try again.");
        } else {
          setError(result.error || "Department code verification failed");
        }

        if (keyValidationAttempts >= 2) {
          setTimeout(() => {
            setShowUniqueKeyModal(false);
            setSelectedDepartment("");
            setUniqueKey("");
            setUserId(null);
            setError("Too many failed attempts. Please contact your administrator.");
          }, 2000);
        }
      }
    } catch (error) {
      setError("Failed to verify department code. Please try again.");
    } finally {
      setIsValidatingKey(false);
    }
  };

  const handleModalClose = () => {
    setShowUniqueKeyModal(false);
    setUniqueKey("");
    setError("");
    setKeyValidationAttempts(0);
    setUserId(null);
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
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Department Code Modal */}
        <Dialog open={showUniqueKeyModal} onOpenChange={setShowUniqueKeyModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-arch-orange" />
                Department Code Required
              </DialogTitle>
              <DialogDescription>
                Please enter your 5-6 character department code to complete login for {selectedDepartment}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="unique-key">Department Code</Label>
                <Input
                  id="unique-key"
                  placeholder="Enter your department code"
                  value={uniqueKey}
                  onChange={(e) => {
                    const value = e.target.value.toUpperCase().slice(0, 6);
                    setUniqueKey(value);
                  }}
                  maxLength={6}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleUniqueKeySubmit();
                    }
                  }}
                />
              </div>
              <p className="text-xs text-arch-blue-gray">
                Format: 5-6 characters (e.g., SA1234, AC5930)
              </p>
            </div>

            {keyValidationAttempts > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-center gap-2 text-yellow-700">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">
                    Attempt {keyValidationAttempts}/3 -{" "}
                    {3 - keyValidationAttempts} attempts remaining
                  </span>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleModalClose}
                className="flex-1 border-arch-light-blue text-arch-charcoal hover:bg-arch-light-blue/20"
                disabled={isValidatingKey}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUniqueKeySubmit}
                disabled={
                  !uniqueKey || uniqueKey.length < 5 || isValidatingKey
                }
                className="flex-1 bg-arch-orange hover:bg-arch-rust text-white"
              >
                {isValidatingKey ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  "Verify Code"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}
