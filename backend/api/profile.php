<?php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendJsonResponse(['error' => 'Method not allowed'], 405);
}

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    sendJsonResponse(['error' => 'Not authenticated'], 401);
}

try {
    $pdo = getDatabase();
    
    // Get user profile
    $stmt = $pdo->prepare("
        SELECT id, email, role, department, department_code, created_at, updated_at 
        FROM users 
        WHERE id = ?
    ");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch();
    
    if (!$user) {
        sendJsonResponse(['error' => 'User not found'], 404);
    }
    
    sendJsonResponse([
        'success' => true,
        'user' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role'],
            'department' => $user['department'],
            'department_code' => $user['department_code'],
            'created_at' => $user['created_at'],
            'updated_at' => $user['updated_at']
        ]
    ]);
    
} catch (PDOException $e) {
    error_log("Profile error: " . $e->getMessage());
    sendJsonResponse(['error' => 'Failed to fetch profile'], 500);
}
?>
