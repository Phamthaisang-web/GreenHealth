from flask import request, jsonify
from app.services.address_service import AddressService

address_service = AddressService()

# ---------------------------
# Lấy danh sách địa chỉ của user
# ---------------------------
def get_addresses():
    try:
        user_id = request.user["user_id"]
        addresses = address_service.get_user_addresses(user_id)
        return jsonify(addresses), 200
    except ValueError as e:
        return jsonify({"message": str(e)}), 400


def get_address_by_id(address_id):
    try:
        address = address_service.get_address_details(address_id)
        return jsonify(address), 200
    except ValueError as e:
        return jsonify({"message": str(e)}), 404


# ---------------------------
# Tạo địa chỉ mới
# ---------------------------
def create_address():
    data = request.json
    if not data:
        return jsonify({"message": "Thiếu dữ liệu gửi lên"}), 400

    try:
        user_id = request.user["user_id"]
        address_id = address_service.create_address(user_id, data)
        return jsonify({
            "message": "Tạo địa chỉ thành công",
            "address_id": address_id
        }), 201
    except ValueError as e:
        return jsonify({"message": str(e)}), 400


# Cập nhật địa chỉ

def update_address(address_id):
    data = request.json
    if not data:
        return jsonify({"message": "Thiếu dữ liệu cập nhật"}), 400

    try:
        user_id = request.user["user_id"]
        address_service.update_address(user_id, address_id, data)
        return jsonify({"message": "Cập nhật địa chỉ thành công"}), 200
    except ValueError as e:
        return jsonify({"message": str(e)}), 400


# ---------------------------
# Xóa địa chỉ
# ---------------------------
def delete_address(address_id):
    try:
        address_service.delete_address(address_id)
        return jsonify({"message": "Xóa địa chỉ thành công"}), 200
    except ValueError as e:
        return jsonify({"message": str(e)}), 400
