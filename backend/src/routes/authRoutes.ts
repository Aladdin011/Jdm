import { Router } from "express";
import { 
  register, 
  login, 
  profile, 
  verifyCredentials, 
  verifyDepartmentCode, 
  completeLogin 
} from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, profile);
router.post("/verify-credentials", verifyCredentials);
router.post("/verify-department-code", verifyDepartmentCode);
router.post("/complete-login", completeLogin);

export default router;
