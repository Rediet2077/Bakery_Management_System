<?php
require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';

requireAdmin();

$db = getDB();

// Today's revenue & sales count
$stmt = $db->prepare(
    "SELECT COALESCE(SUM(total_amount), 0) AS revenue, COUNT(*) AS count
     FROM sales WHERE DATE(created_at) = CURDATE()"
);
$stmt->execute();
$today = $stmt->get_result()->fetch_assoc();
$stmt->close();

// Yesterday's revenue & sales count
$stmt = $db->prepare(
    "SELECT COALESCE(SUM(total_amount), 0) AS revenue, COUNT(*) AS count
     FROM sales WHERE DATE(created_at) = CURDATE() - INTERVAL 1 DAY"
);
$stmt->execute();
$yesterday = $stmt->get_result()->fetch_assoc();
$stmt->close();

// Revenue change %
$revChange = 0;
if ($yesterday['revenue'] > 0) {
    $revChange = round((($today['revenue'] - $yesterday['revenue']) / $yesterday['revenue']) * 100, 1);
}

$salesChange = 0;
if ($yesterday['count'] > 0) {
    $salesChange = round((($today['count'] - $yesterday['count']) / $yesterday['count']) * 100, 1);
}

// Low stock (stock <= 10)
$result = $db->query("SELECT id, name, stock FROM products WHERE stock <= 10 ORDER BY stock ASC");
$lowStock = [];
while ($row = $result->fetch_assoc()) {
    $lowStock[] = $row;
}

// Weekly chart (last 7 days)
$result = $db->query(
    "SELECT DATE_FORMAT(created_at, '%a') AS day,
            COALESCE(SUM(total_amount), 0) AS revenue
     FROM sales
     WHERE created_at >= CURDATE() - INTERVAL 6 DAY
     GROUP BY DATE(created_at), day
     ORDER BY DATE(created_at) ASC"
);
$chart = [];
while ($row = $result->fetch_assoc()) {
    $chart[] = ['day' => $row['day'], 'revenue' => floatval($row['revenue'])];
}

$db->close();

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
