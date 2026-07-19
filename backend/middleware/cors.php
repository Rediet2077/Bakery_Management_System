<?php
// Send CORS headers immediately for every request
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Allow localhost for dev, and any *.vercel.app for production
$is_allowed =
    $origin === 'http://localhost:5173' ||
    $origin === 'http://127.0.0.1:5173' ||
    $origin === 'http://localhost' ||
    preg_match('/^https:\/\/[\w-]+\.vercel\.app$/', $origin);

// Also allow the explicit env-var URL (set on Render)
$env_url = getenv('FRONTEND_URL');
if ($env_url && $origin === rtrim($env_url, '/')) {
    $is_allowed = true;
}

if ($is_allowed && $origin !== '') {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // Fallback for when no origin header (direct browser visits)
    header("Access-Control-Allow-Origin: https://bakery-management-system-v2r6.vercel.app");
}

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request — must respond here with 200
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
