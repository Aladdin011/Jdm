const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'your_database_name',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Initialize database and create tables if they don't exist
async function initializeDatabase() {
    try {
        console.log('🔄 Initializing database...');
        
        // Read and execute the SQL file to create users table
        const sqlFilePath = path.join(__dirname, '../../sql/create_users_table.sql');
        const sqlContent = await fs.readFile(sqlFilePath, 'utf8');
        
        // Split SQL commands by semicolon and execute each one
        const sqlCommands = sqlContent.split(';').filter(cmd => cmd.trim());
        
        for (const command of sqlCommands) {
            if (command.trim()) {
                await pool.execute(command);
            }
        }
        
        console.log('✅ Database initialized successfully');
        console.log('✅ Users table created/verified');
        
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        throw error;
    }
}

// Test database connection
async function testConnection() {
    try {
        console.log('🔄 Testing database connection...');
        console.log(`   Host: ${dbConfig.host}:${dbConfig.port}`);
        console.log(`   Database: ${dbConfig.database}`);
        console.log(`   User: ${dbConfig.user}`);
        
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        console.log('✅ Database connection successful');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.error('   Error code:', error.code);
        console.error('   Error errno:', error.errno);
        return false;
    }
}

module.exports = {
    pool,
    initializeDatabase,
    testConnection
};
