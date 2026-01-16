from flask import request, jsonify
from app.services.user_service import UserService

user_service = UserService()

def register():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"message": "Thiếu thông tin"}), 400

    user_id = user_service.register_user(name, email, password)
    if not user_id:
        return jsonify({"message": "Email đã tồn tại"}), 400

    return jsonify({"message": "User đã tạo", "user_id": user_id}), 201


def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Thiếu thông tin"}), 400

    if user_service.login_user(email, password):
        return jsonify({"message": "Đăng nhập thành công"})

    return jsonify({"message": "Sai email hoặc mật khẩu"}), 401


def get_users():
    users = user_service.get_users()
    return jsonify(users)

def get_user_by_id(user_id):
    user = user_service.get_user_by_id(user_id)
    if user:
        return jsonify(user)
    return jsonify({"message": "User không tồn tại"}), 404
