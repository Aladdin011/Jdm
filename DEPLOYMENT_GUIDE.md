# 🚀 JD Marc Limited - Complete Deployment Guide

This guide covers deploying the frontend to Hostinger and backend to Render.

## 📋 Overview

- **Frontend**: React + TypeScript → Hostinger (via FTP)
- **Backend**: Node.js + Express → Render (via Git)
- **Database**: None (contact form only)
- **Email**: Nodemailer (optional)

## 🎯 Frontend Deployment (Hostinger)

### Prerequisites
1. ✅ Hostinger hosting account
2. ✅ FTP credentials from Hostinger panel
3. ✅ Domain configured (jdmarcng.com)

### Steps

1. **Configure Environment:**
   ```bash
   # Update .env with your FTP credentials
   VITE_FTP_HOST=46.202.183.111
   VITE_FTP_USERNAME=your-username
   VITE_FTP_PASSWORD=your-password
   ```

2. **Deploy to Hostinger:**
   ```bash
   npm run deploy
   ```

3. **Verify Deployment:**
   - Visit: https://jdmarcng.com
   - Check all pages load correctly
   - Test responsive design

### Manual Upload (Alternative)
If automatic deployment fails:
1. Run `npm run build`
2. Upload `dist/` folder contents to `public_html` via Hostinger File Manager

## 🎯 Backend Deployment (Render)

### Prerequisites
1. ✅ Render account (free tier available)
2. ✅ GitHub repository access
3. ✅ Email service credentials (optional)

### Steps

1. **Create Render Service:**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `backend` folder

2. **Configure Build Settings:**
   ```
   Name: jdmarc-backend
   Environment: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   ```

3. **Set Environment Variables:**
   ```
   NODE_ENV=production
   EMAIL_SERVICE_ENABLED=true
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   COMPANY_EMAIL=info@jdmarcng.com
   ```

4. **Deploy:**
   - Click "Create Web Service"
   - Render will automatically build and deploy
   - Your API will be available at: `https://jdmarc-backend.onrender.com`

### Email Configuration (Optional)

#### Gmail Setup:
1. Enable 2FA on Gmail account
2. Generate App Password:
   - Google Account → Security → 2-Step Verification → App Passwords
3. Use app password in `EMAIL_PASSWORD`

#### Environment Variables:
```
EMAIL_SERVICE_ENABLED=true
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-digit-app-password
COMPANY_EMAIL=info@jdmarcng.com
```

## 🔗 Connect Frontend to Backend

1. **Update Frontend API URL:**
   After backend deployment, update `.env`:
   ```
   VITE_API_URL=https://jdmarc-backend.onrender.com/api
   ```

2. **Redeploy Frontend:**
   ```bash
   npm run deploy
   ```

## ✅ Post-Deployment Checklist

### Frontend (Hostinger)
- [ ] Website loads at https://jdmarcng.com
- [ ] All pages accessible
- [ ] Images and assets loading
- [ ] Mobile responsive
- [ ] Contact form works
- [ ] Navigation functional

### Backend (Render)
- [ ] API accessible at Render URL
- [ ] Health check endpoint working: `/api/health`
- [ ] Contact form submitting: `/api/contact`
- [ ] Email notifications working (if configured)
- [ ] CORS configured for frontend domain

## 🔧 Troubleshooting

### Frontend Issues

**Build Errors:**
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

**FTP Connection Failed:**
1. Check credentials in Hostinger panel
2. Verify FTP service enabled
3. Try different FTP client (FileZilla)

**Website Not Loading:**
1. Check domain DNS settings
2. Verify files in `public_html` directory
3. Check file permissions (644 for files, 755 for folders)

### Backend Issues

**Deploy Failed:**
1. Check build logs in Render dashboard
2. Verify package.json scripts
3. Check environment variables

**API Not Responding:**
1. Check service status in Render
2. Review application logs
3. Verify CORS configuration

**Email Not Sending:**
1. Verify email credentials
2. Check Gmail app password
3. Test with simple SMTP service

## 📊 Monitoring & Maintenance

### Health Checks
- **Frontend**: https://jdmarcng.com
- **Backend**: https://jdmarc-backend.onrender.com/api/health

### Logs
- **Frontend**: Browser console, Hostinger error logs
- **Backend**: Render service logs

### Updates
1. Make changes to code
2. Push to GitHub (backend auto-deploys)
3. Run `npm run deploy` for frontend

## 🆘 Support

### Technical Issues
- Email: info@jdmarcng.com
- Phone: +234 9 291 3991

### Platform Support
- **Hostinger**: https://support.hostinger.com
- **Render**: https://render.com/docs

---

## 📝 Notes

1. **Free Tier Limitations:**
   - Render free tier may sleep after 15 minutes of inactivity
   - First request after sleep may be slow (30+ seconds)

2. **SSL Certificates:**
   - Hostinger provides free SSL
   - Render provides automatic HTTPS

3. **Custom Domain:**
   - Update DNS A record to point to Hostinger IP
   - Configure CNAME for www subdomain

4. **Performance:**
   - Use CDN for static assets (Cloudflare)
   - Enable compression on Hostinger
   - Monitor Core Web Vitals

---

**🎉 Your JD Marc Limited website is now live!**

Frontend: https://jdmarcng.com  
Backend: https://jdmarc-backend.onrender.com
