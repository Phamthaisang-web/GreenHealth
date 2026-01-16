from flask import Blueprint
from app.controllers import category_controller

category_bp = Blueprint("category", __name__, url_prefix="/categories")

# ---------------------------
# Các route công khai (Dùng cho khách hàng/hiển thị)
# ---------------------------

# Lấy danh sách tất cả danh mục (để hiện menu hoặc bộ lọc)
category_bp.route("/", methods=["GET"])(category_controller.get_categories)

# Xem chi tiết một danh mục theo ID
category_bp.route("/<int:category_id>", methods=["GET"])(category_controller.get_category)

# ---------------------------
# Các route quản lý Danh mục (Thường yêu cầu quyền Admin)
# ---------------------------

# Thêm danh mục mới
category_bp.route("/", methods=["POST"])(category_controller.create_category)

# Cập nhật thông tin danh mục
category_bp.route("/<int:category_id>", methods=["PUT"])(category_controller.update_category)

# Xóa danh mục
category_bp.route("/<int:category_id>", methods=["DELETE"])(category_controller.delete_category)