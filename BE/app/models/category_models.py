import mysql.connector
from config import DB_CONFIG

class CategoryModel:
    def __init__(self):
        self.db_config = DB_CONFIG

    def get_connection(self):
        return mysql.connector.connect(**self.db_config)

    # Thêm category
    def insert_category(self, name, description=None, image=None):
        conn = self.get_connection()
        cursor = conn.cursor()

        sql = """
            INSERT INTO Category (name, description, image)
            VALUES (%s, %s, %s)
        """
        cursor.execute(sql, (name, description, image))
        conn.commit()

        category_id = cursor.lastrowid
        cursor.close()
        conn.close()
        return category_id
    # Lấy category theo ID
    def get_category_by_id(self, category_id):
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = "SELECT * FROM Category WHERE id = %s"
        cursor.execute(sql, (category_id,))
        category = cursor.fetchone()

        cursor.close()
        conn.close()
        return category
    # Lấy tất cả category
    def select_all_categories(self):
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = "SELECT * FROM Category ORDER BY created_at DESC"
        cursor.execute(sql)
        categories = cursor.fetchall()

        cursor.close()
        conn.close()
        return categories

    # Cập nhật category
    def update_category(self, category_id, **kwargs):
        conn = self.get_connection()
        cursor = conn.cursor()

        fields = []
        values = []

        for key, value in kwargs.items():
            fields.append(f"{key}=%s")
            values.append(value)

        if not fields:
            return False

        sql = f"UPDATE Category SET {', '.join(fields)} WHERE id=%s"
        values.append(category_id)

        cursor.execute(sql, tuple(values))
        conn.commit()

        success = cursor.rowcount > 0
        cursor.close()
        conn.close()
        return success
    # Xóa category
    def delete_category(self, category_id):
        conn = self.get_connection()
        cursor = conn.cursor()

        sql = "DELETE FROM Category WHERE id=%s"
        cursor.execute(sql, (category_id,))
        conn.commit()

        success = cursor.rowcount > 0
        cursor.close()
        conn.close()
        return success
