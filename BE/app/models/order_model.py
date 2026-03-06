import mysql.connector
from config import DB_CONFIG
from datetime import datetime


class OrderModel:

    def __init__(self):
        self.db_config = DB_CONFIG

    def get_connection(self):
        return mysql.connector.connect(**self.db_config)

    # ==========================================
    # TẠO ĐƠN HÀNG
    # ==========================================
    def create_order(
        self,
        user_id,
        address_id,
        order_code,
        total_amount_before,
        items,
        voucher_code=None
    ):

        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        try:

            conn.start_transaction()

            discount = 0

            # ==========================
            # CHECK VOUCHER
            # ==========================
            if voucher_code:

                cursor.execute("""
                    SELECT *
                    FROM Voucher
                    WHERE code = %s
                    AND status = 'active'
                    AND quantity > 0
                    AND start_date <= NOW()
                    AND end_date >= NOW()
                """, (voucher_code,))

                voucher = cursor.fetchone()

                if not voucher:
                    raise Exception("Voucher không hợp lệ")

                # ==========================
                # TÍNH GIẢM GIÁ
                # ==========================
                if voucher["discount_type"] == "percent":

                    discount = (
                        total_amount_before *
                        voucher["discount_value"] / 100
                    )

                    if voucher["max_discount"]:
                        discount = min(discount, voucher["max_discount"])

                else:
                    discount = voucher["discount_value"]

                # Trừ số lượng voucher
                cursor.execute("""
                    UPDATE Voucher
                    SET quantity = quantity - 1
                    WHERE code = %s
                """, (voucher_code,))

            # ==========================
            # TÍNH TOTAL
            # ==========================
            final_total = total_amount_before - discount

            if final_total < 0:
                final_total = 0

            # ==========================
            # INSERT ORDER
            # ==========================
            sql_order = """
                INSERT INTO Orders
                (
                    order_code,
                    user_id,
                    address_id,
                    total_amount_before,
                    discount_amount,
                    total_amount,
                    voucher_code,
                    status
                )
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
            """

            cursor.execute(sql_order, (
                order_code,
                user_id,
                address_id,
                total_amount_before,
                discount,
                final_total,
                voucher_code,
                "PENDING"
            ))

            order_id = cursor.lastrowid

            # ==========================
            # INSERT ORDER DETAIL
            # ==========================
            sql_detail = """
                INSERT INTO Order_Detail
                (order_id, product_id, quantity, price, subtotal)
                VALUES (%s,%s,%s,%s,%s)
            """

            for item in items:

                cursor.execute(sql_detail, (
                    order_id,
                    item["product_id"],
                    item["quantity"],
                    item["price"],
                    item["subtotal"]
                ))

            conn.commit()

            return order_id

        except Exception as e:

            conn.rollback()
            print("Lỗi create_order:", e)
            return None

        finally:

            cursor.close()
            conn.close()

    # ==========================================
    # LẤY ĐƠN HÀNG CỦA USER
    # ==========================================
    def get_user_orders(self, user_id):

        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = """
            SELECT *
            FROM Orders
            WHERE user_id = %s
            ORDER BY created_at DESC
        """

        cursor.execute(sql, (user_id,))
        orders = cursor.fetchall()

        cursor.close()
        conn.close()

        return orders

    # ==========================================
    # CHI TIẾT ĐƠN HÀNG
    # ==========================================
    def get_order_details(self, order_id):

        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute(
            "SELECT * FROM Orders WHERE id = %s",
            (order_id,)
        )

        order = cursor.fetchone()

        if order:

            sql = """
                SELECT 
                    od.*,
                    p.name
                FROM Order_Detail od
                JOIN Product p 
                ON od.product_id = p.id
                WHERE od.order_id = %s
            """

            cursor.execute(sql, (order_id,))
            order["items"] = cursor.fetchall()

        cursor.close()
        conn.close()

        return order

    # ==========================================
    # UPDATE STATUS
    # ==========================================
    def update_status(self, order_id, new_status):

        conn = self.get_connection()
        cursor = conn.cursor()

        now = datetime.now()

        sql = """
            UPDATE Orders
            SET status = %s, updated_at = %s
            WHERE id = %s
        """

        cursor.execute(sql, (new_status, now, order_id))

        conn.commit()

        success = cursor.rowcount > 0

        cursor.close()
        conn.close()

        return success

    # ==========================================
    # LẤY VOUCHER
    # ==========================================
    def get_voucher(self, code):

        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = """
            SELECT *
            FROM Voucher
            WHERE code = %s
            AND status = 'active'
            AND quantity > 0
            AND start_date <= NOW()
            AND end_date >= NOW()
        """

        cursor.execute(sql, (code,))
        voucher = cursor.fetchone()

        cursor.close()
        conn.close()

        return voucher

    # ==========================================
    # GIẢM SỐ LƯỢNG VOUCHER
    # ==========================================
    def decrease_voucher(self, code):

        conn = self.get_connection()
        cursor = conn.cursor()

        sql = """
            UPDATE Voucher
            SET quantity = quantity - 1
            WHERE code = %s
            AND quantity > 0
        """

        cursor.execute(sql, (code,))
        conn.commit()

        success = cursor.rowcount > 0

        cursor.close()
        conn.close()

        return success

    # ==========================================
    # ADMIN - LẤY TẤT CẢ ĐƠN HÀNG
    # ==========================================
    def get_all_orders(self):

        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = """
            SELECT 
                o.id,
                o.order_code,

                o.user_id,
                u.name AS user_name,
                u.phone AS user_phone,

                o.address_id,
                a.address_line,
                a.ward,
                a.district,
                a.city,

                o.total_amount_before,
                o.discount_amount,
                o.total_amount,
                o.voucher_code,

                o.status,
                o.created_at

            FROM Orders o

            LEFT JOIN Users u
            ON o.user_id = u.id

            LEFT JOIN Address a
            ON o.address_id = a.id

            ORDER BY o.created_at DESC
        """

        cursor.execute(sql)

        orders = cursor.fetchall()

        cursor.close()
        conn.close()

        return orders