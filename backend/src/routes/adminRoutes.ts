import { Router } from "express";
import { listUsers, assignRole, blockUser, updateDepartment, deleteUser, getDashboardSummary } from "../controllers/adminController";
import { authenticate, adminOnly } from "../middleware/auth";
import { dbReadiness } from "../middleware/dbReadiness";

const router = Router();
router.use(dbReadiness);
// Use unified authentication and admin authorization middleware
router.use(authenticate, adminOnly);
router.get("/users", listUsers);
router.get("/dashboard", getDashboardSummary);
router.put("/users/:id/role", assignRole);
router.post("/users/:id/block", blockUser);
router.put("/users/:id/department", updateDepartment);
router.delete("/users/:id", deleteUser);

export default router;
