from app.models.user_model import UserModel
from app.services.otp_service import OTPService
from werkzeug.security import generate_password_hash, check_password_hash
import re


class UserService:
    def __init__(self):
        self.user_model = UserModel()
        self.otp_service = OTPService()
    # ---------------------------
    # Đăng ký user
    # ---------------------------
    def register_user(self, name, phone, email, password, otp, role="user"):

    # ---------------------------
    # Validate cơ bản
    # ---------------------------
        if not name or len(name.strip()) < 2:
            return {"error": "Tên không hợp lệ"}

        if not phone or not re.fullmatch(r"\d{9,11}", phone):
            return {"error": "Số điện thoại không hợp lệ"}

        if not email or not re.fullmatch(r"[^@]+@[^@]+\.[^@]+", email):
            return {"error": "Email không hợp lệ"}

        if not password or len(password) < 6:
            return {"error": "Mật khẩu phải >= 6 ký tự"}

        if role not in ["user", "staff", "admin"]:
            return {"error": "Role không hợp lệ"}

        if self.user_model.get_user_by_email(email):
            return {"error": "Email đã tồn tại"}

    
        otp_result = self.otp_service.verify_email_otp(email, otp)
        if "error" in otp_result:
            return otp_result   

    
        password_hash = generate_password_hash(password)

        user_id = self.user_model.insert_user(
            name=name,
            phone=phone,
            email=email,
            password_hash=password_hash,
            role=role
        )

        return {
            "message": "Đăng ký thành công",
            "user_id": user_id
        }

    # ---------------------------
    # Đăng nhập
    # ---------------------------
    def login_user(self, login_value, password):
    # login_value có thể là email hoặc phone
        if "@" in login_value:
            user = self.user_model.get_user_by_email(login_value)
        else:
            user = self.user_model.get_user_by_phone(login_value)

        if not user:
            return {"error": "Sai thông tin đăng nhập hoặc mật khẩu"}

        if user["status"] == "blocked":
            return {"error": "Tài khoản đã bị khóa"}

        if not check_password_hash(user["password"], password):
            return {"error": "Sai thông tin đăng nhập hoặc mật khẩu"}

        return {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "phone": user["phone"],
            "role": user["role"],
            "reward_points": user["reward_points"],
            "status": user["status"]
        }

    def get_users(self):
        return self.user_model.get_all_users()

    def get_user_by_id(self, user_id):
        if not user_id:
            return {"error": "Thiếu user_id"}

        user = self.user_model.get_user_by_id(user_id)
        if not user:
            return {"error": "User không tồn tại"}

        user.pop("password", None)
        return user

    def update_user_info(self, user_id, **kwargs):

        user = self.user_model.get_user_by_id(user_id)
        if not user:
            return {"error": "User không tồn tại"}

        allowed_fields = {"name", "email", "password", "status"}

        update_data = {}

        for k, v in kwargs.items():
            if k in allowed_fields:
                update_data[k] = v

        if not update_data:
            return {"error": "Không có dữ liệu hợp lệ để cập nhật"}

    
        if "password" in update_data:
            if len(update_data["password"]) < 6:
                return {"error": "Mật khẩu phải >= 6 ký tự"}
            update_data["password"] = generate_password_hash(update_data["password"])

     
        if "email" in update_data:
            if not re.fullmatch(r"[^@]+@[^@]+\.[^@]+", update_data["email"]):
                return {"error": "Email không hợp lệ"}

       
        if "status" in update_data:
            if update_data["status"] not in ["active", "blocked"]:
                return {"error": "Status không hợp lệ"}

        success = self.user_model.update_user(user_id, **update_data)
        if not success:
            return {"error": "Cập nhật thất bại"}

        return {"message": "Cập nhật user thành công"}

   
    def delete_user(self, user_id):

        user = self.user_model.get_user_by_id(user_id)
        if not user:
            return {"error": "User không tồn tại"}

        if user["role"] == "admin":
            return {"error": "Không được xóa admin"}

        self.user_model.update_user(user_id, status="blocked")
        return {"message": "User đã bị khóa"}

    
    def change_user_password(self, user_id, old_password, new_password):

        user = self.user_model.get_user_by_id(user_id)
        if not user:
            return {"error": "User không tồn tại"}

        if not check_password_hash(user["password"], old_password):
            return {"error": "Mật khẩu cũ không đúng"}

        if len(new_password) < 6:
            return {"error": "Mật khẩu mới phải >= 6 ký tự"}

        new_password_hash = generate_password_hash(new_password)
        self.user_model.update_user(user_id, password=new_password_hash)

        return {"message": "Đổi mật khẩu thành công"}
