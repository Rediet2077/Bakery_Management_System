<?php
require_once __DIR__ . '/../../middleware/cors.php';
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/database.php';

requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
    exit();
}

$data      = json_decode(file_get_contents('php://input'), true);
$cashierId = intval($data['cashier_id'] ?? 0);
$items     = $data['items'] ?? [];
$received  = floatval($data['received'] ?? 0);

if (!$cashierId || empty($items) || $received <= 0) {
    http_response_code(400);
    echo json_encode(['message' => 'Invalid sale data']);
    exit();
}

$db = getDB();
$db->beginTransaction();

try {
    $total = 0;
    $productData = [];

    foreach ($items as $item) {
        $pid = intval($item['product_id']);
        $qty = intval($item['quantity']);
        if ($pid <= 0 || $qty <= 0) throw new Exception('Invalid item data');

        $stmt = $db->prepare("SELECT id, price, stock FROM products WHERE id = ? FOR UPDATE");
        $stmt->execute([$pid]);
        $res = $stmt->fetch();

        if (!$res) throw new Exception("Product ID $pid not found");
        if ($res['stock'] < $qty) throw new Exception("Insufficient stock for product ID $pid");

        $total += $res['price'] * $qty;
        $productData[$pid] = ['price' => $res['price'], 'qty' => $qty];
    }

    if ($received < $total) {
        throw new Exception('Received amount is less than total');
    }

    $change = $received - $total;

    $stmt = $db->prepare("INSERT INTO sales (cashier_id, total_amount, received, change_given) VALUES (?, ?, ?, ?)");
    $stmt->execute([$cashierId, $total, $received, $change]);
    $saleId = $db->lastInsertId();

    foreach ($productData as $pid => $pdata) {
        $stmt = $db->prepare("INSERT INTO sale_items (sale_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
        $stmt->execute([$saleId, $pid, $pdata['qty'], $pdata['price']]);

        $stmt = $db->prepare("UPDATE products SET stock = stock - ? WHERE id = ?");
        $stmt->execute([$pdata['qty'], $pid]);
    }

    $db->commit();

    echo json_encode([
        'message' => 'Sale completed successfully',
        'sale_id' => $saleId,
        'total'   => $total,
        'change'  => $change,
    ]);

} catch (Exception $e) {
    $db->rollBack();
    http_response_code(400);
    echo json_encode(['message' => $e->getMessage()]);
}
