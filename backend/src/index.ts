import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import healthRoutes from "./routes/healthRoutes";
import { User } from "./entities/User";
import { Project } from "./entities/Project";
import { Contact } from "./entities/Contact";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Initialize TypeORM connection
const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "jdmarc",
  entities: [User, Project, Contact],
  synchronize: process.env.NODE_ENV !== "production",
  logging: process.env.NODE_ENV !== "production"
});

// Initialize database connection
AppDataSource.initialize()
  .then(() => {
    console.log("Database connection established");
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/health", healthRoutes);

app.get("/", (_req, res) => res.json({ ok: true, project: "JD Marc Backend" }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
