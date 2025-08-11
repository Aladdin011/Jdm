import dotenv from 'dotenv';
import { connectDatabase, AppDataSource, disconnectDatabase } from '../config/database';

// Load environment variables
dotenv.config();

async function testDatabaseConnection() {
  console.log('🔍 Testing MySQL database connection...');
  console.log('📊 Database Config:');
  console.log('   Host:', process.env.DB_HOST);
  console.log('   Port:', process.env.DB_PORT);
  console.log('   User:', process.env.DB_USER);
  console.log('   Database:', process.env.DB_NAME);

  try {
    // Connect to database
    await connectDatabase();

    // Test basic query
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    
    console.log('\n🔍 Running test queries...');
    
    // Test connection
    const result = await queryRunner.query('SELECT 1 as test');
    console.log('✅ Basic query test:', result);

    // Show tables
    const tables = await queryRunner.query('SHOW TABLES');
    console.log('📋 Current tables:', tables);

    // Show database info
    const dbInfo = await queryRunner.query('SELECT DATABASE() as current_db, VERSION() as version');
    console.log('ℹ️  Database info:', dbInfo);

    await queryRunner.release();

    console.log('\n✅ Database connection test successful!');
    
  } catch (error) {
    console.error('\n❌ Database connection test failed:');
    console.error(error);
  } finally {
    await disconnectDatabase();
    process.exit(0);
  }
}

// Run the test
testDatabaseConnection();
