from app.models.voucher_model import VoucherModule


class VoucherService:

    def __init__(self):
        self.voucher_module = VoucherModule()

    # ========================
    # Danh sách voucher
    # ========================
    def get_all_vouchers(self):

        return self.voucher_module.get_all()

    # ========================
    # Kiểm tra voucher
    # ========================
    def validate_voucher(self, code, order_total):

        voucher = self.voucher_module.get_by_code(code)

        if not voucher:
            return None, "Voucher không tồn tại"

        if voucher["status"] != "active":
            return None, "Voucher đã hết hạn"

        if voucher["quantity"] <= 0:
            return None, "Voucher đã hết lượt dùng"

        if order_total < voucher["min_order_value"]:
            return None, "Đơn hàng chưa đủ điều kiện"

        return voucher, None

    # ========================
    # Tạo voucher
    # ========================
    def create_voucher(self, data):

        return self.voucher_module.create(data)

    # ========================
    # Sử dụng voucher
    # ========================
    def use_voucher(self, voucher_id):

        self.voucher_module.decrease_quantity(voucher_id)