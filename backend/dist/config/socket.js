"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnectedClientsCount = exports.broadcastToRoom = exports.broadcastToAll = exports.setupSocketIO = void 0;
const socket_io_1 = require("socket.io");
const setupSocketIO = (server) => {
    const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://jdmarcng.com',
        'https://jdmarcng.com',
        'https://www.jdmarcng.com'
    ];
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: function (origin, callback) {
                if (!origin)
                    return callback(null, true);
                if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
                    callback(null, true);
                }
                else {
                    console.log('Socket.IO CORS blocked origin:', origin);
                    callback(null, true);
                }
            },
            methods: ['GET', 'POST'],
            credentials: true
        },
        transports: ['websocket', 'polling'],
        allowEIO3: true
    });
    io.on('connection', (socket) => {
        console.log('🔌 Client connected:', socket.id);
        console.log('👥 Total clients:', io.engine.clientsCount);
        socket.on('disconnect', (reason) => {
            console.log('🔌 Client disconnected:', socket.id, 'Reason:', reason);
            console.log('👥 Total clients:', io.engine.clientsCount);
        });
        socket.on('join-room', (room) => {
            socket.join(room);
            console.log(`📍 Client ${socket.id} joined room: ${room}`);
        });
        socket.on('leave-room', (room) => {
            socket.leave(room);
            console.log(`📍 Client ${socket.id} left room: ${room}`);
        });
        socket.on('contact-submitted', (data) => {
            console.log('📝 Contact form submitted:', data);
            socket.broadcast.to('admin-dashboard').emit('new-contact', data);
        });
        socket.on('project-update', (data) => {
            console.log('🚧 Project updated:', data);
            socket.broadcast.emit('project-updated', data);
        });
        socket.on('user-status', (data) => {
            console.log('👤 User status update:', data);
            socket.broadcast.emit('user-status-changed', data);
        });
        socket.on('send-message', (data) => {
            console.log('💬 Message sent:', data);
            if (data.room) {
                socket.to(data.room).emit('new-message', data);
            }
            else {
                socket.broadcast.emit('new-message', data);
            }
        });
        socket.on('typing-start', (data) => {
            socket.broadcast.to(data.room || 'general').emit('user-typing', {
                userId: data.userId,
                userName: data.userName
            });
        });
        socket.on('typing-stop', (data) => {
            socket.broadcast.to(data.room || 'general').emit('user-stopped-typing', {
                userId: data.userId
            });
        });
        socket.on('dashboard-activity', (data) => {
            console.log('📊 Dashboard activity:', data);
            socket.broadcast.to('admin-dashboard').emit('activity-update', data);
        });
    });
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (token) {
            console.log('🔑 Client authenticated with token');
        }
        next();
    });
    return io;
};
exports.setupSocketIO = setupSocketIO;
const broadcastToAll = (io, event, data) => {
    io.emit(event, data);
    console.log(`📡 Broadcasted ${event} to all clients`);
};
exports.broadcastToAll = broadcastToAll;
const broadcastToRoom = (io, room, event, data) => {
    io.to(room).emit(event, data);
    console.log(`📡 Broadcasted ${event} to room: ${room}`);
};
exports.broadcastToRoom = broadcastToRoom;
const getConnectedClientsCount = (io) => {
    return io.engine.clientsCount;
};
exports.getConnectedClientsCount = getConnectedClientsCount;
//# sourceMappingURL=socket.js.map