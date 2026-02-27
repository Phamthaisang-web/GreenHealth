from flask import request, jsonify
from app.services.user_service import UserService
import os
from dotenv import load_dotenv
import jwt
from datetime import datetime, timedelta
from functools import wraps

load_dotenv()
user_service = UserService()
SECRET_KEY = os.getenv("SECRET_KEY")
def generate_token(user):
    payload = {
        "user_id": user["id"],
        "role": user["role"],
        "exp": datetime.utcnow() + timedelta(hours=2)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")
def jwt_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"message": "Thiếu token"}), 401

        token = auth_header.split(" ")[1]

        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            request.user = payload
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token đã hết hạn"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Token không hợp lệ"}), 401

        return f(*args, **kwargs)
    return decorated
def register():
    data = request.json or {}

    name = data.get("name")
    phone = data.get("phone")
    email = data.get("email")
    password = data.get("password")
    otp = data.get("otp")
    role = data.get("role", "user")

    if not all([name, phone, email, password, otp]):
        return jsonify({"message": "Thiếu thông tin đăng ký"}), 400

    result = user_service.register_user(
        name=name,
        phone=phone,
        email=email,
        password=password,
        otp=otp,
        role=role
    )

    return jsonify(result), (201 if "error" not in result else 400)
def login():
    data = request.json or {}

    login_value = data.get("login")  # email hoặc phone
    password = data.get("password")

    if not login_value or not password:
        return jsonify({"message": "Thiếu thông tin đăng nhập"}), 400

    user = user_service.login_user(login_value, password)
    if "error" in user:
        return jsonify(user), 401

    token = generate_token(user)

    return jsonify({
        "message": "Đăng nhập thành công",
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    }), 200

def change_password():
    user_id = request.user["user_id"]
    data = request.json or {}

    old_password = data.get("old_password")
    new_password = data.get("new_password")

    if not old_password or not new_password:
        return jsonify({"message": "Thiếu mật khẩu cũ hoặc mới"}), 400

    result = user_service.change_user_password(
        user_id, old_password, new_password
    )

    return jsonify(result), (200 if "error" not in result else 400)

def get_users():
    users = user_service.get_users()
    for u in users:
        u.pop("password", None)
    return jsonify(users), 200

def get_user_by_id(user_id):
    
    result = user_service.get_user_by_id(user_id)
    if "error" in result:
        return jsonify(result), 404
    result.pop("password", None)
    return jsonify(result), 200

def update_user():
    user_id = request.user["user_id"]
    data = request.json or {}
    result = user_service.update_user_info(user_id, **data)
    return jsonify(result), (200 if "error" not in result else 400)

def delete_user(user_id):
    result = user_service.delete_user(user_id)
    return jsonify(result), (200 if "error" not in result else 400)
