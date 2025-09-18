<?php
require_once 'config.php';

// API status endpoint
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $pdo = getDatabase();
        
        // Test database connection
        $stmt = $pdo->query("SELECT COUNT(*) as user_count FROM users");
        $result = $stmt->fetch();
        
        sendJsonResponse([
            'status' => 'healthy',
            'message' => 'Builder Aura Field API is running',
            'timestamp' => date('c'),
            'database' => 'connected',
            'users_count' => $result['user_count']
        ]);
    } catch (Exception $e) {
        sendJsonResponse([
            'status' => 'error',
            'message' => 'Database connection failed',
            'timestamp' => date('c')
        ], 500);
    }
} else {
    sendJsonResponse(['error' => 'Method not allowed'], 405);
}
?>
