<?php
$allowed_origins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost',
    'https://bakery-management-system-v2r6.vercel.app',
    'https://bakery-management-system-kappa.vercel.app',
];

// Also allow any Vercel preview URL set via environment variable
$env_url = getenv('FRONTEND_URL');
if ($env_url) {
    $allowed_origins[] = rtrim($env_url, '/');
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Allow any *.vercel.app origin to support preview deployments
if (in_array($origin, $allowed_origins) || preg_match('/^https:\/\/.*\.vercel\.app$/', $origin)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header("Access-Control-Allow-Origin: https://bakery-management-system-v2r6.vercel.app");
}

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
