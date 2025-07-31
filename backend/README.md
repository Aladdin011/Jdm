# JD Marc Limited Backend API

A comprehensive Node.js backend API for the JD Marc Limited construction company platform, featuring authentication, project management, lead scoring, analytics, and real-time features.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with email OTP verification
- **User Management**: Role-based access control (RBAC)
- **Project Management**: Complete CRUD operations for construction projects
- **Contact Forms**: Lead capture with automated scoring and notifications
- **Analytics**: User behavior tracking and business intelligence
- **Real-time Updates**: WebSocket integration for live notifications
- **Email Services**: Automated email notifications with templates
- **File Uploads**: Support for project images and documents
- **Security**: Rate limiting, input validation, and security headers
- **Lead Scoring**: AI-powered lead qualification and prioritization

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL 13+
- Redis (optional, for caching)
- Email service (Gmail, SendGrid, etc.)

## 🛠️ Installation & Setup

### 1. Clone and Install Dependencies

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Install Prisma CLI globally (optional)
npm install -g prisma
```

### 2. Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your configuration
nano .env
```

### 3. Database Setup

```bash
# Start PostgreSQL service
sudo service postgresql start

# Create database
createdb jdmarc_db

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# (Optional) Seed database with sample data
npm run seed
```

### 4. Email Configuration

Choose one of the following email providers:

#### Gmail Setup
```bash
# In .env file
EMAIL_PROVIDER=gmail
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=your_app_password
```

#### SendGrid Setup
```bash
# In .env file
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your_sendgrid_api_key
```

#### SMTP Setup
```bash
# In .env file
EMAIL_PROVIDER=smtp
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your_username
SMTP_PASSWORD=your_password
```

### 5. Generate JWT Secrets

```bash
# Generate strong JWT secrets
openssl rand -hex 64

# Add to .env file
JWT_SECRET=your_generated_secret_here
JWT_REFRESH_SECRET=your_generated_refresh_secret_here
```

## 🚀 Running the Application

### Development Mode

```bash
# Start development server with hot reload
npm run dev

# The server will start on http://localhost:5000
```

### Production Mode

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Database Management

```bash
# View database in Prisma Studio
npm run prisma:studio

# Reset database (⚠️ This will delete all data)
npm run prisma:reset

# Deploy migrations (production)
npm run prisma:deploy
```

## 📧 Email Templates

The system includes pre-built email templates for:

- **Email Verification**: User registration confirmation
- **Password Reset**: Secure password reset with OTP
- **Contact Confirmation**: Automatic reply to contact form submissions
- **Project Updates**: Client notifications for project progress

### Custom Email Templates

Email templates are defined in `src/utils/email.ts`. To add a new template:

```typescript
'your-template-name': {
  subject: 'Your Email Subject',
  html: (data: any) => `
    <h1>Hello ${data.name}</h1>
    <p>Your custom content here</p>
  `,
  text: (data: any) => `Hello ${data.name}\nYour custom content here`
}
```

## 🔐 Authentication Flow

### Registration Process

1. User submits registration form
2. System validates input and creates user
3. OTP sent to user's email
4. User verifies email with OTP
5. Account activated and JWT tokens issued

### Login Process

1. User submits credentials
2. System validates email/password
3. Check if email is verified
4. Create user session
5. Return JWT access and refresh tokens

### Password Reset

1. User requests password reset
2. OTP sent to registered email
3. User submits OTP and new password
4. Password updated and all sessions invalidated

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - Email verification
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with OTP
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Contact Forms
- `POST /api/contact/submit` - Submit contact form
- `GET /api/contact` - List contact forms (admin)
- `GET /api/contact/:id` - Get contact form details
- `PATCH /api/contact/:id` - Update contact form (admin)
- `GET /api/contact/stats/overview` - Contact form statistics

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/upload-avatar` - Upload profile avatar

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Analytics
- `GET /api/analytics/overview` - Analytics dashboard data
- `GET /api/analytics/user/:id` - User journey analytics
- `POST /api/analytics/track` - Track custom events

## 🔧 Configuration Options

### Security Settings

```bash
# Rate limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100  # Max requests per window

