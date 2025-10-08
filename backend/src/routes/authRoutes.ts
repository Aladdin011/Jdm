import { Router } from "express";
import { z } from "zod";
import { 
  register, 
  login, 
  profile, 
  verifyCredentials, 
  completeLogin,
  refreshToken
} from "../controllers/authController";
import { authenticate, refreshTokenMiddleware } from "../middleware/auth";
import { requireDatabaseReady } from "../middleware/dbReadiness";
import { validate } from "../middleware/validation";

const router = Router();

// Validation schemas
const registerSchema = {
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    department: z.string().optional()
  })
};

const loginSchema = {
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
  })
};

const verifyCredentialsSchema = {
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required')
  })
};

const completeLoginSchema = {
  body: z.object({
    userId: z.number().int().positive('Valid user ID is required')
  })
};

// Public routes
// Database-dependent public routes should only run when DB is ready
router.post("/register", requireDatabaseReady, validate(registerSchema), register);
router.post("/login", requireDatabaseReady, validate(loginSchema), login);
router.post("/verify-credentials", requireDatabaseReady, validate(verifyCredentialsSchema), verifyCredentials);
router.post("/complete-login", requireDatabaseReady, validate(completeLoginSchema), completeLogin);

// Token refresh route
router.post("/refresh", refreshTokenMiddleware);

// Protected routes
router.get("/profile", authenticate, profile);

export default router;
