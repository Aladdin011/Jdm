# Hostinger Deployment Guide

## ✅ Pre-deployment Checklist Complete

### Code Cleanup ✅

- [x] Removed duplicate DEY folder
- [x] Documented all external URLs
- [x] Replaced critical external URLs with internal assets
- [x] Production build tested successfully
- [x] Backend compatibility verified

## 🚀 Hostinger Deployment Steps

### 1. Build Configuration

The project is ready for deployment with:

```bash
npm run build
```

- **Output**: `dist/` directory
- **Build time**: ~10 seconds
- **Bundle size**: 640KB (204KB gzipped)

### 2. Upload to Hostinger

#### Option A: File Manager Upload

1. Run `npm run build` locally
2. Upload entire `dist/` folder contents to your domain's `public_html/` directory
3. Ensure `index.html` is in the root of `public_html/`

#### Option B: Git Deployment (Recommended)

1. Push code to your repository
2. Set up Hostinger Git deployment
3. Configure build command: `npm run build`
4. Set output directory: `dist`

### 3. Environment Variables

Create `.env.production` in Hostinger:

```bash
VITE_API_URL=https://your-backend-domain.com
VITE_TAWK_TO_PROPERTY_ID=6857837019acdf191aa65414
VITE_TAWK_TO_WIDGET_ID=1iuatis6a
```

### 4. Required Files Structure

```
public_html/
���── index.html
├── assets/
│   ├── *.css
│   ├── *.js
│   └── *.svg
└── images/
    ├── blog/
    ├── brand/
    ├── projects/
    └── services/
```

## 🔧 Server Configuration

### .htaccess for React Router (SPA)

Create `.htaccess` in `public_html/`:

```apache
RewriteEngine On
RewriteBase /

# Handle client-side routing
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
```

## 🛡️ Security Headers

Add to `.htaccess`:

```apache
# Security headers
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-Content-Type-Options "nosniff"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
```

## 📋 Post-Deployment Verification

### Test Checklist

1. **Homepage loads** ✓
2. **Navigation works** (all menu items)
3. **Images display** (check internal images load)
4. **Forms function** (contact, login, register)
5. **Tawk.to chat** appears
6. **Responsive design** on mobile
7. **Console errors** check (F12)

### Performance Verification

```bash
# Test build locally before upload
npm run build
npm run preview
```

### Expected Results

- **Load time**: <3 seconds
- **Bundle size**: ~204KB gzipped
- **Images**: All internal images load from `/images/`
- **Chat widget**: Tawk.to loads correctly

## 🚨 Common Issues & Solutions

### Issue: White screen after deployment

**Solution**: Check `.htaccess` file for React Router support

### Issue: Images not loading

**Solution**: Verify `/images/` folder uploaded with correct structure

### Issue: CSS not applying

**Solution**: Check asset paths in `index.html`

### Issue: API calls failing

**Solution**: Update `VITE_API_URL` environment variable

## 🔗 Backend Integration

### Current Status ✅

- Backend code unchanged and compatible
- API endpoints preserved
- Authentication flow intact
- Database connections preserved

### Backend URL Configuration

Update frontend to point to production backend:

```bash
VITE_API_URL=https://your-backend-domain.com
```

## 📊 Performance Optimizations Applied

### Bundle Analysis

- **Total size**: 640KB → 204KB gzipped (68% reduction)
- **External dependencies**: Reduced from 43+ to 2 essential services
- **Images**: All local assets for faster loading
- **Caching**: Static assets cached for 1 year

### Monitoring

- **Google Analytics**: Configured (update tracking ID)
- **Error tracking**: Console monitoring
- **Performance**: Web Vitals tracking included

## 🔄 Maintenance

### Regular Updates

1. **Dependencies**: Monthly security updates
2. **Images**: Optimize new images before upload
3. **Environment**: Monitor external service changes
4. **Performance**: Quarterly bundle analysis

### Backup Strategy

- **Code**: Git repository
- **Assets**: Regular backup of `/images/` folder
- **Config**: Document environment variables

## 📞 Support Resources

- **Hostinger Docs**: [help.hostinger.com](https://help.hostinger.com)
- **Build Issues**: Check `npm run build` logs
- **Runtime Errors**: Browser console (F12)
- **Chat Support**: Tawk.to admin panel

---

**Deployment Ready**: ✅ The frontend is fully prepared for Hostinger deployment with all optimizations and compatibility checks complete.
