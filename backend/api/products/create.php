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

$data = json_decode(file_get_contents('php://input'), true);
$name     = trim($data['name'] ?? '');
$category = trim($data['category'] ?? '');
$price    = floatval($data['price'] ?? 0);
$stock    = intval($data['stock'] ?? 0);

if (!$name || !$category || $price <= 0 || $stock < 0) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid product data']);
    exit();
}

$db = getDB();
$stmt = $db->prepare("INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?)");
$stmt->bind_param('ssdi', $name, $category, $price, $stock);
$stmt->execute();
$id = $db->insert_id;
$stmt->close();
$db->close();

http_response_code(201);
echo json_encode(['message' => 'Product created', 'id' => $id]);
