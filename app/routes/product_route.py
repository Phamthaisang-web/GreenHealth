from flask import Blueprint
from app.controllers import product_controller

product_bp = Blueprint("product", __name__, url_prefix="/products")

# ---------------------------
# Các route công khai (Xem sản phẩm)
# ---------------------------

# Lấy danh sách sản phẩm (có lọc theo tên, category, giá, ngày tháng và phân trang)
product_bp.route("/", methods=["GET"])(product_controller.get_products)

# Xem chi tiết một sản phẩm theo ID
product_bp.route("/<int:product_id>", methods=["GET"])(product_controller.get_product)

# ---------------------------
# Các route quản lý Sản phẩm (Thường yêu cầu quyền Admin)
# ---------------------------

# Thêm sản phẩm mới
product_bp.route("/", methods=["POST"])(product_controller.create_product)

# Cập nhật thông tin sản phẩm
product_bp.route("/<int:product_id>", methods=["PUT"])(product_controller.update_product)

# Xóa sản phẩm
product_bp.route("/<int:product_id>", methods=["DELETE"])(product_controller.delete_product)