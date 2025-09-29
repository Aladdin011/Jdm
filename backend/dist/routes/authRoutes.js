"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post("/register", authController_1.register);
router.post("/login", authController_1.login);
router.get("/profile", authMiddleware_1.authMiddleware, authController_1.profile);
router.post("/verify-credentials", authController_1.verifyCredentials);
router.post("/verify-department-code", authController_1.verifyDepartmentCode);
router.post("/complete-login", authController_1.completeLogin);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map