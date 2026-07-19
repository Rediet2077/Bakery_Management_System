<?php
require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';

$authUser = requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
    exit();
}

$id = intval($_GET['id'] ?? 0);
if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid user ID']);
    exit();
}

if ($id === intval($authUser['id'])) {
    http_response_code(403);
    echo json_encode(['message' => 'Cannot delete your own account']);
    exit();
}

$db = getDB();
$stmt = $db->prepare("SELECT role FROM users WHERE id = ?");
$stmt->execute([$id]);
$user = $stmt->fetch();

if (!$user) {
    http_response_code(404);
    echo json_encode(['message' => 'User not found']);
    exit();
}

if ($user['role'] === 'admin') {
    http_response_code(403);
    echo json_encode(['message' => 'Cannot delete admin accounts']);
    exit();
}

$stmt = $db->prepare("DELETE FROM users WHERE id = ?");
$stmt->execute([$id]);

echo json_encode(['message' => 'User deleted']);
