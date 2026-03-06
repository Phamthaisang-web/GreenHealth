INSERT INTO Category (name, description, image) VALUES
('Rau củ', 'Các loại rau củ tươi sạch', 'rau.jpg'),
('Trái cây', 'Trái cây hữu cơ', 'traicay.jpg'),
('Thực phẩm khô', 'Ngũ cốc, đậu, hạt', 'kho.jpg'),
('Thịt tươi', 'Thịt sạch, có nguồn gốc', 'thit.jpg'),
('Hải sản', 'Hải sản tươi sống', 'haisan.jpg'),
('Đồ uống', 'Nước ép, trà, sữa', 'douong.jpg'),
('Gia vị', 'Gia vị nấu ăn', 'giavi.jpg'),
('Thực phẩm chay', 'Dành cho người ăn chay', 'chay.jpg'),
('Sản phẩm hữu cơ', 'Sản phẩm organic', 'organic.jpg'),
('Đặc sản', 'Đặc sản vùng miền', 'dacsan.jpg');
INSERT INTO Supplier (name, description, phone, address) VALUES
('Nông trại Xanh', 'Chuyên rau sạch', '0900000001', 'Đà Lạt'),
('Fresh Farm', 'Trang trại hữu cơ', '0900000002', 'Lâm Đồng'),
('Green Food', 'Nhà cung cấp thực phẩm sạch', '0900000003', 'TP.HCM'),
('Hải Sản Biển Đông', 'Hải sản tươi', '0900000004', 'Nha Trang'),
('Meat Pro', 'Thịt đạt chuẩn VietGAP', '0900000005', 'Hà Nội'),
('Organic Life', 'Thực phẩm organic', '0900000006', 'Đồng Nai'),
('Healthy Food', 'Thực phẩm dinh dưỡng', '0900000007', 'Bình Dương'),
('An Tâm Farm', 'Nông sản an toàn', '0900000008', 'Cần Thơ'),
('VietFarm', 'Sản phẩm nông nghiệp Việt', '0900000009', 'Long An'),
('Eco Supplier', 'Chuỗi cung ứng xanh', '0900000010', 'Huế');
INSERT INTO Product
(name, description, price, expiry_date, manufacture_date, origin, unit, supplier_id, category_id)
VALUES
('Cà chua sạch', 'Cà chua trồng hữu cơ', 25000, '2026-01-01', '2025-01-01', 'Đà Lạt', 'kg', 1, 1),
('Rau cải xanh', 'Rau cải tươi', 18000, '2026-01-02', '2025-01-02', 'Đà Lạt', 'kg', 2, 1),
('Táo đỏ', 'Táo nhập khẩu', 55000, '2026-02-01', '2025-02-01', 'Mỹ', 'kg', 3, 2),
('Chuối già', 'Chuối chín tự nhiên', 20000, '2026-01-10', '2025-01-10', 'Việt Nam', 'kg', 4, 2),
('Gạo lứt', 'Gạo lứt hữu cơ', 40000, '2026-06-01', '2025-06-01', 'An Giang', 'kg', 5, 3),
('Thịt heo sạch', 'Thịt heo VietGAP', 120000, '2025-12-31', '2025-01-05', 'Việt Nam', 'kg', 6, 4),
('Cá hồi', 'Cá hồi phi lê', 280000, '2025-12-15', '2025-01-03', 'Na Uy', 'kg', 7, 5),
('Nước ép cam', 'Nước ép nguyên chất', 30000, '2025-10-01', '2025-01-01', 'Việt Nam', 'chai', 8, 6),
('Muối hồng', 'Muối Himalaya', 45000, '2027-01-01', '2025-01-01', 'Pakistan', 'gói', 9, 7),
('Đậu hũ chay', 'Đậu hũ nguyên chất', 15000, '2025-09-01', '2025-01-01', 'Việt Nam', 'hộp', 10, 8);