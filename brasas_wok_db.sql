CREATE DATABASE IF NOT EXISTS brasas_wok_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE brasas_wok_db;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    role VARCHAR(20) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_role (role),
    INDEX idx_users_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(60) NOT NULL UNIQUE,
    slug VARCHAR(60) NOT NULL UNIQUE,
    description VARCHAR(255),
    image_url VARCHAR(255),
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_categories_display_order (display_order),
    INDEX idx_categories_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255),
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_products_category (category_id),
    INDEX idx_products_is_available (is_available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(30) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    status VARCHAR(25) NOT NULL DEFAULT 'PENDIENTE',
    payment_method VARCHAR(30) NOT NULL,
    delivery_address VARCHAR(255) NOT NULL,
    delivery_phone VARCHAR(20) NOT NULL,
    delivery_notes VARCHAR(255),
    subtotal DECIMAL(10,2) NOT NULL,
    delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    estimated_delivery_minutes INT DEFAULT 45,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_orders_customer (customer_id),
    INDEX idx_orders_status (status),
    INDEX idx_orders_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    notes VARCHAR(255),
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_order_items_order (order_id),
    INDEX idx_order_items_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL UNIQUE,
    payment_method VARCHAR(30) NOT NULL,
    status VARCHAR(25) NOT NULL DEFAULT 'PENDIENTE',
    amount DECIMAL(10,2) NOT NULL,
    transaction_reference VARCHAR(100),
    paid_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_payments_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS order_status_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    previous_status VARCHAR(25),
    new_status VARCHAR(25) NOT NULL,
    changed_by_user_id BIGINT,
    comment VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_status_logs_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_status_logs_user FOREIGN KEY (changed_by_user_id) REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX idx_status_logs_order (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO users (id, username, email, password, full_name, phone, address, role, is_active) VALUES
(1, 'admin', 'admin@brasaswok.pe', '$2a$10$MwdeIPHQe32NaOxFapHwKOddrBuh/Bco4s18jMk32SSjovPFJRDAC', 'Administrador Brasas & Wok', '987654321', 'Av. Javier Prado Este 1234, San Borja', 'ROLE_ADMIN', TRUE),
(2, 'carlos_m', 'carlos.m@gmail.com', '$2a$10$wfFsFDAwbqVe.kIvDBrSfuz5gxFknnHipQlOYw2ARZl/ztfN8uo5y', 'Carlos Mendoza', '991234567', 'Calle Los Pinos 432, San Isidro', 'ROLE_CUSTOMER', TRUE),
(3, 'ana_torres', 'ana.torres@hotmail.com', '$2a$10$wfFsFDAwbqVe.kIvDBrSfuz5gxFknnHipQlOYw2ARZl/ztfN8uo5y', 'Ana Torres', '984561230', 'Av. Primavera 789, Surco', 'ROLE_CUSTOMER', TRUE)
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO categories (id, name, slug, description, image_url, display_order, is_active) VALUES
(1, 'Brasas & Pollos', 'brasas-y-pollos', 'Nuestros clásicos pollos a la brasa marinados con la receta secreta', '/assets/categories/brasas.jpg', 1, TRUE),
(2, 'Wok & Salteados', 'wok-y-salteados', 'Salteados criollos y orientales al fuego vivo de nuestro wok', '/assets/categories/wok.jpg', 2, TRUE),
(3, 'Chaufas & Aeropuertos', 'chaufas-y-aeropuertos', 'Arroces al wok con el toque ahumado perfecto', '/assets/categories/chaufas.jpg', 3, TRUE),
(4, 'Entradas & Piques', 'entradas-y-piques', 'Entradas crujientes y piqueos para compartir', '/assets/categories/entradas.jpg', 4, TRUE),
(5, 'Bebidas', 'bebidas', 'Refrescos tradicionales y bebidas frías', '/assets/categories/bebidas.jpg', 5, TRUE)
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO products (id, category_id, name, slug, description, price, image_url, is_available) VALUES
(1, 1, '1 Pollo a la Brasa Tradicional', '1-pollo-a-la-brasa-tradicional', '1 Pollo entero a la brasa + papas fritas familiares + ensalada clásica + cremas de la casa', 74.90, '/assets/products/pollo-entero.jpg', TRUE),
(2, 1, '1/2 Pollo a la Brasa', '1-2-pollo-a-la-brasa', 'Medio pollo a la brasa + papas fritas medianas + ensalada personal + cremas', 42.90, '/assets/products/medio-pollo.jpg', TRUE),
(3, 1, '1/4 Pollo a la Brasa Clásico', '1-4-pollo-a-la-brasa-clasico', 'Un cuarto de pollo a la brasa (pierna o pecho) + papas fritas + ensalada + cremas', 24.90, '/assets/products/cuarto-pollo.jpg', TRUE),
(4, 2, 'Lomo Saltado al Wok Criollo', 'lomo-saltado-al-wok-criollo', 'Trozos de lomo fino salteados al wok con cebolla, tomate, ají amarillo, acompañado de papas fritas y arroz con choclo', 39.90, '/assets/products/lomo-saltado.jpg', TRUE),
(5, 2, 'Tallarín Saltado Criollo de Carne', 'tallarin-saltado-criollo-de-carne', 'Tallarines salteados al fuego vivo con trozos de carne de res, cebolla, tomate y cebollita china', 36.90, '/assets/products/tallarin-saltado.jpg', TRUE),
(6, 3, 'Arroz Chaufa Especial de Chancho Asado', 'arroz-chaufa-especial-de-chancho-asado', 'Arroz frito al wok con chancho asado oriental, tortilla de huevo y cebollita china aromatizado con aceite de ajonjolí', 32.90, '/assets/products/chaufa-chancho.jpg', TRUE),
(7, 3, 'Aeropuerto Fusión Brasas & Wok', 'aeropuerto-fusion-brasas-y-wok', 'Combinación estelar de arroz chaufa y fideo wanton salteados al wok con trozos de pollo a la brasa y frejolito chino', 35.90, '/assets/products/aeropuerto-fusion.jpg', TRUE),
(8, 4, 'Wantán Frito Especial (12 und)', 'wantan-frito-especial-12-und', 'Docena de wantanes crocantes rellenos de pollo y langostinos servidos con abundante salsa de tamarindo artesanal', 18.00, '/assets/products/wantan-frito.jpg', TRUE),
(9, 4, 'Tequeños Wok de Pollo a la Brasa (8 und)', 'tequenos-wok-de-pollo-a-la-brasa-8-und', 'Ocho tequeños crujientes rellenos con tierno pollo a la brasa y queso, con crema de palta y tártara', 21.00, '/assets/products/tequenos-wok.jpg', TRUE),
(10, 5, 'Chicha Morada Artesanal 1L', 'chicha-morada-artesanal-1l', 'Elaborada con maíz morado, piña, manzana, membrillo, clavo y canela. 100% natural', 12.00, '/assets/products/chicha-morada.jpg', TRUE),
(11, 5, 'Inka Kola 1.5L', 'inka-kola-1-5l', 'Gaseosa Inka Kola botella descartable de 1.5 litros', 10.00, '/assets/products/inka-kola-15l.jpg', TRUE)
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO orders (id, order_number, customer_id, status, payment_method, delivery_address, delivery_phone, delivery_notes, subtotal, delivery_fee, total_amount, estimated_delivery_minutes) VALUES
(1, 'BW-001', 2, 'PENDIENTE', 'TRANSFERENCIA', 'Calle Los Pinos 432, Dpto 301, San Isidro', '991234567', 'Tocar timbre 301, dejar en recepción si no contesta', 86.90, 5.00, 91.90, 45)
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO order_items (id, order_id, product_id, product_name, quantity, unit_price, subtotal, notes) VALUES
(1, 1, 1, '1 Pollo a la Brasa Tradicional', 1, 74.90, 74.90, 'Papas bien crocantes y doble crema de ají'),
(2, 1, 10, 'Chicha Morada Artesanal 1L', 1, 12.00, 12.00, 'Helada por favor')
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO payments (id, order_id, payment_method, status, amount, transaction_reference, paid_at) VALUES
(1, 1, 'TRANSFERENCIA', 'PENDIENTE', 91.90, 'BCP-TRANSF-982145', NULL)
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO order_status_logs (id, order_id, previous_status, new_status, changed_by_user_id, comment) VALUES
(1, 1, NULL, 'PENDIENTE', 2, 'Orden generada exitosamente por el cliente desde la tienda web')
ON DUPLICATE KEY UPDATE id=id;
