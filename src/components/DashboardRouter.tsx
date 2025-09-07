import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminDashboard from './dashboards/AdminDashboard';
import AccountsDashboard from './dashboards/AccountsDashboard';
import AccountingDashboard from './dashboards/AccountingDashboard';
import BusinessAdministrationDashboard from './dashboards/BusinessAdministrationDashboard';
import BusinessDevelopmentDashboard from './dashboards/BusinessDevelopmentDashboard';
import DigitalMarketingDashboard from './dashboards/DigitalMarketingDashboard';
import HRDashboard from './dashboards/HRDashboard';
import ProjectDashboard from './dashboards/ProjectDashboard';
import SecretariatDashboard from './dashboards/SecretariatDashboard';
import GeneralDashboard from './dashboards/GeneralDashboard';

interface DashboardRouterProps {
  department: string;
}

const DashboardRouter: React.FC<DashboardRouterProps> = ({ department }) => {
  switch (department) {
    case 'Admin':
      return <AdminDashboard />;
    case 'Accounts':
      return <AccountsDashboard />;
    case 'Accounting':
      return <AccountingDashboard />;
    case 'Business Administration':
      return <BusinessAdministrationDashboard />;
    case 'Business Development':
      return <BusinessDevelopmentDashboard />;
    case 'Digital Marketing':
      return <DigitalMarketingDashboard />;
    case 'HR':
      return <HRDashboard />;
    case 'Projects':
      return <ProjectDashboard />;
    case 'Secretariat':
      return <SecretariatDashboard />;
    case 'General Users':
      return <GeneralDashboard />;
    default:
      console.warn(`Unknown department: ${department}`);
      return <Navigate to="/login" replace />;
  }
};

export default DashboardRouter;
