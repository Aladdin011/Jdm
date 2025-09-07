# MySQL Authentication Setup Guide

This guide provides a complete MySQL users table setup with Node.js authentication.

## 📁 Files Created

1. **`sql/create_users_table.sql`** - SQL script to create users table
2. **`src/config/database.js`** - Database connection and initialization
3. **`src/routes/auth.js`** - Authentication routes (register/login)
4. **`src/server.js`** - Main server file with auto-initialization
5. **`test-auth.js`** - Test script to verify everything works

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Update your `.env` file with your MySQL credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database_name
JWT_SECRET=your-secret-key-change-this-in-production
PORT=3001
```

### 3. Start the Server
```bash
npm run dev
# or
node src/server.js
```

The server will automatically:
- ✅ Test database connection
- ✅ Create the `users` table if it doesn't exist
- ✅ Start listening on port 3001

### 4. Test the Authentication
```bash
# In a new terminal
node test-auth.js
```

## 📋 API Endpoints

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "role": "user"  // optional, defaults to "user"
}
```

### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Get User Info (Protected)
```bash
GET /api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🗄️ Database Schema

The `users` table includes:
- `id` - Primary key (auto increment)
- `email` - Unique email address
- `password` - Hashed password (bcrypt)
- `role` - User role (default: "user")
- `created_at` - Timestamp when user was created
- `updated_at` - Timestamp when user was last updated

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT token authentication
- ✅ Input validation (email format, password length)
- ✅ Duplicate email prevention
- ✅ SQL injection protection (parameterized queries)
- ✅ Proper error handling and logging

## 🧪 Testing

The test script (`test-auth.js`) verifies:
1. Health endpoint works
2. User registration works
3. User login works
4. Protected endpoints work with JWT
5. Duplicate registration is rejected
6. Wrong password is rejected

## 🔧 Troubleshooting

### Database Connection Issues
- Check your `.env` file has correct MySQL credentials
- Ensure MySQL server is running
- Verify database exists (or create it first)

### Authentication Failures
- Check server logs for detailed error messages
- Verify JWT_SECRET is set in environment
- Ensure bcrypt dependency is installed

### Table Creation Issues
- Check MySQL user has CREATE TABLE permissions
- Verify the SQL file path is correct
- Check server logs for SQL execution errors

## 📝 Example Usage

```javascript
// Register a new user
const registerResponse = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword123'
  })
});

// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'securepassword123'
  })
});

const { token } = await loginResponse.json();

// Use token for protected requests
const userResponse = await fetch('/api/auth/me', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## 🎯 Next Steps

1. Add password reset functionality
2. Implement email verification
3. Add user profile management
4. Set up role-based permissions
5. Add rate limiting for auth endpoints
