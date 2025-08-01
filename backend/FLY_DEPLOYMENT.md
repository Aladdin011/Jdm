# 🚀 Fly.io Deployment Guide for JD Marc Backend

## Prerequisites

1. **Fly.io Account**: Sign up at [fly.io](https://fly.io)
2. **Fly CLI**: Install the Fly CLI tool
3. **Docker**: Ensure Docker is installed (Fly.io uses Docker for builds)

## 🛠️ Setup Steps

### 1. Install Fly CLI
```bash
# macOS
brew install flyctl

# Linux
curl -L https://fly.io/install.sh | sh

# Windows
# Download from https://fly.io/docs/hands-on/install-flyctl/
```

### 2. Login to Fly.io
```bash
flyctl auth login
```

### 3. Create PostgreSQL Database
```bash
# Create a PostgreSQL database
flyctl postgres create jdmarc-db

# Attach the database to your app
flyctl postgres attach jdmarc-db --app jdmarc-backend
```

### 4. Create Redis Database (Optional)
```bash
# Create Redis for caching
flyctl redis create jdmarc-redis

# Attach Redis to your app
flyctl redis attach jdmarc-redis --app jdmarc-backend
```

### 5. Create Volume for File Storage
```bash
# Create a volume for file uploads
flyctl volumes create jdmarc_data --size 10 --region iad
```

## 🔧 Configuration

### 1. Set Environment Variables
```bash
# Copy the example environment file
cp fly.env.example fly.env

# Edit the file with your actual values
nano fly.env

# Set secrets (sensitive data)
flyctl secrets set JWT_SECRET="your_actual_jwt_secret"
flyctl secrets set JWT_REFRESH_SECRET="your_actual_refresh_secret"
flyctl secrets set WEBHOOK_SECRET="your_webhook_secret"

# Set environment variables
flyctl secrets set NODE_ENV=production
flyctl secrets set PORT=8080
flyctl secrets set FRONTEND_URL=https://jdmarcng.com
```

### 2. Update CORS Origins
Make sure your `ALLOWED_ORIGINS` includes your Fly.io app URL:
```
ALLOWED_ORIGINS=https://jdmarcng.com,https://www.jdmarcng.com,https://jdmarc-backend.fly.dev,http://localhost:5173
```

## 🚀 Deployment

### Option 1: Using the Deployment Script
```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment
./deploy.sh
```

### Option 2: Manual Deployment
```bash
# Build the application
npm run build

# Generate Prisma client
npx prisma generate

# Deploy to Fly.io
flyctl deploy
```

## 📊 Monitoring & Management

### Check App Status
```bash
flyctl status
```

### View Logs
```bash
# View real-time logs
flyctl logs

# View logs for specific machine
flyctl logs --machine <machine-id>
```

### Scale Application
```bash
# Scale to 2 instances
flyctl scale count 2

# Scale with specific resources
flyctl scale vm shared-cpu-1x --memory 1024
```

### Open Dashboard
```bash
flyctl dashboard
```

## 🔍 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check build logs
   flyctl logs --build
   ```

2. **Database Connection Issues**
   ```bash
   # Check database status
   flyctl postgres status jdmarc-db
   
   # Connect to database
   flyctl postgres connect jdmarc-db
   ```

3. **Environment Variables**
   ```bash
   # List all secrets
   flyctl secrets list
   
   # Remove a secret
   flyctl secrets unset SECRET_NAME
   ```

### Health Checks
The app includes a health check endpoint at `/health`. Make sure it returns a 200 status.

## 🌐 Custom Domain Setup

### 1. Add Custom Domain
```bash
flyctl certs add api.jdmarcng.com
```

### 2. Update DNS
Add a CNAME record pointing to your Fly.io app:
```
api.jdmarcng.com CNAME jdmarc-backend.fly.dev
```

### 3. Update Environment Variables
```bash
flyctl secrets set FRONTEND_URL=https://jdmarcng.com
flyctl secrets set ALLOWED_ORIGINS=https://jdmarcng.com,https://www.jdmarcng.com,https://api.jdmarcng.com
```

## 💰 Cost Optimization

### Free Tier Limits
- 3 shared-cpu-1x 256mb VMs
- 3GB persistent volume storage
- 160GB outbound data transfer

### Scaling Down for Development
```bash
# Scale down to 0 instances (stops the app)
flyctl scale count 0

# Scale back up when needed
flyctl scale count 1
```

## 🔐 Security Best Practices

1. **Use Secrets for Sensitive Data**
   ```bash
   flyctl secrets set JWT_SECRET="your_secret"
   ```

2. **Enable HTTPS**
   - HTTPS is automatically enabled in fly.toml

3. **Regular Updates**
   ```bash
   # Update Fly CLI
   flyctl version upgrade
   ```

## 📞 Support

- **Fly.io Documentation**: https://fly.io/docs/
- **Community**: https://community.fly.io/
- **Status Page**: https://status.fly.io/

## 🎯 Next Steps

1. Deploy your application
2. Set up monitoring and alerts
3. Configure custom domains
4. Set up CI/CD pipeline
5. Monitor costs and optimize

---

**Happy Deploying! 🚀**