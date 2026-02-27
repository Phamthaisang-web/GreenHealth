from flask import request, jsonify
from app.services.order_service import OrderService

order_service = OrderService()

# ---------------------------
# PLACE ORDER (CREATE)
# ---------------------------
def place_order():
    """
    Body JSON:
    {
        "user_id": 1,
        "cart_items": [
            {"product_id": 1, "quantity": 2},
            {"product_id": 3, "quantity": 1}
        ]
    }
    """
    data = request.json

    if not data:
        return jsonify({"message": "Không có dữ liệu"}), 400

    user_id = data.get("user_id")
    cart_items = data.get("cart_items")

    if not user_id or not cart_items:
        return jsonify({"message": "Thiếu user_id hoặc cart_items"}), 400

    try:
        order_id = order_service.place_order(user_id, cart_items)
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
# GET ORDER HISTORY (BY USER)
# ---------------------------
def get_order_history():
    """
    Query param:
    ?user_id=1
    """
    user_id = request.args.get("user_id", type=int)

    if not user_id:
        return jsonify({"message": "Thiếu user_id"}), 400

    orders = order_service.get_order_history(user_id)
    return jsonify(orders), 200


# ---------------------------
# GET ORDER DETAIL
# ---------------------------
def get_order_detail(order_id):
    order = order_service.get_order_detail(order_id)

    if order:
        return jsonify(order), 200

    return jsonify({"message": "Đơn hàng không tồn tại"}), 404


# ---------------------------
# CANCEL ORDER
# ---------------------------
def cancel_order(order_id):
    try:
        success = order_service.cancel_order(order_id)

        if success:
            return jsonify({"message": "Hủy đơn hàng thành công"}), 200

        return jsonify({"message": "Hủy đơn hàng thất bại"}), 400

    except ValueError as e:
        return jsonify({"message": str(e)}), 400
    except Exception as e:
        return jsonify({
            "message": "Lỗi hệ thống",
            "error": str(e)
        }), 500