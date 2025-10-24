import React, { Suspense } from "react";
import { Navigate } from "react-router-dom";
import AdminDashboard from "./admin/AdminDashboard";
import AccountsDashboard from "./admin/AccountsDashboard";
import BusinessAdministrationDashboard from "./admin/BusinessAdministrationDashboard";
import ExecutiveAssistantDashboard from "./admin/ExecutiveAssistantDashboard";
import DigitalMarketingDashboard from "./admin/DigitalMarketingDashboard";
import HRDashboard from "./admin/HRDashboard";
import ProjectDashboard from "./admin/ProjectDashboard";
import SecretariatDashboard from "./admin/SecretariatDashboard";
import GeneralDashboard from "./admin/GeneralDashboard";
import { toast } from "sonner";

interface DashboardRouterProps {
  department: string;
}

// Loading component for dashboard transitions
const DashboardLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#EAE6DF] to-[#C2CCC5]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A7967E] mx-auto mb-4"></div>
      <p className="text-[#142E54] font-medium">Loading your dashboard...</p>
    </div>
  </div>
);

const DashboardRouter: React.FC<DashboardRouterProps> = ({ department }) => {
  // Normalize department name to handle case inconsistencies
  const normalizedDepartment = department?.trim().toLowerCase();
  
  // Validate department input
  if (!normalizedDepartment) {
    console.error("Missing department information");
    toast.error("Missing department information. Redirecting to login.");
    return <Navigate to="/login" replace />;
  }
  
  try {
    return (
      <Suspense fallback={<DashboardLoading />}>
        {(() => {
          switch (normalizedDepartment) {
            case "admin":
            case "administrator":
            case "secretariat-admin":
            case "admin-secretariat":
            case "system-admin":
              return <AdminDashboard />;
              
            case "accounts":
            case "accounting":
            case "finance":
            case "financial":
            case "accountant":
              return <AccountsDashboard />;
              
            case "business administration":
            case "business-administration":
            case "business-development":
            case "business development":
            case "business":
            case "administration":
              return <BusinessAdministrationDashboard />;
              
            case "executive assistant":
            case "executive-assistant":
            case "executive":
            case "assistant":
            case "exec-assistant":
              return <ExecutiveAssistantDashboard />;
              
            case "digital marketing":
            case "digital-marketing":
            case "marketing":
            case "digital":
            case "social media":
            case "social-media":
              return <DigitalMarketingDashboard />;
              
            case "hr":
            case "human resources":
            case "human-resources":
            case "personnel":
            case "staffing":
              return <HRDashboard />;
              
            case "projects":
            case "project":
            case "project-management":
            case "project management":
            case "pm":
            case "project-manager":
              return <ProjectDashboard />;
              
            case "secretariat":
            case "secretary":
            case "secretarial":
            case "office-admin":
              return <SecretariatDashboard />;
              
            case "general users":
            case "general":
            case "user":
            case "users":
            case "default":
              return <GeneralDashboard />;
              
            default:
              // Show toast for unknown department
              console.error(`Unknown department: ${normalizedDepartment}`);
              toast.error(
                `Unknown department: ${normalizedDepartment}. Redirecting to login.`
              );
              // Attempt to find a fallback dashboard based on partial matches
              if (normalizedDepartment.includes("admin")) {
                return <AdminDashboard />;
              } else if (
                normalizedDepartment.includes("account") ||
                normalizedDepartment.includes("financ")
              ) {
                return <AccountsDashboard />;
              } else {
                return <Navigate to="/login" replace />;
              }
          }
        })()}
      </Suspense>
    );
  } catch (error) {
    console.error("Dashboard routing error:", error);
    toast.error("Failed to load dashboard. Please try again.");
    return <Navigate to="/login" replace />;
  }
};

export default DashboardRouter;
