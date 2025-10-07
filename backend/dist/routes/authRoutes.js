"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
// Validation schemas
const registerSchema = {
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email format'),
        password: zod_1.z.string().min(8, 'Password must be at least 8 characters'),
        department: zod_1.z.string().optional()
    })
};
const loginSchema = {
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email format'),
        password: zod_1.z.string().min(1, 'Password is required')
    })
};
const verifyCredentialsSchema = {
    body: zod_1.z.object({
        email: zod_1.z.string().email('Invalid email format'),
        password: zod_1.z.string().min(1, 'Password is required')
    })
};
const completeLoginSchema = {
    body: zod_1.z.object({
        userId: zod_1.z.number().int().positive('Valid user ID is required')
    })
};
// Public routes
router.post("/register", (0, validation_1.validate)(registerSchema), authController_1.register);
router.post("/login", (0, validation_1.validate)(loginSchema), authController_1.login);
router.post("/verify-credentials", (0, validation_1.validate)(verifyCredentialsSchema), authController_1.verifyCredentials);
router.post("/complete-login", (0, validation_1.validate)(completeLoginSchema), authController_1.completeLogin);
// Token refresh route
router.post("/refresh", auth_1.refreshTokenMiddleware);
// Protected routes
router.get("/profile", auth_1.authenticate, authController_1.profile);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map