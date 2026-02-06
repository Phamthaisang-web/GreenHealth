import mysql.connector
from config import DB_CONFIG
from datetime import datetime

class OrderModel:
    def __init__(self):
        self.db_config = DB_CONFIG

    def get_connection(self):
        return mysql.connector.connect(**self.db_config)

    # ---------------------------
    # 1. Tạo đơn hàng mới (Kèm chi tiết)
    # ---------------------------
    def create_order(self, user_id, order_code, total_amount, items):
        """
        items: List các dict [{'product_id': 1, 'quantity': 2, 'price': 100, 'subtotal': 200}, ...]
        """
        conn = self.get_connection()
        cursor = conn.cursor()
        now = datetime.now()

        try:
            conn.start_transaction()

            # Chèn vào bảng Order (Lưu ý các trường trong ảnh: order_code, User ID, status)
            sql_order = """
                INSERT INTO `Order` (order_code, user_id, total_amount, status, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s)
            """
            # Mặc định status là PENDING theo sơ đồ
            cursor.execute(sql_order, (order_code, user_id, total_amount, 'PENDING', now, now))
            order_id = cursor.lastrowid

            # Chèn vào bảng Order_Detail
            sql_detail = """
                INSERT INTO Order_Detail (order_id, product_id, quantity, price, subtotal, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            for item in items:
                cursor.execute(sql_detail, (
                    order_id,
                    item['product_id'],
                    item['quantity'],
                    item['price'],
                    item['subtotal'], # Theo sơ đồ có trường subtotal
                    now,
                    now
                ))

            conn.commit()
            return order_id
        except mysql.connector.Error as err:
            conn.rollback()
            print(f"Lỗi: {err}")
            return None
        finally:
            cursor.close()
            conn.close()

    # ---------------------------
    # 2. Lấy danh sách đơn hàng theo User ID
    # ---------------------------
    def get_user_orders(self, user_id):
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)
        
        sql = "SELECT * FROM `Order` WHERE user_id = %s ORDER BY created_at DESC"
        cursor.execute(sql, (user_id,))
        orders = cursor.fetchall()
        
        cursor.close()
        conn.close()
        return orders

    # ---------------------------
    # 3. Lấy chi tiết một đơn hàng (Kèm thông tin sản phẩm)
    # ---------------------------
    def get_order_details(self, order_id):
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        # Lấy thông tin đơn hàng
        cursor.execute("SELECT * FROM `Order` WHERE id = %s", (order_id,))
        order = cursor.fetchone()

        if order:
            # Lấy chi tiết sản phẩm và JOIN với bảng Product để lấy name, image
            sql = """
                SELECT od.*, p.name, p.image 
                FROM Order_Detail od
                JOIN Product p ON od.product_id = p.id
                WHERE od.order_id = %s
            """
            cursor.execute(sql, (order_id,))
            order['items'] = cursor.fetchall()

        cursor.close()
        conn.close()
        return order

    # ---------------------------
    # 4. Cập nhật trạng thái đơn hàng
    # ---------------------------
    def update_status(self, order_id, new_status):
        """new_status: 'PENDING', 'SHIPPING', 'COMPLETED', 'CANCELLED'"""
        conn = self.get_connection()
        cursor = conn.cursor()
        now = datetime.now()
        
        sql = "UPDATE `Order` SET status = %s, updated_at = %s WHERE id = %s"
        cursor.execute(sql, (new_status, now, order_id))
        
        conn.commit()
        success = cursor.rowcount > 0
        cursor.close()
        conn.close()
        return success