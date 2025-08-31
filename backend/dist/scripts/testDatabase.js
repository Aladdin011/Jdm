"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("../config/database");
dotenv_1.default.config();
async function testDatabaseConnection() {
    console.log('🔍 Testing MySQL database connection...');
    console.log('📊 Database Config:');
    console.log('   Host:', process.env.DB_HOST);
    console.log('   Port:', process.env.DB_PORT);
    console.log('   User:', process.env.DB_USER);
    console.log('   Database:', process.env.DB_NAME);
    try {
        await (0, database_1.connectDatabase)();
        const queryRunner = database_1.AppDataSource.createQueryRunner();
        await queryRunner.connect();
        console.log('\n🔍 Running test queries...');
        const result = await queryRunner.query('SELECT 1 as test');
        console.log('✅ Basic query test:', result);
        const tables = await queryRunner.query('SHOW TABLES');
        console.log('📋 Current tables:', tables);
        const dbInfo = await queryRunner.query('SELECT DATABASE() as current_db, VERSION() as version');
        console.log('ℹ️  Database info:', dbInfo);
        await queryRunner.release();
        console.log('\n✅ Database connection test successful!');
    }
    catch (error) {
        console.error('\n❌ Database connection test failed:');
        console.error(error);
    }
    finally {
        await (0, database_1.disconnectDatabase)();
        process.exit(0);
    }
}
testDatabaseConnection();
//# sourceMappingURL=testDatabase.js.map