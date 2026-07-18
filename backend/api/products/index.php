<?php
require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';

requireAuth();

$db = getDB();
$stmt = $db->query("SELECT id, name, category, price, stock FROM products ORDER BY id ASC");
$products = $stmt->fetchAll();

echo json_encode($products);
