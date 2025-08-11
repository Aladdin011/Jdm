import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testMysql2Connection() {
  console.log('🔍 Testing MySQL2 direct connection...');
  console.log('📊 Database Config:');
  console.log('   Host:', process.env.DB_HOST);
  console.log('   Port:', process.env.DB_PORT);
  console.log('   User:', process.env.DB_USER);
  console.log('   Database:', process.env.DB_NAME);
  console.log('   Password:', process.env.DB_PASSWORD ? '***hidden***' : 'NOT SET');

  let connection;

  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: false,
      timeout: 30000,
      charset: 'utf8mb4'
    });

    console.log('✅ Connection established successfully!');

    // Test basic query
    const [rows] = await connection.execute('SELECT 1 as test, NOW() as current_time');
    console.log('✅ Test query result:', rows);

    // Show database info
    const [dbInfo] = await connection.execute('SELECT DATABASE() as current_db, VERSION() as version, USER() as user');
    console.log('ℹ️  Database info:', dbInfo);

    // Show tables
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('📋 Current tables:');
    tables.forEach((table: any) => {
      console.log('   -', Object.values(table)[0]);
    });

    console.log('\n✅ MySQL2 connection test successful!');
    
  } catch (error) {
    console.error('\n❌ MySQL2 connection test failed:');
    console.error('Error:', error);
    
    if (error instanceof Error) {
      console.error('Message:', error.message);
      console.error('Code:', (error as any).code);
      console.error('Errno:', (error as any).errno);
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Connection closed');
    }
    process.exit(0);
  }
}

// Run the test
testMysql2Connection();
