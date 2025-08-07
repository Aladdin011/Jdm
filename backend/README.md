# JD Marc Limited Backend API

A clean, production-ready Node.js/Express API server designed for Render deployment.

## 🚀 Features

- **Express.js** - Fast, unopinionated web framework
- **TypeScript** - Type-safe development
- **Security** - Helmet, CORS, rate limiting
- **Validation** - Joi schema validation
- **Email** - Contact form email handling
- **Health Checks** - Application monitoring endpoints
- **Production Ready** - Optimized for Render deployment

## 📁 Project Structure

```
backend/
├── src/
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── utils/          # Utility functions
│   └── server.ts       # Main server file
├── config/             # Configuration files
├── tests/              # Test files
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## 🛠️ Installation

1. **Install dependencies:**

   ```bash
   cd backend
   npm install
   ```

2. **Create environment file:**

   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables in `.env`**

## 🚦 Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint code
npm run lint
```

## 🌐 API Endpoints

### Health Check

- `GET /` - Basic server info
- `GET /api/health` - Health check
- `GET /api/health/detailed` - Detailed health info

### Contact

- `POST /api/contact` - Submit contact form
- `GET /api/contact/info` - Get contact information

## 📧 Email Configuration

The API supports email notifications for contact form submissions.

### Gmail Setup:

1. Enable 2-factor authentication
2. Generate an app password
3. Set environment variables:
   ```
   EMAIL_SERVICE_ENABLED=true
   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

### SMTP Setup:

```
EMAIL_SERVICE_ENABLED=true
SMTP_HOST=your-smtp-host
SMTP_PORT=587
EMAIL_USER=your-email
EMAIL_PASSWORD=your-password
```

## 🚀 Render Deployment

### Automatic Deployment:

1. **Connect Repository:**

   - Link your GitHub repository to Render
   - Select the `backend` folder as the source

2. **Configure Build:**

   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

3. **Environment Variables:**
   Add these in Render dashboard:

   ```
   NODE_ENV=production
   PORT=5000
   EMAIL_SERVICE_ENABLED=true
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   COMPANY_EMAIL=info@jdmarcng.com
   ```

4. **Domain Setup:**
   - Your API will be available at: `https://your-app-name.onrender.com`
   - Update frontend `VITE_API_URL` to point to this URL

### Manual Deployment:

```bash
# Build the project
npm run build

# Deploy to Render (using Render CLI)
render deploy
```

## 🔒 Security Features

- **Helmet** - Security headers
- **CORS** - Cross-origin protection
- **Rate Limiting** - Request throttling
- **Input Validation** - Joi schema validation
- **Error Handling** - Secure error responses

## 📊 Monitoring

- Health check endpoints for uptime monitoring
- Structured logging with Morgan
- Memory and CPU usage tracking
- Error tracking and reporting

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📝 Environment Variables

| Variable                | Description           | Default       |
| ----------------------- | --------------------- | ------------- |
| `NODE_ENV`              | Environment mode      | `development` |
| `PORT`                  | Server port           | `5000`        |
| `EMAIL_SERVICE_ENABLED` | Enable email features | `false`       |
| `EMAIL_USER`            | Email username        | -             |
| `EMAIL_PASSWORD`        | Email password        | -             |
| `COMPANY_EMAIL`         | Company email address | -             |

## 🆘 Troubleshooting

### Common Issues:

1. **Port Already in Use:**

   ```bash
   # Kill process on port 5000
   npx kill-port 5000
   ```

2. **Email Not Sending:**

   - Check environment variables
   - Verify email credentials
   - Check firewall settings

3. **Build Errors:**
   ```bash
   # Clear node modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📞 Support

For technical support:

- Email: info@jdmarcng.com
- Phone: +234 9 291 3991

---

**JD Marc Limited** - Building Africa's Future Cities
