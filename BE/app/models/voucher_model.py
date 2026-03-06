import mysql.connector
from config import DB_CONFIG


class VoucherModule:

    def __init__(self):
        self.db_config = DB_CONFIG

    def get_connection(self):
        return mysql.connector.connect(**self.db_config)

    
    def get_all(self):

        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = "SELECT * FROM Voucher"

        cursor.execute(sql)
        result = cursor.fetchall()

        cursor.close()
        conn.close()

        return result

    
    def get_by_code(self, code):

        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = "SELECT * FROM Voucher WHERE code = %s"

        cursor.execute(sql, (code,))
        result = cursor.fetchone()

        cursor.close()
        conn.close()

        return result

    # ========================
    # Tạo voucher
    # ========================
    def create(self, data):

        conn = self.get_connection()
        cursor = conn.cursor()

        sql = """
        INSERT INTO Voucher
        (code, discount_type, discount_value, min_order_value,
         max_discount, quantity, start_date, end_date)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
        """

        cursor.execute(sql, (
            data["code"],
            data["discount_type"],
            data["discount_value"],
            data["min_order_value"],
            data["max_discount"],
            data["quantity"],
            data["start_date"],
            data["end_date"]
        ))

        conn.commit()

        cursor.close()
        conn.close()

        return cursor.lastrowid

    # ========================
    # Giảm số lượng voucher
    # ========================
    def decrease_quantity(self, voucher_id):

        conn = self.get_connection()
        cursor = conn.cursor()

        sql = """
        UPDATE Voucher
        SET quantity = quantity - 1
        WHERE id = %s AND quantity > 0
        """

        cursor.execute(sql, (voucher_id,))
        conn.commit()

        cursor.close()
        conn.close()
    