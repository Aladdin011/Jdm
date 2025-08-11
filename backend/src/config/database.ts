import { DataSource } from 'typeorm';

// Database configuration with proper error handling
const getDatabaseConfig = () => {
  const config = {
    type: 'mysql' as const,
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
      acquireTimeout: 30000,
      reconnect: true,
      charset: 'utf8mb4'
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

export const AppDataSource = new DataSource(getDatabaseConfig());

export const connectDatabase = async () => {
  try {
    if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
      console.warn('⚠️  Database credentials not fully configured');
      console.warn('   Please check your .env file for:');
      console.warn('   - DB_HOST, DB_USER, DB_PASSWORD, DB_NAME');
      console.warn('   Server will continue without database connection');
      return;
    }

    await AppDataSource.initialize();
    console.log('✅ MySQL connected successfully');
    console.log('📊 Database:', process.env.DB_NAME);
    console.log('🌐 Host:', process.env.DB_HOST);
    
    // Test the connection
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.query('SELECT 1');
    await queryRunner.release();
    
    console.log('🔍 Database connection test passed');
    
  } catch (error) {
    console.error('❌ MySQL connection error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Access denied')) {
        console.error('\n🔑 Authentication Error:');
        console.error('   Please verify your database credentials:');
        console.error('   - Username:', process.env.DB_USER);
        console.error('   - Password: Check if special characters are properly escaped');
        console.error('   - Database:', process.env.DB_NAME);
        console.error('   - Host:', process.env.DB_HOST);
      } else if (error.message.includes('ECONNREFUSED')) {
        console.error('\n🌐 Connection Error:');
        console.error('   Cannot reach database server. Please check:');
        console.error('   - Host/IP address is correct');
        console.error('   - Port 3306 is open');
        console.error('   - Database server is running');
      }
    }
    
    console.error('\n⚠️  Server will continue without database connection');
    console.error('   Some features may not work properly');
    // Don't exit the process, continue without database
  }
};

export const disconnectDatabase = async () => {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('📴 MySQL connection closed');
    }
  } catch (error) {
    console.error('❌ Error closing MySQL connection:', error);
  }
};

export const isDatabaseConnected = (): boolean => {
  return AppDataSource.isInitialized;
};
