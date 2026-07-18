<?php
require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';

requireAdmin();

$db = getDB();

$from = $_GET['from'] ?? null;
$to   = $_GET['to'] ?? null;

$sql = "SELECT s.id, s.total_amount, s.received, s.change_given, s.created_at,
               u.username AS cashier_name
        FROM sales s
        JOIN users u ON s.cashier_id = u.id";

$conditions = [];
$params = [];

if ($from) {
    $conditions[] = "DATE(s.created_at) >= ?";
    $params[] = $from;
}
if ($to) {
    $conditions[] = "DATE(s.created_at) <= ?";
    $params[] = $to;
}

if (!empty($conditions)) {
    $sql .= ' WHERE ' . implode(' AND ', $conditions);
}

$sql .= " ORDER BY s.created_at DESC";

$stmt = $db->prepare($sql);
$stmt->execute($params);
$sales = $stmt->fetchAll();

echo json_encode($sales);
