-- ============================================================
--  Bakery Management System - Database
--  Run this in phpMyAdmin or MySQL CLI
-- ============================================================

CREATE DATABASE IF NOT EXISTS bakery_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE bakery_db;

-- ============================================================
--  USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    username   VARCHAR(50) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,        -- bcrypt hash
    role       ENUM('admin', 'cashier') NOT NULL DEFAULT 'cashier',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
--  PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    category   VARCHAR(50)  NOT NULL,
    price      DECIMAL(10,2) NOT NULL,
    stock      INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================================
--  SALES
-- ============================================================
CREATE TABLE IF NOT EXISTS sales (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    cashier_id   INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    received     DECIMAL(10,2) NOT NULL,
    change_given DECIMAL(10,2) NOT NULL,
    created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cashier_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================================
--  SALE ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS sale_items (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    sale_id    INT NOT NULL,
    product_id INT NOT NULL,
    quantity   INT NOT NULL,
    price      DECIMAL(10,2) NOT NULL,       -- price at time of sale
    FOREIGN KEY (sale_id)    REFERENCES sales(id)    ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- ============================================================
--  SEED DATA
-- ============================================================

-- Admin user  (password: admin123)
INSERT INTO users (username, password, role) VALUES
('admin', '$2y$10$qwWAl5nXUxPKONV95mr8beKgbWody0lHDqW7Kfc..MpSMSn2D16ZG', 'admin');

-- Cashier users  (password: cashier123)
INSERT INTO users (username, password, role) VALUES
('john',     '$2y$10$EbOebyQV7/Fw7FGDN9MnFu9JCxsiZwDe/srbHnaqRniSkUe75Mtmu', 'cashier'),
('johndoe',  '$2y$10$EbOebyQV7/Fw7FGDN9MnFu9JCxsiZwDe/srbHnaqRniSkUe75Mtmu', 'cashier'),
('janesmith','$2y$10$EbOebyQV7/Fw7FGDN9MnFu9JCxsiZwDe/srbHnaqRniSkUe75Mtmu', 'cashier');

-- Products
INSERT INTO products (name, category, price, stock) VALUES
('Bread',      'Bread',    2.00,  80),
('Cake Slice', 'Cake',     4.50,  25),
('Croissant',  'Pastries', 2.50,  40),
('Donut',      'Donuts',   1.50,  60),
('Muffin',     'Pastries', 2.00,  30),
('Pastry',     'Pastries', 2.50,  18),
('Cupcake',    'Cake',     2.00,   8),
('Cookies',    'Cookies',  1.80,   5),
('Milk Bread', 'Bread',    3.00,  50),
('Croissant',  'Pastries', 2.50,   3);

-- Sample sales
INSERT INTO sales (cashier_id, total_amount, received, change_given, created_at) VALUES
(2, 13.00, 20.00, 7.00,  NOW() - INTERVAL 1 DAY),
(3, 22.50, 25.00, 2.50,  NOW() - INTERVAL 2 DAY),
(4,  8.80, 10.00, 1.20,  NOW() - INTERVAL 3 DAY),
(2, 15.75, 20.00, 4.25,  NOW()),
(3, 33.00, 33.00, 0.00,  NOW());

-- Sample sale items
INSERT INTO sale_items (sale_id, product_id, quantity, price) VALUES
(1, 1, 2, 2.00),
(1, 2, 1, 4.50),
(1, 8, 3, 1.50),
(2, 3, 3, 2.50),
(2, 5, 2, 2.00),
(3, 4, 4, 1.50),
(3, 6, 1, 2.50),
(4, 9, 2, 3.00),
(4, 7, 1, 2.00),
(4, 8, 2, 1.80),
(5, 2, 4, 4.50),
(5, 3, 2, 2.50),
(5, 5, 1, 2.00);
