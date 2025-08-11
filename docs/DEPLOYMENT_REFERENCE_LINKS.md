# 📚 Deployment Reference Links

This document contains all the internal and external reference links used in the [Render Deployment Guide](./RENDER_DEPLOYMENT_GUIDE.md).

## 🏷️ Internal Reference Tags

### Platform and Dashboard Links
- `#render-platform` - Render.com main platform
- `#render-dashboard` - Render service dashboard
- `#render-env-config` - Environment variables configuration page
- `#render-ssl-dashboard` - SSL certificate management dashboard
- `#render-health-config` - Health check configuration settings
- `#render-autodeploy` - Auto-deployment settings

### External Service Integration
- `#google-security` - Google Account security settings
- `#mongodb-atlas` - MongoDB Atlas cloud platform
- `#uptimerobot-setup` - UptimeRobot monitoring service setup
- `#betteruptime-setup` - Better Uptime monitoring service setup
- `#pingdom-setup` - Pingdom monitoring service setup

### Company and Support
- `#jdmarc-company-email` - JD Marc Limited official email
- `#jdmarc-company-phone` - JD Marc Limited contact phone
- `#jdmarc-github-issues` - GitHub issues page for technical support

### Documentation and Resources
- `#render-docs` - Official Render documentation
- `#mongodb-docs` - MongoDB Atlas documentation
- `#nodejs-production` - Node.js production best practices
- `#render-status` - Render platform status page
- `#mongodb-status` - MongoDB Atlas status page
- `#google-status` - Google Workspace status page

---

## 🔗 Actual URLs and Links

### Primary Platform URLs

| Reference Tag | Actual URL | Description |
|---------------|------------|-------------|
| `#render-platform` | https://render.com | Render Cloud Platform |
| `#render-dashboard` | https://dashboard.render.com | Render Service Dashboard |
| `#mongodb-atlas` | https://cloud.mongodb.com | MongoDB Atlas Cloud |

### Configuration Dashboards

| Reference Tag | Section | URL Pattern |
|---------------|---------|-------------|
| `#render-env-config` | Environment Variables | `https://dashboard.render.com/web/srv-*/env` |
| `#render-ssl-dashboard` | SSL Management | `https://dashboard.render.com/web/srv-*/settings` |
| `#render-health-config` | Health Checks | `https://dashboard.render.com/web/srv-*/health` |
| `#render-autodeploy` | Auto-Deploy | `https://dashboard.render.com/web/srv-*/deploys` |

### Account and Security Setup

| Reference Tag | Service | Actual URL |
|---------------|---------|------------|
| `#google-security` | Google Account Security | https://myaccount.google.com/security |
| `#google-status` | Google Workspace Status | https://www.google.com/appsstatus/ |

### Monitoring Services

| Reference Tag | Service | URL | Plan |
|---------------|---------|-----|------|
| `#uptimerobot-setup` | UptimeRobot | https://uptimerobot.com | Free |
| `#betteruptime-setup` | Better Uptime | https://betteruptime.com | Paid |
| `#pingdom-setup` | Pingdom | https://pingdom.com | Enterprise |

### Documentation and Support

| Reference Tag | Resource | URL |
|---------------|----------|-----|
| `#render-docs` | Render Documentation | https://render.com/docs |
| `#mongodb-docs` | MongoDB Atlas Docs | https://docs.atlas.mongodb.com |
| `#nodejs-production` | Node.js Best Practices | https://nodejs.org/en/docs/guides/ |

### Status Pages

| Reference Tag | Service | Status URL |
|---------------|---------|------------|
| `#render-status` | Render Status | https://status.render.com |
| `#mongodb-status` | MongoDB Status | https://status.mongodb.com |

---

## 📧 JD Marc Limited Contact Information

### Company References

| Reference Tag | Contact Type | Details |
|---------------|--------------|---------|
| `#jdmarc-company-email` | Primary Email | info@jdmarcng.com |
| `#jdmarc-company-phone` | Phone Number | +234 9 291 3991 |
| `#jdmarc-github-issues` | Technical Support | https://github.com/jdmarc-limited/issues |

### Business Emails

| Purpose | Email Address | Usage |
|---------|---------------|--------|
| General Inquiries | info@jdmarcng.com | Customer inquiries |
| Technical Support | support@jdmarcng.com | Backend API support |
| Business Development | business@jdmarcng.com | Partnership inquiries |
| No Reply | noreply@jdmarcng.com | Automated emails |

---

## 🌐 JD Marc Limited URLs

### Production Domains

