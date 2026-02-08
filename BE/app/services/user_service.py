from app.models.user_model import UserModel
from werkzeug.security import generate_password_hash, check_password_hash
import re

class UserService:
    def __init__(self):
        self.user_model = UserModel()

    # ---------------------------
    # Đăng ký user
    # ---------------------------
    def register_user(self, name, phone, password, role="user"):

        # Validate name
        if not name or len(name.strip()) < 2:
            return {"error": "Tên không hợp lệ"}

        # Validate phone
        if not phone or not re.fullmatch(r"\d{9,11}", phone):
            return {"error": "Số điện thoại không hợp lệ"}

        # Validate password
        if not password or len(password) < 6:
            return {"error": "Mật khẩu phải >= 6 ký tự"}

        # Validate role
        if role not in ["user", "staff", "admin"]:
            return {"error": "Role không hợp lệ"}

        # Check tồn tại
        if self.user_model.get_user_by_phone(phone):
            return {"error": "Số điện thoại đã tồn tại"}

        password_hash = generate_password_hash(password)
        user_id = self.user_model.insert_user(name, phone, password_hash, role)

        return {"message": "Đăng ký thành công", "user_id": user_id}

    # ---------------------------
    # Đăng nhập
    # ---------------------------
    def login_user(self, phone, password):
        user = self.user_model.get_user_by_phone(phone)

        if not user:
            return {"error": "Sai số điện thoại hoặc mật khẩu"}

        if user["status"] == "blocked":
            return {"error": "Tài khoản đã bị khóa"}

        if not check_password_hash(user["password"], password):
            return {"error": "Sai số điện thoại hoặc mật khẩu"}

        return user

    # ---------------------------
    # Lấy danh sách user
    # ---------------------------
    def get_users(self):
        return self.user_model.select_all_users()

    # ---------------------------
    # Lấy user theo ID
    # ---------------------------
    def get_user_by_id(self, user_id):
        if not user_id:
            return {"error": "Thiếu user_id"}

        user = self.user_model.get_user_by_id(user_id)
        if not user:
            return {"error": "User không tồn tại"}

        return user

    # ---------------------------
    # Cập nhật user
    # ---------------------------
    def update_user_info(self, user_id, **kwargs):

        user = self.user_model.get_user_by_id(user_id)
        if not user:
            return {"error": "User không tồn tại"}

        allowed_fields = {"name", "password", "status"}

        update_data = {}
        for k, v in kwargs.items():
            if k in allowed_fields:
                update_data[k] = v

        if not update_data:
            return {"error": "Không có dữ liệu hợp lệ để cập nhật"}

        # Password
        if "password" in update_data:
            if len(update_data["password"]) < 6:
                return {"error": "Mật khẩu phải >= 6 ký tự"}
            update_data["password"] = generate_password_hash(update_data["password"])

        # Status
        if "status" in update_data:
            if update_data["status"] not in ["active", "blocked"]:
                return {"error": "Status không hợp lệ"}

        success = self.user_model.update_user(user_id, **update_data)
        if not success:
            return {"error": "Cập nhật thất bại"}

        return {"message": "Cập nhật user thành công"}

    # ---------------------------
    # Xóa user
    # ---------------------------
    def delete_user(self, user_id):

        user = self.user_model.get_user_by_id(user_id)
        if not user:
            return {"error": "User không tồn tại"}

        if user["role"] == "admin":
            return {"error": "Không được xóa admin"}

        self.user_model.delete_user(user_id)
        return {"message": "Xóa user thành công"}
