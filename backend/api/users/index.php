<?php
require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';

requireAdmin();

$db = getDB();
$result = $db->query("SELECT id, username, role, created_at FROM users ORDER BY id ASC");
$users = [];
while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}
$db->close();

echo json_encode($users);
