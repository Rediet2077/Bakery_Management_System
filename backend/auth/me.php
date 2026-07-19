<?php
require_once __DIR__ . '/../middleware/cors.php';
require_once __DIR__ . '/../middleware/auth.php';

$user = requireAuth();

echo json_encode([
    'id'       => $user['id'],
    'username' => $user['username'],
    'role'     => $user['role'],
]);
