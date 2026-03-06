import mysql.connector
from config import DB_CONFIG

class ProductModel:
    def __init__(self):
        self.db_config = DB_CONFIG

    def get_connection(self):
        return mysql.connector.connect(**self.db_config)
    
    # Thêm sản phẩm mới
    def insert_product(self,name,
        description,
        price,
        expiry_date,
        manufacture_date,
        origin,
        unit,
        supplier_id,
        category_id
    ):
        conn = self.get_connection()
        cursor = conn.cursor()

        sql = """
            INSERT INTO Product
            (name, description, price, expiry_date, manufacture_date,
             origin, unit, supplier_id, category_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        cursor.execute(sql, (
            name,
            description,
            price,
            expiry_date,
            manufacture_date,
            origin,
            unit,
            supplier_id,
            category_id
        ))

        conn.commit()
        product_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return product_id
    # Lấy sản phẩm theo ID
    def get_product_by_id(self, product_id):
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = "SELECT * FROM Product WHERE id = %s"
        cursor.execute(sql, (product_id,))
        product = cursor.fetchone()

        cursor.close()
        conn.close()
        return product
    # Lấy danh sách sản phẩm + filter + phân trang
    def select_all_products(
        self,
        name=None,
        category_name=None,
        supplier_name=None,
        min_price=None,
        max_price=None,
        page=1,
        page_size=10
    ):
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = """
            SELECT 
                p.*,
                c.name AS category_name,
                s.name AS supplier_name
            FROM Product p
            LEFT JOIN Category c ON p.category_id = c.id
            LEFT JOIN Supplier s ON p.supplier_id = s.id
            WHERE 1=1
        """
        params = []

        if name:
            sql += " AND p.name LIKE %s"
            params.append(f"%{name}%")

        if category_name:
            sql += " AND c.name LIKE %s"
            params.append(f"%{category_name}%")

        if supplier_name:
            sql += " AND s.name LIKE %s"
            params.append(f"%{supplier_name}%")

        if min_price is not None:
            sql += " AND p.price >= %s"
            params.append(min_price)

        if max_price is not None:
            sql += " AND p.price <= %s"
            params.append(max_price)

        sql += " ORDER BY p.created_at DESC"
        offset = (page - 1) * page_size
        sql += " LIMIT %s OFFSET %s"
        params.extend([page_size, offset])

        cursor.execute(sql, tuple(params))
        products = cursor.fetchall()

        cursor.close()
        conn.close()
        return products

    # Cập nhật sản phẩm
    def update_product(self, product_id, **kwargs):
        conn = self.get_connection()
        cursor = conn.cursor()

        fields = []
        values = []

        allowed_fields = {
            "name", "description", "price",
            "expiry_date", "manufacture_date",
            "origin", "unit", "supplier_id", "category_id"
        }

        for key, value in kwargs.items():
            if key in allowed_fields:
                fields.append(f"{key} = %s")
                values.append(value)

        if not fields:
            cursor.close()
            conn.close()
            return False

        values.append(product_id)
        sql = f"UPDATE Product SET {', '.join(fields)} WHERE id = %s"

        cursor.execute(sql, tuple(values))
        conn.commit()

        updated = cursor.rowcount > 0
        cursor.close()
        conn.close()
        return updated
    # Xóa sản phẩm
    def delete_product(self, product_id):
        conn = self.get_connection()
        cursor = conn.cursor()

        sql = "DELETE FROM Product WHERE id = %s"
        cursor.execute(sql, (product_id,))
        conn.commit()

        deleted = cursor.rowcount > 0
        cursor.close()
        conn.close()
        return deleted
