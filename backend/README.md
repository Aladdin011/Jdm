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
   - `PORT`: `10000` (Render will override this with its own port)
   - `JWT_SECRET`: Your JWT secret key
   - `DB_HOST`: Your MySQL host
   - `DB_USER`: Your MySQL username
   - `DB_PASSWORD`: Your MySQL password
   - `DB_NAME`: Your MySQL database name
   - `DB_PORT`: `3306`
   - `FRONTEND_URL`: Your frontend URL (e.g., `https://jdmarcng.com`)

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

### Troubleshooting

- Check the Render logs for any errors
- Ensure all environment variables are set correctly
- Verify that the database connection is working