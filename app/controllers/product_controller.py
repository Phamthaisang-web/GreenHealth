from flask import request, jsonify
from app.services.product_service import ProductService

product_service = ProductService()

# ---------------------------
# Lấy danh sách sản phẩm (Có lọc & Phân trang)
# ---------------------------
def get_products():
    # Lấy các tham số lọc từ query string (?name=...&category_id=...)
    filters = {
        "name": request.args.get("name"),
        "category_id": request.args.get("category_id", type=int),
        "min_price": request.args.get("min_price", type=float),
        "max_price": request.args.get("max_price", type=float),
        "from_mfg_date": request.args.get("from_mfg_date"),
        "to_mfg_date": request.args.get("to_mfg_date"),
        "from_exp_date": request.args.get("from_exp_date"),
        "to_exp_date": request.args.get("to_exp_date")
    }
    
    # Lấy tham số phân trang
    page = request.args.get("page", default=1, type=int)
    page_size = request.args.get("page_size", default=10, type=int)

    products = product_service.get_all_products(filters=filters, page=page, page_size=page_size)
    return jsonify(products), 200

# ---------------------------
# Lấy chi tiết một sản phẩm
# ---------------------------
def get_product(product_id):
    product = product_service.get_product_details(product_id)
    if product:
        return jsonify(product), 200
    return jsonify({"message": "Sản phẩm không tồn tại"}), 404

# ---------------------------
# Tạo sản phẩm mới
# ---------------------------
def create_product():
    data = request.json
    try:
        product_id = product_service.create_product(data)
        return jsonify({
            "message": "Tạo sản phẩm thành công",
            "product_id": product_id
        }), 201
    except ValueError as e:
        return jsonify({"message": str(e)}), 400
    except Exception as e:
        return jsonify({"message": "Lỗi hệ thống", "error": str(e)}), 500

# ---------------------------
# Cập nhật sản phẩm
# ---------------------------
def update_product(product_id):
    data = request.json
    if not data:
        return jsonify({"message": "Không có dữ liệu cập nhật"}), 400
        
    success = product_service.update_product(product_id, **data)
    if success:
        return jsonify({"message": "Cập nhật sản phẩm thành công"}), 200
    return jsonify({"message": "Cập nhật thất bại hoặc sản phẩm không tồn tại"}), 400

# ---------------------------
# Xóa sản phẩm
# ---------------------------
def delete_product(product_id):
    success = product_service.delete_product(product_id)
    if success:
        return jsonify({"message": "Xóa sản phẩm thành công"}), 200
    return jsonify({"message": "Xóa sản phẩm thất bại"}), 400