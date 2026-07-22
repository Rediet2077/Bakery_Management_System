<?php
require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';

requireAdmin();

$id = $_GET['id'] ?? null;

if (!$id || !is_numeric($id)) {
    http_response_code(400);
    echo json_encode(['message' => 'Valid sale ID is required.']);
    exit();
}

$db = getDB();

// Check the sale exists
$check = $db->prepare("SELECT id FROM sales WHERE id = ?");
$check->execute([$id]);
if (!$check->fetch()) {
    http_response_code(404);
    echo json_encode(['message' => 'Sale not found.']);
    exit();
}

// sale_items cascade on delete, so just delete the sale
$db->prepare("DELETE FROM sales WHERE id = ?")->execute([$id]);

echo json_encode(['message' => 'Sale deleted successfully.']);
