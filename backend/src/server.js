const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables FIRST
dotenv.config();

const { initializeDatabase, testConnection } = require('./config/database');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Authentication API Server',
        endpoints: {
            'POST /api/auth/register': 'Register a new user',
            'POST /api/auth/login': 'Login user',
            'GET /api/auth/me': 'Get current user info (requires token)',
            'GET /health': 'Health check'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('❌ Unhandled error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Start server
async function startServer() {
    try {
        console.log('🚀 Starting server...');
        
        // Test database connection
        const dbConnected = await testConnection();
        if (!dbConnected) {
            throw new Error('Database connection failed');
        }
        
        // Initialize database (create tables if they don't exist)
        await initializeDatabase();
        
        // Start the server
        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`🌐 API available at: http://localhost:${PORT}`);
            console.log(`📋 Health check: http://localhost:${PORT}/health`);
            console.log('📚 Available endpoints:');
            console.log('   POST /api/auth/register - Register user');
            console.log('   POST /api/auth/login - Login user');
            console.log('   GET /api/auth/me - Get user info');
        });
        
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Shutting down server...');
    process.exit(0);
});

// Start the server
startServer();
