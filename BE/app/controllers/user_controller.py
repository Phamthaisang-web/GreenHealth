from flask import request, jsonify
from app.services.user_service import UserService
import os
from dotenv import load_dotenv
import jwt
from datetime import datetime, timedelta

load_dotenv()
user_service = UserService()

# ---------------------------
# Tạo JWT
# ---------------------------
def generate_token(user):
    payload = {
        "user_id": user["id"],
        "role": user["role"],
        "exp": datetime.utcnow() + timedelta(hours=2)
    }
    token = jwt.encode(payload, os.getenv("SECRET_KEY"), algorithm="HS256")
    return token

# ---------------------------
# Register
# ---------------------------
def register():
    data = request.json or {}

    name = data.get("name")
    phone = data.get("phone")
    password = data.get("password")
    role = data.get("role", "user")

    if not name or not phone or not password:
        return jsonify({"message": "Thiếu thông tin (name, phone, password)"}), 400

    result = user_service.register_user(name, phone, password, role)

    if "error" in result:
        return jsonify(result), 400

    return jsonify(result), 201

# ---------------------------
# Login
# ---------------------------
def login():
    data = request.json or {}

    phone = data.get("phone")
    password = data.get("password")

    if not phone or not password:
        return jsonify({"message": "Thiếu số điện thoại hoặc mật khẩu"}), 400

    user = user_service.login_user(phone, password)

    if "error" in user:
        return jsonify(user), 401

    token = generate_token(user)

    return jsonify({
        "message": "Đăng nhập thành công",
        "token": token,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "phone": user["phone"],
            "role": user["role"]
        }
    }), 200

# ---------------------------
# Get all users
# ---------------------------
def get_users():
    users = user_service.get_users()

    # Ẩn password
    for u in users:
        u.pop("password", None)

    return jsonify(users), 200

# ---------------------------
# Get user by id
# ---------------------------
def get_user_by_id(user_id):
    result = user_service.get_user_by_id(user_id)

    if "error" in result:
        return jsonify(result), 404

    result.pop("password", None)
    return jsonify(result), 200

# ---------------------------
# Update user
# ---------------------------
def update_user(user_id):
    data = request.json or {}

    if not data:
        return jsonify({"message": "Không có dữ liệu cập nhật"}), 400

    result = user_service.update_user_info(user_id, **data)

    if "error" in result:
        return jsonify(result), 400

    return jsonify(result), 200

# ---------------------------
# Delete user
# ---------------------------
def delete_user(user_id):
    result = user_service.delete_user(user_id)

    if "error" in result:
        return jsonify(result), 400

    return jsonify(result), 200
