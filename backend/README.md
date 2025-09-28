# JD Marc Backend

## Render Deployment Guide

### Prerequisites

1. Create a Render account at [render.com](https://render.com)
2. Connect your GitHub repository to Render

### Deployment Steps

1. **Create a new Web Service**
   - Select your repository
   - Set the name to `jdmarc-backend`
   - Set the environment to `Node`
   - Set the build command to `npm install && npx prisma generate`
   - Set the start command to `npm start`

2. **Configure Environment Variables**
   - `NODE_ENV`: `production`
   - `PORT`: `5004` (Render will override this with its own port)
   - `CORS_ORIGIN`: Your frontend URL (e.g., `https://jdmarcng.com`)
   - `DATABASE_URL`: Your MySQL connection string
   - `JWT_SECRET`: Your JWT secret key
   - `JWT_EXPIRES_IN`: `1h` (or your preferred token expiration time)
   - `BCRYPT_ROUNDS`: `12` (password hashing strength)
   - `API_VERSION`: `v1`
   - `FRONTEND_URL`: Your frontend URL (e.g., `https://jdmarcng.com`)
   - `RATE_LIMIT_WINDOW_MS`: `900000` (15 minutes in milliseconds)
   - `RATE_LIMIT_MAX`: `100` (maximum requests per IP within the window)

3. **Deploy**
   - Click the "Create Web Service" button
   - Wait for the deployment to complete

### Verify Deployment

- Check the health endpoint at `https://your-app-name.onrender.com/api/health`
- The response should be:
  ```json
  {
    "status": "ok",
    "timestamp": "2023-06-01T12:00:00.000Z",
    "uptime": 123.456,
    "environment": "production"
  }
  ```

### Security Features

#### Rate Limiting

The API implements rate limiting to protect against abuse and DoS attacks:

- Default: 100 requests per IP address in a 15-minute window
- Customize by setting `RATE_LIMIT_WINDOW_MS` and `RATE_LIMIT_MAX` environment variables
- Returns 429 status code with retry information when limits are exceeded

### Troubleshooting

- Check the Render logs for any errors
- Ensure all environment variables are set correctly
- Verify that the database connection is working
- If experiencing 429 errors, check the rate limiting configuration

### Node.js Version Requirements

- This application requires Node.js version 20.x
- The `.node-version` file specifies version 20.15.1
- The `engines` field in package.json specifies `>=20.0.0 <21.0.0`
- Using Node.js 18.x (especially 18.19.0) will cause deployment issues as it has reached end-of-life

### Common TypeScript Errors

If you encounter TypeScript errors during build, check for these common issues:

- Property naming in repository files must match entity definitions exactly
- For the `Project` entity, use `public: true` instead of `isPublic: true`
- For the `User` entity, use `active: true` instead of `isActive: true`
- For the `User` entity, use `created_at` instead of `createdAt`