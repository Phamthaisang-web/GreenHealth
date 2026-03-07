from flask import Blueprint, request, jsonify
from app.controllers import order_controller
from app.utils.auth_middleware import token_required

order_bp = Blueprint("order", __name__, url_prefix="/orders")


# ddatw hang
@order_bp.route("/", methods=["POST"])
@token_required
def place_order():
    return order_controller.place_order()


# lịch sử đon hangdf của mình
@order_bp.route("/my-orders", methods=["GET"])
@token_required
def get_my_orders():
    user_id = request.user.get("user_id")
    return order_controller.get_order_history(user_id)


# xem chi tiết đơn hàng
@order_bp.route("/<int:order_id>", methods=["GET"])
@token_required
def get_order_detail(order_id):
    
    return order_controller.get_order_detail(order_id)

# hủy đơn
@order_bp.route("/<int:order_id>/cancel", methods=["PUT"])
@token_required
def cancel_order(order_id):
    return order_controller.cancel_order(order_id, request.user)


# admin lấy tất cả đơn
@order_bp.route("/", methods=["GET"])
@token_required
def get_all_orders():
    if request.user.get("role") != "admin":
        return jsonify({"message": "Chỉ Admin mới có quyền truy cập"}), 403

    return order_controller.get_all_orders()
# admin cập nhập trangh thái
@order_bp.route("/status/<int:order_id>", methods=["PUT"])
@token_required
def update_order_status(order_id):
    if request.user.get("role") != "admin" :
        return jsonify({"message": "Chỉ Admin mới có quyền thực hiện"}), 403

    return order_controller.update_order_status(order_id)