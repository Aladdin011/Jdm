# Database Setup Guide

## Overview

This backend is configured to use MySQL database hosted on Hostinger with TypeORM as the ORM.

## Configuration

### Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# MySQL Database Configuration
DB_HOST=srv1847.hstgr.io
DB_PORT=3306
DB_USER=u158969833_Jdm1
DB_PASSWORD=KL98@nEC6>i
DB_NAME=u158969833_jdb1

# Database Collections (Tables)
PROJECTS_TABLE=projects
CONTACTS_TABLE=contact_submissions
USERS_TABLE=users
```

### Dependencies

The following MySQL-related dependencies have been added:

- `mysql2@^3.11.0` - MySQL client for Node.js
- `typeorm@^0.3.20` - TypeScript ORM for MySQL

## Database Entities

Three main entities are configured:

### 1. Contact Entity (`src/entities/Contact.ts`)
- Stores contact form submissions
- Fields: firstName, lastName, email, phone, company, message, subject, status
- Status options: pending, reviewed, responded

### 2. User Entity (`src/entities/User.ts`)
- Stores user registration data
- Fields: firstName, lastName, email, phone, location, company, password, role, isActive
- Role options: user, admin

### 3. Project Entity (`src/entities/Project.ts`)
- Stores project information
- Fields: title, description, category, location, images, status, dates, budget, client
- Status options: planning, ongoing, completed, paused

## Repositories

Repository classes provide database operations:

- `ContactRepository` - CRUD operations for contacts
- `UserRepository` - User management operations
- `ProjectRepository` - Project management operations

## Database Connection

The database connection is configured in `src/config/database.ts` with:

- Automatic retry on connection failure
- Connection pooling (5 connections)
- UTF8MB4 charset support
- Graceful error handling
- Development vs production configurations

## Testing & Verification

### Check Database Credentials
```bash
npm run verify-credentials
```

### Test Database Connection
```bash
npm run test-db
```

### Health Check
The `/api/health` endpoint includes database status information.

## Troubleshooting

### Common Issues

1. **Access Denied Error**
   - Verify username and password in Hostinger control panel
   - Check if IP address needs to be whitelisted
   - Ensure password special characters are correct

2. **Connection Refused**
   - Verify host address is correct
   - Check if port 3306 is accessible
   - Confirm database server is running

3. **Authentication Issues**
   - Reset database password in Hostinger panel
   - Check for HTML entities in password (e.g., &gt; should be >)
   - Verify database name exists

### Server Behavior

The server is configured to:
- Continue running even if database connection fails
- Log detailed error information for debugging
- Provide helpful error messages and suggestions
- Gracefully handle database unavailability

## Development Workflow

1. **Development Mode**: Tables are auto-created (synchronize: true)
2. **Production Mode**: Manual migrations required (synchronize: false)
3. **Logging**: SQL queries are logged in development mode

## Security Features

- Password hashing for user authentication
- Connection pooling to prevent connection exhaustion
- Input validation through TypeORM decorators
- Prepared statements to prevent SQL injection

## Deployment Notes

For production deployment:
1. Set `NODE_ENV=production`
2. Disable `synchronize` option
3. Enable SSL if required by hosting provider
4. Configure proper connection limits
5. Set up database backups

## API Integration

The repositories can be used in route handlers:

```typescript
import { ContactRepository } from '../repositories/ContactRepository';

const contactRepo = new ContactRepository();
const contacts = await contactRepo.findAll();
```

## Migration Strategy

While TypeORM can auto-create tables in development, for production:
1. Create migration files for schema changes
2. Run migrations during deployment
3. Keep database schema in version control
