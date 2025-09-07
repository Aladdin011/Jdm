# Department Login System - JD Marc Limited

## Overview
The department login system allows each department to have its own default account with both email and 5-digit department code login options. Users are automatically redirected to their department-specific dashboard.

## Department Accounts

| Department | Email | Password | Dept Code | Dashboard Component |
|------------|-------|----------|-----------|-------------------|
| Admin | admin@jdmarcng.com | Admin@123 | 84217 | AdminDashboard.tsx |
| Accounts | accounts@jdmarcng.com | Acc@123 | 59304 | AccountsDashboard.tsx |
| Accounting | accounting@jdmarcng.com | Acct@123 | 17026 | AccountingDashboard.tsx |
| Business Administration | busadmin@jdmarcng.com | BA@123 | 42689 | BusinessAdministrationDashboard.tsx |
| Business Development | busdev@jdmarcng.com | BD@123 | 31275 | BusinessDevelopmentDashboard.tsx |
| Digital Marketing | marketing@jdmarcng.com | Mkt@123 | 75820 | DigitalMarketingDashboard.tsx |
| HR | hr@jdmarcng.com | Hr@123 | 60491 | HRDashboard.tsx |
| Projects | projects@jdmarcng.com | Proj@123 | 18562 | ProjectDashboard.tsx |
| Secretariat | secretariat@jdmarcng.com | Sec@123 | 92734 | SecretariatDashboard.tsx |
| General Users | general@jdmarcng.com | Gen@123 | 35108 | GeneralDashboard.tsx |

## Login Methods

### Method 1: Email Login
- Use the department email address
- Enter the corresponding password
- System authenticates and redirects to department dashboard

### Method 2: Department Code Login
- Use the 5-digit department code instead of email
- Enter the corresponding password
- System authenticates and redirects to department dashboard

## Technical Implementation

### Database Schema
```sql
-- Users table includes department fields
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    department VARCHAR(100),
    department_code CHAR(5) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Backend Authentication
- Login endpoint accepts both `email` and `identifier` fields
- SQL query: `SELECT * FROM users WHERE email = ? OR department_code = ?`
- Response includes `dashboard` field for frontend routing
- Passwords are bcrypt-hashed with salt rounds 10

### Frontend Routing
- `DashboardRouter` component handles department-based routing
- User object includes `department` field from login response
- Automatic redirection to appropriate dashboard component

## Components

### Core Components
- `DashboardRouter.tsx` - Routes users to correct dashboard based on department
- `DepartmentLoginForm.tsx` - Modern login form with email/code toggle
- Individual dashboard components for each department

### Authentication Flow
1. User enters email/code and password
2. Backend validates credentials against database
3. Response includes user data with department information
4. Frontend stores user data and routes to appropriate dashboard
5. `DashboardRouter` renders correct dashboard component

## Security Features
- Bcrypt password hashing
- JWT token authentication
- Department-specific access control
- Unique department codes for quick access
- Session management with token expiration

## Usage Examples

### Quick Login with Department Code
```
Department Code: 84217
Password: Admin@123
Result: Redirected to Admin Dashboard
```

### Email Login
```
Email: accounting@jdmarcng.com
Password: Acct@123
Result: Redirected to Accounting Dashboard
```

## Development Notes
- All department accounts are pre-seeded in the database
- Passwords are securely hashed before storage
- Department codes are unique and indexed for fast lookup
- Dashboard components use `useDashboardActions` hook for consistency
- Real-time UI updates and error handling implemented across all dashboards

## Deployment
- Database schema automatically created on server startup
- Seed data automatically inserted with `INSERT IGNORE`
- Production-ready with proper error handling and logging
- Compatible with Render deployment platform
