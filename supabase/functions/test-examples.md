# Supabase Functions Testing Guide

## 🧪 How to Test Your Functions

### 1. **Login Function Test**

**URL:** `https://your-project-ref.supabase.co/functions/v1/login`

**Method:** POST

**Headers:**
```
Content-Type: application/json
Authorization: Bearer your-anon-key
```

**Body:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "session": {
    "access_token": "...",
    "refresh_token": "...",
    "user": {...}
  }
}
```

### 2. **Register Function Test**

**URL:** `https://your-project-ref.supabase.co/functions/v1/register`

**Method:** POST

**Headers:**
```
Content-Type: application/json
Authorization: Bearer your-anon-key
```

**Body:**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "role": "user",
  "department": "admin"
}
```

**Expected Response:**
```json
{
  "user": {
    "id": "...",
    "email": "newuser@example.com",
    ...
  }
}
```

### 3. **Create Upload URL Function Test**

**URL:** `https://your-project-ref.supabase.co/functions/v1/create_upload_url`

**Method:** POST

**Headers:**
```
Content-Type: application/json
Authorization: Bearer your-anon-key
```

**Body:**
```json
{
  "bucket": "Project_Files",
  "path": "documents/test-file.pdf",
  "expiresIn": 3600
}
```

**Expected Response:**
```json
{
  "uploadUrl": "https://...",
  "path": "documents/test-file.pdf"
}
```

## 🔧 Common Issues & Solutions

### Issue 1: "Missing required environment variables"
**Solution:** Make sure you've set these in your Supabase dashboard:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`

### Issue 2: CORS errors
**Solution:** The functions now include proper CORS headers. If you still get CORS errors, check your browser's developer tools.

### Issue 3: "Method Not Allowed"
**Solution:** Make sure you're using POST method and the correct endpoint URL.

### Issue 4: Function not found
**Solution:** 
1. Deploy your functions using Supabase CLI: `supabase functions deploy`
2. Or upload them through the Supabase dashboard

## 🚀 Deployment Commands

```bash
# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy login
supabase functions deploy register
supabase functions deploy create_upload_url
```

## 📝 Testing in Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to "Edge Functions"
3. Click on the function you want to test
4. Use the "Test" tab
5. Enter the JSON body and click "Run"
