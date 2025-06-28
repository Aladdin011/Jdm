import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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
  User,
  Building,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import useAnalytics from "@/hooks/useAnalytics";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    location: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { register, isLoading, isAuthenticated } = useAuth();
  const { trackBusinessEvent } = useAnalytics();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (
      field === "confirmPassword" ||
      (field === "password" && formData.confirmPassword)
    ) {
      const password = field === "password" ? value : formData.password;
      const confirmPassword =
        field === "confirmPassword" ? value : formData.confirmPassword;
      setPasswordMatch(password === confirmPassword && password.length > 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      setError("Please fill in all required fields");
      return;
    }

    if (!passwordMatch) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    const result = await register(formData);

    if (result.success) {
      // Track successful registration
      trackBusinessEvent.userAuth("register");
      setSuccess("Registration successful! Redirecting to dashboard...");

      // Small delay to show success message
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } else {
      setError(result.error || "Registration failed");
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-[#EAE6DF] to-[#C2CCC5] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl"
        >
          <Card className="shadow-2xl border-0 overflow-hidden">
            {/* Header */}
            <CardHeader className="bg-[#142E54] text-white text-center py-8">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* JD MARC Logo - Clickable to Homepage */}
                <div className="mb-4">
                  <Link
                    to="/"
                    className="flex items-center justify-center hover:opacity-80 transition-opacity duration-300 cursor-pointer"
                  >
                    <div
                      className="text-3xl font-bold mr-2"
                      style={{
                        color: "#4A90E2",
                        textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                      }}
                    >
                      JD
                    </div>
                    <div
                      className="text-xl font-bold"
                      style={{
                        color: "#EAE6DF",
                        textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                      }}
                    >
                      MARC
                    </div>
                  </Link>
                </div>

                <CardTitle
                  className="text-3xl font-bold"
                  style={{ color: "#EAE6DF" }}
                >
                  Join JD Marc
                </CardTitle>
                <CardDescription
                  className="text-lg mt-2"
                  style={{ color: "#A7967E" }}
                >
                  Create your account to access our construction management
                  platform. Department assignment will be handled by
                  administrators.
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2"
                  >
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-red-700 text-sm">{error}</span>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-green-700 text-sm">{success}</span>
                  </motion.div>
                )}

                {/* Personal Information */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h3 className="text-xl font-semibold text-[#142E54] mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-[#A7967E]" />
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="firstName"
                        className="text-[#142E54] font-medium"
                      >
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="John"
                        className="h-12 border-[#A7967E]/30 focus:border-[#A7967E] focus:ring-[#A7967E]"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="lastName"
                        className="text-[#142E54] font-medium"
                      >
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        className="h-12 border-[#A7967E]/30 focus:border-[#A7967E] focus:ring-[#A7967E]"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Contact Information */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h3 className="text-xl font-semibold text-[#142E54] mb-4 flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-[#A7967E]" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="email"
                        className="text-[#142E54] font-medium"
                      >
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john.doe@company.com"
                        className="h-12 border-[#A7967E]/30 focus:border-[#A7967E] focus:ring-[#A7967E]"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="phone"
                        className="text-[#142E54] font-medium"
                      >
                        Phone Number
                      </Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-[#A7967E]" />
                        <Input
                          id="phone"
                          placeholder="+234 803 000 0000"
                          className="pl-10 h-12 border-[#A7967E]/30 focus:border-[#A7967E] focus:ring-[#A7967E]"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Company Information */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <h3 className="text-xl font-semibold text-[#142E54] mb-4 flex items-center">
                    <Building className="h-5 w-5 mr-2 text-[#A7967E]" />
                    Company Information
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Your department will be assigned by an administrator after
                    registration.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="company"
                        className="text-[#142E54] font-medium"
                      >
                        Company Name
                      </Label>
                      <Input
                        id="company"
                        placeholder="ABC Construction Ltd."
                        className="h-12 border-[#A7967E]/30 focus:border-[#A7967E] focus:ring-[#A7967E]"
                        value={formData.company}
                        onChange={(e) =>
                          handleInputChange("company", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="location"
                        className="text-[#142E54] font-medium"
                      >
                        Location
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-[#A7967E]" />
                        <Input
                          id="location"
                          placeholder="Abuja, Nigeria"
                          className="pl-10 h-12 border-[#A7967E]/30 focus:border-[#A7967E] focus:ring-[#A7967E]"
                          value={formData.location}
                          onChange={(e) =>
                            handleInputChange("location", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Password Section */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <h3 className="text-xl font-semibold text-[#142E54] mb-4 flex items-center">
                    <Lock className="h-5 w-5 mr-2 text-[#A7967E]" />
                    Security
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label
                        htmlFor="password"
                        className="text-[#142E54] font-medium"
                      >
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-[#A7967E]" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          className="pl-10 pr-10 h-12 border-[#A7967E]/30 focus:border-[#A7967E] focus:ring-[#A7967E]"
                          value={formData.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-[#A7967E] hover:text-[#142E54] transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <Label
                        htmlFor="confirmPassword"
                        className="text-[#142E54] font-medium"
                      >
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-[#A7967E]" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className={`pl-10 pr-10 h-12 border-[#A7967E]/30 focus:border-[#A7967E] focus:ring-[#A7967E] ${
                            passwordMatch === false
                              ? "border-red-500"
                              : passwordMatch === true
                                ? "border-green-500"
                                : ""
                          }`}
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                          }
                          required
                        />
                        <div className="absolute right-10 top-3">
                          {passwordMatch === true && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                          {passwordMatch === false && (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-3 text-[#A7967E] hover:text-[#142E54] transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {passwordMatch === false && (
                        <p className="text-red-500 text-sm mt-1">
                          Passwords do not match
                        </p>
                      )}
                      {passwordMatch === true && (
                        <p className="text-green-500 text-sm mt-1">
                          Passwords match
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>

                {/* Department Assignment Info */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.65 }}
                  className="bg-blue-50 border border-blue-200 rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Building className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">
                        Department Assignment
                      </h4>
                      <p className="text-sm text-blue-700">
                        Your department will be assigned by an administrator
                        after your account is created. You'll receive access to
                        department-specific tools and dashboards once assigned.
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="pt-6"
                >
                  <Button
                    type="submit"
                    className="w-full h-12 text-white font-semibold transition-all duration-300 transform hover:scale-105"
                    style={{ backgroundColor: "#A7967E" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#C2CCC5";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#A7967E";
                    }}
                    disabled={isLoading || passwordMatch === false}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Creating account...</span>
                      </div>
                    ) : (
                      "Create Account"
                    )}
                  </Button>

                  <div className="text-center mt-6">
                    <p className="text-[#142E54]">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="text-[#A7967E] hover:text-[#142E54] font-medium transition-colors"
                      >
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}
