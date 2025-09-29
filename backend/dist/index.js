"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const healthRoutes_1 = __importDefault(require("./routes/healthRoutes"));
const rateLimitMiddleware_1 = require("./middleware/rateLimitMiddleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Configure CORS with specific origin
app.use((0, cors_1.default)({
    origin: [
        'https://jdmarcng.com',
        'https://www.jdmarcng.com',
        process.env.CORS_ORIGIN
    ].filter(Boolean),
    credentials: true
}));
app.use(express_1.default.json());
// Apply rate limiting to all API routes
app.use("/api", rateLimitMiddleware_1.rateLimitMiddleware);
app.use("/api/auth", authRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
app.use("/api/health", healthRoutes_1.default);
app.get("/", (_req, res) => res.json({ ok: true, project: "JD Marc Backend" }));
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//# sourceMappingURL=index.js.map