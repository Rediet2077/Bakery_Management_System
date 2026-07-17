<?php
require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';

requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
    exit();
}

$data     = json_decode(file_get_contents('php://input'), true);
$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';
$role     = $data['role'] ?? 'cashier';

if (!$username || strlen($password) < 6) {
    http_response_code(400);
    echo json_encode(['message' => 'Username required and password must be at least 6 characters']);
    exit();
}

if (!in_array($role, ['admin', 'cashier'])) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid role']);
    exit();
}

$db = getDB();

// Check username exists
$stmt = $db->prepare("SELECT id FROM users WHERE username = ?");
$stmt->bind_param('s', $username);
$stmt->execute();
$exists = $stmt->get_result()->num_rows > 0;
$stmt->close();

if ($exists) {
    $db->close();
    http_response_code(409);
    echo json_encode(['message' => 'Username already exists']);
    exit();
}

$hash = password_hash($password, PASSWORD_BCRYPT);
$stmt = $db->prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)");
$stmt->bind_param('sss', $username, $hash, $role);
$stmt->execute();
$id = $db->insert_id;
$stmt->close();
$db->close();

http_response_code(201);
echo json_encode(['message' => 'User created', 'id' => $id]);
