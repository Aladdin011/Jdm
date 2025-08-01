# 📱 Mobile Setup Guide for Fly.io Deployment

## 🎯 **Easiest Method: GitHub Actions (Recommended)**

### Step 1: Create Fly.io Account
1. **Open Safari** on your iPhone
2. Go to [fly.io](https://fly.io)
3. **Sign up** with your email or GitHub account
4. **Verify your email**

### Step 2: Get Fly.io API Token
1. **Open Safari** and go to [fly.io](https://fly.io)
2. **Login** to your account
3. Go to **Account Settings** → **Access Tokens**
4. **Create a new token** with a name like "JD Marc Backend"
5. **Copy the token** (you'll need this for GitHub)

### Step 3: Setup GitHub Repository
1. **Push your code** to GitHub (if not already done)
2. Go to your **GitHub repository** in Safari
3. Go to **Settings** → **Secrets and variables** → **Actions**
4. **Add new repository secret**:
   - Name: `FLY_API_TOKEN`
   - Value: Paste your Fly.io API token

### Step 4: Initial Fly.io Setup (One-time)
You'll need to do this initial setup once. You can either:

**Option A: Use a computer briefly**
- Use any computer to run the initial setup commands
- Then everything else can be done from your iPhone

**Option B: Use GitHub Codespaces (Free)**
1. Go to your GitHub repository
2. Click the **Code** button
3. Select **Codespaces** tab
4. Click **Create codespace on main**
5. Wait for it to load, then run the setup commands

### Step 5: Initial Setup Commands
```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login to Fly.io
flyctl auth login

# Create the app (one-time)
flyctl apps create jdmarc-backend

# Create PostgreSQL database
flyctl postgres create jdmarc-db

# Attach database to app
flyctl postgres attach jdmarc-db --app jdmarc-backend

# Create volume for file storage
flyctl volumes create jdmarc_data --size 10 --region iad
```

### Step 6: Set Environment Variables
```bash
# Set secrets (sensitive data)
flyctl secrets set JWT_SECRET="your_actual_jwt_secret_here"
flyctl secrets set JWT_REFRESH_SECRET="your_actual_refresh_secret_here"
flyctl secrets set WEBHOOK_SECRET="your_webhook_secret_here"

# Set other environment variables
flyctl secrets set NODE_ENV=production
flyctl secrets set PORT=8080
flyctl secrets set FRONTEND_URL=https://jdmarcng.com
flyctl secrets set ALLOWED_ORIGINS=https://jdmarcng.com,https://www.jdmarcng.com,https://jdmarc-backend.fly.dev,http://localhost:5173
```

## 🚀 **Deployment (Automatic!)**

Once setup is complete, deployment is automatic:

1. **Make changes** to your code
2. **Push to GitHub** (main branch)
3. **GitHub Actions** automatically deploys to Fly.io
4. **Check deployment** at: https://jdmarc-backend.fly.dev

## 📱 **Mobile Management**

### Check Deployment Status
1. **Open Safari**
2. Go to [fly.io](https://fly.io)
3. **Login** and go to your app dashboard
4. Check **Deployments** tab

### View Logs
1. Go to your app in Fly.io dashboard
2. Click **Logs** tab
3. View real-time application logs

### Scale Application
1. Go to your app dashboard
2. Click **Scale** tab
3. Adjust **Instance count** or **Resources**

### Monitor Costs
1. Go to **Account** → **Billing**
2. View current usage and costs

## 🔧 **Mobile-Friendly Commands**

If you need to run commands from your iPhone, you can use:

### GitHub Codespaces (Recommended)
1. Go to your repository
2. Click **Code** → **Codespaces**
3. **Create new codespace**
4. Run commands in the terminal

### Replit (Alternative)
1. Go to [replit.com](https://replit.com)
2. **Create new repl**
3. **Import from GitHub**
4. Run commands in the shell

## 📞 **Quick Commands Reference**

```bash
# Check app status
flyctl status

# View logs
flyctl logs

# Scale app
flyctl scale count 1

# Open dashboard
flyctl dashboard
```

## 🎯 **Pro Tips for Mobile**

1. **Bookmark** your Fly.io dashboard
2. **Use Safari** for best compatibility
3. **Enable notifications** for deployment status
4. **Use GitHub mobile app** for quick code pushes
5. **Set up email alerts** for deployment failures

## 🆘 **Need Help?**

- **Fly.io Docs**: https://fly.io/docs/
- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Community**: https://community.fly.io/

---

**You're all set! 🚀**

Once you complete the initial setup, you can manage everything from your iPhone. The GitHub Actions workflow will handle all deployments automatically when you push code changes.