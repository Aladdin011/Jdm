# Seed Accounts Guide

## Overview

The Builder Aura Field application includes a seed account feature that provides quick and easy login access to different dashboard types. This feature is particularly useful for development, testing, and demonstration purposes, allowing users to access various dashboards without the need to create accounts manually.

## What are Seed Accounts?

Seed accounts are pre-configured test accounts with predefined credentials for each dashboard type in the system. Each seed account is associated with a specific department and has the necessary permissions to access its corresponding dashboard.

## Available Seed Accounts

The following seed accounts are available for quick access:

| Department | Email | Password | Department Code |
|------------|-------|----------|----------------|
| Admin | admin@jdmarcng.com | Admin@123 | AD8421 |
| Accounts | accounts@jdmarcng.com | Acc@123 | AC5930 |
| Accounting | accounting@jdmarcng.com | Acct@123 | AC1702 |
| Business Administration | busadmin@jdmarcng.com | BA@123 | BA4268 |
| Executive Assistant | busdev@jdmarcng.com | BD@123 | EA3127 |
| Digital Marketing | marketing@jdmarcng.com | Mkt@123 | DM7582 |
| HR | hr@jdmarcng.com | Hr@123 | HR6049 |
| Projects | projects@jdmarcng.com | Proj@123 | PR1856 |
| Secretariat | secretariat@jdmarcng.com | Sec@123 | SE9273 |
| General Users | general@jdmarcng.com | Gen@123 | GU3510 |

## How to Use Seed Accounts

### Method 1: Using the Seed Account Selector

1. Navigate to the login page of the application
2. Look for the "Test Accounts" dropdown button
3. Click on the button to open the seed account selector
4. Browse the available accounts or filter by department
5. Click the "Use" button next to the account you want to use
6. The system will automatically log you in with the selected account

### Method 2: Manual Login with Seed Account Credentials

1. Navigate to the login page of the application
2. Enter the email and password of the desired seed account (from the table above)
3. Click the "Login" button
4. If prompted for a department code, enter the corresponding 6-character code (2 letters followed by 4 digits) from the table
5. You will be logged in and redirected to the appropriate dashboard

## Dashboard Access

Each seed account provides access to a specific dashboard with features tailored to its department:

- **Admin Dashboard**: System administration and user management
- **Accounts Dashboard**: Financial management and invoicing
- **Accounting Dashboard**: Financial reporting and analysis
- **Business Administration Dashboard**: Business process management
- **Executive Assistant Dashboard**: Executive support and coordination
- **Digital Marketing Dashboard**: Campaign management and analytics
- **HR Dashboard**: Employee management and recruitment
- **Project Dashboard**: Project tracking and management
- **Secretariat Dashboard**: Administrative support and document management
- **General Dashboard**: Basic access and general information

## Security Considerations

- Seed accounts are intended for development, testing, and demonstration purposes only
- These accounts should not be used in production environments
- All seed account activities are logged for security purposes
- Seed accounts have limited permissions based on their department role

## Troubleshooting

If you encounter issues with seed accounts:

1. Ensure you're using the correct credentials from the table above
2. Check that you're entering the department code correctly when prompted
3. Clear your browser cache and cookies if you experience login issues
4. Contact the system administrator if problems persist

## Customizing Seed Accounts

Developers can customize or add new seed accounts by modifying the `SeedAccounts.ts` file in the project's data directory. Each seed account requires the following properties:

```typescript
interface SeedAccount {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "admin" | "user" | "staff";
  department: string;
  department_code: string;
  dashboard: string;
  description: string;
}
```

---

**Note**: This feature is automatically enabled in development environments and can be disabled in production by setting the appropriate environment variables.