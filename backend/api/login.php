<?php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(['error' => 'Method not allowed'], 405);
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    sendJsonResponse(['error' => 'Invalid JSON input'], 400);
}

// Validate required fields
$errors = validateInput($input, ['email', 'password']);
if (!empty($errors)) {
    sendJsonResponse(['error' => 'Validation failed', 'details' => $errors], 400);
}

$email = sanitizeInput($input['email']);
$password = $input['password'];
$departmentCode = isset($input['departmentCode']) ? sanitizeInput($input['departmentCode']) : null;

try {
    $pdo = getDatabase();
    
    // Get user by email
    $stmt = $pdo->prepare("
        SELECT id, email, password, role, department, department_code, code_expires_at 
        FROM users 
        WHERE email = ?
    ");
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    
    if (!$user) {
        sendJsonResponse(['error' => 'Invalid credentials'], 401);
    }
    
    // Verify password
    if (!password_verify($password, $user['password'])) {
        sendJsonResponse(['error' => 'Invalid credentials'], 401);
    }
    
    // Check department code if provided
    if ($departmentCode && $user['department_code']) {
        if ($user['department_code'] !== $departmentCode) {
            sendJsonResponse(['error' => 'Invalid department code'], 401);
        }
        
        // Check if code has expired
        if ($user['code_expires_at'] && strtotime($user['code_expires_at']) < time()) {
            sendJsonResponse(['error' => 'Department code has expired'], 401);
        }
    }
    
    // Update last login timestamp
    $updateStmt = $pdo->prepare("UPDATE users SET updated_at = NOW() WHERE id = ?");
    $updateStmt->execute([$user['id']]);
    
    // Set session
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_role'] = $user['role'];
    $_SESSION['user_department'] = $user['department'];
    
    sendJsonResponse([
        'success' => true,
        'message' => 'Login successful',
        'user' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role'],
            'department' => $user['department'],
            'department_code' => $user['department_code']
        ]
    ]);
    
} catch (PDOException $e) {
    error_log("Login error: " . $e->getMessage());
    sendJsonResponse(['error' => 'Login failed'], 500);
}
?>
