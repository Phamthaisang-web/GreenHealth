from flask import request, jsonify
from functools import wraps

def role_required(*roles):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            # token_required đã gán request.user
            user = getattr(request, "user", None)

            if not user:
                return jsonify({"message": "Chưa xác thực người dùng"}), 401

            user_role = user.get("role")

            if user_role not in roles:
                return jsonify({
                    "message": "Không có quyền truy cập",
                    "required_roles": roles,
                    "your_role": user_role
                }), 403

            return f(*args, **kwargs)
        return decorated
    return decorator
