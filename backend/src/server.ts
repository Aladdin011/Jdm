import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Import database connection
import { connectDatabase, disconnectDatabase } from "./config/database";

// Import routes
import contactRoutes from "./routes/contact";
import healthRoutes from "./routes/health";

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }),
);

// CORS configuration
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://jdmarcng.com", "https://www.jdmarcng.com"]
        : ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// API Routes
app.use("/api/health", healthRoutes);
app.use("/api/contact", contactRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "JD Marc Limited API Server",
    version: "1.0.0",
    status: "running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    message: `The requested endpoint ${req.originalUrl} does not exist.`,
  });
});

// Global error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("Error:", err);

    const status = err.statusCode || err.status || 500;
    const message = err.message || "Internal server error";

    res.status(status).json({
      error: message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  },
);

// Start server with database connection
const startServer = async () => {
  try {
    // Attempt to connect to Hostinger MySQL database
    // This will not fail the server startup if database is unavailable
    await connectDatabase();

    // Start Express server regardless of database connection status
    app.listen(PORT, () => {
      console.log(`🚀 JD Marc API Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🌐 API URL: ${process.env.NODE_ENV === 'production' ? 'https://jdmarc-backend-api.onrender.com' : `http://localhost:${PORT}`}`);
      console.log('🎯 Ready to handle requests');

      if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD) {
        console.log('\n⚠️  Database not configured. Run: npm run verify-credentials');
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🔄 Graceful shutdown initiated...');
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🔄 Graceful shutdown initiated...');
  await disconnectDatabase();
  process.exit(0);
});

// Start the server
startServer();

export default app;
