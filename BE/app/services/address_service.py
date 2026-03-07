from app.models.address_model import AddressModel

class AddressService:
    def __init__(self):
        self.address_model = AddressModel()

    # Tạo địa chỉ mới
    def create_address(self, user_id, data):
        required_fields = [
            "receiver_name",
            "phone",
            "address_line",
            "ward",
            "district",
            "city"
        ]

        # Check user_id
        if not user_id:
            raise ValueError("Thiếu user_id")

        # Check field bắt buộc
        for field in required_fields:
            if not data.get(field):
                raise ValueError(f"Thiếu thông tin {field}")

        is_default = data.get("is_default", False)

        # Nếu đặt địa chỉ mới là default → bỏ default cũ
        if is_default:
            self.address_model.unset_default_addresses(user_id)

        return self.address_model.insert_address(
            user_id=user_id,
            receiver_name=data["receiver_name"],
            phone=data["phone"],
            address_line=data["address_line"],
            ward=data["ward"],
            district=data["district"],
            city=data["city"],
            is_default=is_default
        )

    def get_user_addresses(self, user_id):
        if not user_id:
            raise ValueError("Thiếu user_id")

        return self.address_model.get_addresses_by_user(user_id)
    # Lấy chi tiết địa chỉ
    def get_address_details(self, address_id):
        if not address_id:
            raise ValueError("Thiếu address_id")

        address = self.address_model.get_address_by_id(address_id)
        if not address:
            raise ValueError("Địa chỉ không tồn tại")

        return address

    # Cập nhật địa chỉ
    def update_address(self, user_id, address_id, data):
        if not user_id:
            raise ValueError("Thiếu user_id")

        if not address_id:
            raise ValueError("Thiếu address_id")

        allowed_fields = {
            "receiver_name",
            "phone",
            "address_line",
            "ward",
            "district",
            "city",
            "is_default"
        }

        update_data = {k: v for k, v in data.items() if k in allowed_fields}

        if not update_data:
            raise ValueError("Không có dữ liệu hợp lệ để cập nhật")

    
        if update_data.get("is_default") is True:
            self.address_model.unset_default_addresses(user_id)

        success = self.address_model.update_address(address_id, **update_data)
        if not success:
            raise ValueError("Cập nhật thất bại hoặc địa chỉ không tồn tại")

        return True

    # xóa
    def delete_address(self, address_id):
        if not address_id:
            raise ValueError("Thiếu address_id")

        success = self.address_model.delete_address(address_id)
        if not success:
            raise ValueError("Xóa thất bại hoặc địa chỉ không tồn tại")

        return True
