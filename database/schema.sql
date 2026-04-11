-- Prestige Gentlemen - Schéma de base de données MySQL
-- E-commerce costumes de mariage haut de gamme
-- Date: Mars 2026

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS prestige_gentlemen CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE prestige_gentlemen;

-- Suppression des tables si elles existent
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS variants;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- Table USERS
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('client', 'admin') DEFAULT 'client',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table CATEGORIES
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(255),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table PRODUCTS
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(255),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_category (category_id),
    INDEX idx_slug (slug),
    INDEX idx_featured (is_featured),
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table VARIANTS (tailles, couleurs, stock)
CREATE TABLE variants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    size VARCHAR(10) NOT NULL,
    color VARCHAR(50) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    price_modifier DECIMAL(10, 2) DEFAULT 0.00,
    sku VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_variant (product_id, size, color),
    INDEX idx_product (product_id),
    INDEX idx_stock (stock_quantity),
    CHECK (stock_quantity >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table ORDERS
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_postal_code VARCHAR(20) NOT NULL,
    shipping_country VARCHAR(100) DEFAULT 'France',
    payment_method VARCHAR(50),
    payment_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_order_number (order_number),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table ORDER_ITEMS
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    variant_id INT NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    size VARCHAR(10) NOT NULL,
    color VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (variant_id) REFERENCES variants(id) ON DELETE RESTRICT,
    INDEX idx_order (order_id),
    INDEX idx_variant (variant_id),
    CHECK (quantity > 0),
    CHECK (unit_price >= 0),
    CHECK (subtotal >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertion des catégories
INSERT INTO categories (name, slug, description, display_order) VALUES
('Costumes 3 pièces', 'costumes-3-pieces', 'Costumes complets élégants avec veste, pantalon et gilet', 1),
('Smokings', 'smokings', 'Smokings classiques et modernes pour mariages haut de gamme', 2),
('Costumes casual chic', 'costumes-casual-chic', 'Costumes décontractés pour mariages champêtres', 3),
('Chemises', 'chemises', 'Chemises de qualité pour accompagner votre costume', 4),
('Accessoires', 'accessoires', 'Cravates, nœuds papillon, pochettes, boutons de manchette', 5),
('Chaussures', 'chaussures', 'Chaussures en cuir pour compléter votre tenue', 6);

-- Insertion des produits (exemples)
INSERT INTO products (category_id, name, slug, description, base_price, is_featured) VALUES
(1, 'Costume 3 pièces Élégance Noire', 'costume-3-pieces-elegance-noire', 'Costume complet noir en laine italienne, coupe slim', 549.00, TRUE),
(1, 'Costume 3 pièces Marine Premium', 'costume-3-pieces-marine-premium', 'Costume bleu marine en tissu premium avec gilet assorti', 599.00, TRUE),
(1, 'Costume 3 pièces Gris Anthracite', 'costume-3-pieces-gris-anthracite', 'Costume gris anthracite moderne, parfait pour toutes saisons', 529.00, FALSE),
(2, 'Smoking Classique Noir', 'smoking-classique-noir', 'Smoking traditionnel noir avec revers satin', 699.00, TRUE),
(2, 'Smoking Blanc Ivoire', 'smoking-blanc-ivoire', 'Smoking blanc cassé pour mariages d\'été', 749.00, FALSE),
(3, 'Costume Lin Beige', 'costume-lin-beige', 'Costume en lin naturel pour mariages champêtres', 449.00, FALSE),
(4, 'Chemise Blanche Premium', 'chemise-blanche-premium', 'Chemise blanche en coton égyptien', 89.00, FALSE),
(5, 'Cravate Soie Bleue', 'cravate-soie-bleue', 'Cravate en soie pure bleu marine', 49.00, FALSE),
(5, 'Nœud Papillon Noir Satin', 'noeud-papillon-noir-satin', 'Nœud papillon classique noir', 39.00, FALSE),
(6, 'Richelieu Cuir Noir', 'richelieu-cuir-noir', 'Chaussures Richelieu en cuir italien', 189.00, FALSE);

-- Insertion des variants (tailles et couleurs avec stock)
INSERT INTO variants (product_id, size, color, stock_quantity, sku) VALUES
-- Costume Élégance Noire (tailles 46 à 56)
(1, '46', 'Noir', 5, 'ELG-N-46'),
(1, '48', 'Noir', 8, 'ELG-N-48'),
(1, '50', 'Noir', 10, 'ELG-N-50'),
(1, '52', 'Noir', 7, 'ELG-N-52'),
(1, '54', 'Noir', 4, 'ELG-N-54'),
(1, '56', 'Noir', 3, 'ELG-N-56'),

-- Costume Marine Premium
(2, '46', 'Bleu Marine', 6, 'MAR-BM-46'),
(2, '48', 'Bleu Marine', 9, 'MAR-BM-48'),
(2, '50', 'Bleu Marine', 12, 'MAR-BM-50'),
(2, '52', 'Bleu Marine', 8, 'MAR-BM-52'),
(2, '54', 'Bleu Marine', 5, 'MAR-BM-54'),

-- Costume Gris Anthracite
(3, '48', 'Gris', 7, 'GRI-G-48'),
(3, '50', 'Gris', 10, 'GRI-G-50'),
(3, '52', 'Gris', 6, 'GRI-G-52'),

-- Smoking Classique Noir
(4, '48', 'Noir', 4, 'SMO-N-48'),
(4, '50', 'Noir', 6, 'SMO-N-50'),
(4, '52', 'Noir', 5, 'SMO-N-52'),

-- Chemises (tailles S à XXL)
(7, 'S', 'Blanc', 20, 'CHM-B-S'),
(7, 'M', 'Blanc', 25, 'CHM-B-M'),
(7, 'L', 'Blanc', 30, 'CHM-B-L'),
(7, 'XL', 'Blanc', 20, 'CHM-B-XL'),
(7, 'XXL', 'Blanc', 15, 'CHM-B-XXL'),

-- Accessoires (taille unique)
(8, 'Unique', 'Bleu', 50, 'CRA-BL-U'),
(9, 'Unique', 'Noir', 40, 'NOP-N-U'),

-- Chaussures (pointures 40 à 46)
(10, '40', 'Noir', 8, 'RICH-N-40'),
(10, '41', 'Noir', 12, 'RICH-N-41'),
(10, '42', 'Noir', 15, 'RICH-N-42'),
(10, '43', 'Noir', 12, 'RICH-N-43'),
(10, '44', 'Noir', 10, 'RICH-N-44'),
(10, '45', 'Noir', 7, 'RICH-N-45'),
(10, '46', 'Noir', 5, 'RICH-N-46');

-- Insertion d'un utilisateur admin (mot de passe: admin123)
INSERT INTO users (first_name, last_name, email, password, phone, role) VALUES
('Admin', 'Prestige', 'admin@prestige-gentlemen.com', '$2b$10$rOiEyJ5vP8wW.GHxZ0oGEucVZxGFx/VQqD7EzVKrM8TkVJ5kJ5Yey', '0600000000', 'admin');

-- Insertion d'utilisateurs clients de test (mot de passe: client123)
INSERT INTO users (first_name, last_name, email, password, phone, role) VALUES
('Pierre', 'Dupont', 'pierre.dupont@email.fr', '$2b$10$rOiEyJ5vP8wW.GHxZ0oGEucVZxGFx/VQqD7EzVKrM8TkVJ5kJ5Yey', '0612345678', 'client'),
('Jean', 'Martin', 'jean.martin@email.fr', '$2b$10$rOiEyJ5vP8wW.GHxZ0oGEucVZxGFx/VQqD7EzVKrM8TkVJ5kJ5Yey', '0698765432', 'client'),
('Marc', 'Bernard', 'marc.bernard@email.fr', '$2b$10$rOiEyJ5vP8wW.GHxZ0oGEucVZxGFx/VQqD7EzVKrM8TkVJ5kJ5Yey', '0656789012', 'client');

-- Vérification des données
SELECT 'Categories' as Table_Name, COUNT(*) as Count FROM categories
UNION ALL
SELECT 'Products' as Table_Name, COUNT(*) as Count FROM products
UNION ALL
SELECT 'Variants' as Table_Name, COUNT(*) as Count FROM variants
UNION ALL
SELECT 'Users' as Table_Name, COUNT(*) as Count FROM users;