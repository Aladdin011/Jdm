# 🚀 Render Deployment Guide

## Backend Deployment Configuration

### Required Environment Variables in Render

Set these environment variables in your Render service dashboard:

```bash
# Database Configuration (Required)
DB_HOST=your-mysql-host.com
DB_USER=your-mysql-username
DB_PASSWORD=your-mysql-password
DB_NAME=your-database-name
DB_PORT=3306

# JWT Configuration (Required)
JWT_SECRET=your-super-secure-jwt-secret-key-here

# Environment (Required)
NODE_ENV=production

# Frontend URL (Optional - for CORS)
FRONTEND_URL=https://your-frontend-domain.com
```

### Build & Start Commands

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
node src/server.js
```

### Port Configuration
- The server automatically uses `process.env.PORT || 5000`
- Render will provide the PORT environment variable automatically

## Frontend Configuration

### Update Your Frontend URL

1. **Replace the placeholder URL** in your `.env` file:
   ```bash
   # Change this:
   VITE_API_URL=https://your-app-name.onrender.com/api
   
   # To your actual Render service URL:
   VITE_API_URL=https://my-actual-app.onrender.com/api
   ```

2. **Update CORS configuration** in `backend/src/server.js`:
   ```javascript
   // Add your actual frontend domain to the CORS origins array
   origin: process.env.NODE_ENV === 'production' 
     ? [process.env.FRONTEND_URL, 'https://your-actual-frontend-domain.com']
     : ['http://localhost:3000', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://127.0.0.1:8080']
   ```

## Database Setup

### MySQL Database Requirements

Your MySQL database should have these credentials ready:
- **Host**: Usually provided by your MySQL hosting service
- **Port**: Usually 3306 (default)
- **Username**: Your database username
- **Password**: Your database password
- **Database Name**: The name of your database

### Auto-Table Creation

The backend automatically creates the `users` table on startup using the SQL script in `backend/sql/create_users_table.sql`. No manual database setup required!

## Deployment Steps

### 1. Deploy Backend to Render

1. Connect your GitHub repository to Render
2. Create a new **Web Service**
3. Set the **Root Directory** to `backend`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `node src/server.js`
6. Add all the environment variables listed above
7. Deploy!

### 2. Update Frontend Configuration

1. Get your Render backend URL (e.g., `https://my-app.onrender.com`)
2. Update your `.env` file:
   ```bash
   VITE_API_URL=https://my-app.onrender.com/api
   ```
3. Update the CORS configuration with your frontend domain

### 3. Deploy Frontend

Deploy your frontend to your preferred platform (Netlify, Vercel, etc.) with the updated environment variables.

## Testing Your Deployment

### Health Check

Visit your backend health endpoint:
```
https://your-app.onrender.com/health
```

You should see:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### API Endpoints

Your backend provides these endpoints:
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info (requires token)
- `GET /health` - Health check

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check all DB environment variables are set correctly
   - Verify your MySQL host allows connections from Render's IP ranges
   - Ensure your database credentials are correct

2. **CORS Errors**
   - Add your frontend domain to the CORS origins array
   - Set the `FRONTEND_URL` environment variable

3. **Port Issues**
   - Don't hardcode ports - use `process.env.PORT || 5000`
   - Render automatically assigns a port

4. **SSL/TLS Issues**
   - The backend is configured to handle SSL in production
   - Use HTTPS URLs for all production API calls

### Logs

Check your Render service logs for detailed error messages:
1. Go to your Render dashboard
2. Select your service
3. Click on "Logs" tab

## Security Notes

- Never commit sensitive environment variables to Git
- Use strong, unique passwords for your database
- Generate a secure JWT secret (at least 32 characters)
- Enable SSL/TLS for your database connection in production

## Production Checklist

- [ ] All environment variables set in Render
- [ ] Database credentials verified
- [ ] Frontend URL updated in `.env`
- [ ] CORS configuration updated
- [ ] Health check endpoint working
- [ ] Authentication endpoints tested
- [ ] SSL/HTTPS enabled
- [ ] Logs monitored for errors

Your application is now production-ready and deployed on Render! 🎉
