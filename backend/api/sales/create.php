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
$db->begin_transaction();

try {
    // Calculate total & validate stock
    $total = 0;
    $productData = [];

    foreach ($items as $item) {
        $pid = intval($item['product_id']);
        $qty = intval($item['quantity']);
        if ($pid <= 0 || $qty <= 0) throw new Exception('Invalid item data');

        $stmt = $db->prepare("SELECT id, price, stock FROM products WHERE id = ? FOR UPDATE");
        $stmt->bind_param('i', $pid);
        $stmt->execute();
        $res = $stmt->get_result()->fetch_assoc();
        $stmt->close();

        if (!$res) throw new Exception("Product ID $pid not found");
        if ($res['stock'] < $qty) throw new Exception("Insufficient stock for product ID $pid");

        $total += $res['price'] * $qty;
        $productData[$pid] = ['price' => $res['price'], 'qty' => $qty];
    }

    if ($received < $total) {
        throw new Exception('Received amount is less than total');
    }

    $change = $received - $total;

    // Insert sale
    $stmt = $db->prepare("INSERT INTO sales (cashier_id, total_amount, received, change_given) VALUES (?, ?, ?, ?)");
    $stmt->bind_param('iddd', $cashierId, $total, $received, $change);
    $stmt->execute();
    $saleId = $db->insert_id;
    $stmt->close();

    // Insert sale items & update stock
    foreach ($productData as $pid => $pdata) {
        $price = $pdata['price'];
        $qty   = $pdata['qty'];

        $stmt = $db->prepare("INSERT INTO sale_items (sale_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
        $stmt->bind_param('iiid', $saleId, $pid, $qty, $price);
        $stmt->execute();
        $stmt->close();

        $stmt = $db->prepare("UPDATE products SET stock = stock - ? WHERE id = ?");
        $stmt->bind_param('ii', $qty, $pid);
        $stmt->execute();
        $stmt->close();
    }

    $db->commit();
    $db->close();

    echo json_encode([
        'message'  => 'Sale completed successfully',
        'sale_id'  => $saleId,
        'total'    => $total,
        'change'   => $change,
    ]);

} catch (Exception $e) {
    $db->rollback();
    $db->close();
    http_response_code(400);
    echo json_encode(['message' => $e->getMessage()]);
}