# JWT expiration
JWT_EXPIRES_IN=1d           # Access token expiry
JWT_REFRESH_EXPIRES_IN=7d   # Refresh token expiry

# Password policy
MIN_PASSWORD_LENGTH=8
REQUIRE_UPPERCASE=true
REQUIRE_LOWERCASE=true
REQUIRE_NUMBERS=true
REQUIRE_SYMBOLS=true
```

### File Upload Settings

```bash
# Local storage
STORAGE_PROVIDER=local
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760     # 10MB
ALLOWED_FILE_TYPES=jpg,jpeg,png,gif,pdf,doc,docx

# AWS S3 (optional)
STORAGE_PROVIDER=aws-s3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=your_bucket_name
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📝 Logging

The application uses Winston for comprehensive logging:

- **Error logs**: `logs/error.log`
- **Combined logs**: `logs/combined.log`
- **Debug logs**: `logs/debug.log`

Log levels: `error`, `warn`, `info`, `debug`

```bash
# View real-time logs
tail -f logs/combined.log

# View error logs
tail -f logs/error.log
```

## 🚀 Deployment

### Using PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Create ecosystem file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'jdmarc-backend',
    script: 'dist/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
}
EOF

# Build and start
npm run build
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save
pm2 startup
```

### Using Docker

```bash
# Create Dockerfile
cat > Dockerfile << EOF
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
EOF

# Build and run
docker build -t jdmarc-backend .
docker run -p 5000:5000 --env-file .env jdmarc-backend
```

### Using Docker Compose

```bash
# Create docker-compose.yml
cat > docker-compose.yml << EOF
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: jdmarc_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
EOF

# Start services
docker-compose up -d
```

## 🔍 Monitoring & Health Checks

### Health Check Endpoint

```bash
# Check application health
curl http://localhost:5000/health

# Response
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "version": "1.0.0"
}
```

### Database Health Check

```bash
# Check database connectivity
curl http://localhost:5000/api/admin/health/database
```

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check PostgreSQL status
sudo service postgresql status

# Restart PostgreSQL
sudo service postgresql restart

# Check database exists
psql -l | grep jdmarc
```

#### Email Not Sending
```bash
# Check email configuration
node -e "require('./dist/utils/email').verifyEmailConfig()"

# Test with Ethereal (development)
EMAIL_PROVIDER=ethereal npm run dev
```

#### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

#### Memory Issues
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm start
```

## 🔒 Security Considerations

### Production Security Checklist

- [ ] Use strong JWT secrets (minimum 64 characters)
- [ ] Enable HTTPS with valid SSL certificates
- [ ] Set up proper CORS origins
- [ ] Configure rate limiting appropriately
- [ ] Use environment variables for all secrets
- [ ] Set up proper database user permissions
- [ ] Enable database SSL connections
- [ ] Configure proper firewall rules
- [ ] Set up monitoring and alerts
- [ ] Regular security updates
- [ ] Backup strategy in place

### Security Headers

The application automatically sets security headers:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`
- `Content-Security-Policy: ...`

## 📚 API Documentation

### Authentication Required

Most endpoints require a Bearer token in the Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:5000/api/users/profile
```

### Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  },
  "pagination": {
    // Pagination info for list endpoints
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### Error Responses

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    // Additional error details
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm test`
5. Check linting: `npm run lint`
6. Submit a pull request

## 📄 License

This project is proprietary software owned by JD Marc Limited.

## 📞 Support

For technical support or questions:

- **Email**: tech@jdmarc.com
- **Documentation**: [Internal Wiki]
- **Issues**: [GitHub Issues]

---

**Built with ❤️ by the JD Marc Development Team**
