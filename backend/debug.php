<?php
// Temporary debug - DELETE after use
header('Content-Type: application/json');
echo json_encode([
    'DB_HOST' => getenv('DB_HOST'),
    'DB_PORT' => getenv('DB_PORT'),
    'DB_USER' => getenv('DB_USER'),
    'DB_NAME' => getenv('DB_NAME'),
    'DB_PASS_LENGTH' => strlen(getenv('DB_PASS')),
    'DB_PASS_FIRST4' => substr(getenv('DB_PASS'), 0, 4),
]);
