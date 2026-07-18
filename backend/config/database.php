<?php
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_NAME', getenv('DB_NAME') ?: 'bakery_db');

function getDB() {
    $conn = mysqli_init();
    if (!$conn) {
        http_response_code(500);
        die(json_encode(['message' => 'mysqli_init failed']));
    }
    // Fail fast after 10 seconds instead of hanging
    $conn->options(MYSQLI_OPT_CONNECT_TIMEOUT, 10);
    if (!$conn->real_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME)) {
        http_response_code(500);
        die(json_encode(['message' => 'Database connection failed: ' . mysqli_connect_error()]));
    }
    $conn->set_charset('utf8mb4');
    return $conn;
}
