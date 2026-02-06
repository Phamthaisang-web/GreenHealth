from app.models.order_model import OrderModel
from app.models.product_model import ProductModel
from datetime import datetime
import uuid

class OrderService:
    def __init__(self):
        self.order_model = OrderModel()
        self.product_model = ProductModel()

    def place_order(self, user_id, cart_items):
        """ 
        cart_items: Danh sách dict [{'product_id': 1, 'quantity': 2}, ...]
        """
        if not cart_items:
            raise ValueError("Giỏ hàng không được để trống")

        processed_items = []
        total_amount = 0

        # 1. Kiểm tra sản phẩm và tính toán subtotal cho từng món
        for item in cart_items:
            product = self.product_model.get_product_by_id(item['product_id'])
            if not product:
                raise ValueError(f"Sản phẩm ID {item['product_id']} không tồn tại")
            
            # Logic: Tính thành tiền (subtotal)
            price = float(product['price'])
            quantity = int(item['quantity'])
            subtotal = price * quantity
            
            total_amount += subtotal
            
            # Chuẩn bị dữ liệu theo đúng cấu trúc Order_Detail trong ảnh
            processed_items.append({
                'product_id': product['id'],
                'quantity': quantity,
                'price': price,
                'subtotal': subtotal
            })

        # 2. Tạo mã đơn hàng duy nhất (order_code) theo sơ đồ
        order_code = f"ORD-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"

        # 3. Gọi Model để thực hiện lưu vào DB (sử dụng Transaction)
        order_id = self.order_model.create_order(
            user_id=user_id,
            order_code=order_code,
            total_amount=total_amount,
            items=processed_items
        )

        return order_id

    def get_order_history(self, user_id):
        """Lấy danh sách đơn hàng của một người dùng"""
        return self.order_model.get_user_orders(user_id)

    def get_order_detail(self, order_id):
        """Lấy chi tiết đơn hàng kèm thông tin sản phẩm"""
        order = self.order_model.get_order_details(order_id)
        if not order:
            return None
        return order

    def cancel_order(self, order_id):
        """Logic hủy đơn hàng (chỉ cho phép khi đang PENDING)"""
        order = self.order_model.get_order_details(order_id)
        if not order:
            raise ValueError("Đơn hàng không tồn tại")
            
        if order['status'] != 'PENDING':
            raise ValueError("Chỉ có thể hủy đơn hàng đang ở trạng thái chờ xử lý")

        return self.order_model.update_status(order_id, 'CANCELLED')