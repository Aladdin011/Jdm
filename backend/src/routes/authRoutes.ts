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
import { dbReadiness } from "../middleware/dbReadiness";
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

// Ensure database is healthy for auth routes
router.use(dbReadiness);
// Public routes
router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/verify-credentials", validate(verifyCredentialsSchema), verifyCredentials);
router.post("/complete-login", validate(completeLoginSchema), completeLogin);

// Token refresh route
router.post("/refresh", refreshTokenMiddleware);

// Protected routes
router.get("/profile", authenticate, profile);

export default router;
