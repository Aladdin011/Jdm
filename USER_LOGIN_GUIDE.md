# User Login Guide - JD Marc Limited

This comprehensive guide provides login credentials and instructions for all department accounts in the JD Marc Limited system.

## Login Methods

The system supports two authentication methods:
1. **Email + Password**
2. **Department Code + Password**

## Department Accounts

| Department | Email | Password | Dept Code | Dashboard |
|------------|-------|----------|-----------|-----------|
| Admin | admin@jdmarcng.com | Admin@123 | AD8421 | AdminDashboard |
| Accounts | accounts@jdmarcng.com | Acc@123 | AC5930 | AccountsDashboard |
| Accounting | accounting@jdmarcng.com | Acct@123 | AC1702 | AccountsDashboard |
| Business Administration | busadmin@jdmarcng.com | BA@123 | BA4268 | BusinessAdministrationDashboard |
| Executive Assistant | busdev@jdmarcng.com | BD@123 | EA3127 | ExecutiveAssistantDashboard |
| Digital Marketing | marketing@jdmarcng.com | Mkt@123 | DM7582 | DigitalMarketingDashboard |
| HR | hr@jdmarcng.com | Hr@123 | HR6049 | HRDashboard |
| Projects | projects@jdmarcng.com | Proj@123 | PR1856 | ProjectDashboard |
| Secretariat | secretariat@jdmarcng.com | Sec@123 | SE9273 | SecretaryDashboard |
| General Users | general@jdmarcng.com | Gen@123 | GU3510 | GeneralDashboard |

## Login Process

### Step 1: Access Login Page
Navigate to the login page and choose your preferred authentication method.

### Step 2: Enter Credentials
- **Email Method:** Enter your department email and password
- **Code Method:** Enter your 6-character department code (2 letters followed by 4 digits) and password

### Step 3: Dashboard Access
Upon successful authentication, you'll be redirected to your department-specific dashboard.

## Dashboard Features

### Merged Financial Dashboard (Accounts & Accounting)
Both Accounts and Accounting departments access the same comprehensive dashboard with:
- **Overview Tab:** Financial KPIs, revenue tracking, expense monitoring
- **Invoices Tab:** Complete invoice management with PDF generation
- **Payroll Tab:** Employee payroll processing and management
- **Budget Tab:** Budget vs actual analysis with variance tracking
- **Payments Tab:** Recurring payments and automated scheduling
- **Reports Tab:** Financial reports (P&L, cash flow, expense breakdown)
- **Team Communication:** Voice/video calls and finance chat

### Secretary Dashboard (Formerly Secretariat)
Renamed from SecretariatDashboard to SecretaryDashboard for better clarity:
- Task management and scheduling
- Document handling and filing
- Communication coordination
- Administrative oversight

### Other Department Dashboards
Each department has specialized dashboards tailored to their specific needs:
- **Admin:** System administration and user management
- **HR:** Employee management and recruitment
- **Projects:** Project tracking and management
- **Digital Marketing:** Campaign management and analytics
- **Business Administration:** Business process management
- **Executive Assistant:** Executive support and coordination
- **General Users:** Basic access and general information

## Quick Login Examples

### Admin Access
```
Email: admin@jdmarcng.com
Password: Admin@123
Alternative: Code 84217 + Admin@123
```

### Financial Department Access
```
Accounts: accounts@jdmarcng.com + Acc@123 (Code: 59304)
Accounting: accounting@jdmarcng.com + Acct@123 (Code: 17026)
Both redirect to the same comprehensive financial dashboard
```

### Secretary Access
```
Email: secretariat@jdmarcng.com
Password: Sec@123
Code: 92734
Dashboard: SecretaryDashboard (renamed from SecretariatDashboard)
```

## Technical Notes

- All passwords follow the format: [DeptAbbr]@123
- Department codes are unique 6-character identifiers (2 letters followed by 4 digits)
- The system automatically routes users to appropriate dashboards
- Session management handles authentication state
- Both Accounts and Accounting departments share the same enhanced dashboard

## Security Features

- Password-based authentication
- Department-specific access control
- Session timeout management
- Secure routing to authorized dashboards only

## Development Notes

- All accounts are pre-configured for development and testing
- Production deployment maintains the same credential structure
- Dashboard components are modular and easily maintainable
- Recent updates include dashboard merging and component renaming

---

*Last Updated: January 2024*
*JD Marc Limited - Internal Use Only*
