from app.models.supplier_model import SupplierModel
class SupplierService:
    def __init__(self):
        self.supplier_model = SupplierModel()

    def get_all_suppliers(self):
        return self.supplier_model.select_all_suppliers()
    def get_supplier_details(self, supplier_id):
        if not supplier_id:
            raise ValueError("Thiếu supplier_id")

        supplier = self.supplier_model.get_supplier_by_id(supplier_id)
        if not supplier:
            raise ValueError("Supplier không tồn tại")

        return supplier
    def create_supplier(self, data):
        name = data.get("name")
        phone = data.get("phone")
        address = data.get("address")
        description = data.get("description")

        if not name or not phone or not address:
            raise ValueError("Tên, số điện thoại và địa chỉ không được để trống")

        return self.supplier_model.insert_supplier(
            name=name,
            phone=phone,
            address=address,
            description=description
        )
    def update_supplier(self, supplier_id, data):
        if not supplier_id:
            raise ValueError("Thiếu supplier_id")

        allowed_fields = {"name", "phone", "address", "description"}
        update_data = {k: v for k, v in data.items() if k in allowed_fields}

        if not update_data:
            raise ValueError("Không có dữ liệu hợp lệ để cập nhật")

        success = self.supplier_model.update_supplier(supplier_id, **update_data)
        if not success:
            raise ValueError("Cập nhật thất bại hoặc supplier không tồn tại")

        return True
    def delete_supplier(self, supplier_id):
        if not supplier_id:
            raise ValueError("Thiếu supplier_id")

        success = self.supplier_model.delete_supplier(supplier_id)
        if not success:
            raise ValueError("Xóa thất bại hoặc supplier không tồn tại")

        return True