| Service | Domain | Purpose |
|---------|--------|---------|
| Main Website | https://jdmarcng.com | Company website |
| WWW Redirect | https://www.jdmarcng.com | Website redirect |
| API Endpoint | https://api.jdmarcng.com | Backend API |
| Admin Panel | https://admin.jdmarcng.com | Admin interface |

### Development Domains

| Environment | Domain | Purpose |
|-------------|--------|---------|
| Staging | https://staging-api.jdmarcng.com | Testing environment |
| Development | http://localhost:5000 | Local development |
| Preview | https://preview-*.onrender.com | PR previews |

---

## 🔧 Environment-Specific Configurations

### Production Environment
```bash
# API Endpoints
VITE_API_URL=https://api.jdmarcng.com
VITE_SOCKET_URL=https://api.jdmarcng.com

# Frontend URLs
FRONTEND_URL=https://jdmarcng.com
ADMIN_URL=https://admin.jdmarcng.com

# CORS Origins
CORS_ORIGINS=https://jdmarcng.com,https://www.jdmarcng.com
```

### Staging Environment
```bash
# API Endpoints
VITE_API_URL=https://staging-api.jdmarcng.com
VITE_SOCKET_URL=https://staging-api.jdmarcng.com

# Frontend URLs
FRONTEND_URL=https://staging.jdmarcng.com
ADMIN_URL=https://staging-admin.jdmarcng.com
```

### Development Environment
```bash
# API Endpoints
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000

# Frontend URLs
FRONTEND_URL=http://localhost:8080
ADMIN_URL=http://localhost:3001
```

---

## 📋 Quick Reference Checklist

### Pre-Deployment URLs to Verify
- [ ] Render account setup: [render.com](https://render.com)
- [ ] MongoDB Atlas cluster: [cloud.mongodb.com](https://cloud.mongodb.com)
- [ ] Google security settings: [myaccount.google.com/security](https://myaccount.google.com/security)
- [ ] Domain DNS configuration: Verify CNAME records
- [ ] SSL certificate status: Check in Render dashboard

### Post-Deployment URLs to Test
- [ ] API health check: `https://api.jdmarcng.com/api/health`
- [ ] Contact form endpoint: `https://api.jdmarcng.com/api/contact`
- [ ] Contact info endpoint: `https://api.jdmarcng.com/api/contact/info`
- [ ] WebSocket connection: `wss://api.jdmarcng.com`
- [ ] Metrics endpoint: `https://api.jdmarcng.com/metrics`

### Monitoring URLs to Configure
- [ ] UptimeRobot monitor: `https://api.jdmarcng.com/api/health`
- [ ] Render health dashboard: Service-specific URL
- [ ] MongoDB Atlas monitoring: Cluster dashboard
- [ ] Email delivery status: Gmail/SMTP logs

---

## 🔄 URL Pattern Templates

### Render Service URLs
```
Service Dashboard: https://dashboard.render.com/web/srv-{SERVICE_ID}
Environment Config: https://dashboard.render.com/web/srv-{SERVICE_ID}/env
Deploy Logs: https://dashboard.render.com/web/srv-{SERVICE_ID}/deploys
Health Checks: https://dashboard.render.com/web/srv-{SERVICE_ID}/health
```

### MongoDB Atlas URLs
```
Cluster Dashboard: https://cloud.mongodb.com/v2/{PROJECT_ID}#clusters
Database Access: https://cloud.mongodb.com/v2/{PROJECT_ID}#security/database/users
Network Access: https://cloud.mongodb.com/v2/{PROJECT_ID}#security/network/whitelist
```

### API Testing URLs
```
Health Check: https://{API_DOMAIN}/api/health
Detailed Health: https://{API_DOMAIN}/api/health/detailed
Contact Form: https://{API_DOMAIN}/api/contact
Contact Info: https://{API_DOMAIN}/api/contact/info
Metrics: https://{API_DOMAIN}/metrics
```

---

## 📝 Notes for URL Management

### Link Maintenance
1. **Regular Verification**: Check all external links monthly
2. **Status Monitoring**: Verify service status pages are current
3. **Documentation Updates**: Update URLs when services change
4. **Broken Link Detection**: Implement automated link checking

### Security Considerations
1. **HTTPS Only**: All production URLs must use HTTPS
2. **Domain Verification**: Verify domain ownership before DNS changes
3. **SSL Certificate Monitoring**: Monitor certificate expiration
4. **Access Control**: Restrict admin dashboard access

---

**Last Updated**: January 2024  
**Next Review**: February 2024  
**Maintainer**: JD Marc Limited Technical Team
