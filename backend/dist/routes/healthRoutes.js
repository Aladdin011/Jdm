"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const router = (0, express_1.Router)();
router.get("/", async (_req, res) => {
    const db = (0, database_1.getDatabaseStatus)();
    return res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
        database: db
    });
});
exports.default = router;
//# sourceMappingURL=healthRoutes.js.map