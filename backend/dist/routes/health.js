"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("../config/database");
const router = express_1.default.Router();
router.get("/", async (req, res) => {
    try {
        let dbStatus = "disconnected";
        let dbMessage = "Database not initialized";
        if (database_1.AppDataSource.isInitialized) {
            const queryRunner = database_1.AppDataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.query('SELECT 1');
            await queryRunner.release();
            dbStatus = "connected";
            dbMessage = "Database connection healthy";
        }
        const healthData = {
            status: "OK",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: {
                used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
                total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
            },
            environment: process.env.NODE_ENV || "development",
            version: "1.0.0",
            database: {
                status: dbStatus,
                message: dbMessage,
                host: process.env.DB_HOST,
                name: process.env.DB_NAME
            }
        };
        res.status(200).json(healthData);
    }
    catch (error) {
        const healthData = {
            status: "ERROR",
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: {
                used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
                total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
            },
            environment: process.env.NODE_ENV || "development",
            version: "1.0.0",
            database: {
                status: "error",
                message: error instanceof Error ? error.message : "Unknown database error"
            }
        };
        res.status(500).json(healthData);
    }
});
router.get("/detailed", (req, res) => {
    const memoryUsage = process.memoryUsage();
    const healthData = {
        status: "OK",
        timestamp: new Date().toISOString(),
        uptime: {
            seconds: process.uptime(),
            formatted: formatUptime(process.uptime()),
        },
        memory: {
            rss: Math.round((memoryUsage.rss / 1024 / 1024) * 100) / 100,
            heapTotal: Math.round((memoryUsage.heapTotal / 1024 / 1024) * 100) / 100,
            heapUsed: Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100,
            external: Math.round((memoryUsage.external / 1024 / 1024) * 100) / 100,
        },
        cpu: {
            usage: process.cpuUsage(),
        },
        environment: process.env.NODE_ENV || "development",
        version: "1.0.0",
        platform: process.platform,
        nodeVersion: process.version,
    };
    res.status(200).json(healthData);
});
function formatUptime(uptime) {
    const days = Math.floor(uptime / (24 * 60 * 60));
    const hours = Math.floor((uptime % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((uptime % (60 * 60)) / 60);
    const seconds = Math.floor(uptime % 60);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}
exports.default = router;
//# sourceMappingURL=health.js.map