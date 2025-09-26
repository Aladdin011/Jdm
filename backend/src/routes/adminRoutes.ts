import { Router } from "express";
import { listUsers, assignRole, blockUser } from "../controllers/adminController";
import { authMiddleware, adminOnly } from "../middleware/authMiddleware";

const router = Router();
router.use(authMiddleware, adminOnly);
router.get("/users", listUsers);
router.put("/users/:id/role", assignRole);
router.post("/users/:id/block", blockUser);

export default router;
