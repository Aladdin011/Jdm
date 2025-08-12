# JD Marc Platform - Project Structure

```
builder-aura-field/
├── backend/                  # Backend API Server
│   ├── src/
│   │   ├── config/          # Backend configuration files
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── utils/           # Utility functions
│   │   └── server.ts        # Main server file
│   ├── package.json
│   └── tsconfig.json
│
├── src/                     # Frontend Source
│   ├── assets/             # Static assets
│   │   ├── fonts/
│   │   └── styles/
│   ├── components/         # React components
│   │   ├── auth/          # Authentication components
│   │   ├── layout/        # Layout components
│   │   ├── sections/      # Page sections
│   │   └── ui/            # UI components
│   ├── config/            # Frontend configuration
│   ├── contexts/          # React contexts
│   ├── data/             # Mock data and types
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Library code
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── styles/           # Global styles
│   └── utils/            # Utility functions
│
├── public/                # Public assets
│   ├── images/           # Image assets
│   │   ├── blog/
│   │   ├── brand/
│   │   ├── projects/
│   │   ├── services/
│   │   └── team/
│   ├── favicon.ico
│   └── robots.txt
│
├── docs/                  # Documentation
│   ├── technical/        # Technical documentation
│   │   ├── architecture.md
│   │   └── api.md
│   ├── deployment/       # Deployment guides
│   │   ├── hosting.md
│   │   └── env.md
│   └── README.md
│
├── scripts/              # Build and deployment scripts
│   ├── deploy.js
│   └── build.js
│
├── .env                  # Environment variables
├── .env.example         # Example environment variables
├── .gitignore
├── package.json
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── README.md
```

## Directory Structure Guidelines

### Backend (`/backend`)
- Server-side code
- API endpoints
- Database interactions
- Authentication logic

### Frontend (`/src`)
- React components
- Application logic
- State management
- Routing

### Public (`/public`)
- Static assets
- Images
- Fonts
- Global static files

### Documentation (`/docs`)
- Technical documentation
- Deployment guides
- API documentation
- Architecture diagrams

### Configuration Files (Root)
- Build configuration
- TypeScript configuration
- Environment variables
- Package management

## File Naming Conventions

1. Components: PascalCase
   - `Button.tsx`
   - `NavBar.tsx`

2. Utilities: camelCase
   - `formatDate.ts`
   - `validation.ts`

3. Constants: UPPER_SNAKE_CASE
   - `API_ENDPOINTS.ts`
   - `THEME_CONSTANTS.ts`

4. Styles: kebab-case
   - `button-styles.css`
   - `layout-grid.css`

## Import Organization

1. External imports
2. Internal absolute imports
3. Internal relative imports
4. Style imports

Example:
```typescript
// External imports
import React from 'react';
import { motion } from 'framer-motion';

// Internal absolute imports
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

// Internal relative imports
import { validateInput } from '../utils';

// Styles
import './styles.css';
```

## Best Practices

1. Keep components focused and small
2. Use consistent naming conventions
3. Organize imports properly
4. Document complex logic
5. Keep configuration in appropriate locations
6. Use TypeScript types and interfaces

This structure provides:
- Clear separation of concerns
- Easy navigation
- Scalability
- Maintainability
