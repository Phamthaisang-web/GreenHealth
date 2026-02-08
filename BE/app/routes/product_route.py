from flask import Blueprint, request, jsonify
from app.controllers import product_controller
from app.utils.auth_middleware import token_required

product_bp = Blueprint("product", __name__, url_prefix="/products")

product_bp.route("/", methods=["GET"])(product_controller.get_products)
product_bp.route("/<int:product_id>", methods=["GET"])(product_controller.get_product_id)


@product_bp.route("/", methods=["POST"])
@token_required
def create_product():
    if request.user.get('role') != 'admin':
        return jsonify({"message": "Chỉ Admin mới có quyền thêm sản phẩm"}), 403
    return product_controller.create_product()

@product_bp.route("/<int:product_id>", methods=["PUT"])
@token_required
def update_product(product_id):
    if request.user.get('role') != 'admin':
        return jsonify({"message": "Không có quyền cập nhật"}), 403
    return product_controller.update_product(product_id)

@product_bp.route("/<int:product_id>", methods=["DELETE"])
@token_required
def delete_product(product_id):
    if request.user.get('role') != 'admin':
        return jsonify({"message": "Không có quyền xóa"}), 403
    return product_controller.delete_product(product_id)