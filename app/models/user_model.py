import mysql.connector
from config import DB_CONFIG
from datetime import datetime

class UserModel:
    def __init__(self):
        self.db_config = DB_CONFIG

    def get_connection(self):
        return mysql.connector.connect(**self.db_config)

    # ---------------------------
    # Tạo user mới
    # ---------------------------
    def insert_user(self, name, phone, password_hash, role="user"):
        conn = self.get_connection()
        cursor = conn.cursor()

        sql = """
            INSERT INTO users 
            (name, phone, password, role, reward_points, status, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """
        now = datetime.now()
        cursor.execute(sql, (
            name,
            phone,
            password_hash,
            role,
            0,              # reward_points
            "Active",       # status
            now,
            now
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

        sql = "SELECT * FROM users WHERE phone = %s"
        cursor.execute(sql, (phone,))
        user = cursor.fetchone()

        cursor.close()
        conn.close()
        return user

    # ---------------------------
    # Lấy tất cả user
    # ---------------------------
    def select_all_users(self):
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = """
            SELECT id, name, phone, role, reward_points, status, created_at, updated_at
            FROM users
        """
        cursor.execute(sql)
        users = cursor.fetchall()

        cursor.close()
        conn.close()
        return users

    # ---------------------------
    # Cập nhật user
    # ---------------------------
    def update_user(self, user_id, name=None, phone=None, password_hash=None, role=None, reward_points=None, status=None):
        conn = self.get_connection()
        cursor = conn.cursor()

        fields = []
        values = []

        if name is not None:
            fields.append("name=%s")
            values.append(name)
        if phone is not None:
            fields.append("phone=%s")
            values.append(phone)
        if password_hash is not None:
            fields.append("password=%s")
            values.append(password_hash)
        if role is not None:
            fields.append("role=%s")
            values.append(role)
        if reward_points is not None:
            fields.append("reward_points=%s")
            values.append(reward_points)
        if status is not None:
            fields.append("status=%s")
            values.append(status)

        if not fields:
            cursor.close()
            conn.close()
            return False  # Không có gì để cập nhật

        fields.append("updated_at=%s")
        values.append(datetime.now())

        sql = f"UPDATE users SET {', '.join(fields)} WHERE id=%s"
        values.append(user_id)

        cursor.execute(sql, tuple(values))
        conn.commit()
        cursor.close()
        conn.close()
        return True

    # ---------------------------
    # Xóa user
    # ---------------------------
    def delete_user(self, user_id):
        conn = self.get_connection()
        cursor = conn.cursor()

        sql = "DELETE FROM users WHERE id=%s"
        cursor.execute(sql, (user_id,))

        conn.commit()
        cursor.close()
        conn.close()
        return True
# Thêm vào UserModel
def get_user_by_id(self, user_id):
    conn = self.get_connection()
    cursor = conn.cursor(dictionary=True)
    sql = "SELECT * FROM users WHERE id = %s"
    cursor.execute(sql, (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    return user