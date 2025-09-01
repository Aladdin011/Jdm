"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDatabaseConnected = exports.disconnectDatabase = exports.connectDatabase = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const getDatabaseConfig = () => {
    const config = {
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [__dirname + '/../entities/**/*.ts'],
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV !== 'production',
        extra: {
            connectionLimit: 5,
            queueLimit: 0,
            charset: 'utf8mb4',
            acquireTimeout: 30000,
            timeout: 30000,
        },
        connectTimeoutMS: 30000,
        poolSize: 5
    };
    console.log('🔧 Database Configuration:');
    console.log('   Host:', config.host);
    console.log('   Port:', config.port);
    console.log('   User:', config.username);
    console.log('   Database:', config.database);
    console.log('   Password:', config.password ? '***SET***' : 'NOT SET');
    return config;
};
exports.AppDataSource = new typeorm_1.DataSource(getDatabaseConfig());
const connectDatabase = async () => {
    try {
        if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
            console.warn('⚠️  Database credentials not fully configured');
            console.warn('   Please check your .env file for:');
            console.warn('   - DB_HOST, DB_USER, DB_PASSWORD, DB_NAME');
            console.warn('   Server will continue without database connection');
            return;
        }
        await exports.AppDataSource.initialize();
        console.log('✅ MySQL connected successfully');
        console.log('📊 Database:', process.env.DB_NAME);
        console.log('🌐 Host:', process.env.DB_HOST);
        const queryRunner = exports.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.query('SELECT 1');
        await queryRunner.release();
        console.log('🔍 Database connection test passed');
    }
    catch (error) {
        console.error('❌ MySQL connection error:', error);
        if (error instanceof Error) {
            if (error.message.includes('Access denied')) {
                console.error('\n🔑 Authentication Error:');
                console.error('   Please verify your database credentials:');
                console.error('   - Username:', process.env.DB_USER);
                console.error('   - Password: Check if special characters are properly escaped');
                console.error('   - Database:', process.env.DB_NAME);
                console.error('   - Host:', process.env.DB_HOST);
            }
            else if (error.message.includes('ECONNREFUSED')) {
                console.error('\n🌐 Connection Error:');
                console.error('   Cannot reach database server. Please check:');
                console.error('   - Host/IP address is correct');
                console.error('   - Port 3306 is open');
                console.error('   - Database server is running');
            }
        }
        console.error('\n⚠️  Server will continue without database connection');
        console.error('   Some features may not work properly');
    }
};
exports.connectDatabase = connectDatabase;
const disconnectDatabase = async () => {
    try {
        if (exports.AppDataSource.isInitialized) {
            await exports.AppDataSource.destroy();
            console.log('📴 MySQL connection closed');
        }
    }
    catch (error) {
        console.error('❌ Error closing MySQL connection:', error);
    }
};
exports.disconnectDatabase = disconnectDatabase;
const isDatabaseConnected = () => {
    return exports.AppDataSource.isInitialized;
};
exports.isDatabaseConnected = isDatabaseConnected;
//# sourceMappingURL=database.js.map