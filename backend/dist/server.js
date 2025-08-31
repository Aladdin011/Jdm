"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const database_1 = require("./config/database");
const socket_1 = require("./config/socket");
const contact_1 = __importDefault(require("./routes/contact"));
const health_1 = __importDefault(require("./routes/health"));
const socket_test_1 = __importDefault(require("./routes/socket-test"));
const auth_1 = __importDefault(require("./routes/auth"));
const projects_1 = __importDefault(require("./routes/projects"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5002;
const server = http_1.default.createServer(app);
const io = (0, socket_1.setupSocketIO)(server);
app.set('io', io);
app.use((0, helmet_1.default)({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https:"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://jdmarcng.com',
    'https://jdmarcng.com',
    'https://www.jdmarcng.com'
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
            callback(null, true);
        }
        else {
            console.log('CORS blocked origin:', origin);
            callback(null, true);
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ['Access-Control-Allow-Origin'],
}));
app.options('*', (0, cors_1.default)());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error: "Too many requests from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use("/api/health", health_1.default);
app.use("/api/contact", contact_1.default);
app.use("/api/socket", socket_test_1.default);
app.use("/api/auth", auth_1.default);
app.use("/api/projects", projects_1.default);
app.get("/", (req, res) => {
    res.json({
        message: "JD Marc Limited API Server",
        version: "1.0.0",
        status: "running",
        timestamp: new Date().toISOString(),
    });
});
app.use("*", (req, res) => {
    res.status(404).json({
        error: "Endpoint not found",
        message: `The requested endpoint ${req.originalUrl} does not exist.`,
    });
});
app.use((err, req, res, next) => {
    console.error("Error:", err);
    const status = err.statusCode || err.status || 500;
    const message = err.message || "Internal server error";
    res.status(status).json({
        error: message,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
});
const startServer = async () => {
    try {
        await (0, database_1.connectDatabase)();
        server.listen(PORT, () => {
            console.log(`🚀 JD Marc API Server running on port ${PORT}`);
            console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`);
            const baseUrl = process.env.NODE_ENV === 'production'
                ? 'https://jdmarc-backend-api.onrender.com'
                : `http://localhost:${PORT}`;
            console.log(`🌐 API URL: ${baseUrl}`);
            console.log(`🔄 WebSocket enabled: ${baseUrl.replace('http', 'ws')}`);
            console.log('🎯 Ready to handle requests and real-time connections');
            if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD) {
                console.log('\n⚠️  Database not configured. Run: npm run verify-credentials');
            }
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};
process.on('SIGINT', async () => {
    console.log('\n🔄 Graceful shutdown initiated...');
    io.close(() => {
        console.log('🔌 Socket.IO connections closed');
    });
    await (0, database_1.disconnectDatabase)();
    server.close(() => {
        console.log('🔄 Server closed gracefully');
        process.exit(0);
    });
});
process.on('SIGTERM', async () => {
    console.log('\n🔄 Graceful shutdown initiated...');
    io.close(() => {
        console.log('🔌 Socket.IO connections closed');
    });
    await (0, database_1.disconnectDatabase)();
    server.close(() => {
        console.log('🔄 Server closed gracefully');
        process.exit(0);
    });
});
startServer();
exports.default = app;
//# sourceMappingURL=server.js.map