from flask import Blueprint, request, jsonify
from app.controllers import order_detail_controller
from app.utils.auth_middleware import token_required

order_detail_bp = Blueprint("order_detail", __name__, url_prefix="/order-details")


# ---------------------------
# USER: Xem chi tiết order của mình
# ---------------------------
@order_detail_bp.route("/order/<int:order_id>", methods=["GET"])
@token_required
def get_order_details(order_id):
    # Có thể thêm check order thuộc user nếu bạn muốn secure hơn
    return order_detail_controller.get_order_details(order_id)


# ---------------------------
# USER: Thêm sản phẩm vào order
# ---------------------------
@order_detail_bp.route("/", methods=["POST"])
@token_required
def add_product_to_order():
    return order_detail_controller.add_product_to_order()


# ---------------------------
# ADMIN: Xóa order detail
# ---------------------------
@order_detail_bp.route("/<int:detail_id>", methods=["DELETE"])
@token_required
def delete_order_detail(detail_id):
    if request.user.get("role") != "admin":
        return jsonify({"message": "Chỉ Admin mới có quyền xóa"}), 403

    return order_detail_controller.delete_order_detail(detail_id)
