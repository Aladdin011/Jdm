export interface TestAccount {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "admin" | "user" | "staff";
  department?: string;
  uniqueKey?: string;
  phone?: string;
  location?: string;
  isStaff: boolean;
  description: string;
}

export const testAccounts: TestAccount[] = [
  // Admin Account
  {
    email: "admin@jdmarcng.com",
    password: "admin123",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    department: "secretariat-admin",
    uniqueKey: "SA1234",
    phone: "+234 803 000 0001",
    location: "Abuja, Nigeria",
    isStaff: true,
    description:
      "System Administrator with full access to all features including user management, UniqueKey generation, and system analytics.",
  },

  // Secretariat & Administration
  {
    email: "secretary@jdmarcng.com",
    password: "secretary123",
    firstName: "Grace",
    lastName: "Nwosu",
    role: "staff",
    department: "secretariat-admin",
    uniqueKey: "SA5678",
    phone: "+234 803 000 0002",
    location: "Abuja, Nigeria",
    isStaff: true,
    description:
      "Secretariat staff with access to scheduling, document management, visitor logs, and executive briefings.",
  },

  // Accounting & Finance
  {
    email: "accountant@jdmarcng.com",
    password: "accounting123",
    firstName: "Emmanuel",
    lastName: "Okafor",
    role: "staff",
    department: "accounting",
    uniqueKey: "AC3456",
    phone: "+234 803 000 0003",
    location: "Lagos, Nigeria",
    isStaff: true,
    description:
      "Accounting staff with access to invoicing, payroll, budget management, and financial reporting.",
  },

  // Human Resources
  {
    email: "hr@jdmarcng.com",
    password: "hr123",
    firstName: "Adunni",
    lastName: "Bakare",
    role: "staff",
    department: "human-resources",
    uniqueKey: "HR7890",
    phone: "+234 803 000 0004",
    location: "Lagos, Nigeria",
    isStaff: true,
    description:
      "HR staff with access to employee records, recruitment, leave management, and performance tracking.",
  },

  // Project Management
  {
    email: "pm@jdmarcng.com",
    password: "project123",
    firstName: "Donatus",
    lastName: "Oduopara",
    role: "staff",
    department: "project-management",
    uniqueKey: "PM2468",
    phone: "+234 803 000 0005",
    location: "Abuja, Nigeria",
    isStaff: true,
    description:
      "Project Manager with access to project cards, Gantt charts, resource management, and team coordination.",
  },

  // Business Development
  {
    email: "bd@jdmarcng.com",
    password: "business123",
    firstName: "Chioma",
    lastName: "Ugochukwu",
    role: "staff",
    department: "business-development",
    uniqueKey: "BD1357",
    phone: "+234 803 000 0006",
    location: "Lagos, Nigeria",
    isStaff: true,
    description:
      "Business Development staff with access to lead tracking, proposals, partnerships, and revenue management.",
  },

  // Digital Marketing
  {
    email: "marketing@jdmarcng.com",
    password: "marketing123",
    firstName: "Kemi",
    lastName: "Adeleke",
    role: "staff",
    department: "digital-marketing",
    uniqueKey: "DM9876",
    phone: "+234 803 000 0007",
    location: "Lagos, Nigeria",
    isStaff: true,
    description:
      "Digital Marketing staff with access to campaign analytics, content pipeline, and social media management.",
  },

  // Business Administration
  {
    email: "ba@jdmarcng.com",
    password: "administration123",
    firstName: "Abdullahi",
    lastName: "Musa",
    role: "staff",
    department: "business-administration",
    uniqueKey: "BA5432",
    phone: "+234 803 000 0008",
    location: "Abuja, Nigeria",
    isStaff: true,
    description:
      "Business Administration staff with access to organization KPIs, approval workflows, and governance oversight.",
  },

  // Regular User (Non-Staff)
  {
    email: "user@jdmarcng.com",
    password: "user123",
    firstName: "John",
    lastName: "Doe",
    role: "user",
    phone: "+234 803 000 0009",
    location: "Port Harcourt, Nigeria",
    isStaff: false,
    description:
      "Regular user account without department assignment. Shows general dashboard until admin assigns department.",
  },

  // Additional Test Users
  {
    email: "test@jdmarcng.com",
    password: "test123",
    firstName: "Test",
    lastName: "User",
    role: "user",
    phone: "+234 803 000 0010",
    location: "Kano, Nigeria",
    isStaff: false,
    description: "Another test user account for general testing purposes.",
  },
];

export const getTestAccountByEmail = (
  email: string,
): TestAccount | undefined => {
  return testAccounts.find(
    (account) => account.email.toLowerCase() === email.toLowerCase(),
  );
};

export const validateUniqueKey = (key: string, department: string): boolean => {
  const account = testAccounts.find(
    (acc) => acc.department === department && acc.uniqueKey === key,
  );
  return !!account;
};

export const getDepartmentPrefix = (department: string): string => {
  const prefixMap: Record<string, string> = {
    "secretariat-admin": "SA",
    accounting: "AC",
    "human-resources": "HR",
    "project-management": "PM",
    "business-development": "BD",
    "digital-marketing": "DM",
    "business-administration": "BA",
  };
  return prefixMap[department] || "XX";
};

// Test account credentials summary for easy reference
export const testAccountSummary = {
  admin: {
    email: "admin@jdmarcng.com",
    password: "admin123",
    uniqueKey: "SA1234",
    features: "Full admin access, user management, UniqueKey generation",
  },
  departments: {
    "Secretariat & Admin": {
      email: "secretary@jdmarcng.com",
      password: "secretary123",
      uniqueKey: "SA5678",
    },
    "Accounting & Finance": {
      email: "accountant@jdmarcng.com",
      password: "accounting123",
      uniqueKey: "AC3456",
    },
    "Human Resources": {
      email: "hr@jdmarcng.com",
      password: "hr123",
      uniqueKey: "HR7890",
    },
    "Project Management": {
      email: "pm@jdmarcng.com",
      password: "project123",
      uniqueKey: "PM2468",
    },
    "Business Development": {
      email: "bd@jdmarcng.com",
      password: "business123",
      uniqueKey: "BD1357",
    },
    "Digital Marketing": {
      email: "marketing@jdmarcng.com",
      password: "marketing123",
      uniqueKey: "DM9876",
    },
    "Business Administration": {
      email: "ba@jdmarcng.com",
      password: "administration123",
      uniqueKey: "BA5432",
    },
  },
  nonStaff: {
    "Regular User": {
      email: "user@jdmarcng.com",
      password: "user123",
      note: "No UniqueKey needed - shows general dashboard",
    },
    "Test User": {
      email: "test@jdmarcng.com",
      password: "test123",
      note: "Another general user account",
    },
  },
};
