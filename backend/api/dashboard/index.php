<?php
require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';

requireAdmin();

$db = getDB();

$stmt = $db->query("SELECT COALESCE(SUM(total_amount), 0) AS revenue, COUNT(*) AS count FROM sales WHERE DATE(created_at) = CURDATE()");
$today = $stmt->fetch();

$stmt = $db->query("SELECT COALESCE(SUM(total_amount), 0) AS revenue, COUNT(*) AS count FROM sales WHERE DATE(created_at) = CURDATE() - INTERVAL 1 DAY");
$yesterday = $stmt->fetch();

$revChange = 0;
if ($yesterday['revenue'] > 0) {
    $revChange = round((($today['revenue'] - $yesterday['revenue']) / $yesterday['revenue']) * 100, 1);
}

$salesChange = 0;
if ($yesterday['count'] > 0) {
    $salesChange = round((($today['count'] - $yesterday['count']) / $yesterday['count']) * 100, 1);
}

$stmt = $db->query("SELECT id, name, stock FROM products WHERE stock <= 10 ORDER BY stock ASC");
$lowStock = $stmt->fetchAll();

$stmt = $db->query("SELECT DATE_FORMAT(created_at, '%a') AS day, COALESCE(SUM(total_amount), 0) AS revenue FROM sales WHERE created_at >= CURDATE() - INTERVAL 6 DAY GROUP BY DATE(created_at), day ORDER BY DATE(created_at) ASC");
$chart = [];
foreach ($stmt->fetchAll() as $row) {
    $chart[] = ['day' => $row['day'], 'revenue' => floatval($row['revenue'])];
}

echo json_encode([
    'stats' => [
        'today_revenue'  => floatval($today['revenue']),
        'today_sales'    => intval($today['count']),
        'revenue_change' => $revChange,
        'sales_change'   => $salesChange,
    ],
    'low_stock' => $lowStock,
    'chart'     => $chart,
]);
