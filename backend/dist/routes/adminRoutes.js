"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminController_1 = require("../controllers/adminController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware, authMiddleware_1.adminOnly);
router.get("/users", adminController_1.listUsers);
router.put("/users/:id/role", adminController_1.assignRole);
router.post("/users/:id/block", adminController_1.blockUser);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map