import mysql.connector
from config import DB_CONFIG
from datetime import datetime

class SupplierModel:
    def __init__(self):
        self.db_config = DB_CONFIG

    def get_connection(self):
        return mysql.connector.connect(**self.db_config)

    # ---------------------------
    # Thêm nhà cung cấp mới
    # ---------------------------
    def insert_supplier(self, name, contact_person, email, phone, address, tax_code=None):
        sql = """
            INSERT INTO Supplier 
            (name, contact_person, email, phone, address, tax_code, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        now = datetime.now()
        conn = self.get_connection()
        cursor = conn.cursor()
        try:
            cursor.execute(sql, (name, contact_person, email, phone, address, tax_code, now, now))
            conn.commit()
            return cursor.lastrowid
        finally:
            cursor.close()
            conn.close()

    # ---------------------------
    # Lấy danh sách nhà cung cấp (Tìm kiếm & Phân trang)
    # ---------------------------
    def select_all_suppliers(self, name=None, phone=None, page=1, page_size=10):
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)
        
        sql = "SELECT * FROM Supplier WHERE 1=1"
        params = []

        if name:
            sql += " AND name LIKE %s"
            params.append(f"%{name}%")
        
        if phone:
            sql += " AND phone LIKE %s"
            params.append(f"%{phone}%")

        # Sắp xếp
        sql += " ORDER BY name ASC"

        # Phân trang
        offset = (page - 1) * page_size
        sql += " LIMIT %s OFFSET %s"
        params.extend([page_size, offset])

        cursor.execute(sql, tuple(params))
        suppliers = cursor.fetchall()
        
        cursor.close()
        conn.close()
        return suppliers

    # ---------------------------
    # Lấy thông tin chi tiết 1 nhà cung cấp
    # ---------------------------
    def get_supplier_by_id(self, supplier_id):
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)
        sql = "SELECT * FROM Supplier WHERE id = %s"
        cursor.execute(sql, (supplier_id,))
        supplier = cursor.fetchone()
        cursor.close()
        conn.close()
        return supplier

    # ---------------------------
    # Cập nhật linh hoạt (Sử dụng kwargs)
    # ---------------------------
    def update_supplier(self, supplier_id, **kwargs):
        if not kwargs:
            return False

        fields = []
        values = []
        for key, value in kwargs.items():
            fields.append(f"{key}=%s")
            values.append(value)

        fields.append("updated_at=%s")
        values.append(datetime.now())

        sql = f"UPDATE Supplier SET {', '.join(fields)} WHERE id=%s"
        values.append(supplier_id)

        conn = self.get_connection()
        cursor = conn.cursor()
        try:
            cursor.execute(sql, tuple(values))
            conn.commit()
            return cursor.rowcount > 0
        finally:
            cursor.close()
            conn.close()

    # ---------------------------
    # Xóa nhà cung cấp
    # ---------------------------
    def delete_supplier(self, supplier_id):
        conn = self.get_connection()
        cursor = conn.cursor()
        try:
            # Lưu ý: Sẽ lỗi nếu có sản phẩm đang liên kết với supplier này
            sql = "DELETE FROM Supplier WHERE id=%s"
            cursor.execute(sql, (supplier_id,))
            conn.commit()
            return True
        except mysql.connector.Error as err:
            print(f"Lỗi khi xóa: {err}")
            return False
        finally:
            cursor.close()
            conn.close()