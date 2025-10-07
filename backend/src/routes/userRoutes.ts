import { Router } from 'express';
import { listUsersPublic } from '../controllers/userController';

const router = Router();

// GET /api/users
router.get('/', listUsersPublic);

export default router;