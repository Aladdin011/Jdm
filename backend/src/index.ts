import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import healthRoutes from "./routes/healthRoutes";
import { rateLimitMiddleware } from "./middleware/rateLimitMiddleware";

dotenv.config();
const app = express();

// Configure CORS with specific origin
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

app.use(express.json());

// Apply rate limiting to all API routes
app.use("/api", rateLimitMiddleware);

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/health", healthRoutes);

app.get("/", (_req, res) => res.json({ ok: true, project: "JD Marc Backend" }));

console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log("JWT_SECRET:", process.env.JWT_SECRET);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
