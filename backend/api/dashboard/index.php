<?php
require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';

requireAdmin();

$db = getDB();

// Get low stock threshold from query param (defaults to 10)
$threshold = isset($_GET['threshold']) && is_numeric($_GET['threshold']) ? intval($_GET['threshold']) : 10;

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

// Use dynamic threshold
$stmt = $db->prepare("SELECT id, name, stock FROM products WHERE stock <= ? ORDER BY stock ASC");
$stmt->execute([$threshold]);
$lowStock = $stmt->fetchAll();

// Total products and users
$totalProducts = $db->query("SELECT COUNT(*) FROM products")->fetchColumn();
$totalUsers    = $db->query("SELECT COUNT(*) FROM users WHERE role = 'cashier'")->fetchColumn();

// Fill all 7 days with zero revenue for missing days
$stmt = $db->query("SELECT DATE(created_at) AS date, DATE_FORMAT(created_at, '%a') AS day, COALESCE(SUM(total_amount), 0) AS revenue FROM sales WHERE created_at >= CURDATE() - INTERVAL 6 DAY GROUP BY DATE(created_at), day");
$salesByDate = [];
foreach ($stmt->fetchAll() as $row) {
    $salesByDate[$row['date']] = ['day' => $row['day'], 'revenue' => floatval($row['revenue'])];
}

// Fill missing days with zeros
$chart = [];
for ($i = 6; $i >= 0; $i--) {
    $date = date('Y-m-d', strtotime("-$i days"));
    $dayName = date('D', strtotime($date));
    $chart[] = [
        'day' => $dayName,
        'revenue' => isset($salesByDate[$date]) ? $salesByDate[$date]['revenue'] : 0
    ];
}

echo json_encode([
    'stats' => [
        'today_revenue'   => floatval($today['revenue']),
        'today_sales'     => intval($today['count']),
        'revenue_change'  => $revChange,
        'sales_change'    => $salesChange,
        'total_products'  => intval($totalProducts),
        'total_cashiers'  => intval($totalUsers),
    ],
    'low_stock' => $lowStock,
    'chart'     => $chart,
]);
