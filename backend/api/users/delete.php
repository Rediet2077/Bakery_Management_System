<?php
require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';

requireAdmin();

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

// Prevent deleting yourself
if ($id === intval($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(['message' => 'Cannot delete your own account']);
    exit();
}

$db = getDB();

// Cannot delete admin accounts
$stmt = $db->prepare("SELECT role FROM users WHERE id = ?");
$stmt->bind_param('i', $id);
$stmt->execute();
$user = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$user) {
    $db->close();
    http_response_code(404);
    echo json_encode(['message' => 'User not found']);
    exit();
}

if ($user['role'] === 'admin') {
    $db->close();
    http_response_code(403);
    echo json_encode(['message' => 'Cannot delete admin accounts']);
    exit();
}

$stmt = $db->prepare("DELETE FROM users WHERE id = ?");
$stmt->bind_param('i', $id);
$stmt->execute();
$stmt->close();
$db->close();

echo json_encode(['message' => 'User deleted']);
