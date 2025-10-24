import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  HardHat,
} from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";
import useAnalytics from "@/hooks/useAnalytics";
import { CityBackground } from "@/components/auth/ui/CityBackground";

type RegistrationStep = 1 | 2;

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  company: string;
  department: string;
  isStaff: boolean;
  password: string;
  confirmPassword: string;
  departmentCode?: string;
}

export default function Register() {
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    company: "",
    department: "",
    isStaff: false,
    password: "",
    confirmPassword: "",
  });

  // Define departments from the system
  const DEPARTMENTS = [
    { value: "secretariat-admin", label: "Secretariat/Admin" },
    { value: "business-development", label: "Business Development" },
    { value: "project-management", label: "Project Management" },
    { value: "accounting", label: "Accounting" },
    { value: "human-resources", label: "Human Resources" },
    { value: "digital-marketing", label: "Digital Marketing" },
    { value: "business-administration", label: "Business Administration" },
  ];
  const [passwordMatch, setPasswordMatch] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { register, isLoading, isAuthenticated } = useAuth();
  const { trackBusinessEvent } = useAnalytics();
  const navigate = useNavigate();

  // Redirect if already authenticated (after auth bootstrap)
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (
      field === "confirmPassword" ||
      (field === "password" && formData.confirmPassword)
    ) {
      const password = field === "password" ? value as string : formData.password;
      const confirmPassword =
        field === "confirmPassword" ? value as string : formData.confirmPassword;
      setPasswordMatch(password === confirmPassword && password.length > 0);
    }
  };

  const validateStep = (step: RegistrationStep): boolean => {
    setError("");

    switch (step) {
      case 1:
        if (
          !formData.firstName ||
          !formData.lastName ||
          !formData.email ||
          !formData.phone
        ) {
          setError("Please fill in all required fields");
          return false;
        }
        if (!formData.email.includes("@")) {
          setError("Please enter a valid email address");
          return false;
        }
        return true;

      case 2:
        if (
          !formData.location ||
          !formData.password ||
          !formData.confirmPassword
        ) {
          setError("Please fill in all required fields");
          return false;
        }
        if (formData.password.length < 8) {
          setError("Password must be at least 8 characters long");
          return false;
        }
        if (!passwordMatch) {
          setError("Passwords do not match");
          return false;
        }
        return true;

      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 2) as RegistrationStep);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as RegistrationStep);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(2)) return;

    try {
        const result = await register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          company: formData.company,
          department: formData.department,
          isStaff: formData.isStaff,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        });

        if (result.success) {
          trackBusinessEvent.userAuth("register");
          setSuccess("Account created successfully! Preparing your dashboard...");
          
          // Wait a moment for authentication state to update, then redirect
          setTimeout(() => {
            navigate("/dashboard", { replace: true });
          }, 1500);
        } else {
          setError(result.error || "Registration failed");
        }
      } catch (error) {
        setError("Registration failed. Please try again.");
      }
  };

  const stepTitles = {
    1: "Personal Information",
    2: "Account Setup",
  };

  const progress = (currentStep / 2) * 100;

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  };

  return (
    <PageTransition>
      <div className="min-h-screen relative flex items-center justify-center p-4">
        {/* Background */}
        <CityBackground />
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-arch-charcoal/40 via-arch-blue-gray/30 to-arch-charcoal/50 z-10" />
        
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl relative z-20"
        >
          <Card className="shadow-2xl border-0 overflow-hidden backdrop-blur-lg bg-white/10 border border-white/20">
            {/* Header */}
            <CardHeader className="bg-gradient-to-r from-arch-charcoal/90 to-arch-blue-gray/90 text-white py-8 backdrop-blur-sm">
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <Link
                  to="/"
                  className="inline-block mb-4 hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <HardHat className="h-10 w-10 text-arch-orange drop-shadow-lg" />
                    <span className="text-2xl font-bold text-white drop-shadow-lg">
                      JD Marc Limited
                    </span>
                  </div>
                </Link>
                <CardTitle className="text-heading-1 font-semibold text-white text-shadow-glass-strong">
                  Join JD Marc Limited
                </CardTitle>
                <CardDescription className="text-body text-white/80 text-shadow-glass">
                  Create your account to access our platform
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="p-8 bg-white/5 backdrop-blur-sm">
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-white/90 drop-shadow-sm">
                    Step {currentStep} of 2: {stepTitles[currentStep]}
                  </span>
                  <span className="text-sm text-white/70 drop-shadow-sm">
                    {Math.round(progress)}% Complete
                  </span>
                </div>

                {/* Step Indicators */}
                <div className="flex justify-center mb-4">
                  <div className="flex items-center space-x-2">
                    {[1, 2].map((step) => (
                      <div key={step} className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                            step <= currentStep
                              ? "bg-arch-orange text-white shadow-lg"
                              : step === currentStep + 1
                                ? "bg-arch-orange/20 text-arch-orange border-2 border-arch-orange"
                                : "bg-arch-light-blue/30 text-arch-blue-gray"
                          }`}
                        >
                          {step < currentStep ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            step
                          )}
                        </div>
                        {step < 2 && (
                          <div
                            className={`w-12 h-0.5 transition-all duration-300 ${
                              step < currentStep
                                ? "bg-arch-orange"
                                : "bg-arch-light-blue/30"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <Progress
                  value={progress}
                  className="h-2 bg-arch-light-blue/30"
                >
                  <div
                    className="h-full bg-gradient-to-r from-arch-orange to-arch-rust transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </Progress>
              </div>

              {/* Error/Success Messages */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="status-error p-3 rounded-lg text-sm font-medium text-shadow-glass"
                  >
                    <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                    <span className="text-red-200 text-sm">{error}</span>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="status-success p-3 rounded-lg text-sm font-medium text-shadow-glass"
                  >
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-green-200 text-sm">{success}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatePresence mode="wait">
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <motion.div key="step1" {...fadeInUp} className="space-y-6">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-arch-orange/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                          <User className="h-8 w-8 text-arch-orange drop-shadow-lg" />
                        </div>
                        <h3 className="text-xl font-semibold text-white/90 drop-shadow-lg">
                          Personal Details
                        </h3>
                        <p className="text-white/70 text-sm mt-1 drop-shadow-sm">
                          Tell us about yourself
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <Label
                            htmlFor="firstName"
                            className="text-white/90 font-medium drop-shadow-sm"
                          >
                            First Name *
                          </Label>
                          <Input
                            id="firstName"
                            placeholder="Enter your first name"
                            className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-arch-orange focus:ring-arch-orange/20 backdrop-blur-sm"
                            value={formData.firstName}
                            onChange={(e) =>
                              handleInputChange("firstName", e.target.value)
                            }
                            required
                          />
                        </div>

                        <div className="space-y-3">
                          <Label
                            htmlFor="lastName"
                            className="text-white/90 font-medium drop-shadow-sm"
                          >
                            Last Name *
                          </Label>
                          <Input
                            id="lastName"
                            placeholder="Enter your last name"
                            className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-arch-orange focus:ring-arch-orange/20 backdrop-blur-sm"
                            value={formData.lastName}
                            onChange={(e) =>
                              handleInputChange("lastName", e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="email"
                          className="text-white/90 font-medium drop-shadow-sm"
                        >
                          Email Address *
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-5 w-5 text-white/60" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email address"
                            className="pl-11 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-arch-orange focus:ring-arch-orange/20 backdrop-blur-sm"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="phone"
                          className="text-white/90 font-medium drop-shadow-sm"
                        >
                          Phone Number *
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-5 w-5 text-white/60" />
                          <Input
                            id="phone"
                            placeholder="+234 803 000 0000"
                            className="pl-11 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-arch-orange focus:ring-arch-orange/20 backdrop-blur-sm"
                            value={formData.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="company"
                          className="text-white/90 font-medium drop-shadow-sm"
                        >
                          Company/Organization (Optional)
                        </Label>
                        <div className="relative">
                          <HardHat className="absolute left-3 top-3 h-5 w-5 text-white/60" />
                          <Input
                            id="company"
                            placeholder="Enter your company name"
                            className="pl-11 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-arch-orange focus:ring-arch-orange/20 backdrop-blur-sm"
                            value={formData.company}
                            onChange={(e) =>
                              handleInputChange("company", e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="department"
                          className="text-white/90 font-medium drop-shadow-sm"
                        >
                          Department
                        </Label>
                        <Select
                          value={formData.department}
                          onValueChange={(value) =>
                            handleInputChange("department", value)
                          }
                        >
                          <SelectTrigger className="h-12 bg-white/10 border-white/20 text-white focus:border-arch-orange focus:ring-arch-orange/20 backdrop-blur-sm">
                            <SelectValue placeholder="Select your department" />
                          </SelectTrigger>
                          <SelectContent>
                            {DEPARTMENTS.map((dept) => (
                              <SelectItem key={dept.value} value={dept.value}>
                                {dept.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isStaff"
                          checked={formData.isStaff}
                          onCheckedChange={(checked) =>
                            handleInputChange("isStaff", checked === true)
                          }
                        />
                        <Label
                          htmlFor="isStaff"
                          className="text-sm font-medium leading-none text-white/80 drop-shadow-sm"
                        >
                          Register as Staff
                        </Label>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Account Setup */}
                  {currentStep === 2 && (
                    <motion.div key="step2" {...fadeInUp} className="space-y-6">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-arch-orange/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                          <Lock className="h-8 w-8 text-arch-orange drop-shadow-lg" />
                        </div>
                        <h3 className="text-xl font-semibold text-white/90 drop-shadow-lg">
                          Account Setup
                        </h3>
                        <p className="text-white/70 text-sm mt-1 drop-shadow-sm">
                          Complete your account details
                        </p>
                      </div>

                      <div className="space-y-3">
                        <Label
                          htmlFor="location"
                          className="text-white/90 font-medium drop-shadow-sm"
                        >
                          Location *
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-5 w-5 text-white/60" />
                          <Input
                            id="location"
                            placeholder="City, Country"
                            className="pl-11 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-arch-orange focus:ring-arch-orange/20 backdrop-blur-sm"
                            value={formData.location}
                            onChange={(e) =>
                              handleInputChange("location", e.target.value)
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <Label
                            htmlFor="password"
                            className="text-white/90 font-medium drop-shadow-sm"
                          >
                            Password *
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-white/60" />
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a strong password"
                              className="pl-11 pr-11 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-arch-orange focus:ring-arch-orange/20 backdrop-blur-sm"
                              value={formData.password}
                              onChange={(e) =>
                                handleInputChange("password", e.target.value)
                              }
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-white/60 hover:text-arch-orange transition-colors"
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label
                            htmlFor="confirmPassword"
                            className="text-white/90 font-medium drop-shadow-sm"
                          >
                            Confirm Password *
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-5 w-5 text-white/60" />
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              className={`pl-11 pr-16 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-arch-orange focus:ring-arch-orange/20 backdrop-blur-sm ${
                                passwordMatch === false
                                  ? "border-red-400/50 focus:border-red-400"
                                  : passwordMatch === true
                                    ? "border-green-400/50 focus:border-green-400"
                                    : ""
                              }`}
                              value={formData.confirmPassword}
                              onChange={(e) =>
                                handleInputChange(
                                  "confirmPassword",
                                  e.target.value,
                                )
                              }
                              required
                            />
                            <div className="absolute right-11 top-3">
                              {passwordMatch === true && (
                                <CheckCircle className="h-5 w-5 text-green-400" />
                              )}
                              {passwordMatch === false && (
                                <AlertCircle className="h-5 w-5 text-red-400" />
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              className="absolute right-3 top-3 text-white/60 hover:text-arch-orange transition-colors"
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                          {passwordMatch === false && (
                            <p className="text-red-300 text-xs mt-1 drop-shadow-sm">
                              Passwords do not match
                            </p>
                          )}
                          {passwordMatch === true && (
                            <p className="text-green-300 text-xs mt-1 drop-shadow-sm">
                              Passwords match
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="bg-white/10 border border-white/20 rounded-lg p-4 backdrop-blur-sm">
                        <h4 className="font-medium text-white/90 mb-2 drop-shadow-sm">
                          Password Requirements:
                        </h4>
                        <ul className="text-sm text-white/70 space-y-1">
                          <li className="flex items-center gap-2">
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${formData.password.length >= 8 ? "bg-green-400" : "bg-white/30"}`}
                            />
                            At least 8 characters long
                          </li>
                          <li className="flex items-center gap-2">
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(formData.password) ? "bg-green-400" : "bg-white/30"}`}
                            />
                            One uppercase letter
                          </li>
                          <li className="flex items-center gap-2">
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${/[0-9]/.test(formData.password) ? "bg-green-400" : "bg-white/30"}`}
                            />
                            One number
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Department Code Display */}
                {formData.departmentCode ? (
                  <div className="mt-6 p-4 bg-green-400/20 border border-green-400/30 rounded-md backdrop-blur-sm">
                    <h3 className="text-lg font-semibold text-green-200 mb-2 drop-shadow-sm">
                      Registration Successful!
                    </h3>
                    <p className="text-green-300 mb-4 drop-shadow-sm">
                      Your department code has been generated:
                    </p>
                    <div className="bg-white/10 p-3 rounded border border-green-400/30 text-center backdrop-blur-sm">
                      <span className="text-2xl font-bold text-arch-orange drop-shadow-lg">
                        {formData.departmentCode}
                      </span>
                    </div>
                    <p className="mt-4 text-sm text-green-300 drop-shadow-sm">
                      Please save this code for future reference.
                    </p>
                    <Button
                      type="button"
                      className="w-full mt-4 bg-arch-blue hover:bg-arch-blue/90 text-white backdrop-blur-sm"
                      onClick={() => navigate("/login")}
                    >
                      Continue to Login
                    </Button>
                  </div>
                ) : (
                  /* Navigation Buttons */
                  <div className="flex justify-between pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="flex items-center gap-2 border-white/30 text-white/90 hover:bg-white/10 backdrop-blur-sm"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    {currentStep < 2 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="btn-arch-primary focus-arch flex items-center gap-2"
                      >
                        Next
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="btn-arch-primary focus-arch flex items-center gap-2 min-w-[140px]"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Create Account
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </form>

              {/* Login Link */}
              <div className="text-center mt-8 pt-6 border-t border-white/20">
                <p className="text-white/70 drop-shadow-sm">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-arch-orange hover:text-arch-rust font-medium transition-colors drop-shadow-sm"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageTransition>
  );
}
