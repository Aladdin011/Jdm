import React, { Suspense } from 'react';
import { Navigate } from 'react-router-dom';
import AdminDashboard from './dashboards/AdminDashboard';
import AccountsDashboard from './dashboards/AccountsDashboard';
import BusinessAdministrationDashboard from './dashboards/BusinessAdministrationDashboard';
import ExecutiveAssistantDashboard from './dashboards/ExecutiveAssistantDashboard';
import DigitalMarketingDashboard from './dashboards/DigitalMarketingDashboard';
import HRDashboard from './dashboards/HRDashboard';
import ProjectDashboard from './dashboards/ProjectDashboard';
import SecretariatDashboard from './dashboards/SecretariatDashboard';
import GeneralDashboard from './dashboards/GeneralDashboard';
import { toast } from 'sonner';

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
  
  // Log the department for debugging
  console.log('Routing to dashboard for department:', normalizedDepartment);
  
  // Validate department input
  if (!normalizedDepartment) {
    console.error('Missing department information');
    toast.error('Missing department information. Redirecting to login.');
    return <Navigate to="/login" replace />;
  }
  
  try {
    // Track dashboard access for analytics
    console.log(`User accessing ${normalizedDepartment} dashboard`);
    
    return (
      <Suspense fallback={<DashboardLoading />}>
        {(() => {
          switch (normalizedDepartment) {
            case 'admin':
            case 'administrator':
            case 'secretariat-admin':
            case 'admin-secretariat':
            case 'system-admin':
              console.log('Routing to Admin Dashboard');
              return <AdminDashboard />;
              
            case 'accounts':
            case 'accounting':
            case 'finance':
            case 'financial':
            case 'accountant':
              console.log('Routing to Accounts Dashboard');
              return <AccountsDashboard />;
              
            case 'business administration':
            case 'business-administration':
            case 'business-development':
            case 'business development':
            case 'business':
            case 'administration':
              console.log('Routing to Business Administration Dashboard');
              return <BusinessAdministrationDashboard />;
              
            case 'executive assistant':
            case 'executive-assistant':
            case 'executive':
            case 'assistant':
            case 'exec-assistant':
              console.log('Routing to Executive Assistant Dashboard');
              return <ExecutiveAssistantDashboard />;
              
            case 'digital marketing':
            case 'digital-marketing':
            case 'marketing':
            case 'digital':
            case 'social media':
            case 'social-media':
              console.log('Routing to Digital Marketing Dashboard');
              return <DigitalMarketingDashboard />;
              
            case 'hr':
            case 'human resources':
            case 'human-resources':
            case 'personnel':
            case 'staffing':
              console.log('Routing to HR Dashboard');
              return <HRDashboard />;
              
            case 'projects':
            case 'project':
            case 'project-management':
            case 'project management':
            case 'pm':
            case 'project-manager':
              console.log('Routing to Project Dashboard');
              return <ProjectDashboard />;
              
            case 'secretariat':
            case 'secretary':
            case 'secretarial':
            case 'office-admin':
              console.log('Routing to Secretariat Dashboard');
              return <SecretariatDashboard />;
              
            case 'general users':
            case 'general':
            case 'user':
            case 'users':
            case 'default':
              console.log('Routing to General Dashboard');
              return <GeneralDashboard />;
              
            default:
              // Show toast for unknown department
              console.error(`Unknown department: ${normalizedDepartment}`);
              toast.error(`Unknown department: ${normalizedDepartment}. Redirecting to login.`);
              // Attempt to find a fallback dashboard based on partial matches
              if (normalizedDepartment.includes('admin')) {
                console.log('Fallback to Admin Dashboard based on partial match');
                return <AdminDashboard />;
              } else if (normalizedDepartment.includes('account') || normalizedDepartment.includes('financ')) {
                console.log('Fallback to Accounts Dashboard based on partial match');
                return <AccountsDashboard />;
              } else {
                console.log('No fallback found, redirecting to login');
                return <Navigate to="/login" replace />;
              }
          }
        })()}
      </Suspense>
    );
  } catch (error) {
    // Enhanced error logging with more details
    console.error('Error rendering dashboard:', error);
    console.error('Department that caused error:', normalizedDepartment);
    
    // Provide more specific error message based on error type
    if (error instanceof TypeError) {
      toast.error('Dashboard component error. Please contact support with code: TYPE-ERR');
    } else if (error instanceof ReferenceError) {
      toast.error('Dashboard reference error. Please contact support with code: REF-ERR');
    } else {
      toast.error('Failed to load dashboard. Please try logging in again.');
    }
    
    // Show fallback error UI instead of immediate redirect
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#EAE6DF] to-[#C2CCC5] p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <div className="text-red-600 text-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-bold mt-2">Dashboard Error</h2>
          </div>
          <p className="text-gray-700 mb-4">We encountered an error while loading your dashboard. This has been logged for our team to investigate.</p>
          <div className="flex flex-col space-y-2">
            <button 
              onClick={() => window.location.reload()} 
              className="w-full py-2 px-4 bg-[#142E54] text-white rounded hover:bg-[#0e2240] transition-colors">
              Try Again
            </button>
            <button 
              onClick={() => window.location.href = '/login'} 
              className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors">
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default DashboardRouter;
