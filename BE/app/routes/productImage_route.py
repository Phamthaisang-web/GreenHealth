from flask import Blueprint, request, jsonify
from app.controllers import productImage_controllers
from app.utils.auth_middleware import token_required

# Tạo Blueprint
product_image_bp = Blueprint(
    "product_image",
    __name__,
    url_prefix="/product-images"
)

# =============================
# Lấy tất cả ảnh theo product
# =============================
@product_image_bp.route("/product/<int:product_id>", methods=["GET"])
def get_images_by_product(product_id):
    return productImage_controllers.get_product_images(product_id)


# =============================
# Lấy ảnh chính
# =============================
@product_image_bp.route("/product/<int:product_id>/main", methods=["GET"])
def get_main_image(product_id):
    return productImage_controllers.get_main_image(product_id)


# =============================
# Thêm ảnh (Admin)
# =============================
@product_image_bp.route("/", methods=["POST"])
@token_required
def add_product_image():
    if request.user.get("role") != "admin":
        return jsonify({"message": "Chỉ Admin mới có quyền thêm ảnh"}), 403

    return productImage_controllers.add_product_image()


# =============================
# Cập nhật ảnh (Admin)
# =============================
@product_image_bp.route("/<int:image_id>", methods=["PUT"])
@token_required
def update_product_image(image_id):
    if request.user.get("role") != "admin":
        return jsonify({"message": "Không có quyền cập nhật ảnh"}), 403

    return productImage_controllers.update_product_image(image_id)


# =============================
# Xóa ảnh (Admin)
# =============================
@product_image_bp.route("/<int:image_id>", methods=["DELETE"])
@token_required
def delete_product_image(image_id):
    if request.user.get("role") != "admin":
        return jsonify({"message": "Không có quyền xóa ảnh"}), 403

    return productImage_controllers.delete_product_image(image_id)
