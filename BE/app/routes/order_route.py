from flask import Blueprint, request, jsonify
from app.controllers import order_controller
from app.utils.auth_middleware import token_required

order_bp = Blueprint("order", __name__, url_prefix="/orders")


# ---------------------------
# USER: Đặt hàng
# ---------------------------
@order_bp.route("/", methods=["POST"])
@token_required
def place_order():
    """
    USER đặt hàng từ giỏ
    user_id sẽ lấy từ token
    """
    data = request.json or {}
    data["user_id"] = request.user.get("id")

    return order_controller.place_order(data)


# ---------------------------
# USER: Xem lịch sử đơn hàng của mình
# ---------------------------
@order_bp.route("/my-orders", methods=["GET"])
@token_required
def get_my_orders():
    user_id = request.user.get("id")
    return order_controller.get_order_history(user_id)


# ---------------------------
# USER: Xem chi tiết 1 đơn hàng của mình
# ---------------------------
@order_bp.route("/<int:order_id>", methods=["GET"])
@token_required
def get_order_detail(order_id):
    """
    Có thể check order thuộc user trong controller/service
    """
    return order_controller.get_order_detail(order_id, request.user)


# ---------------------------
# USER: Hủy đơn hàng
# ---------------------------
@order_bp.route("/<int:order_id>/cancel", methods=["PUT"])
@token_required
def cancel_order(order_id):
    return order_controller.cancel_order(order_id, request.user)


# ---------------------------
# ADMIN: Xem tất cả đơn hàng
# ---------------------------
@order_bp.route("/", methods=["GET"])
@token_required
def get_all_orders():
    if request.user.get("role") != "admin":
        return jsonify({"message": "Chỉ Admin mới có quyền truy cập"}), 403

    return order_controller.get_all_orders()