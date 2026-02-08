import mysql.connector
from config import DB_CONFIG
from datetime import datetime

class OrderDetailModel:
    def __init__(self):
        self.db_config = DB_CONFIG

    def get_connection(self):
        """Tạo kết nối mới tới database"""
        return mysql.connector.connect(**self.db_config)

    # ---------------------------------------------------------
    # 1. THÊM CHI TIẾT ĐƠN HÀNG
    # ---------------------------------------------------------
    def insert_order_detail(self, order_id, product_id, quantity, price):
      
        conn = self.get_connection()
        cursor = conn.cursor()

        subtotal = float(price) * int(quantity)
        now = datetime.now()

        sql = """
            INSERT INTO Order_Detail 
            (order_id, product_id, quantity, price, subtotal, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        try:
            cursor.execute(sql, (order_id, product_id, quantity, price, subtotal, now, now))
            conn.commit()
            detail_id = cursor.lastrowid
            
            # Tự động cập nhật tổng tiền đơn hàng sau khi thêm
            self.update_order_total_amount(order_id)
            
            return detail_id
        except Exception as e:
            print(f"Lỗi khi thêm chi tiết đơn hàng: {e}")
            conn.rollback()
            return None
        finally:
            cursor.close()
            conn.close()

    # ---------------------------------------------------------
    # 2. LẤY DANH SÁCH THEO ORDER ID
    # ---------------------------------------------------------
    def get_by_order_id(self, order_id):
        """
        Lấy tất cả chi tiết của một đơn hàng, kèm thông tin sản phẩm.
        """
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = """
            SELECT od.*, p.name AS product_name, p.image, p.unit
            FROM Order_Detail od
            JOIN Product p ON od.product_id = p.id
            WHERE od.order_id = %s
        """
        cursor.execute(sql, (order_id,))
        data = cursor.fetchall()

        cursor.close()
        conn.close()
        return data

    # ---------------------------------------------------------
    # 3. CẬP NHẬT SỐ LƯỢNG
    # ---------------------------------------------------------
    def update_quantity(self, detail_id, new_quantity):
        """
        Cập nhật số lượng của một dòng và tính lại subtotal + order total.
        """
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        try:
            # Lấy giá hiện tại và order_id
            cursor.execute("SELECT order_id, price FROM Order_Detail WHERE id = %s", (detail_id,))
            row = cursor.fetchone()
            if not row:
                return False

            new_subtotal = float(row['price']) * int(new_quantity)
            
            sql = "UPDATE Order_Detail SET quantity=%s, subtotal=%s, updated_at=%s WHERE id=%s"
            cursor.execute(sql, (new_quantity, new_subtotal, datetime.now(), detail_id))
            
            conn.commit()
            
            # Cập nhật lại tổng tiền của đơn hàng lớn
            self.update_order_total_amount(row['order_id'])
            return True
        except Exception as e:
            print(f"Lỗi khi cập nhật số lượng: {e}")
            conn.rollback()
            return False
        finally:
            cursor.close()
            conn.close()

    # ---------------------------------------------------------
    # 4. XÓA CHI TIẾT
    # ---------------------------------------------------------
    def delete(self, detail_id):
        """
        Xóa một dòng chi tiết và cập nhật lại tổng tiền đơn hàng.
        """
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        try:
            # Lấy order_id trước khi xóa
            cursor.execute("SELECT order_id FROM Order_Detail WHERE id = %s", (detail_id,))
            row = cursor.fetchone()
            
            if row:
                order_id = row['order_id']
                sql = "DELETE FROM Order_Detail WHERE id=%s"
                cursor.execute(sql, (detail_id,))
                conn.commit()
                
                # Cập nhật lại tổng tiền đơn hàng
                self.update_order_total_amount(order_id)
                return True
            return False
        except Exception as e:
            print(f"Lỗi khi xóa chi tiết: {e}")
            conn.rollback()
            return False
        finally:
            cursor.close()
            conn.close()

    # ---------------------------------------------------------
    # 5. ĐỒNG BỘ TỔNG TIỀN (HÀM NỘI BỘ)
    # ---------------------------------------------------------
    def update_order_total_amount(self, order_id):
        """
        Tính tổng các subtotal và cập nhật vào cột total_amount của bảng Order.
        """
        conn = self.get_connection()
        cursor = conn.cursor()

        try:
            # 1. Tính tổng từ bảng Order_Detail
            sql_sum = "SELECT SUM(subtotal) FROM Order_Detail WHERE order_id = %s"
            cursor.execute(sql_sum, (order_id,))
            total = cursor.fetchone()[0] or 0

            # 2. Cập nhật vào bảng Order
            sql_update = "UPDATE `Order` SET total_amount=%s, updated_at=%s WHERE id=%s"
            cursor.execute(sql_update, (total, datetime.now(), order_id))
            
            conn.commit()
        except Exception as e:
            print(f"Lỗi khi đồng bộ tổng tiền: {e}")
        finally:
            cursor.close()
            conn.close()