import mysql.connector
from config import DB_CONFIG


class DashboardModel:

    def __init__(self):
        self.db_config = DB_CONFIG

    def get_connection(self):
        return mysql.connector.connect(**self.db_config)

    # -------------------------
    # Tổng số user
    # -------------------------
    def count_users(self):
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT COUNT(*) FROM Users")
        result = cursor.fetchone()[0]

        cursor.close()
        conn.close()

        return result

    # -------------------------
    # Tổng số sản phẩm
    # -------------------------
    def count_products(self):
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT COUNT(*) FROM Product")
        result = cursor.fetchone()[0]

        cursor.close()
        conn.close()

        return result

    # -------------------------
    # Tổng số đơn hàng
    # -------------------------
    def count_orders(self):
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT COUNT(*) FROM Orders")
        result = cursor.fetchone()[0]

        cursor.close()
        conn.close()

        return result

    # -------------------------
    # Tổng doanh thu
    # -------------------------
    def total_revenue(self):
        conn = self.get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT IFNULL(SUM(total_amount),0)
            FROM Orders
            WHERE status = 'COMPLETED'
        """)

        result = cursor.fetchone()[0]

        cursor.close()
        conn.close()

        return result

    # -------------------------
    # Đơn hàng mới nhất
    # -------------------------
    def latest_orders(self):

        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = """
            SELECT 
                o.id,
                o.order_code,
                u.name AS user_name,
                o.total_amount,
                o.status,
                o.created_at
            FROM Orders o
            LEFT JOIN Users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
            LIMIT 5
        """

        cursor.execute(sql)
        orders = cursor.fetchall()

        cursor.close()
        conn.close()

        return orders