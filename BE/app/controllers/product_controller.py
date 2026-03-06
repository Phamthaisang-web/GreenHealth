from flask import request, jsonify
from app.services.product_service import ProductService

product_service = ProductService()

# ---------------------------
# Lấy danh sách sản phẩm (Có lọc & Phân trang)
# ---------------------------

def get_products():
    name = request.args.get("name")
    category_name = request.args.get("category_name")
    supplier_name = request.args.get("supplier_name")
    min_price = request.args.get("min_price", type=float)
    max_price = request.args.get("max_price", type=float)
    page = request.args.get("page", default=1, type=int)
    page_size = request.args.get("page_size", default=10, type=int)
    products = product_service.get_all_products(
        name=name,
        category_name=category_name,
        supplier_name=supplier_name,
        min_price=min_price,
        max_price=max_price,
        page=page,
        page_size=page_size
    )

    return jsonify(products), 200


# ---------------------------
# Lấy chi tiết sản phẩm
# ---------------------------
def get_product_id(product_id):
    product = product_service.get_product_details(product_id)
    if not product:
        return jsonify({"message": "Sản phẩm không tồn tại"}), 404

    return jsonify(product), 200


# ---------------------------
# Tạo sản phẩm mới
# ---------------------------
def create_product():
    data = request.json
    if not data:
        return jsonify({"message": "Thiếu dữ liệu gửi lên"}), 400

    try:
        product_id = product_service.create_product(data)

        # Lấy lại sản phẩm vừa tạo
        new_product = product_service.get_product_details(product_id)

        return jsonify({
        "message": "Tạo sản phẩm thành công",
        "data": new_product
        }), 201

    except ValueError as e:
        return jsonify({"message": str(e)}), 400

    except Exception as e:
        return jsonify({
            "message": "Lỗi hệ thống",
            "error": str(e)
        }), 500


# ---------------------------
# Cập nhật sản phẩm
# ---------------------------
def update_product(product_id):
    data = request.json
    if not data:
        return jsonify({"message": "Không có dữ liệu cập nhật"}), 400

    success = product_service.update_product(product_id, data)
    if not success:
        return jsonify({"message": "Cập nhật thất bại hoặc sản phẩm không tồn tại"}), 400

    return jsonify({"message": "Cập nhật sản phẩm thành công"}), 200


# ---------------------------
# Xóa sản phẩm
# ---------------------------
def delete_product(product_id):
    success = product_service.delete_product(product_id)
    if not success:
        return jsonify({"message": "Xóa sản phẩm thất bại"}), 400

    return jsonify({"message": "Xóa sản phẩm thành công"}), 200
