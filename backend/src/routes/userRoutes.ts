import { Router } from 'express';
import { listUsersPublic } from '../controllers/userController';
import { dbReadiness } from '../middleware/dbReadiness';

const router = Router();

// Ensure database is healthy for user routes
router.use(dbReadiness);
// GET /api/users
router.get('/', listUsersPublic);

export default router;