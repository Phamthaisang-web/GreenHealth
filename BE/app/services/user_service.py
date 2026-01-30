from app.models.user_model import UserModel
from werkzeug.security import generate_password_hash, check_password_hash

class UserService:
    def __init__(self):
        self.user_model = UserModel()

    def register_user(self, name, phone, password, role="user"):
        # Kiểm tra xem số điện thoại đã tồn tại chưa
        if self.user_model.get_user_by_phone(phone):
            return None

        # Mã hóa mật khẩu trước khi lưu
        password_hash = generate_password_hash(password)
        
        # Gọi model để insert (đảm bảo thứ tự tham số khớp với model)
        return self.user_model.insert_user(name, phone, password_hash, role)

    def login_user(self, phone, password):
        # Tìm user dựa trên số điện thoại
        user = self.user_model.get_user_by_phone(phone)
        
        # Kiểm tra user tồn tại và mật khẩu khớp
        if user and check_password_hash(user["password"], password):
            return user  # Trả về thông tin user thay vì chỉ True để tiện làm session/token
        return None

    def get_users(self):
        return self.user_model.select_all_users()

    def get_user_by_id(self, user_id):
        # Lưu ý: Trong model của bạn chưa có hàm get_user_by_id 
        # Bạn nên bổ sung hàm này vào UserModel hoặc dùng get_user_by_phone
        return self.user_model.get_user_by_id(user_id)

    def update_user_info(self, user_id, **kwargs):
        # Nếu có cập nhật mật khẩu, cần hash trước
        if 'password' in kwargs:
            kwargs['password_hash'] = generate_password_hash(kwargs.pop('password'))
            
        return self.user_model.update_user(user_id, **kwargs)

    def delete_user(self, user_id):
        return self.user_model.delete_user(user_id)