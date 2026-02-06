from flask import request, jsonify
from app.services.order_detail_service import OrderDetailService

order_detail_service = OrderDetailService()


# ---------------------------
# GET ALL / FILTER BY ORDER
# ---------------------------
def get_order_details():
    order_id = request.args.get("order_id", type=int)

    if order_id:
        data = order_detail_service.get_by_order(order_id)
    else:
        data = order_detail_service.get_all()

    return jsonify(data), 200


# ---------------------------
# GET ONE
# ---------------------------
def get_order_detail(detail_id):
    detail = order_detail_service.get_by_id(detail_id)
    if detail:
        return jsonify(detail), 200
    return jsonify({"message": "Order detail không tồn tại"}), 404


# ---------------------------
# CREATE
# ---------------------------
def create_order_detail():
    data = request.json

    try:
        detail_id = order_detail_service.create(data)
        return jsonify({
            "message": "Thêm sản phẩm vào đơn hàng thành công",
            "order_detail_id": detail_id
        }), 201

    except ValueError as e:
        return jsonify({"message": str(e)}), 400
    except Exception as e:
        return jsonify({"message": "Lỗi hệ thống", "error": str(e)}), 500


# ---------------------------
# UPDATE
# ---------------------------
def update_order_detail(detail_id):
    data = request.json
    if not data:
        return jsonify({"message": "Không có dữ liệu"}), 400

    success = order_detail_service.update(detail_id, **data)

    if success:
        return jsonify({"message": "Cập nhật thành công"}), 200
    return jsonify({"message": "Cập nhật thất bại"}), 400


# ---------------------------
# DELETE
# ---------------------------
def delete_order_detail(detail_id):
    success = order_detail_service.delete(detail_id)

    if success:
        return jsonify({"message": "Xóa thành công"}), 200
    return jsonify({"message": "Xóa thất bại"}), 400
