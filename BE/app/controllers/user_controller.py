from flask import request, jsonify
from app.services.user_service import UserService
import os
from dotenv import load_dotenv
import jwt
from datetime import datetime, timedelta

load_dotenv()
user_service = UserService()

def generate_token(user):
    # Đảm bảo payload nhận đúng thông tin từ object user trả về từ DB
    payload = {
        "user_id": user["id"],
        "role": user["role"],
        "exp": datetime.utcnow() + timedelta(hours=2)
    }
    token = jwt.encode(payload, os.getenv("SECRET_KEY"), algorithm="HS256")
    return token

def register():
    data = request.json
    name = data.get("name")
    phone = data.get("phone")  # Đổi từ email sang phone
    password = data.get("password")
    role = data.get("role", "user") # Có thể lấy role từ request hoặc mặc định

    if not name or not phone or not password:
        return jsonify({"message": "Thiếu thông tin (name, phone, password)"}), 400

    # Gọi service với phone
    user_id = user_service.register_user(name, phone, password, role)
    
    if not user_id:
        return jsonify({"message": "Số điện thoại đã tồn tại"}), 400

    return jsonify({"message": "User đã tạo thành công", "user_id": user_id}), 201

def login():
    data = request.json
    phone = data.get("phone")
    password = data.get("password")

    if not phone or not password:
        return jsonify({"message": "Thiếu số điện thoại hoặc mật khẩu"}), 400

    # Service hiện tại trả về object user hoặc None
    user = user_service.login_user(phone, password)
    
    if user:
        token = generate_token(user)
        return jsonify({
            "message": "Đăng nhập thành công",
            "token": token,
            "user": {
                "id": user["id"],
                "name": user["name"],
                "role": user["role"]
            }
        })

    return jsonify({"message": "Sai số điện thoại hoặc mật khẩu"}), 401

def get_users():
    users = user_service.get_users()
    return jsonify(users)

def get_user_by_id(user_id):
    user = user_service.get_user_by_id(user_id)
    if user:
        # Loại bỏ password trước khi trả về cho client để bảo mật
        if "password" in user:
            del user["password"]
        return jsonify(user)
    return jsonify({"message": "User không tồn tại"}), 404
def update_user(user_id):
    data = request.json
    success = user_service.update_user_info(user_id, **data)
    if success:
        return jsonify({"message": "Cập nhật thành công"})
    return jsonify({"message": "Cập nhật thất bại hoặc không có thay đổi"}), 400

def delete_user(user_id):
    success = user_service.delete_user(user_id)
    if success:
        return jsonify({"message": "Xóa người dùng thành công"})
    return jsonify({"message": "Xóa thất bại"}), 400