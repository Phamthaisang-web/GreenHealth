from flask import jsonify,request
from app.services.order_service import OrderService

order_service = OrderService()


# ---------------------------
# PLACE ORDER
# ---------------------------
def place_order():
    user_id = request.user["user_id"]
    
    data  = request.json

    if not data:
        return jsonify({"message": "Không có dữ liệu"}), 400
    
    cart_items = data.get("cart_items")
    address_id=data.get("address_id")
    voucher_code = data.get("voucher_code")
    

    try:
        order_id = order_service.place_order(user_id, cart_items,address_id,voucher_code)

        return jsonify({
            "message": "Đặt hàng thành công",
            "order_id": order_id
        }), 201

    except ValueError as e:
        return jsonify({"message": str(e)}), 400
    except Exception as e:
        return jsonify({
            "message": "Lỗi hệ thống",
            "error": str(e)
        }), 500


# ---------------------------
# GET ORDER HISTORY
# ---------------------------
def get_order_history(user_id):
    if not user_id:
        return jsonify({"message": "Thiếu user_id"}), 400

    orders = order_service.get_order_history(user_id)
    return jsonify(orders), 200


# ---------------------------
# GET ORDER DETAIL
# ---------------------------
def get_order_detail(order_id, user):
    order = order_service.get_order_detail(order_id)

    if not order:
        return jsonify({"message": "Đơn hàng không tồn tại"}), 404

    # Optional: check quyền
    if user.get("role") != "admin" and order["user_id"] != user.get("id"):
        return jsonify({"message": "Không có quyền truy cập"}), 403

    return jsonify(order), 200

# ---------------------------
# CANCEL ORDER
# ---------------------------
def cancel_order(order_id, user):
    order = order_service.get_order_detail(order_id)

    if not order:
        return jsonify({"message": "Đơn hàng không tồn tại"}), 404

    if order["user_id"] != user.get("id"):
        return jsonify({"message": "Bạn không thể hủy đơn này"}), 403

    try:
        success = order_service.cancel_order(order_id)

        if success:
            return jsonify({"message": "Hủy đơn hàng thành công"}), 200

        return jsonify({"message": "Hủy đơn hàng thất bại"}), 400

    except ValueError as e:
        return jsonify({"message": str(e)}), 400



def update_order_status(order_id):
    from flask import request

    data = request.json
    new_status = data.get("status") if data else None

    if not new_status:
        return jsonify({"message": "Thiếu status"}), 400

    try:
        success = order_service.update_order_status(order_id, new_status)

        if success:
            return jsonify({"message": "Cập nhật trạng thái thành công"}), 200

        return jsonify({"message": "Cập nhật thất bại"}), 400

    except ValueError as e:
        return jsonify({"message": str(e)}), 400
   
def get_all_orders():

    orders = order_service.get_all_orders()

    return jsonify(orders), 200