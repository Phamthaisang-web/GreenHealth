import mysql.connector
from config import DB_CONFIG

class AddressModel:
    def __init__(self):
        self.db_config = DB_CONFIG

    def get_connection(self):
        return mysql.connector.connect(**self.db_config)

    # ---------------------------
    # Thêm địa chỉ
    # ---------------------------
    def insert_address(
        self,
        user_id,
        receiver_name,
        phone,
        address_line,
        ward,
        district,
        city,
        is_default=False
    ):
        conn = self.get_connection()
        cursor = conn.cursor()

        sql = """
            INSERT INTO Address (
                user_id,
                receiver_name,
                phone,
                address_line,
                ward,
                district,
                city,
                is_default
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """

        cursor.execute(sql, (
            user_id,
            receiver_name,
            phone,
            address_line,
            ward,
            district,
            city,
            is_default
        ))

        conn.commit()
        address_id = cursor.lastrowid

        cursor.close()
        conn.close()
        return address_id

    # ---------------------------
    # Lấy địa chỉ theo ID
    # ---------------------------
    def get_address_by_id(self, address_id):
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = "SELECT * FROM Address WHERE id = %s"
        cursor.execute(sql, (address_id,))
        address = cursor.fetchone()

        cursor.close()
        conn.close()
        return address

    # ---------------------------
    # Lấy danh sách địa chỉ của user
    # ---------------------------
    def get_addresses_by_user(self, user_id):
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = """
            SELECT * FROM Address
            WHERE user_id = %s
            ORDER BY is_default DESC, created_at DESC
        """
        cursor.execute(sql, (user_id,))
        addresses = cursor.fetchall()

        cursor.close()
        conn.close()
        return addresses

    # Cập nhật địa chỉ
    def update_address(self, address_id, **kwargs):
        conn = self.get_connection()
        cursor = conn.cursor()

        fields = []
        values = []

        for key, value in kwargs.items():
            fields.append(f"{key}=%s")
            values.append(value)

        if not fields:
            return False

        sql = f"UPDATE Address SET {', '.join(fields)} WHERE id=%s"
        values.append(address_id)

        cursor.execute(sql, tuple(values))
        conn.commit()

        success = cursor.rowcount > 0
        cursor.close()
        conn.close()
        return success

    # Xóa địa chỉ
    def delete_address(self, address_id):
        conn = self.get_connection()
        cursor = conn.cursor()

        sql = "DELETE FROM Address WHERE id=%s"
        cursor.execute(sql, (address_id,))
        conn.commit()

        success = cursor.rowcount > 0
        cursor.close()
        conn.close()
        return success

    # Bỏ default của các địa chỉ khác
    def unset_default_addresses(self, user_id):
        conn = self.get_connection()
        cursor = conn.cursor()

        sql = "UPDATE Address SET is_default = FALSE WHERE user_id = %s"
        cursor.execute(sql, (user_id,))
        conn.commit()

        cursor.close()
        conn.close()
