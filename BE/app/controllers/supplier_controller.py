from flask import request, jsonify
from app.services.supplier_service import SupplierService
supplier_service = SupplierService()
def get_suppliers():
    suppliers = supplier_service.get_all_suppliers()
    return jsonify(suppliers), 200
def get_supplier_id(supplier_id):
    try:
        supplier = supplier_service.get_supplier_details(supplier_id)
        return jsonify(supplier), 200
    except ValueError as e:
        return jsonify({"message": str(e)}), 404
def create_supplier():
    data = request.json
    if not data:
        return jsonify({"message": "Thiếu dữ liệu gửi lên"}), 400
    try:
        supplier_id = supplier_service.create_supplier(data)
        return jsonify({
            "message": "Tạo supplier thành công",
            "supplier_id": supplier_id
        }), 201
    except ValueError as e:
        return jsonify({"message": str(e)}), 400
def update_supplier(supplier_id):
    data = request.json
    if not data:
        return jsonify({"message": "Thiếu dữ liệu cập nhật"}), 400
    try:
        supplier_service.update_supplier(supplier_id, data)
        return jsonify({"message": "Cập nhật supplier thành công"}), 200
    except ValueError as e:
        return jsonify({"message": str(e)}), 400
def delete_supplier(supplier_id):
    try:
        supplier_service.delete_supplier(supplier_id)
        return jsonify({"message": "Xóa supplier thành công"}), 200
    except ValueError as e:
        return jsonify({"message": str(e)}), 400