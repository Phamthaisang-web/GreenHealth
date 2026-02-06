from flask import request, jsonify
from app.services.category_service import CategoryService

category_service = CategoryService()

# ---------------------------
# Lấy danh sách danh mục
# ---------------------------
def get_categories():
    # Lấy tham số tìm kiếm từ query string (?name=...)
    name_filter = request.args.get("name")
    
    # Category thường ít dữ liệu nên có thể không cần phân trang, 
    # nhưng nếu cần bạn có thể thêm page/page_size tương tự Product
    categories = category_service.get_all_categories(name=name_filter)
    
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
    
    # Kiểm tra đầu vào cơ bản trước khi gọi Service
    if not data or 'name' not in data:
        return jsonify({"message": "Thiếu tên danh mục"}), 400

    try:
        # Gọi service tạo mới
        category_id = category_service.create_category(data['name'])
        
        if category_id:
            return jsonify({
                "message": "Tạo danh mục thành công",
                "category_id": category_id
            }), 201
        else:
            return jsonify({"message": "Tạo danh mục thất bại"}), 500
            
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
        return jsonify({"message": "Cần cung cấp tên mới để cập nhật"}), 400
        
    try:
        success = category_service.update_category(category_id, name=data['name'])
        
        if success:
            return jsonify({"message": "Cập nhật danh mục thành công"}), 200
        return jsonify({"message": "Cập nhật thất bại hoặc danh mục không tồn tại"}), 404
        
    except ValueError as e:
        return jsonify({"message": str(e)}), 400

# ---------------------------
# Xóa danh mục
# ---------------------------
def delete_category(category_id):
    """
    Lưu ý: Nếu danh mục đang có sản phẩm (ràng buộc khóa ngoại), 
    hàm service sẽ trả về False (hoặc bạn có thể try-catch cụ thể hơn ở đó).
    """
    success = category_service.delete_category(category_id)
    
    if success:
        return jsonify({"message": "Xóa danh mục thành công"}), 200
        
    # Trường hợp phổ biến nhất khi xóa thất bại là do danh mục đang được sử dụng
    return jsonify({
        "message": "Xóa thất bại. Có thể danh mục không tồn tại hoặc đang chứa sản phẩm."
    }), 400