from app.models.order_detail_model import OrderDetailModel
from app.models.product_model import ProductModel
from datetime import datetime

class OrderDetailService:
    def __init__(self):
        # Khởi tạo các model liên quan để xử lý logic phối hợp
        self.order_detail_model = OrderDetailModel()
        self.product_model = ProductModel()

    # ---------------------------------------------------------
    # THÊM MẶT HÀNG VÀO ĐƠN HÀNG
    # ---------------------------------------------------------
    def add_item_to_order(self, order_id, product_id, quantity):
        """
        Nghiệp vụ:
        1. Kiểm tra sản phẩm có tồn tại không.
        2. Lấy giá niêm yết hiện tại (để lưu snapshot giá lúc mua).
        3. Thực hiện lưu chi tiết và tự động cập nhật tổng tiền hóa đơn.
        """
        # 1. Kiểm tra sản phẩm
        product = self.product_model.get_product_by_id(product_id)
        if not product:
            raise ValueError(f"Sản phẩm ID {product_id} không tồn tại.")

        # 2. Kiểm tra số lượng hợp lệ
        if int(quantity) <= 0:
            raise ValueError("Số lượng mặt hàng phải lớn hơn 0.")

        # 3. Lấy giá bán hiện tại (đảm bảo hóa đơn không đổi giá khi giá SP thay đổi sau này)
        price_at_order = product['price']

        return self.order_detail_model.insert_order_detail(
            order_id=order_id,
            product_id=product_id,
            quantity=quantity,
            price=price_at_order
        )

    # ---------------------------------------------------------
    # LẤY DANH SÁCH CHI TIẾT THEO ĐƠN HÀNG
    # ---------------------------------------------------------
    def get_all_items_in_order(self, order_id):
        """Lấy toàn bộ sản phẩm trong đơn hàng kèm thông tin tên/ảnh"""
        return self.order_detail_model.get_by_order_id(order_id)

    # ---------------------------------------------------------
    # CẬP NHẬT SỐ LƯỢNG MẶT HÀNG
    # ---------------------------------------------------------
    def update_item_quantity(self, detail_id, new_quantity):
        """
        Cập nhật số lượng mới. 
        Nếu số lượng đưa về 0 hoặc nhỏ hơn, hệ thống sẽ tự động xóa dòng này.
        """
        if int(new_quantity) <= 0:
            return self.delete_item(detail_id)
        
        return self.order_detail_model.update_quantity(detail_id, new_quantity)

    # ---------------------------------------------------------
    # XÓA MẶT HÀNG KHỎI ĐƠN
    # ---------------------------------------------------------
    def delete_item(self, detail_id):
        """Xóa chi tiết và tự động kích hoạt tính toán lại tổng tiền Order"""
        return self.order_detail_model.delete(detail_id)

    # ---------------------------------------------------------
    # TÍNH TOÁN THÔNG TIN TỔNG HỢP (Dành cho giao diện)
    # ---------------------------------------------------------
    def get_order_preview(self, order_id):
        """
        Trả về tóm tắt đơn hàng: Tổng số loại SP, tổng số lượng SP và danh sách chi tiết.
        """
        items = self.get_all_items_in_order(order_id)
        if not items:
            return {
                "total_distinct_items": 0,
                "total_quantity": 0,
                "items": []
            }

        return {
            "total_distinct_items": len(items),
            "total_quantity": sum(item['quantity'] for item in items),
            "items": items
        }   