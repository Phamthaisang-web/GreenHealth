from app.models.user_model import UserModel
from werkzeug.security import generate_password_hash, check_password_hash

class UserService:
    def __init__(self):
        self.user_model = UserModel()

    def register_user(self, name, email, password):
        if self.user_model.get_user_by_email(email):
            return None

        password_hash = generate_password_hash(password)
        return self.user_model.insert_user(name, email, password_hash)

    def login_user(self, email, password):
        user = self.user_model.get_user_by_email(email)
        if user and check_password_hash(user["password"], password):
            return True
        return False

    def get_users(self):
        return self.user_model.select_all_users()
    def get_user_by_id(self, user_id):
        return self.user_model.get_user_by_id(user_id)
    