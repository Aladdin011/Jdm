import { Router } from "express";
import { getDatabaseStatus } from "../config/database";

const router = Router();

router.get("/", async (_req, res) => {
  const db = getDatabaseStatus();
  return res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    database: db
  });
});

export default router;