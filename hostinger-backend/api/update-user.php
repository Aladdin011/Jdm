<?php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    sendJsonResponse(['error' => 'Method not allowed'], 405);
}

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    sendJsonResponse(['error' => 'Not authenticated'], 401);
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    sendJsonResponse(['error' => 'Invalid JSON input'], 400);
}

try {
    $pdo = getDatabase();
    
    // Build dynamic update query
    $updateFields = [];
    $params = [];
    
    // Allowed fields to update
    $allowedFields = ['email', 'password', 'department'];
    
    foreach ($allowedFields as $field) {
        if (isset($input[$field]) && !empty(trim($input[$field]))) {
            if ($field === 'email') {
                $email = sanitizeInput($input[$field]);
                if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    sendJsonResponse(['error' => 'Invalid email format'], 400);
                }
                
                // Check if email already exists for another user
                $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
                $stmt->execute([$email, $_SESSION['user_id']]);
                if ($stmt->fetch()) {
                    sendJsonResponse(['error' => 'Email already exists'], 409);
                }
                
                $updateFields[] = "email = ?";
                $params[] = $email;
                $_SESSION['user_email'] = $email;
                
            } elseif ($field === 'password') {
                $password = $input[$field];
                if (strlen($password) < 6) {
                    sendJsonResponse(['error' => 'Password must be at least 6 characters long'], 400);
                }
                
                $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
                $updateFields[] = "password = ?";
                $params[] = $hashedPassword;
                
            } elseif ($field === 'department') {
                $department = sanitizeInput($input[$field]);
                $updateFields[] = "department = ?";
                $params[] = $department;
                $_SESSION['user_department'] = $department;
            }
        }
    }
    
    if (empty($updateFields)) {
        sendJsonResponse(['error' => 'No valid fields to update'], 400);
    }
    
    // Add updated_at timestamp
    $updateFields[] = "updated_at = NOW()";
    $params[] = $_SESSION['user_id'];
    
    // Execute update
    $sql = "UPDATE users SET " . implode(', ', $updateFields) . " WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    if ($stmt->rowCount() === 0) {
        sendJsonResponse(['error' => 'No changes made or user not found'], 404);
    }
    
    // Get updated user data
    $stmt = $pdo->prepare("
        SELECT id, email, role, department, department_code, updated_at 
        FROM users 
        WHERE id = ?
    ");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch();
    
    sendJsonResponse([
        'success' => true,
        'message' => 'User updated successfully',
        'user' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role'],
            'department' => $user['department'],
            'department_code' => $user['department_code'],
            'updated_at' => $user['updated_at']
        ]
    ]);
    
} catch (PDOException $e) {
    error_log("Update user error: " . $e->getMessage());
    sendJsonResponse(['error' => 'Update failed'], 500);
}
?>
