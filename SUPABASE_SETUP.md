# 🚀 Supabase Setup Guide for JD Marc Backend

## 🎯 **Why Supabase? (Perfect for Mobile Development)**

### ✅ **Advantages:**
- **Built-in Auth**: Complete authentication system
- **Real-time Database**: Live updates out of the box
- **File Storage**: Built-in storage with CDN
- **Auto-generated APIs**: REST and GraphQL APIs
- **Excellent Dashboard**: Mobile-friendly web interface
- **Generous Free Tier**: 500MB database, 1GB file storage
- **No Server Management**: Fully managed backend

### 📱 **Mobile-Friendly Features:**
- **Web Dashboard**: Works perfectly on iPhone Safari
- **Real-time Updates**: Perfect for mobile apps
- **Push Notifications**: Built-in support
- **Offline Support**: Local storage capabilities

## 🛠️ **Setup Steps (iPhone-Friendly)**

### Step 1: Create Supabase Account
1. **Open Safari** on your iPhone
2. Go to [supabase.com](https://supabase.com)
3. **Sign up** with GitHub or email
4. **Verify your email**

### Step 2: Create New Project
1. **Login** to Supabase dashboard
2. Click **"New Project"**
3. **Choose organization** (create one if needed)
4. **Project details**:
   - Name: `jdmarc-backend`
   - Database Password: `Choose a strong password`
   - Region: `West US (N. California)` or `East US (N. Virginia)`
5. Click **"Create new project"**
6. **Wait** for project to be ready (2-3 minutes)

### Step 3: Get Project Credentials
1. Go to **Settings** → **API**
2. **Copy these values**:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon Key**: `your-anon-key`
   - **Service Role Key**: `your-service-role-key`

### Step 4: Configure Environment Variables
1. **Copy** the credentials to your `.env.supabase` file
2. **Update** the values in the file:
   ```bash
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

## 🗄️ **Database Setup**

### Step 1: Create Tables
1. Go to **Table Editor** in Supabase dashboard
2. **Create tables** for your application:

#### Users Table (extends Supabase auth)
```sql
-- This is automatically created by Supabase
-- You can add custom columns:
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
```

#### Projects Table
```sql
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'planning',
  client_id UUID REFERENCES auth.users(id),
  budget DECIMAL(10,2),
  start_date DATE,
  end_date DATE,
  location TEXT,
  images TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Contacts Table
```sql
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Step 2: Set Up Row Level Security (RLS)
```sql
-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own projects" ON projects
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Users can insert their own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update their own projects" ON projects
  FOR UPDATE USING (auth.uid() = client_id);

-- Contacts can be viewed by admins only
CREATE POLICY "Admins can view all contacts" ON contacts
  FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');
```

## 🔐 **Authentication Setup**

### Step 1: Configure Auth Settings
1. Go to **Authentication** → **Settings**
2. **Site URL**: `https://jdmarcng.com`
3. **Redirect URLs**: 
   - `https://jdmarcng.com/auth/callback`
   - `http://localhost:5173/auth/callback`

### Step 2: Enable Email Auth
1. Go to **Authentication** → **Providers**
2. **Enable Email provider**
3. **Configure email templates** (optional)

### Step 3: Enable Social Login (Optional)
1. **Google OAuth**:
   - Enable Google provider
   - Add Google Client ID and Secret
2. **Facebook OAuth**:
   - Enable Facebook provider
   - Add Facebook App ID and Secret

## 📁 **Storage Setup**

### Step 1: Create Storage Buckets
1. Go to **Storage** in dashboard
2. **Create buckets**:
   - `projects` (public)
   - `avatars` (public)
   - `documents` (private)
   - `temp` (public)

### Step 2: Set Up Storage Policies
```sql
-- Projects bucket - anyone can view, authenticated users can upload
CREATE POLICY "Anyone can view projects" ON storage.objects
  FOR SELECT USING (bucket_id = 'projects');

CREATE POLICY "Authenticated users can upload projects" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'projects' AND auth.role() = 'authenticated');

-- Avatars bucket - anyone can view, users can upload their own
CREATE POLICY "Anyone can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## 🔄 **Real-time Setup**

### Step 1: Enable Real-time
1. Go to **Database** → **Replication**
2. **Enable real-time** for tables you want to sync
3. **Select tables**: `projects`, `contacts`

### Step 2: Configure Realtime Policies
```sql
-- Allow users to subscribe to their own projects
CREATE POLICY "Users can subscribe to their own projects" ON projects
  FOR SELECT USING (auth.uid() = client_id);
```

## 📧 **Email Configuration**

### Step 1: Configure SMTP (Optional)
1. Go to **Settings** → **Auth** → **SMTP Settings**
2. **Add SMTP credentials** for custom email provider
3. **Test email sending**

### Step 2: Customize Email Templates
1. Go to **Authentication** → **Templates**
2. **Customize**:
   - Confirmation email
   - Magic link email
   - Password reset email

## 🚀 **Deployment Options**

### Option 1: Vercel (Recommended for Mobile)
1. **Connect GitHub** to Vercel
2. **Import** your repository
3. **Set environment variables** in Vercel dashboard
4. **Deploy** automatically on push

### Option 2: Netlify
1. **Connect GitHub** to Netlify
2. **Import** your repository
3. **Set environment variables**
4. **Deploy** automatically

### Option 3: Railway
1. **Connect GitHub** to Railway
2. **Import** your repository
3. **Set environment variables**
4. **Deploy** automatically

## 📱 **Mobile Management**

### Dashboard Access
- **URL**: Your Supabase project dashboard
- **Features**: Works perfectly on iPhone Safari
- **Real-time monitoring**: Live logs and metrics

### API Management
- **Auto-generated docs**: Available in dashboard
- **API testing**: Built-in API explorer
- **Rate limiting**: Configured automatically

### Database Management
- **Table editor**: Visual database management
- **SQL editor**: Run custom queries
- **Backups**: Automatic daily backups

## 💰 **Cost Comparison**

| Feature | Supabase Free | Supabase Pro | Fly.io |
|---------|---------------|--------------|--------|
| **Database** | 500MB | 8GB | 3GB |
| **Storage** | 1GB | 100GB | 3GB |
| **Bandwidth** | 2GB | 250GB | 160GB |
| **Auth Users** | Unlimited | Unlimited | Custom |
| **Real-time** | ✅ | ✅ | Custom |
| **File Storage** | ✅ | ✅ | Custom |
| **Auto APIs** | ✅ | ✅ | Custom |

## 🎯 **Next Steps**

1. **Complete the setup** following this guide
2. **Test authentication** with your frontend
3. **Configure real-time** subscriptions
4. **Set up file uploads** to storage
5. **Deploy your application**
6. **Monitor** usage and performance

## 🆘 **Need Help?**

- **Supabase Docs**: https://supabase.com/docs
- **Community**: https://github.com/supabase/supabase/discussions
- **Discord**: https://discord.supabase.com

---

**Supabase is perfect for mobile development! 🚀**

You'll have a fully managed backend with authentication, real-time database, file storage, and auto-generated APIs - all manageable from your iPhone.