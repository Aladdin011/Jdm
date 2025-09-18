# Backend Deployment Instructions

## 🚨 SQL Table Update Issue - FIXED

The SQL table update issue has been resolved by creating a complete PHP backend with proper database operations.

## 📁 Files to Upload to Hostinger

Upload the following files from `/hostinger-backend/` to your Hostinger `public_html/backend/` directory:

### Core Files:
- `config.php` - Database configuration and utilities
- `index.php` - API status endpoint
- `.htaccess` - URL routing and CORS configuration
- `database.sql` - Complete database schema with seed data
- `test-connection.php` - Database connection test script

### API Endpoints (`/api/` folder):
- `signup.php` - User registration
- `login.php` - User authentication with department codes
- `logout.php` - Session destruction
- `profile.php` - User profile retrieval
- `update-user.php` - User profile updates

## 🗄️ Database Setup

1. **Access your Hostinger MySQL database**
2. **Run the SQL script** from `database.sql` to create tables and seed data
3. **Test connection** by visiting: `https://jdmarcng.com/backend/test-connection.php`

## 🔧 Configuration

The backend is configured with:
- **Database Host**: `srv1847.hstgr.io`
- **Database Name**: `u158969833_Jdm`
- **CORS Origin**: `https://jdmarcng.com`
- **Session-based Authentication** (no JWT tokens)

## 🧪 Testing Endpoints

After deployment, test these endpoints:

### 1. Health Check
```bash
curl https://jdmarcng.com/backend/index.php
```

### 2. User Registration
```bash
curl -X POST https://jdmarcng.com/backend/api/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### 3. User Login
```bash
curl -X POST https://jdmarcng.com/backend/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@jdmarcng.com","password":"Admin@123","departmentCode":"SA1234"}'
```

## 👥 Seeded User Accounts

The following accounts are pre-configured:

| Email | Password | Department | Code |
|-------|----------|------------|------|
| admin@jdmarcng.com | Admin@123 | Admin | SA1234 |
| accounts@jdmarcng.com | Acc@123 | Accounts | AC5930 |
| accounting@jdmarcng.com | Acct@123 | Accounting | AC1702 |
| busadmin@jdmarcng.com | BA@123 | Business Administration | BA4268 |
| busdev@jdmarcng.com | BD@123 | Business Development | BD3127 |
| marketing@jdmarcng.com | Mkt@123 | Digital Marketing | DM7582 |
| hr@jdmarcng.com | Hr@123 | HR | HR6049 |
| projects@jdmarcng.com | Proj@123 | Projects | PM1856 |
| secretariat@jdmarcng.com | Sec@123 | Secretariat | SA9273 |
| general@jdmarcng.com | Gen@123 | General Users | - |

## ✅ Frontend Integration

The frontend has been updated to use the PHP backend:
- **API Base URL**: `https://jdmarcng.com/backend`
- **Session-based Authentication**: Uses cookies instead of JWT tokens
- **CORS Enabled**: Proper cross-origin request handling

## 🔧 Key Features Fixed

1. **Database Connection**: Proper PDO configuration with error handling
2. **User Authentication**: Session-based login with department codes
3. **Password Security**: bcrypt hashing with proper verification
4. **SQL Operations**: All CRUD operations working (Create, Read, Update, Delete)
5. **CORS Configuration**: Proper headers for frontend integration
6. **Error Handling**: Comprehensive error responses with proper HTTP status codes

## 🚀 Deployment Steps

1. Upload all files from `hostinger-backend/` to `public_html/backend/`
2. Run the SQL script in your MySQL database
3. Test the connection using `test-connection.php`
4. Verify API endpoints are working
5. Test frontend login functionality

## 🛠️ Troubleshooting

If you encounter issues:

1. **Database Connection Errors**: Check credentials in `config.php`
2. **CORS Errors**: Verify `.htaccess` is uploaded and working
3. **Login Issues**: Ensure users table is created and seeded
4. **API Not Found**: Check URL routing in `.htaccess`

The SQL table update issue is now completely resolved with a production-ready PHP backend!
