/**
 * SeedAccounts.ts
 * 
 * This file contains predefined test accounts for each dashboard type.
 * These accounts can be used for quick login access during development and testing.
 */

export interface SeedAccount {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "admin" | "user" | "staff";
  department: string;
  dashboard: string;
  description: string;
}

/**
 * Seed accounts for quick login access to different dashboards
 * Each account has predefined credentials and is associated with a specific dashboard
 */
const seedAccounts: SeedAccount[] = [
  {
    id: "seed-admin-1",
    email: "admin@jdmarcng.com",
    password: "Admin@123",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    department: "Admin",
    dashboard: "AdminDashboard",
    description: "Administrator account with full system access"
  },
  {
    id: "seed-accounts-1",
    email: "accounts@jdmarcng.com",
    password: "Acc@123",
    firstName: "Accounts",
    lastName: "Manager",
    role: "staff",
    department: "Accounts",
    dashboard: "AccountsDashboard",
    description: "Accounts department with financial management access"
  },
  {
    id: "seed-accounting-1",
    email: "accounting@jdmarcng.com",
    password: "Acct@123",
    firstName: "Accounting",
    lastName: "Officer",
    role: "staff",
    department: "Accounting",
    dashboard: "AccountsDashboard",
    description: "Accounting department with financial reporting access"
  },
  {
    id: "seed-business-1",
    email: "busadmin@jdmarcng.com",
    password: "BA@123",
    firstName: "Business",
    lastName: "Administrator",
    role: "staff",
    department: "Business Administration",
    dashboard: "BusinessAdministrationDashboard",
    description: "Business administration with operational management access"
  },
  {
    id: "seed-executive-1",
    email: "busdev@jdmarcng.com",
    password: "BD@123",
    firstName: "Executive",
    lastName: "Assistant",
    role: "staff",
    department: "Executive Assistant",
    dashboard: "ExecutiveAssistantDashboard",
    description: "Executive assistant with scheduling and coordination access"
  },
  {
    id: "seed-marketing-1",
    email: "marketing@jdmarcng.com",
    password: "Mkt@123",
    firstName: "Digital",
    lastName: "Marketer",
    role: "staff",
    department: "Digital Marketing",
    dashboard: "DigitalMarketingDashboard",
    description: "Digital marketing with campaign management access"
  },
  {
    id: "seed-hr-1",
    email: "hr@jdmarcng.com",
    password: "Hr@123",
    firstName: "HR",
    lastName: "Manager",
    role: "staff",
    department: "HR",
    dashboard: "HRDashboard",
    description: "Human resources with personnel management access"
  },
  {
    id: "seed-projects-1",
    email: "projects@jdmarcng.com",
    password: "Proj@123",
    firstName: "Project",
    lastName: "Manager",
    role: "staff",
    department: "Projects",
    dashboard: "ProjectDashboard",
    description: "Project management with task tracking access"
  },
  {
    id: "seed-secretariat-1",
    email: "secretariat@jdmarcng.com",
    password: "Sec@123",
    firstName: "Secretary",
    lastName: "Officer",
    role: "staff",
    department: "Secretariat",
    dashboard: "SecretaryDashboard",
    description: "Secretariat with administrative support access"
  },
  {
    id: "seed-general-1",
    email: "general@jdmarcng.com",
    password: "Gen@123",
    firstName: "General",
    lastName: "User",
    role: "user",
    department: "General Users",
    dashboard: "GeneralDashboard",
    description: "General user with basic system access"
  }
];

/**
 * Get all available seed accounts
 */
export const getAllSeedAccounts = (): SeedAccount[] => {
  return seedAccounts;
};

/**
 * Get a seed account by department
 * @param department The department name to find a seed account for
 */
export const getSeedAccountByDepartment = (department: string): SeedAccount | undefined => {
  const normalizedDepartment = department.trim().toLowerCase();
  return seedAccounts.find(account => 
    account.department.toLowerCase() === normalizedDepartment ||
    account.dashboard.toLowerCase().includes(normalizedDepartment)
  );
};

/**
 * Get a seed account by email
 * @param email The email to find a seed account for
 */
export const getSeedAccountByEmail = (email: string): SeedAccount | undefined => {
  return seedAccounts.find(account => account.email === email);
};

/**
 * Check if an email belongs to a seed account
 * @param email The email to check
 */
export const isSeedAccount = (email: string): boolean => {
  return seedAccounts.some(account => account.email === email);
};



export default seedAccounts;