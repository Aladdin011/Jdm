# 🚀 Complete Render Deployment Guide for JD Marc Backend

This comprehensive guide will walk you through deploying your JD Marc Limited backend API to Render, including all implemented features: real-time email verification, contact forms, health monitoring, and security features.

## 📋 Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Setting Up Render Account](#setting-up-render-account)
3. [Preparing Your Repository](#preparing-your-repository)
4. [Creating the Web Service](#creating-the-web-service)
5. [Environment Variables Configuration](#environment-variables-configuration)
6. [Email Service Setup](#email-service-setup)
7. [Database Implementation (MongoDB)](#database-implementation-mongodb)
8. [Real-time Features Setup](#real-time-features-setup)
9. [SSL and Custom Domain](#ssl-and-custom-domain)
10. [Monitoring and Health Checks](#monitoring-and-health-checks)
11. [Troubleshooting](#troubleshooting)
12. [Post-Deployment Verification](#post-deployment-verification)
13. [Reference Links](#reference-links)

---

## 🔍 Pre-Deployment Checklist

### Current Backend Features Analysis:
✅ **Express.js Server** - Production-ready API server  
✅ **Email System** - Contact form with auto-reply functionality  
✅ **Security Features** - Helmet, CORS, rate limiting  
✅ **Health Monitoring** - Basic and detailed health checks  
✅ **TypeScript** - Type-safe development  
✅ **Input Validation** - Joi schema validation  

### Additional Features to Implement:
🟡 **Database (MongoDB)** - For data persistence  
🟡 **Real-time Communication** - WebSocket support for live calls  
🟡 **Authentication System** - JWT-based auth  
🟡 **File Upload** - For project images and documents  

---

## 🌐 Setting Up Render Account

### Step 1: Create Render Account
1. Go to [Render Platform][render-platform]
2. Sign up with GitHub (recommended for automatic deployments)
3. Verify your email address
4. Connect your GitHub account

### Step 2: Prepare Repository Access
1. Ensure your repository is public or grant Render access to private repos
2. Make sure your backend code is in a dedicated folder or separate repository

---

## 📁 Preparing Your Repository

### Step 1: Repository Structure Verification
```
jdmarc-frontend/
├── backend/                 # Backend code directory
│   ├── src/
│   │   ├── routes/
│   │   │   ├── contact.ts
│   │   │   └── health.ts
│   │   ├── middleware/
│   │   │   └── validation.ts
│   │   ├── utils/
│   │   │   └── email.ts
│   │   └── server.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── src/                    # Frontend code
└── README.md
```

### Step 2: Update package.json Scripts
Ensure your `backend/package.json` has these scripts:

```json
{
  "name": "jdmarc-backend",
  "version": "1.0.0",
  "scripts": {
    "dev": "nodemon src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "test": "jest",
    "lint": "eslint src/**/*.ts",
    "type-check": "tsc --noEmit"
  }
}
```

### Step 3: Create render.yaml (Optional but Recommended)
Create `render.yaml` in your repository root:

```yaml
services:
  - type: web
    name: jdmarc-backend-api
    env: node
    buildCommand: cd backend && npm install && npm run build
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
```

---

## 🔧 Creating the Web Service

### Step 1: Create New Web Service
1. Log into [Render Dashboard][render-dashboard]
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Select the repository containing your backend

### Step 2: Configure Service Settings
```
Service Name: jdmarc-backend-api
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install && npm run build
Start Command: npm start
```

### Step 3: Plan Selection
- **Free Tier**: Good for development/testing
- **Starter ($7/month)**: Recommended for production
- **Standard ($25/month)**: For high-traffic applications

---

## ⚙️ Environment Variables Configuration

### Step 1: Core Environment Variables
Add these in [Render Environment Settings][render-env-config]:

```bash
# Server Configuration
NODE_ENV=production
PORT=5000

# CORS Configuration - JD Marc Domains
CORS_ORIGINS=https://jdmarcng.com,https://www.jdmarcng.com

# Security Keys (Generate secure random strings)
JWT_SECRET=jdmarc-jwt-secret-key-production-2024-minimum-32-characters
SESSION_SECRET=jdmarc-session-secret-production-2024-minimum-32-characters

# Rate Limiting Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
CONTACT_RATE_LIMIT_MAX=5

# Application Logging
LOG_LEVEL=info
```

### Step 2: Email Configuration Variables
```bash
# Email Service Configuration
EMAIL_SERVICE_ENABLED=true

# Gmail Configuration (Business Email)
EMAIL_SERVICE=gmail
EMAIL_USER=support@jdmarcng.com
EMAIL_PASSWORD=jdmarc-gmail-app-password-2024
COMPANY_EMAIL=info@jdmarcng.com

# SMTP Alternative Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_FROM=support@jdmarcng.com
```

---

## 📧 Email Service Setup

### Step 1: Gmail Business Account Setup
1. **Create Business Gmail Account**: `support@jdmarcng.com`
2. **Enable 2-Factor Authentication** on Gmail account
3. **Generate App Password**:
   - Go to [Google Account Security Settings][google-security]
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
   - Use this password in `EMAIL_PASSWORD`

### Step 2: Alternative Email Providers

#### For SendGrid Integration:
```bash
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=jdmarc-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@jdmarcng.com
```

#### For Mailgun Integration:
```bash
EMAIL_SERVICE=mailgun
MAILGUN_API_KEY=jdmarc-mailgun-api-key
MAILGUN_DOMAIN=mail.jdmarcng.com
```

### Step 3: Test Email Configuration
After deployment, test email functionality:
```bash
curl -X POST https://jdmarc-backend-api.onrender.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "JD Marc Test User",
    "email": "test@jdmarcng.com",
    "subject": "Backend Email Test",
    "message": "Testing email functionality for JD Marc Limited backend"
  }'
```

---

## 🗄️ Database Implementation (MongoDB)

### Step 1: Add MongoDB Dependencies
Update `backend/package.json`:
```json
{
  "dependencies": {
    "mongoose": "^8.0.3",
    "mongodb": "^6.0.0",
    "@types/mongoose": "^5.11.97"
  }
}
```

### Step 2: Create Database Connection Module
Create `backend/src/config/database.ts`:
```typescript
import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    const connectionString = process.env.MONGODB_URI;
    
    if (!connectionString) {
      throw new Error('MONGODB_URI environment variable not provided');
    }

    await mongoose.connect(connectionString, {
      dbName: process.env.DATABASE_NAME || 'jdmarc_production'
    });
    
    console.log('✅ MongoDB Atlas connected successfully');
    console.log('📊 Database:', mongoose.connection.db.databaseName);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('📡 MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB error:', error);
});
```

### Step 3: MongoDB Atlas Configuration
1. **Create MongoDB Atlas Account**: [MongoDB Atlas Platform][mongodb-atlas]
2. **Create Production Cluster**:
   - Choose AWS/Google Cloud
   - Select region closest to Render servers
   - Choose M0 (Free) or M2 (Shared) tier
3. **Create Database User**:
   - Security → Database Access
   - Username: `jdmarc_backend`
   - Password: Generate secure password
4. **Network Access Configuration**:
   - Security → Network Access
   - Add IP Address: `0.0.0.0/0` (allow from anywhere for Render)
5. **Get Connection String**:
   - Clusters → Connect → Connect your application
   - Copy MongoDB URI

### Step 4: Database Environment Variables
```bash
# MongoDB Atlas Configuration
MONGODB_URI=mongodb+srv://jdmarc_backend:SECURE_PASSWORD@jdmarc-cluster.abc123.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=jdmarc_production

# Database Collections
PROJECTS_COLLECTION=projects
CONTACTS_COLLECTION=contact_submissions
USERS_COLLECTION=users
```

### Step 5: Update Server with Database Connection
Update `backend/src/server.ts`:
```typescript
import { connectDatabase } from './config/database';

// Database connection and server startup
const startServer = async () => {
  try {
    // Connect to MongoDB Atlas
    await connectDatabase();
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 JD Marc API Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🌐 API URL: https://jdmarc-backend-api.onrender.com`);
      console.log(`📧 Email Service: ${process.env.EMAIL_SERVICE_ENABLED === 'true' ? 'Enabled' : 'Disabled'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🔄 Received SIGTERM, shutting down gracefully');
  await mongoose.connection.close();
  process.exit(0);
});

startServer();
```

---

## 🔄 Real-time Features Setup

### Step 1: Add WebSocket Dependencies
Update `backend/package.json`:
```json
{
  "dependencies": {
    "socket.io": "^4.7.4",
    "@types/socket.io": "^3.0.2"
  }
}
```

### Step 2: Create Socket.IO Configuration
Create `backend/src/config/socket.ts`:
```typescript
import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

export const setupSocketIO = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://jdmarcng.com', 'https://www.jdmarcng.com']
        : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'],
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // Connection handling
  io.on('connection', (socket) => {
    console.log('🔌 Client connected:', socket.id);

    // Live call functionality
    socket.on('join-call', (data: { callId: string; userName: string }) => {
      socket.join(data.callId);
      socket.broadcast.to(data.callId).emit('user-joined', {
        userId: socket.id,
        userName: data.userName
      });
      console.log(`📞 User ${data.userName} joined call ${data.callId}`);
    });

    // Call signaling for WebRTC
    socket.on('call-signal', (data: { callId: string; signal: any; to: string }) => {
      socket.to(data.to).emit('call-signal', {
        signal: data.signal,
        from: socket.id
      });
    });

    // Real-time project updates
    socket.on('project-update', (data: { projectId: string; update: any }) => {
      socket.broadcast.emit('project-updated', data);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('🔌 Client disconnected:', socket.id);
    });
  });

  return io;
};
```

### Step 3: Update Server for Real-time Support
Update `backend/src/server.ts`:
```typescript
import http from 'http';
import { setupSocketIO } from './config/socket';

// Create HTTP server instance
const server = http.createServer(app);

// Setup Socket.IO for real-time features
const io = setupSocketIO(server);

// Make io available globally for route handlers
app.set('io', io);

// Start server with Socket.IO
const startServer = async () => {
  try {
    await connectDatabase();
    
    server.listen(PORT, () => {
      console.log(`🚀 JD Marc API Server running on port ${PORT}`);
      console.log(`🔄 Socket.IO enabled for real-time features`);
      console.log(`📡 WebSocket endpoint: wss://jdmarc-backend-api.onrender.com`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};
```

---

## 🔒 SSL and Custom Domain

### Step 1: Custom Domain Configuration
1. **In Render Dashboard**:
   - Navigate to your service settings
   - Click "Custom Domains" tab
   - Add custom domain: `api.jdmarcng.com`

2. **DNS Configuration**:
   - Add CNAME record in your domain provider:
   - `api.jdmarcng.com` → `jdmarc-backend-api.onrender.com`
   - TTL: 300 seconds (5 minutes)

### Step 2: SSL Certificate Management
- Render automatically provisions SSL certificates
- Certificates are auto-renewed before expiration
- Force HTTPS redirects are enabled by default
- Verify SSL status in [Render SSL Dashboard][render-ssl-dashboard]

---

## 📊 Monitoring and Health Checks

### Step 1: Configure Health Check Endpoints
Your backend includes comprehensive health monitoring:
- `GET /api/health` - Basic system health
- `GET /api/health/detailed` - Detailed system metrics

### Step 2: Render Health Check Configuration
Configure in [Render Health Settings][render-health-config]:
```yaml
healthCheckPath: /api/health
healthCheckInterval: 30s
healthCheckTimeout: 10s
```

### Step 3: External Monitoring Setup
Recommended monitoring services:
- **UptimeRobot**: [Free uptime monitoring][uptimerobot-setup]
- **Better Uptime**: [Advanced monitoring][betteruptime-setup]
- **Pingdom**: [Enterprise monitoring][pingdom-setup]

Monitor these endpoints:
- `https://api.jdmarcng.com/api/health`
- `https://api.jdmarcng.com/`

---

## 🚨 Troubleshooting

### Common Issues and Solutions

#### 1. Build Failures
```bash
# TypeScript compilation errors
Error: Cannot find module '@types/node'
Solution: Move @types packages to dependencies instead of devDependencies

# Missing environment variables
Error: JWT_SECRET is not defined
Solution: Verify all environment variables are set in Render dashboard
```

#### 2. Email Service Issues
```bash
# Gmail authentication failed
Error: Invalid login credentials
Solution: 
- Verify 2FA is enabled on Gmail account
- Generate new app password
- Use app password, not regular password

# SMTP connection timeout
Error: Connection timeout
Solution: Check SMTP settings and firewall rules
```

#### 3. Database Connection Problems
```bash
# MongoDB Atlas connection failed
Error: MongoNetworkError
Solution:
- Verify MongoDB URI format
- Check IP whitelist includes 0.0.0.0/0
- Ensure database user has correct permissions

# Database authentication failed
Error: Authentication failed
Solution: Verify username and password in MongoDB URI
```

#### 4. CORS Configuration Issues
```bash
# CORS policy errors
Error: Access blocked by CORS policy
Solution: Update CORS_ORIGINS environment variable:
CORS_ORIGINS=https://jdmarcng.com,https://www.jdmarcng.com,https://your-additional-domain.com
```

### Debug Mode Configuration
Enable detailed logging:
```bash
LOG_LEVEL=debug
DEBUG=express:*,socket.io:*
NODE_DEBUG=request
```

---

## ✅ Post-Deployment Verification

### Step 1: API Health Verification
```bash
# Basic health check
curl https://api.jdmarcng.com/api/health

# Expected response:
{
  "status": "OK",
  "timestamp": "2024-01-XX...",
  "uptime": 123.45,
  "memory": { "used": 45.67, "total": 89.12 },
  "environment": "production",
  "version": "1.0.0"
}

# Detailed health check
curl https://api.jdmarcng.com/api/health/detailed
```

### Step 2: API Endpoints Testing
```bash
# Test contact form submission
curl -X POST https://api.jdmarcng.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "JD Marc Test",
    "email": "test@jdmarcng.com",
    "phone": "+234 9 291 3991",
    "subject": "API Testing",
    "message": "Testing contact form functionality",
    "projectType": "Infrastructure",
    "budget": "₦5M - ₦10M"
  }'

# Expected response:
{
  "success": true,
  "message": "Thank you for your inquiry! We will get back to you soon.",
  "timestamp": "2024-01-XX..."
}

# Test contact information endpoint
curl https://api.jdmarcng.com/api/contact/info

# Expected response: Company contact details
```

### Step 3: Load Testing
```bash
# Apache Bench load test
ab -n 100 -c 10 https://api.jdmarcng.com/api/health

# Artillery load testing (install: npm install -g artillery)
echo 'config:
  target: https://api.jdmarcng.com
  phases:
    - duration: 60
      arrivalRate: 5
scenarios:
  - name: "Health Check"
    requests:
      - get:
          url: "/api/health"' > artillery-test.yml

artillery run artillery-test.yml
```

### Step 4: Frontend Integration
Update your frontend environment variables:
```bash
# Production environment variables
VITE_API_URL=https://api.jdmarcng.com
VITE_SOCKET_URL=https://api.jdmarcng.com
VITE_ENVIRONMENT=production

# Development environment variables
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
VITE_ENVIRONMENT=development
```

---

## 🔧 Advanced Configuration

### Auto-Deploy Configuration
1. **GitHub Integration**: 
   - Automatic deploys on push to `main` branch
   - Configure in [Render Auto-Deploy Settings][render-autodeploy]
2. **Preview Deployments**: 
   - Automatic preview environments for pull requests
3. **Rollback Capability**: 
   - One-click rollback to previous deployments

### Scaling Configuration
```yaml
# render.yaml advanced configuration
services:
  - type: web
    name: jdmarc-backend-api
    env: node
    plan: standard
    numInstances: 2
    buildCommand: cd backend && npm ci && npm run build
    startCommand: cd backend && npm start
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
```

### Performance Monitoring
```typescript
// Add to backend/src/server.ts
import { collectDefaultMetrics, register } from 'prom-client';

// Prometheus metrics collection
collectDefaultMetrics();

// Metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(register.metrics());
});
```

---

## 📞 Support and Resources

### JD Marc Limited Support
- **Email**: [info@jdmarcng.com][company-email]
- **Phone**: [+234 9 291 3991][company-phone]
- **Technical Issues**: [Create GitHub Issue][github-issues]

### External Resources
- **Render Documentation**: [Reference Guide][render-docs]
- **MongoDB Atlas Support**: [Atlas Documentation][mongodb-docs]
- **Node.js Best Practices**: [Production Guidelines][nodejs-production]

### Emergency Procedures
1. **Service Down**: Check [Render Status Page][render-status]
2. **Database Issues**: Monitor [MongoDB Atlas Status][mongodb-status]
3. **Email Problems**: Verify [Google Workspace Status][google-status]

---

## 🎯 Next Steps After Deployment

### Immediate Actions (Week 1)
1. **Setup monitoring alerts** for uptime and performance
2. **Configure backup strategies** for database
3. **Implement comprehensive logging** with structured format
4. **Set up staging environment** for testing

### Short-term Goals (Month 1)
1. **API documentation** with Swagger/OpenAPI
2. **CI/CD pipeline** automation
3. **Performance optimization** and caching
4. **Security audit** and penetration testing

### Long-term Objectives (Quarter 1)
1. **API versioning** strategy implementation
2. **Microservices architecture** evaluation
3. **Advanced monitoring** with custom metrics
4. **Disaster recovery** procedures

---

## 📚 Reference Links

For all external links and references used in this guide, see: [Deployment Reference Links](./DEPLOYMENT_REFERENCE_LINKS.md)

---

**🚀 Your JD Marc Limited backend API is now successfully deployed on Render with all features configured and production-ready!**

For any issues or questions, refer to the [troubleshooting section](#troubleshooting) or contact the [JD Marc technical team][company-email].

[render-platform]: #render-platform
[render-dashboard]: #render-dashboard
[render-env-config]: #render-environment-configuration
[google-security]: #google-account-security
[mongodb-atlas]: #mongodb-atlas-platform
[render-ssl-dashboard]: #render-ssl-dashboard
[render-health-config]: #render-health-configuration
[uptimerobot-setup]: #uptimerobot-monitoring-setup
[betteruptime-setup]: #betteruptime-monitoring-setup
[pingdom-setup]: #pingdom-monitoring-setup
[render-autodeploy]: #render-auto-deploy-settings
[company-email]: #jdmarc-company-email
[company-phone]: #jdmarc-company-phone
[github-issues]: #jdmarc-github-issues
[render-docs]: #render-documentation
[mongodb-docs]: #mongodb-atlas-documentation
[nodejs-production]: #nodejs-production-guidelines
[render-status]: #render-status-page
[mongodb-status]: #mongodb-atlas-status
[google-status]: #google-workspace-status
