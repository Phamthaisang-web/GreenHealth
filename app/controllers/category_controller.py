from flask import request, jsonify
from app.services.category_service import CategoryService

category_service = CategoryService()

# ---------------------------
# Lấy danh sách tất cả danh mục
# ---------------------------
def get_categories():
    """
    Trả về toàn bộ danh sách danh mục (thường dùng cho dropdown hoặc menu)
    """
    categories = category_service.get_all_categories()
    return jsonify(categories), 200

# ---------------------------
# Lấy chi tiết một danh mục
# ---------------------------
def get_category(category_id):
    category = category_service.get_category_details(category_id)
    if category:
        return jsonify(category), 200
    return jsonify({"message": "Danh mục không tồn tại"}), 404

# ---------------------------
# Tạo danh mục mới
# ---------------------------
def create_category():
    data = request.json
    if not data or 'name' not in data:
        return jsonify({"message": "Thiếu thông tin tên danh mục"}), 400
        
    try:
        category_id = category_service.create_category(data)
        return jsonify({
            "message": "Tạo danh mục thành công",
            "category_id": category_id
        }), 201
    except ValueError as e:
        return jsonify({"message": str(e)}), 400
    except Exception as e:
        return jsonify({"message": "Lỗi hệ thống", "error": str(e)}), 500

# ---------------------------
# Cập nhật danh mục
# ---------------------------
def update_category(category_id):
    data = request.json
    if not data or 'name' not in data:
        return jsonify({"message": "Dữ liệu cập nhật không hợp lệ"}), 400
        
    try:
        success = category_service.update_category(category_id, data)
        if success:
            return jsonify({"message": "Cập nhật danh mục thành công"}), 200
        return jsonify({"message": "Danh mục không tồn tại"}), 404
    except ValueError as e:
        return jsonify({"message": str(e)}), 400

# ---------------------------
# Xóa danh mục
# ---------------------------
def delete_category(category_id):
    # Lưu ý: Xóa có thể thất bại nếu có sản phẩm đang thuộc danh mục này (Khóa ngoại)
    success = category_service.delete_category(category_id)
    if success:
        return jsonify({"message": "Xóa danh mục thành công"}), 200
    return jsonify({
        "message": "Không thể xóa danh mục. Có thể danh mục này đang chứa sản phẩm hoặc không tồn tại."
    }), 400