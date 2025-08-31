"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
        connection = await promise_1.default.createConnection({
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '3306'),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            connectTimeout: 30000,
            charset: 'utf8mb4'
        });
        console.log('✅ Connection established successfully!');
        const [rows] = await connection.execute('SELECT 1 as test, NOW() as current_time');
        console.log('✅ Test query result:', rows);
        const [dbInfo] = await connection.execute('SELECT DATABASE() as current_db, VERSION() as version, USER() as user');
        console.log('ℹ️  Database info:', dbInfo);
        const [tablesResult] = await connection.execute('SHOW TABLES');
        const tables = tablesResult;
        console.log('📋 Current tables:');
        if (Array.isArray(tables)) {
            tables.forEach((table) => {
                console.log('   -', Object.values(table)[0]);
            });
        }
        else {
            console.log('   No tables found or unable to list tables');
        }
        console.log('\n✅ MySQL2 connection test successful!');
    }
    catch (error) {
        console.error('\n❌ MySQL2 connection test failed:');
        console.error('Error:', error);
        if (error instanceof Error) {
            console.error('Message:', error.message);
            console.error('Code:', error.code);
            console.error('Errno:', error.errno);
        }
    }
    finally {
        if (connection) {
            await connection.end();
            console.log('🔌 Connection closed');
        }
        process.exit(0);
    }
}
testMysql2Connection();
//# sourceMappingURL=testMysql2.js.map