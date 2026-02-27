import mysql.connector
from config import DB_CONFIG


class UserModel:
    def __init__(self):
        self.db_config = DB_CONFIG

    def get_connection(self):
        return mysql.connector.connect(**self.db_config)

    # ---------------------------
    # Tạo user mới
    # ---------------------------
    def insert_user(self, name, phone, email, password_hash, role="user"):
        conn = self.get_connection()
        cursor = conn.cursor()

        sql = """
            INSERT INTO Users (name, phone, email, password, role)
            VALUES (%s, %s, %s, %s, %s)
        """

        cursor.execute(sql, (
            name,
            phone,
            email,
            password_hash,
            role
        ))

        conn.commit()
        user_id = cursor.lastrowid

        cursor.close()
        conn.close()
        return user_id

    # ---------------------------
    # Lấy user theo phone
    # ---------------------------
    def get_user_by_phone(self, phone):
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = "SELECT * FROM Users WHERE phone = %s"
        cursor.execute(sql, (phone,))
        user = cursor.fetchone()

        cursor.close()
        conn.close()
        return user

    # ---------------------------
    # Lấy user theo email
    # ---------------------------
    def get_user_by_email(self, email):
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = "SELECT * FROM Users WHERE email = %s"
        cursor.execute(sql, (email,))
        user = cursor.fetchone()

        cursor.close()
        conn.close()
        return user

    # ---------------------------
    # Lấy user theo ID
    # ---------------------------
    def get_user_by_id(self, user_id):
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = "SELECT * FROM Users WHERE id = %s"
        cursor.execute(sql, (user_id,))
        user = cursor.fetchone()

        cursor.close()
        conn.close()
        return user

    # ---------------------------
    # Lấy tất cả user
    # ---------------------------
    def get_all_users(self):
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = """
            SELECT id, name, phone, email, role,
                   reward_points, status, created_at, updated_at
            FROM Users
        """
        cursor.execute(sql)
        users = cursor.fetchall()

        cursor.close()
        conn.close()
        return users

    # ---------------------------
    # Cập nhật user
    # ---------------------------
    def update_user(self, user_id, **kwargs):
        conn = self.get_connection()
        cursor = conn.cursor()

        allowed_fields = {
            "name", "phone", "email", "password",
            "role", "reward_points", "status"
        }

        fields = []
        values = []

        for key, value in kwargs.items():
            if key in allowed_fields:
                fields.append(f"{key} = %s")
                values.append(value)

        if not fields:
            cursor.close()
            conn.close()
            return False

        values.append(user_id)
        sql = f"UPDATE Users SET {', '.join(fields)} WHERE id = %s"

        cursor.execute(sql, values)
        conn.commit()

        updated = cursor.rowcount > 0
        cursor.close()
        conn.close()
        return updated

    # ---------------------------
    # Xóa user
    # ---------------------------
    def delete_user(self, user_id):
        conn = self.get_connection()
        cursor = conn.cursor()

        sql = "DELETE FROM Users WHERE id = %s"
        cursor.execute(sql, (user_id,))
        conn.commit()

        deleted = cursor.rowcount > 0
        cursor.close()
        conn.close()
        return deleted
