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
        """
        Thêm mới category. 
        created_at và updated_at được tự động lấy thời gian hiện tại.
        """
        conn = self.get_connection()
        cursor = conn.cursor()
        
        sql = """
            INSERT INTO Category (name, created_at, updated_at)
            VALUES (%s, %s, %s)
        """
        now = datetime.now()
        
        try:
            cursor.execute(sql, (name, now, now))
            conn.commit()
            category_id = cursor.lastrowid
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            category_id = None
        finally:
            cursor.close()
            conn.close()
            
        return category_id

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
    # Lấy tất cả danh mục (có tìm kiếm)
    # ---------------------------
    def select_all_categories(self, name=None):
        """
        Lấy danh sách Category.
        Vì category thường ít hơn Product nên có thể không cần phân trang phức tạp,
        nhưng vẫn hỗ trợ tìm kiếm theo tên.
        """
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = "SELECT * FROM Category WHERE 1=1"
        params = []

        if name:
            sql += " AND name LIKE %s"
            params.append(f"%{name}%")

        # Sắp xếp theo tên A-Z hoặc ngày tạo (tùy nhu cầu)
        sql += " ORDER BY created_at DESC"

        cursor.execute(sql, tuple(params))
        categories = cursor.fetchall()

        cursor.close()
        conn.close()
        return categories

    # ---------------------------
    # Cập nhật danh mục
    # ---------------------------
    def update_category(self, category_id, **kwargs):
        """
        Cập nhật linh hoạt sử dụng kwargs.
        Ví dụ: update_category(1, name="Đồ điện tử")
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

        # Tự động cập nhật thời gian update
        fields.append("updated_at=%s")
        values.append(datetime.now())

        sql = f"UPDATE Category SET {', '.join(fields)} WHERE id=%s"
        values.append(category_id)

        try:
            cursor.execute(sql, tuple(values))
            conn.commit()
            row_count = cursor.rowcount
        except mysql.connector.Error as err:
            print(f"Error: {err}")
            row_count = 0
        finally:
            cursor.close()
            conn.close()
            
        return row_count > 0

    # ---------------------------
    # Xóa danh mục
    # ---------------------------
    def delete_category(self, category_id):
        """
        Lưu ý: Nếu database có khóa ngoại (Foreign Key) tại bảng Product,
        bạn cần xử lý ngoại lệ nếu xóa Category đang được sử dụng.
        """
        conn = self.get_connection()
        cursor = conn.cursor()
        
        sql = "DELETE FROM Category WHERE id=%s"
        
        try:
            cursor.execute(sql, (category_id,))
            conn.commit()
            success = True
        except mysql.connector.Error as err:
            # Bắt lỗi ràng buộc khóa ngoại (nếu có sản phẩm thuộc danh mục này)
            print(f"Error deleting category: {err}")
            success = False
        finally:
            cursor.close()
            conn.close()
            
        return success