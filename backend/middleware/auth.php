<?php
function getTokenUser() {
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    if (!$auth || !str_starts_with($auth, 'Bearer ')) return null;

    $token = substr($auth, 7);
    $parts = explode('.', $token);
    if (count($parts) !== 2) return null;

    [$payload, $sig] = $parts;
    $secret = getenv('JWT_SECRET') ?: 'bakery_secret_key_2024';
    $expected = base64_encode(hash_hmac('sha256', $payload, $secret, true));
    if (!hash_equals($expected, $sig)) return null;

    $data = json_decode(base64_decode($payload), true);
    if (!$data || $data['exp'] < time()) return null;

    return $data;
}

function requireAuth() {
    $user = getTokenUser();
    if (!$user) {
        http_response_code(401);
        echo json_encode(['message' => 'Unauthorized. Please login.']);
        exit();
    }
    return $user;
}

function requireAdmin() {
    $user = requireAuth();
    if ($user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['message' => 'Forbidden. Admin access required.']);
        exit();
    }
    return $user;
}
