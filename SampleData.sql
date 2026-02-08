
-- Users
INSERT INTO Users (name, phone, password, role) VALUES
('Nguyen Van A', '0901234567', 'hashed_pass_1', 'user'),
('Tran Thi B', '0912345678', 'hashed_pass_2', 'user'),
('Admin GreenHealth', '0999999999', 'admin_pass', 'admin');

-- Category
INSERT INTO Category (name, description) VALUES
('Rau củ tươi', 'Rau củ quả tươi mỗi ngày'),
('Thịt tươi', 'Thịt heo, bò, gà'),
('Hải sản', 'Cá, tôm, mực tươi');

-- Supplier
INSERT INTO Supplier (name, description, phone, address) VALUES
('Nông trại Đà Lạt', 'Rau hữu cơ', '0263123456', 'Đà Lạt'),
('Trang trại Heo Sạch', 'Thịt VietGAP', '0272987654', 'Quảng Nam'),
('Vựa Hải Sản Biển Đông', 'Hải sản tươi sống', '0236123987', 'Đà Nẵng');

-- Address
INSERT INTO Address (user_id, receiver_name, phone, address_line, ward, district, city, is_default) VALUES
(1, 'Nguyen Van A', '0901234567', '12 Le Loi', 'Hai Chau 1', 'Hai Chau', 'Da Nang', TRUE),
(2, 'Tran Thi B', '0912345678', '55 Nguyen Van Linh', 'Hoa Thuan Tay', 'Hai Chau', 'Da Nang', TRUE);

-- Product
INSERT INTO Product
(name, description, price, expiry_date, manufacture_date, origin, unit, supplier_id, category_id)
VALUES
('Rau muống', 'Rau muống tươi', 12000, '2026-02-12', '2026-02-08', 'Đà Lạt', 'bó', 1, 1),
('Cà chua', 'Cà chua chín', 18000, '2026-02-15', '2026-02-08', 'Đà Lạt', 'kg', 1, 1),
('Thịt heo ba chỉ', 'Ba chỉ tươi', 150000, '2026-02-10', '2026-02-08', 'Quảng Nam', 'kg', 2, 2),
('Cá thu', 'Cá thu biển', 220000, '2026-02-09', '2026-02-08', 'Biển Đông', 'kg', 3, 3);

-- Product Image
INSERT INTO ProductImage (product_id, image_url, is_main) VALUES
(1, '/images/rau_muong.jpg', TRUE),
(2, '/images/ca_chua.jpg', TRUE),
(3, '/images/thit_heo.jpg', TRUE),
(4, '/images/ca_thu.jpg', TRUE);

-- Orders
INSERT INTO Orders (order_code, user_id, address_id, total_amount, status) VALUES
('GH20260208001', 1, 1, 194000, 'pending');

-- Order Detail
INSERT INTO Order_Detail (order_id, product_id, quantity, price, subtotal) VALUES
(1, 1, 2, 12000, 24000),
(1, 2, 1, 18000, 18000),
(1, 3, 1, 150000, 150000);