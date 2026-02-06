from app.models.supplier_model import SupplierModel
from datetime import datetime

class SupplierService:
    def __init__(self):
        self.supplier_model = SupplierModel()

    # ---------------------------
    # Tạo nhà cung cấp mới với logic kiểm tra
    # ---------------------------
    def create_supplier(self, data):
        """
        data: dict chứa {name, phone, address, status, ...}
        """
        # 1. Logic nghiệp vụ: Tên không được để trống
        if not data.get('name') or len(data.get('name').strip()) == 0:
            raise ValueError("Tên nhà cung cấp là bắt buộc")

        # 2. Logic nghiệp vụ: Kiểm tra số điện thoại (phải là số)
        phone = data.get('phone', '')
        if phone and not phone.isdigit():
            raise ValueError("Số điện thoại chỉ được chứa ký tự số")

        # 3. Gán trạng thái mặc định nếu không có
        # Dựa theo sơ đồ: Active hoặc Blocked
        status = data.get('status', 'Active')

        return self.supplier_model.insert_supplier(
            name=data.get('name'),
            phone=data.get('phone'),
            address=data.get('address'),
            status=status
        )

    # ---------------------------
    # Lấy danh sách NCC có bộ lọc
    # ---------------------------
    def get_all_suppliers(self, name=None, page=1, page_size=10):
        return self.supplier_model.select_all_suppliers(
            name=name,
            page=page,
            page_size=page_size
        )

    # ---------------------------
    # Lấy thông tin chi tiết
    # ---------------------------
    def get_supplier_details(self, supplier_id):
        supplier = self.supplier_model.get_supplier_by_id(supplier_id)
        if not supplier:
            return None
        return supplier

    # ---------------------------
    # Cập nhật thông tin
    # ---------------------------
    def update_supplier_info(self, supplier_id, **kwargs):
        # Kiểm tra tồn tại trước khi cập nhật
        if not self.get_supplier_details(supplier_id):
            return False
            
        # Có thể thêm logic kiểm tra email/phone hợp lệ tại đây trước khi gọi Model
        return self.supplier_model.update_supplier(supplier_id, **kwargs)

    # ---------------------------
    # Chặn nhà cung cấp (Thay vì xóa)
    # ---------------------------
    def block_supplier(self, supplier_id):
        """
        Dựa trên sơ đồ có trường status: 'Active/Blocked', 
        thay vì xóa bản ghi làm mất lịch sử nhập hàng, ta nên đổi trạng thái.
        """
        return self.update_supplier_info(supplier_id, status='Blocked')

    # ---------------------------
    # Xóa nhà cung cấp
    # ---------------------------
    def delete_supplier(self, supplier_id):
        # Lưu ý: Cần kiểm tra xem có Product nào thuộc NCC này không
        # Nếu có, thường sẽ không cho xóa để đảm bảo toàn vẹn dữ liệu (Foreign Key)
        return self.supplier_model.delete_supplier(supplier_id)