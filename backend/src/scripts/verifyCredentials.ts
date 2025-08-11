import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

function verifyDatabaseCredentials() {
  console.log('🔍 Database Credentials Verification');
  console.log('=====================================\n');

  const credentials = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  };

  console.log('Current Configuration:');
  console.log('----------------------');
  console.log('Host:', credentials.host || '❌ NOT SET');
  console.log('Port:', credentials.port || '❌ NOT SET');
  console.log('User:', credentials.user || '❌ NOT SET');
  console.log('Password:', credentials.password ? '✅ SET (length: ' + credentials.password.length + ')' : '❌ NOT SET');
  console.log('Database:', credentials.database || '❌ NOT SET');

  console.log('\nCredential Analysis:');
  console.log('-------------------');

  if (credentials.password) {
    console.log('Password contains:');
    console.log('  - Length:', credentials.password.length);
    console.log('  - Special chars:', /[!@#$%^&*(),.?":{}|<>]/.test(credentials.password) ? '✅ Yes' : '❌ No');
    console.log('  - Numbers:', /\d/.test(credentials.password) ? '✅ Yes' : '❌ No');
    console.log('  - Uppercase:', /[A-Z]/.test(credentials.password) ? '✅ Yes' : '❌ No');
    console.log('  - Lowercase:', /[a-z]/.test(credentials.password) ? '✅ Yes' : '❌ No');
    
    // Check for common problematic characters
    const problematicChars = ['&gt;', '&lt;', '&amp;', '"', "'"];
    const foundProblematic = problematicChars.filter(char => credentials.password!.includes(char));
    
    if (foundProblematic.length > 0) {
      console.log('  - HTML entities found:', foundProblematic.join(', '));
      console.log('    Consider URL decoding or escaping these characters');
    }
  }

  console.log('\nRecommended Actions:');
  console.log('-------------------');
  
  if (!credentials.host) {
    console.log('❌ Set DB_HOST in your .env file');
  }
  
  if (!credentials.user) {
    console.log('❌ Set DB_USER in your .env file');
  }
  
  if (!credentials.password) {
    console.log('❌ Set DB_PASSWORD in your .env file');
  } else if (credentials.password.includes('&gt;')) {
    console.log('⚠️  Password contains HTML entity &gt; - try replacing with >');
  }
  
  if (!credentials.database) {
    console.log('❌ Set DB_NAME in your .env file');
  }

  console.log('\nExample .env configuration:');
  console.log('---------------------------');
  console.log('DB_HOST=srv1847.hstgr.io');
  console.log('DB_PORT=3306');
  console.log('DB_USER=u158969833_Jdm1');
  console.log('DB_PASSWORD=KL98@nEC6>i  # Make sure special characters are correct');
  console.log('DB_NAME=u158969833_jdb1');

  console.log('\nIf issues persist:');
  console.log('------------------');
  console.log('1. Login to Hostinger control panel');
  console.log('2. Navigate to Databases > MySQL');
  console.log('3. Verify the exact credentials');
  console.log('4. Consider resetting the database password');
  console.log('5. Check if your IP is whitelisted (if required)');
}

verifyCredentials();
