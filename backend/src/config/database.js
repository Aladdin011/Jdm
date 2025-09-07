const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');

// Database configuration
const dbConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
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
        
        // Read and execute the seed data
        const seedFilePath = path.join(__dirname, '../../sql/seed_department_accounts.sql');
        const seedContent = await fs.readFile(seedFilePath, 'utf8');
        
        // Split seed commands by semicolon and execute each one
        const seedCommands = seedContent.split(';').filter(cmd => cmd.trim());
        
        for (const command of seedCommands) {
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
        console.log(`   SSL: ${dbConfig.ssl ? 'enabled' : 'disabled'}`);
        
        // Validate required environment variables
        if (!dbConfig.host || !dbConfig.user || !dbConfig.password || !dbConfig.database) {
            throw new Error('Missing required database environment variables: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME');
        }
        
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        console.log('✅ Database connection successful');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.error('   Error code:', error.code);
        console.error('   Error errno:', error.errno);
        console.error('   Error sqlState:', error.sqlState);
        
        // Log configuration (without password)
        console.error('   Configuration check:');
        console.error(`     DB_HOST: ${process.env.DB_HOST ? 'SET' : 'MISSING'}`);
        console.error(`     DB_USER: ${process.env.DB_USER ? 'SET' : 'MISSING'}`);
        console.error(`     DB_PASSWORD: ${process.env.DB_PASSWORD ? 'SET' : 'MISSING'}`);
        console.error(`     DB_NAME: ${process.env.DB_NAME ? 'SET' : 'MISSING'}`);
        console.error(`     DB_PORT: ${process.env.DB_PORT || '3306 (default)'}`);
        
        return false;
    }
}

module.exports = {
    pool,
    initializeDatabase,
    testConnection
};
