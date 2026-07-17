<?php
require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';

requireAdmin();

$id = intval($_GET['id'] ?? 0);
if ($id <= 0) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid sale ID']);
    exit();
}

$db = getDB();

// Get sale
$stmt = $db->prepare(
    "SELECT s.id, s.total_amount, s.received, s.change_given, s.created_at,
            u.username AS cashier_name
     FROM sales s
     JOIN users u ON s.cashier_id = u.id
     WHERE s.id = ?"
);
$stmt->bind_param('i', $id);
$stmt->execute();
$sale = $stmt->get_result()->fetch_assoc();
$stmt->close();

if (!$sale) {
    http_response_code(404);
    echo json_encode(['message' => 'Sale not found']);
    $db->close();
    exit();
}

// Get items
$stmt = $db->prepare(
    "SELECT si.quantity, si.price, p.name AS product_name
     FROM sale_items si
     JOIN products p ON si.product_id = p.id
     WHERE si.sale_id = ?"
);
$stmt->bind_param('i', $id);
$stmt->execute();
$result = $stmt->get_result();
$items = [];
while ($row = $result->fetch_assoc()) {
    $items[] = $row;
}
$stmt->close();
$db->close();

$sale['items'] = $items;
echo json_encode($sale);
