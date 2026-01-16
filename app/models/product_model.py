import mysql.connector
from config import DB_CONFIG
from datetime import datetime

class ProductModel:
    def __init__(self):
        self.db_config = DB_CONFIG

    def get_connection(self):
        return mysql.connector.connect(**self.db_config)

    # ---------------------------
    # Thêm sản phẩm mới
    # ---------------------------
    def insert_product(self, name, image, description, price, expiry_date, manufacture_date, origin, unit, supplier_id, category_id):
        conn = self.get_connection()
        cursor = conn.cursor()

        sql = """
            INSERT INTO Product 
            (name, image, description, price, expiry_date, manufacture_date, origin, unit, supplier_id, category_id, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        now = datetime.now()
        cursor.execute(sql, (
            name, image, description, price, 
            expiry_date, manufacture_date, origin, 
            unit, supplier_id, category_id, 
            now, now
        ))

        conn.commit()
        product_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return product_id

    # ---------------------------
    # Lấy sản phẩm theo ID
    # ---------------------------
    def get_product_by_id(self, product_id):
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = "SELECT * FROM Product WHERE id = %s"
        cursor.execute(sql, (product_id,))
        product = cursor.fetchone()

        cursor.close()
        conn.close()
        return product

    # ---------------------------
    # Lấy tất cả sản phẩm
    # ---------------------------
    def select_all_products(self, 
                            name=None, 
                            category_id=None, 
                            min_price=None, 
                            max_price=None,
                            from_mfg_date=None, # Từ ngày sản xuất
                            to_mfg_date=None,   # Đến ngày sản xuất
                            from_exp_date=None, # Từ ngày hết hạn
                            to_exp_date=None,   # Đến ngày hết hạn
                            page=1, 
                            page_size=10):
        """
        Lấy danh sách sản phẩm với bộ lọc đa năng và phân trang.
        - page: Số trang hiện tại (bắt đầu từ 1)
        - page_size: Số lượng sản phẩm trên mỗi trang
        """
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        # 1. Xây dựng câu lệnh SQL cơ bản
        sql = "SELECT * FROM Product WHERE 1=1"
        params = []

        # 2. Thêm các điều kiện lọc (Filters)
        if name:
            sql += " AND name LIKE %s"
            params.append(f"%{name}%")
        
        if category_id:
            sql += " AND category_id = %s"
            params.append(category_id)

        # Lọc theo giá
        if min_price is not None:
            sql += " AND price >= %s"
            params.append(min_price)
        if max_price is not None:
            sql += " AND price <= %s"
            params.append(max_price)

        # Lọc theo ngày sản xuất (manufacture_date)
        if from_mfg_date:
            sql += " AND manufacture_date >= %s"
            params.append(from_mfg_date)
        if to_mfg_date:
            sql += " AND manufacture_date <= %s"
            params.append(to_mfg_date)

        # Lọc theo ngày hết hạn (expiry_date)
        if from_exp_date:
            sql += " AND expiry_date >= %s"
            params.append(from_exp_date)
        if to_exp_date:
            sql += " AND expiry_date <= %s"
            params.append(to_exp_date)

        # 3. Sắp xếp (Mặc định mới nhất lên đầu)
        sql += " ORDER BY created_at DESC"

        # 4. Xử lý phân trang (Pagination)
        offset = (page - 1) * page_size
        sql += " LIMIT %s OFFSET %s"
        params.append(page_size)
        params.append(offset)

        # Thực thi truy vấn
        cursor.execute(sql, tuple(params))
        products = cursor.fetchall()

        # 5. Tính tổng số bản ghi (để tính tổng số trang ở phía giao diện)
        # (Tùy chọn: Bạn có thể viết một hàm count riêng hoặc chạy thêm query count ở đây)
        
        cursor.close()
        conn.close()
        return products

    # ---------------------------
    # Cập nhật sản phẩm
    # ---------------------------
    def update_product(self, product_id, **kwargs):
        """
        Sử dụng kwargs để cập nhật linh hoạt các trường.
        Ví dụ: update_product(1, name="Sữa tươi", price=15000)
        """
        conn = self.get_connection()
        cursor = conn.cursor()

        fields = []
        values = []

        for key, value in kwargs.items():
            fields.append(f"{key}=%s")
            values.append(value)

        if not fields:
            return False

        fields.append("updated_at=%s")
        values.append(datetime.now())

        sql = f"UPDATE Product SET {', '.join(fields)} WHERE id=%s"
        values.append(product_id)

        cursor.execute(sql, tuple(values))
        conn.commit()
        
        row_count = cursor.rowcount
        cursor.close()
        conn.close()
        return row_count > 0

    # ---------------------------
    # Xóa sản phẩm
    # ---------------------------
    def delete_product(self, product_id):
        conn = self.get_connection()
        cursor = conn.cursor()

        sql = "DELETE FROM Product WHERE id=%s"
        cursor.execute(sql, (product_id,))

        conn.commit()
        cursor.close()
        conn.close()
        return True