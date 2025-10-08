import { Router } from 'express';
import { listUsersPublic } from '../controllers/userController';
import { requireDatabaseReady } from '../middleware/dbReadiness';

const router = Router();

// GET /api/users
router.get('/', requireDatabaseReady, listUsersPublic);

export default router;