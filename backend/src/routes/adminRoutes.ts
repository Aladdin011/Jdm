import { Router } from "express";
import { listUsers, assignRole, blockUser, updateDepartment, deleteUser } from "../controllers/adminController";
import { authMiddleware, adminOnly } from "../middleware/authMiddleware";

const router = Router();
router.use(authMiddleware, adminOnly);
router.get("/users", listUsers);
router.put("/users/:id/role", assignRole);
router.post("/users/:id/block", blockUser);
router.put("/users/:id/department", updateDepartment);
router.delete("/users/:id", deleteUser);

export default router;
