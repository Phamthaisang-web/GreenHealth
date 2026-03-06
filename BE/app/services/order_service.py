from flask import request
from decimal import Decimal
from app.models.order_model import OrderModel
from app.models.product_model import ProductModel
from datetime import datetime
import uuid


class OrderService:

    def __init__(self):
        self.order_model = OrderModel()
        self.product_model = ProductModel()

    # =========================
    # Tạo đơn hàng
    # =========================
    def place_order(self, user_id, cart_items, address_id, voucher_code=None):

        if not cart_items:
            raise ValueError("Giỏ hàng không được để trống")

        if not user_id or not address_id:
            raise ValueError("Thiếu user_id hoặc address_id")

        processed_items = []
        total_amount_before = 0

        for item in cart_items:

            product = self.product_model.get_product_by_id(item['product_id'])

            if not product:
                raise ValueError(f"Sản phẩm ID {item['product_id']} không tồn tại")

            price = Decimal(product['price'])
            quantity = int(item['quantity'])

            subtotal = price * quantity
            total_amount_before += subtotal

            processed_items.append({
                "product_id": product["id"],
                "quantity": quantity,
                "price": price,
                "subtotal": subtotal
            })

        order_code = f"ORD-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"

        order_id = self.order_model.create_order(
            user_id=user_id,
            address_id=address_id,
            order_code=order_code,
            total_amount_before=total_amount_before,
            items=processed_items,
            voucher_code=voucher_code
        )

        return order_id


    # =========================
    # Lấy lịch sử đơn hàng user
    # =========================
    def get_order_history(self, user_id):
        return self.order_model.get_user_orders(user_id)


    # =========================
    # Chi tiết đơn hàng
    # =========================
    def get_order_detail(self, order_id):

        order = self.order_model.get_order_details(order_id)

        if not order:
            return None

        return order


    # =========================
    # Hủy đơn
    # =========================
    def cancel_order(self, order_id):

        order = self.order_model.get_order_details(order_id)

        if not order:
            raise ValueError("Đơn hàng không tồn tại")

        if order["status"] != "PENDING":
            raise ValueError("Chỉ có thể hủy đơn hàng đang ở trạng thái chờ xử lý")

        return self.order_model.update_status(order_id, "CANCELLED")


    # =========================
    # Admin cập nhật trạng thái
    # =========================
    def update_order_status(self, order_id, new_status):

        valid_status = ["PENDING", "SHIPPING", "COMPLETED", "CANCELLED"]

        if new_status not in valid_status:
            raise ValueError("Trạng thái không hợp lệ")

        order = self.order_model.get_order_details(order_id)

        if not order:
            raise ValueError("Đơn hàng không tồn tại")

        return self.order_model.update_status(order_id, new_status)


    # =========================
    # ADMIN - Lấy toàn bộ đơn hàng
    # =========================
    def get_all_orders(self):
        return self.order_model.get_all_orders()