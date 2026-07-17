<?php
require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';

requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
    exit();
}

$id = intval($_GET['id'] ?? 0);
if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid product ID']);
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
$stmt = $db->prepare("UPDATE products SET name=?, category=?, price=?, stock=? WHERE id=?");
$stmt->bind_param('ssdii', $name, $category, $price, $stock, $id);
$stmt->execute();
$affected = $stmt->affected_rows;
$stmt->close();
$db->close();

if ($affected === 0) {
    http_response_code(404);
    echo json_encode(['message' => 'Product not found']);
    exit();
}

echo json_encode(['message' => 'Product updated']);
