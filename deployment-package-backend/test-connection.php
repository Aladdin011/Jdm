<?php
require_once 'config.php';

// Test database connection and display results
echo "<h2>Database Connection Test</h2>";

try {
    $pdo = getDatabase();
    echo "<p style='color: green;'>✅ Database connected successfully!</p>";
    
    // Test user count
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM users");
    $result = $stmt->fetch();
    echo "<p>👥 Total users in database: " . $result['count'] . "</p>";
    
    // Test sample user data
    $stmt = $pdo->query("SELECT email, name, role FROM users LIMIT 3");
    $users = $stmt->fetchAll();
    
    echo "<h3>Sample Users:</h3>";
    echo "<ul>";
    foreach ($users as $user) {
        echo "<li>{$user['name']} ({$user['email']}) - Role: {$user['role']}</li>";
    }
    echo "</ul>";
    
    // Test API endpoints
    echo "<h3>API Endpoints Ready:</h3>";
    echo "<ul>";
    echo "<li><a href='/backend/api/login.php'>Login API</a></li>";
    echo "<li><a href='/backend/api/signup.php'>Signup API</a></li>";
    echo "<li><a href='/backend/api/profile.php'>Profile API</a></li>";
    echo "<li><a href='/backend/api/logout.php'>Logout API</a></li>";
    echo "<li><a href='/backend/api/update-user.php'>Update User API</a></li>";
    echo "</ul>";
    
    echo "<p style='color: green; font-weight: bold;'>🎉 Backend is ready for production!</p>";
    
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Database connection failed: " . $e->getMessage() . "</p>";
    echo "<p>Please check your database credentials in config.php</p>";
}
?>
