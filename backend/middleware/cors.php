<?php
$allowed_origins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost',
];

// Allow Vercel frontend URL set via environment variable
$vercel_url = getenv('FRONTEND_URL');
if ($vercel_url) {
    $allowed_origins[] = rtrim($vercel_url, '/');
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // Fallback: allow the frontend URL or localhost
    header("Access-Control-Allow-Origin: " . ($vercel_url ?: 'http://localhost'));
}

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
