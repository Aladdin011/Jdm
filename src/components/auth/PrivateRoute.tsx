import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

interface PrivateRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export default function PrivateRoute({
  children,
  requireAdmin = false,
}: PrivateRouteProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EAE6DF] to-[#C2CCC5]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A7967E] mx-auto mb-4"></div>
          <p className="text-[#142E54] font-medium">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    // Redirect to dashboard if user is not admin
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
