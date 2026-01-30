import jwt
import os
from flask import request, jsonify
from functools import wraps

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({"message": "Thiếu mã xác thực (Token)!"}), 401

        try:
            # Giải mã token
            data = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=["HS256"])
            
            # --- SỬA Ở ĐÂY ---
            # Đổi từ request.current_user thành request.user để khớp với Route
            request.user = data 
            # -----------------
            
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token đã hết hạn!"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Token không hợp lệ!"}), 401

        return f(*args, **kwargs)
    return decorated