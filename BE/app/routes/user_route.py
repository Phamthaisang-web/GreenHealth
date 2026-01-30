from flask import Blueprint
from app.controllers import user_controller

user_bp = Blueprint("user", __name__, url_prefix="/users")

# ---------------------------
# Các route công khai (Public)
# ---------------------------
user_bp.route("/register", methods=["POST"])(user_controller.register)
user_bp.route("/login", methods=["POST"])(user_controller.login)

# ---------------------------
# Các route quản lý User
# ---------------------------

# Lấy danh sách tất cả người dùng
user_bp.route("/", methods=["GET"])(user_controller.get_users)

# Lấy thông tin chi tiết một người dùng theo ID
user_bp.route("/<int:user_id>", methods=["GET"])(user_controller.get_user_by_id)

# Lưu ý: Nếu bạn muốn hỗ trợ thêm Cập nhật và Xóa, hãy thêm các dòng sau:
user_bp.route("/<int:user_id>", methods=["PUT"])(user_controller.update_user)
user_bp.route("/<int:user_id>", methods=["DELETE"])(user_controller.delete_user)