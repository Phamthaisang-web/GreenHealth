from flask import Blueprint, request, jsonify
from app.controllers import category_controller
from app.utils.auth_middleware import token_required

# Tạo Blueprint cho Category
category_bp = Blueprint("category", __name__, url_prefix="/categories")

# ---------------------------
# Các route công khai (Public)
# ---------------------------
# Lấy danh sách danh mục
category_bp.route("/", methods=["GET"])(category_controller.get_categories)

# Lấy chi tiết danh mục
category_bp.route("/<int:category_id>", methods=["GET"])(category_controller.get_category)

# ---------------------------
# Các route cần xác thực & quyền Admin
# ---------------------------

@category_bp.route("/", methods=["POST"])
@token_required
def create_category():
    # Kiểm tra quyền admin
    if request.user.get('role') != 'admin':
        return jsonify({"message": "Chỉ Admin mới có quyền thêm danh mục"}), 403
    return category_controller.create_category()

@category_bp.route("/<int:category_id>", methods=["PUT"])
@token_required
def update_category(category_id):
    if request.user.get('role') != 'admin':
        return jsonify({"message": "Không có quyền cập nhật danh mục"}), 403
    return category_controller.update_category(category_id)

@category_bp.route("/<int:category_id>", methods=["DELETE"])
@token_required
def delete_category(category_id):
    if request.user.get('role') != 'admin':
        return jsonify({"message": "Không có quyền xóa danh mục"}), 403
    return category_controller.delete_category(category_id)