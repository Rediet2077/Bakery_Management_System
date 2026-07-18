<?php
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_PORT', (int)(getenv('DB_PORT') ?: 3306));
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_NAME', getenv('DB_NAME') ?: 'defaultdb');

function getDB() {
    $conn = mysqli_init();
    if (!$conn) {
        http_response_code(500);
        die(json_encode(['message' => 'mysqli_init failed']));
    }
    $conn->options(MYSQLI_OPT_CONNECT_TIMEOUT, 15);

    // Try with SSL first, fall back without if needed
    $flags = MYSQLI_CLIENT_SSL | MYSQLI_CLIENT_SSL_DONT_VERIFY_SERVER_CERT;
    if (!@$conn->real_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT, NULL, $flags)) {
        // Retry without SSL verify
        $conn = mysqli_init();
        $conn->options(MYSQLI_OPT_CONNECT_TIMEOUT, 15);
        if (!$conn->real_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT)) {
            http_response_code(500);
            die(json_encode(['message' => 'Database connection failed: ' . mysqli_connect_error()]));
        }
    }
    $conn->set_charset('utf8mb4');
    return $conn;
}
