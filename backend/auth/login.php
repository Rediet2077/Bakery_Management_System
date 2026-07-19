<?php
require_once __DIR__ . '/../middleware/cors.php';
require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';

if (!$username || !$password) {
    http_response_code(400);
    echo json_encode(['message' => 'Username and password are required']);
    exit();
}

$db = getDB();
$stmt = $db->prepare("SELECT id, username, password, role FROM users WHERE username = ?");
$stmt->execute([$username]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode(['message' => 'Invalid username or password']);
    exit();
}

// Generate a simple signed token: base64(payload).base64(signature)
$secret = getenv('JWT_SECRET') ?: 'bakery_secret_key_2024';
$payload = base64_encode(json_encode([
    'id'       => $user['id'],
    'username' => $user['username'],
    'role'     => $user['role'],
    'exp'      => time() + 86400 // 24 hours
]));
$sig = base64_encode(hash_hmac('sha256', $payload, $secret, true));
$token = $payload . '.' . $sig;

echo json_encode([
    'message' => 'Login successful',
    'token'   => $token,
    'user'    => [
        'id'       => $user['id'],
        'username' => $user['username'],
        'role'     => $user['role'],
    ]
]);
