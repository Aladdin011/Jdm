import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to dashboard
      window.location.href = "/dashboard";
    }, 1500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <motion.div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#142E54]/90 to-[#142E54]/70 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://cdn.builder.io/api/v1/image/assets%2F751ea84be0da437c8dd3f1bf04173189%2Fa99cd57b1b98496ca25fa02ed32b5108')",
          }}
        />

        {/* Content Overlay */}
        <div className="relative z-20 flex flex-col justify-center p-12 text-white">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <img
              src="/images/jd-marc-logo.png"
              alt="JD MARC"
              className="h-16 w-auto mb-8 filter brightness-0 invert"
            />
            <h1
              className="text-4xl font-bold mb-4"
              style={{ color: "#EAE6DF" }}
            >
              Welcome Back
            </h1>
            <p className="text-xl mb-6" style={{ color: "#A7967E" }}>
              Engineering Excellence, Building Tomorrow
            </p>
            <p className="text-lg opacity-90">
              Access your construction management dashboard and continue
              building the future with precision and innovation.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Form */}
      <motion.div
        className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#EAE6DF]"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Card className="w-full max-w-md shadow-2xl border-0">
          <CardHeader className="space-y-1 pb-8">
            <CardTitle className="text-3xl font-bold text-center text-[#142E54]">
              Sign In
            </CardTitle>
            <CardDescription className="text-center text-[#A7967E]">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Label htmlFor="email" className="text-[#142E54] font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-[#A7967E]" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@company.com"
                    className="pl-10 h-12 border-[#A7967E]/30 focus:border-[#A7967E] focus:ring-[#A7967E]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
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
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-12 border-[#A7967E]/30 focus:border-[#A7967E] focus:ring-[#A7967E]"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className="rounded border-[#A7967E]/30 text-[#A7967E] focus:ring-[#A7967E]"
                  />
                  <Label htmlFor="remember" className="text-sm text-[#142E54]">
                    Remember me
                  </Label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-[#A7967E] hover:text-[#142E54] transition-colors"
                >
                  Forgot password?
                </Link>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
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
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-center"
              >
                <p className="text-[#142E54]">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="text-[#A7967E] hover:text-[#142E54] font-medium transition-colors"
                  >
                    Create one here
                  </Link>
                </p>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
