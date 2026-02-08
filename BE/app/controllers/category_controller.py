from flask import request, jsonify
from app.services.category_service import CategoryService

category_service = CategoryService()

# ---------------------------
# Lấy danh sách danh mục
# ---------------------------
def get_categories():
    categories = category_service.get_all_categories()
    return jsonify(categories), 200


# ---------------------------
# Lấy chi tiết một danh mục
# ---------------------------
def get_category_id(category_id):
    try:
        category = category_service.get_category_details(category_id)
        return jsonify(category), 200
    except ValueError as e:
        return jsonify({"message": str(e)}), 404


# ---------------------------
# Tạo danh mục mới
# ---------------------------
def create_category():
    data = request.json
    if not data:
        return jsonify({"message": "Thiếu dữ liệu gửi lên"}), 400

    try:
        category_id = category_service.create_category(data)
        return jsonify({
            "message": "Tạo category thành công",
            "category_id": category_id
        }), 201
    except ValueError as e:
        return jsonify({"message": str(e)}), 400


# ---------------------------
# Cập nhật danh mục
# ---------------------------
def update_category(category_id):
    data = request.json
    if not data:
        return jsonify({"message": "Thiếu dữ liệu cập nhật"}), 400

    try:
        category_service.update_category(category_id, data)
        return jsonify({"message": "Cập nhật category thành công"}), 200
    except ValueError as e:
        return jsonify({"message": str(e)}), 400


# ---------------------------
# Xóa danh mục
# ---------------------------
def delete_category(category_id):
    try:
        category_service.delete_category(category_id)
        return jsonify({"message": "Xóa category thành công"}), 200
    except ValueError as e:
        return jsonify({"message": str(e)}), 400
