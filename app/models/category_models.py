import mysql.connector
from config import DB_CONFIG
from datetime import datetime

class CategoryModel:
    def __init__(self):
        self.db_config = DB_CONFIG

    def get_connection(self):
        return mysql.connector.connect(**self.db_config)

    # ---------------------------
    # Thêm danh mục mới
    # ---------------------------
    def insert_category(self, name):
        conn = self.get_connection()
        cursor = conn.cursor()

        sql = """
            INSERT INTO Category (name, created_at, updated_at)
            VALUES (%s, %s, %s)
        """
        now = datetime.now()
        cursor.execute(sql, (name, now, now))

        conn.commit()
        category_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return category_id

    # ---------------------------
    # Lấy tất cả danh mục
    # ---------------------------
    def get_all_categories(self):
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = "SELECT * FROM Category ORDER BY name ASC"
        cursor.execute(sql)
        categories = cursor.fetchall()

        cursor.close()
        conn.close()
        return categories

    # ---------------------------
    # Lấy danh mục theo ID
    # ---------------------------
    def get_category_by_id(self, category_id):
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = "SELECT * FROM Category WHERE id = %s"
        cursor.execute(sql, (category_id,))
        category = cursor.fetchone()

        cursor.close()
        conn.close()
        return category

    # ---------------------------
    # Cập nhật danh mục
    # ---------------------------
    def update_category(self, category_id, name):
        conn = self.get_connection()
        cursor = conn.cursor()

        sql = "UPDATE Category SET name=%s, updated_at=%s WHERE id=%s"
        now = datetime.now()
        
        cursor.execute(sql, (name, now, category_id))
        conn.commit()
        
        row_count = cursor.rowcount
        cursor.close()
        conn.close()
        return row_count > 0

    # ---------------------------
    # Xóa danh mục
    # ---------------------------
    def delete_category(self, category_id):
        """
        Lưu ý: Nếu có sản phẩm đang thuộc danh mục này, 
        việc xóa có thể bị lỗi do ràng buộc khóa ngoại (Foreign Key).
        """
        conn = self.get_connection()
        cursor = conn.cursor()

        try:
            sql = "DELETE FROM Category WHERE id=%s"
            cursor.execute(sql, (category_id,))
            conn.commit()
            success = True
        except mysql.connector.Error as err:
            print(f"Lỗi khi xóa: {err}")
            success = False
        finally:
            cursor.close()
            conn.close()
            
        return success