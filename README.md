# Builder Aura Field

A comprehensive dashboard application with role-based access control and department-specific dashboards.

## Features

- **Multi-Department Support**: Specialized dashboards for different departments
- **Role-Based Access Control**: Admin, staff, and user roles with appropriate permissions
- **Secure Authentication**: Two-step authentication with department code verification
- **Enhanced Session Management**: Secure session handling with encryption and expiry
- **Responsive Design**: Modern UI that works across devices
- **Seed Accounts**: Pre-configured test accounts for quick dashboard access

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd Builder-aura-field

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Deployment (Render Static Site)

- Ensure `vite.config.ts` has `base: "/"` and `plugins: [react()]`.
- Build locally to verify:
  - `npm install && npm run build` (outputs to `dist/`)
- Push latest code to GitHub on the `main` branch.
- On Render: New → Static Site → connect your GitHub repo.
- Configure:
  - Branch: `main`
  - Build Command: `npm install && npm run build`
  - Publish Directory: `dist`
- Environment variables (build-time for Vite):
  - Set `VITE_API_URL` to your backend API, e.g. `https://api.jdmarcng.com`

### Optional: render.yaml auto-config

This repo includes a root `render.yaml` to auto-configure the static site:

```
services:
  - type: web
    name: jdmarc-frontend
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: dist
    autoDeploy: true
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

### Verify Deployment

- After deploy, open the Render URL (e.g., `https://jdmarc-frontend.onrender.com`).
- Confirm routes load correctly (client-side SPA rewrite is configured).
- Validate API calls use `VITE_API_URL` or fallback logic in `src/services/api.ts`.

### Post-Deployment

- Enable Automatic Deploys from GitHub.
- Keep `.gitignore` excluding `node_modules`, `.vite`, and `dist`.

## Deployment (Hostinger via FTP)

- Ensure `vite.config.ts` has `base: "./"` for relative assets.
- Confirm SPA rewrites via `public/_redirects` and `public/.htaccess` (included).
- Build locally to verify:
  - `npm install && npm run build` (outputs to `dist/`)
- Configure FTP credentials:
  - Copy `.env.ftp.example` to `.env.ftp` and fill `FTP_HOST`, `FTP_USER`, `FTP_PASSWORD`, `FTP_REMOTE_DIR`.
- Deploy via FTP:
  - `npm run deploy:ftp`
- What it does:
  - Builds if `dist/` is missing
  - Uploads `dist/` to `FTP_REMOTE_DIR`
  - Uploads `public/.htaccess` to enable SPA routing and headers
- Verify:
  - Open your Hostinger site URL and test routes (client-side navigation)
  - Check Console for 404s on assets; relative base and SPA redirects should prevent these

### Hostinger Production Cautions

- Set `VITE_API_URL` in `.env.production` to your backend (e.g., `https://api.jdmarcng.com`).
- Ensure `VITE_ENABLE_SEED_ACCOUNTS=false` in `.env.production` to hide test accounts.
- Confirm `dist/` contains `index.html`, `_redirects`, and `.htaccess` after build.
- In production, console and debugger statements are stripped for cleaner logs.
- If fonts from Google fail to load due to network policies, the app still functions; consider self-hosting fonts under `public/` for strict environments.
- Private routes use `src/components/auth/PrivateRoute.tsx`; unauthenticated users are redirected to `/login`.

### Backend API Connectivity

- In development, API calls default to the Vite proxy at `/api`; configure the proxy in `vite.config.ts`.
- In production, API calls require `VITE_API_URL`; there is no fallback to external Render URLs.
- Token storage keys align between frontend and API service: `builder_aura_auth_token` and `builder_aura_refresh_token` (override via env).

## Seed Accounts Feature

The application includes a seed account feature that provides quick and easy login access to different dashboard types. This is particularly useful for development, testing, and demonstration purposes.

### How to Use Seed Accounts

1. Navigate to the login page
2. Click on the "Test Accounts" dropdown button
3. Select an account from the list and click "Use"
4. The system will automatically log you in with the selected account

For detailed information about available seed accounts and their credentials, refer to the [Seed Accounts Guide](./SEED_ACCOUNTS_GUIDE.md).

## Documentation

- [User Login Guide](./USER_LOGIN_GUIDE.md)
- [Seed Accounts Guide](./SEED_ACCOUNTS_GUIDE.md)

## License

This project is licensed under the MIT License - see the LICENSE file for details.