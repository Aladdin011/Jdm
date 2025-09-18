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

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJsonResponse(['error' => 'Invalid email format'], 400);
}

// Validate password strength
if (strlen($password) < 6) {
    sendJsonResponse(['error' => 'Password must be at least 6 characters long'], 400);
}

try {
    $pdo = getDatabase();
    
    // Check if user already exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    
    if ($stmt->fetch()) {
        sendJsonResponse(['error' => 'User already exists'], 409);
    }
    
    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    
    // Insert new user
    $stmt = $pdo->prepare("
        INSERT INTO users (email, password, role, created_at, updated_at) 
        VALUES (?, ?, 'user', NOW(), NOW())
    ");
    
    $stmt->execute([$email, $hashedPassword]);
    
    $userId = $pdo->lastInsertId();
    
    // Set session
    $_SESSION['user_id'] = $userId;
    $_SESSION['user_email'] = $email;
    $_SESSION['user_role'] = 'user';
    
    sendJsonResponse([
        'success' => true,
        'message' => 'User registered successfully',
        'user' => [
            'id' => $userId,
            'email' => $email,
            'role' => 'user'
        ]
    ], 201);
    
} catch (PDOException $e) {
    error_log("Signup error: " . $e->getMessage());
    sendJsonResponse(['error' => 'Registration failed'], 500);
}
?>
