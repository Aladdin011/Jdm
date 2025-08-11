# WebSocket Integration Guide

## Overview

The JD Marc backend now supports real-time communication using Socket.IO WebSockets. This enables live updates, notifications, and interactive features.

## Socket.IO Configuration

### Dependencies Added
- `socket.io@^4.7.4` - WebSocket server implementation
- Built-in TypeScript support (no need for @types package)

### Server Setup
- HTTP server created with `http.createServer(app)`
- Socket.IO integrated with proper CORS configuration
- WebSocket and polling transport support

## WebSocket Events

### Client Connection Events
```javascript
// Connection established
socket.on('connect', () => {
  console.log('Connected to server');
});

// Connection lost
socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
});
```

### Room Management
```javascript
// Join a room (for targeted broadcasts)
socket.emit('join-room', 'admin-dashboard');

// Leave a room
socket.emit('leave-room', 'admin-dashboard');
```

### Real-time Features

#### 1. Contact Form Notifications
```javascript
// Listen for new contact submissions (admin dashboard)
socket.on('new-contact', (data) => {
  console.log('New contact:', data);
  // Update UI with notification
});
```

#### 2. Project Updates
```javascript
// Listen for project updates
socket.on('project-updated', (data) => {
  console.log('Project updated:', data);
  // Refresh project data
});

// Send project update
socket.emit('project-update', {
  projectId: 123,
  changes: { status: 'completed' }
});
```

#### 3. User Status Updates
```javascript
// Listen for user status changes
socket.on('user-status-changed', (data) => {
  console.log('User status:', data);
});

// Send user status update
socket.emit('user-status', {
  userId: 456,
  status: 'online'
});
```

#### 4. Chat Messaging
```javascript
// Listen for new messages
socket.on('new-message', (data) => {
  console.log('New message:', data);
});

// Send a message
socket.emit('send-message', {
  room: 'project-123',
  message: 'Hello team!',
  userId: 456,
  userName: 'John Doe'
});
```

#### 5. Typing Indicators
```javascript
// Listen for typing indicators
socket.on('user-typing', (data) => {
  console.log(`${data.userName} is typing...`);
});

socket.on('user-stopped-typing', (data) => {
  console.log('User stopped typing');
});

// Send typing indicators
socket.emit('typing-start', {
  room: 'general',
  userId: 456,
  userName: 'John Doe'
});

socket.emit('typing-stop', {
  room: 'general',
  userId: 456
});
```

#### 6. Dashboard Activity
```javascript
// Listen for dashboard activity updates
socket.on('activity-update', (data) => {
  console.log('Dashboard activity:', data);
});

// Send dashboard activity
socket.emit('dashboard-activity', {
  action: 'view_project',
  projectId: 123,
  userId: 456
});
```

## Frontend Integration

### Basic Socket.IO Client Setup
```javascript
import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000', {
  transports: ['websocket', 'polling'],
  credentials: true
});

// Connection handling
socket.on('connect', () => {
  console.log('✅ Connected to WebSocket server');
  
  // Join admin dashboard room if user is admin
  if (userRole === 'admin') {
    socket.emit('join-room', 'admin-dashboard');
  }
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected from WebSocket server');
});

// Listen for general notifications
socket.on('notification', (data) => {
  // Show toast notification
  showToast(data.type, data.message);
});
```

### React Hook Example
```javascript
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SOCKET_URL);
    
    newSocket.on('connect', () => {
      setConnected(true);
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from server');
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  return { socket, connected };
};

export default useSocket;
```

## API Endpoints

### Socket.IO Testing Endpoints

#### 1. Broadcast Event
```http
POST /api/socket/broadcast
Content-Type: application/json

{
  "event": "test-event",
  "data": { "message": "Hello World" },
  "room": "admin-dashboard" // Optional
}
```

#### 2. Get Connection Statistics
```http
GET /api/socket/stats
```

Response:
```json
{
  "success": true,
  "stats": {
    "connectedClients": 5,
    "rooms": ["admin-dashboard", "project-123"],
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

#### 3. Send Notification to Room
```http
POST /api/socket/notify/admin-dashboard
Content-Type: application/json

{
  "type": "success",
  "message": "Project completed successfully!",
  "data": { "projectId": 123 }
}
```

## Authentication with WebSockets

### JWT Token Authentication
```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: localStorage.getItem('authToken')
  }
});
```

### Server-side token verification (middleware)
```javascript
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    // Verify JWT token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return next(new Error('Authentication error'));
      socket.userId = decoded.userId;
      socket.userRole = decoded.role;
      next();
    });
  } else {
    next(); // Allow anonymous connections
  }
});
```

## Production Deployment

### Environment Variables
```env
# WebSocket CORS origins for production
CORS_ORIGINS=https://jdmarcng.com,https://www.jdmarcng.com

# SSL Configuration (if needed)
SSL_CERT_PATH=/path/to/cert.pem
SSL_KEY_PATH=/path/to/key.pem
```

### NGINX Configuration (if using reverse proxy)
```nginx
location /socket.io/ {
    proxy_pass http://backend:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## Monitoring & Debugging

### Server-side Logging
The server logs all WebSocket activities:
- Client connections/disconnections
- Room joins/leaves
- Event broadcasts
- Error messages

### Client-side Debugging
```javascript
// Enable Socket.IO debug mode
localStorage.debug = 'socket.io-client:socket';

// Or in Node.js
process.env.DEBUG = 'socket.io:client';
```

## Performance Considerations

1. **Connection Limits**: Monitor concurrent connections
2. **Room Management**: Clean up empty rooms periodically
3. **Message Throttling**: Implement rate limiting for events
4. **Memory Usage**: Monitor memory consumption with many connections
5. **Scaling**: Consider Redis adapter for multi-server deployments

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure frontend origin is in CORS configuration
2. **Connection Drops**: Check network stability and firewall settings
3. **Authentication Failures**: Verify JWT token format and expiration
4. **Room Broadcasting**: Ensure clients properly join rooms before sending messages

### Health Check Integration
The `/api/health` endpoint now includes WebSocket connection count for monitoring.

## Future Enhancements

1. **Redis Adapter**: For horizontal scaling across multiple servers
2. **Rate Limiting**: Per-client event rate limiting
3. **Presence System**: Track online/offline user status
4. **File Sharing**: Real-time file upload progress
5. **Voice/Video**: Integration with WebRTC for calls
