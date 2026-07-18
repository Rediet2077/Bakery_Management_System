<?php
// One-time database setup script - DELETE after use
require_once __DIR__ . '/config/database.php';

$db = getDB();

$queries = [
"CREATE TABLE IF NOT EXISTS users (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    username   VARCHAR(50) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    role       ENUM('admin', 'cashier') NOT NULL DEFAULT 'cashier',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB",

"CREATE TABLE IF NOT EXISTS products (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    category   VARCHAR(50)  NOT NULL,
    price      DECIMAL(10,2) NOT NULL,
    stock      INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB",

"CREATE TABLE IF NOT EXISTS sales (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    cashier_id   INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    received     DECIMAL(10,2) NOT NULL,
    change_given DECIMAL(10,2) NOT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cashier_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB",

"CREATE TABLE IF NOT EXISTS sale_items (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    sale_id    INT NOT NULL,
    product_id INT NOT NULL,
    quantity   INT NOT NULL,
    price      DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (sale_id)    REFERENCES sales(id)    ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
) ENGINE=InnoDB",

"INSERT IGNORE INTO users (username, password, role) VALUES
('admin', '\$2y\$10\$qwWAl5nXUxPKONV95mr8beKgbWody0lHDqW7Kfc..MpSMSn2D16ZG', 'admin'),
('john',     '\$2y\$10\$EbOebyQV7/Fw7FGDN9MnFu9JCxsiZwDe/srbHnaqRniSkUe75Mtmu', 'cashier'),
('johndoe',  '\$2y\$10\$EbOebyQV7/Fw7FGDN9MnFu9JCxsiZwDe/srbHnaqRniSkUe75Mtmu', 'cashier'),
('janesmith','\$2y\$10\$EbOebyQV7/Fw7FGDN9MnFu9JCxsiZwDe/srbHnaqRniSkUe75Mtmu', 'cashier')",

"INSERT IGNORE INTO products (name, category, price, stock) VALUES
('Bread',      'Bread',    2.00,  80),
('Cake Slice', 'Cake',     4.50,  25),
('Croissant',  'Pastries', 2.50,  40),
('Donut',      'Donuts',   1.50,  60),
('Muffin',     'Pastries', 2.00,  30),
('Pastry',     'Pastries', 2.50,  18),
('Cupcake',    'Cake',     2.00,   8),
('Cookies',    'Cookies',  1.80,   5),
('Milk Bread', 'Bread',    3.00,  50)"
];

$errors = [];
foreach ($queries as $sql) {
    if (!$db->query($sql)) {
        $errors[] = $db->error;
    }
}

if (empty($errors)) {
    echo json_encode(['status' => 'success', 'message' => 'Database tables created and seeded successfully!']);
} else {
    echo json_encode(['status' => 'error', 'errors' => $errors]);
}

$db->close();
