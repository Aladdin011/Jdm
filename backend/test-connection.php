<?php
// Test database connection and create tables
require_once 'config.php';

echo "<h2>Database Connection Test</h2>\n";

try {
    $pdo = getDatabase();
    echo "<p style='color: green;'>✅ Database connection successful!</p>\n";
    
    // Test basic query
    $stmt = $pdo->query("SELECT VERSION() as version");
    $result = $stmt->fetch();
    echo "<p>MySQL Version: " . $result['version'] . "</p>\n";
    
    // Check if users table exists
    $stmt = $pdo->query("SHOW TABLES LIKE 'users'");
    $tableExists = $stmt->fetch();
    
    if ($tableExists) {
        echo "<p style='color: green;'>✅ Users table exists</p>\n";
        
        // Count users
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
        $result = $stmt->fetch();
        echo "<p>Total users: " . $result['count'] . "</p>\n";
        
        // Show sample users
        $stmt = $pdo->query("SELECT email, role, department FROM users LIMIT 5");
        echo "<h3>Sample Users:</h3>\n<ul>\n";
        while ($user = $stmt->fetch()) {
            echo "<li>" . $user['email'] . " - " . $user['role'] . " (" . $user['department'] . ")</li>\n";
        }
        echo "</ul>\n";
        
    } else {
        echo "<p style='color: orange;'>⚠️ Users table does not exist. Creating now...</p>\n";
        
        // Create users table
        $createTable = "
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'user',
            department VARCHAR(100),
            department_code VARCHAR(6) UNIQUE,
            code_expires_at TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )";
        
        $pdo->exec($createTable);
        echo "<p style='color: green;'>✅ Users table created successfully!</p>\n";
        
        // Create indexes
        $pdo->exec("CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)");
        $pdo->exec("CREATE INDEX IF NOT EXISTS idx_users_department_code ON users(department_code)");
        echo "<p style='color: green;'>✅ Indexes created successfully!</p>\n";
        
        // Insert seed data
        $seedData = "
        INSERT IGNORE INTO users (email, password, role, department, department_code, code_expires_at) VALUES
        ('admin@jdmarcng.com', '$2b$10$d.4kvqgVMjDV3yKTTL.gz.mLpzROing/efQVO8OW7YWUSBgMOaQVm', 'admin', 'Admin', 'SA1234', DATE_ADD(NOW(), INTERVAL 7 DAY)),
        ('accounts@jdmarcng.com', '$2b$10$lJtxM7On6F0F2.sa7EnbYOin.R7ITdy58a8RzBEQyFni9JklEI8I6', 'staff', 'Accounts', 'AC5930', DATE_ADD(NOW(), INTERVAL 7 DAY)),
        ('accounting@jdmarcng.com', '$2b$10$r/SSRElWw33aBJxlWQJXx.ocPMS90fVDLzLbIW1cOXQFAZzrhXj3e', 'staff', 'Accounting', 'AC1702', DATE_ADD(NOW(), INTERVAL 7 DAY)),
        ('busadmin@jdmarcng.com', '$2b$10$JR.2dhzqb.OeW0BxvppszOr7nYopEhmac5F/JLMDlibkS3GFEm7bq', 'staff', 'Business Administration', 'BA4268', DATE_ADD(NOW(), INTERVAL 7 DAY)),
        ('busdev@jdmarcng.com', '$2b$10$GILrGZfWVcDlAhLbdwmyi.h.hFTXebEwgl04E00UYzwPBTvog52lq', 'staff', 'Business Development', 'BD3127', DATE_ADD(NOW(), INTERVAL 7 DAY)),
        ('marketing@jdmarcng.com', '$2b$10$XAg0X.q.7hCXNyhU0ATxau12J4SyGA9R9cms/6sP4PNALdvhFIDby', 'staff', 'Digital Marketing', 'DM7582', DATE_ADD(NOW(), INTERVAL 7 DAY)),
        ('hr@jdmarcng.com', '$2b$10$WA8gABnX/L8IvtCzam4B4OG/I7J9NQ427YnHOop5nOTtRU2CWdHi2', 'staff', 'HR', 'HR6049', DATE_ADD(NOW(), INTERVAL 7 DAY)),
        ('projects@jdmarcng.com', '$2b$10$rgW0BtoiLt8VtpEYnkgBa.TTZRwrbPhL3MGs5fDpbke8VZhz7ZtEy', 'staff', 'Projects', 'PM1856', DATE_ADD(NOW(), INTERVAL 7 DAY)),
        ('secretariat@jdmarcng.com', '$2b$10$RsrM9lSckK5ZgbNKPOXZTeMP/q/pvmvF3wbXdlpQFSHktGsHmdAdW', 'staff', 'Secretariat', 'SA9273', DATE_ADD(NOW(), INTERVAL 7 DAY)),
        ('general@jdmarcng.com', '$2b$10$.HZjNMzXODGXk7dWZcw.N.tpfUwf8w5qAN1d4EN1vOlZf6qH3TJg.', 'user', 'General Users', NULL, NULL)";
        
        $pdo->exec($seedData);
        echo "<p style='color: green;'>✅ Seed data inserted successfully!</p>\n";
        
        // Count users again
        $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
        $result = $stmt->fetch();
        echo "<p>Total users after seeding: " . $result['count'] . "</p>\n";
    }
    
    // Test a sample update operation
    echo "<h3>Testing Update Operations:</h3>\n";
    
    // Update admin user's updated_at timestamp
    $stmt = $pdo->prepare("UPDATE users SET updated_at = NOW() WHERE email = ?");
    $stmt->execute(['admin@jdmarcng.com']);
    
    if ($stmt->rowCount() > 0) {
        echo "<p style='color: green;'>✅ Update operation successful!</p>\n";
    } else {
        echo "<p style='color: red;'>❌ Update operation failed or no rows affected</p>\n";
    }
    
    // Test insert operation
    $testEmail = 'test_' . time() . '@jdmarcng.com';
    $stmt = $pdo->prepare("INSERT INTO users (email, password, role) VALUES (?, ?, ?)");
    $stmt->execute([$testEmail, password_hash('test123', PASSWORD_DEFAULT), 'test']);
    
    if ($stmt->rowCount() > 0) {
        echo "<p style='color: green;'>✅ Insert operation successful!</p>\n";
        
        // Clean up test user
        $stmt = $pdo->prepare("DELETE FROM users WHERE email = ?");
        $stmt->execute([$testEmail]);
        echo "<p>Test user cleaned up</p>\n";
    } else {
        echo "<p style='color: red;'>❌ Insert operation failed</p>\n";
    }
    
} catch (PDOException $e) {
    echo "<p style='color: red;'>❌ Database error: " . $e->getMessage() . "</p>\n";
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ General error: " . $e->getMessage() . "</p>\n";
}

echo "<hr>\n<p><strong>Test completed at: " . date('Y-m-d H:i:s') . "</strong></p>\n";
?>
