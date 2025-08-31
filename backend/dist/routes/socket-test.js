"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post("/broadcast", (req, res) => {
    try {
        const { event, data, room } = req.body;
        const io = req.app.get('io');
        if (!io) {
            return res.status(500).json({
                success: false,
                error: "Socket.IO not available"
            });
        }
        if (!event) {
            return res.status(400).json({
                success: false,
                error: "Event name is required"
            });
        }
        if (room) {
            io.to(room).emit(event, data);
            console.log(`📡 Broadcasted ${event} to room: ${room}`);
        }
        else {
            io.emit(event, data);
            console.log(`📡 Broadcasted ${event} to all clients`);
        }
        return res.status(200).json({
            success: true,
            message: `Event '${event}' broadcasted successfully`,
            room: room || 'all clients',
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error("Socket.IO broadcast error:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to broadcast event"
        });
    }
});
router.get("/stats", (req, res) => {
    try {
        const io = req.app.get('io');
        if (!io) {
            return res.status(500).json({
                success: false,
                error: "Socket.IO not available"
            });
        }
        const stats = {
            connectedClients: io.engine.clientsCount,
            rooms: Array.from(io.sockets.adapter.rooms.keys()),
            timestamp: new Date().toISOString()
        };
        return res.status(200).json({
            success: true,
            stats,
            message: "Socket.IO statistics retrieved successfully"
        });
    }
    catch (error) {
        console.error("Socket.IO stats error:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to retrieve Socket.IO statistics"
        });
    }
});
router.post("/notify/:room", (req, res) => {
    try {
        const { room } = req.params;
        const { type, message, data } = req.body;
        const io = req.app.get('io');
        if (!io) {
            return res.status(500).json({
                success: false,
                error: "Socket.IO not available"
            });
        }
        const notification = {
            type: type || 'info',
            message: message || 'Test notification',
            data: data || {},
            timestamp: new Date().toISOString()
        };
        io.to(room).emit('notification', notification);
        console.log(`🔔 Notification sent to room: ${room}`);
        return res.status(200).json({
            success: true,
            message: `Notification sent to room '${room}'`,
            notification,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error("Socket.IO notification error:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to send notification"
        });
    }
});
exports.default = router;
//# sourceMappingURL=socket-test.js.map