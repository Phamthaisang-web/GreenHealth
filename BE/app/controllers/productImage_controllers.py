from flask import request, jsonify
from app.services.productImage_service import ProductImageService

product_image_service = ProductImageService()


# =============================
# Lấy tất cả ảnh theo product
# =============================
def get_product_images(product_id):
    try:
        images = product_image_service.get_images_by_product(product_id)
        return jsonify(images), 200
    except ValueError as e:
        return jsonify({"message": str(e)}), 400


# =============================
# Lấy ảnh chính
# =============================
def get_main_image(product_id):
    try:
        image = product_image_service.get_main_image(product_id)
        if not image:
            return jsonify({"message": "Không có ảnh chính"}), 404

        return jsonify(image), 200
    except ValueError as e:
        return jsonify({"message": str(e)}), 400


# =============================
# Thêm ảnh cho product
# =============================
def add_product_image():
    data = request.json
    if not data:
        return jsonify({"message": "Thiếu dữ liệu gửi lên"}), 400

    try:
        image_id = product_image_service.add_product_image(data)
        return jsonify({
            "message": "Thêm ảnh thành công",
            "image_id": image_id
        }), 201
    except ValueError as e:
        return jsonify({"message": str(e)}), 400


# =============================
# Cập nhật ảnh
# =============================
def update_product_image(image_id):
    data = request.json
    if not data:
        return jsonify({"message": "Thiếu dữ liệu cập nhật"}), 400

    try:
        product_image_service.update_product_image(image_id, data)
        return jsonify({"message": "Cập nhật ảnh thành công"}), 200
    except ValueError as e:
        return jsonify({"message": str(e)}), 400


# =============================
# Xóa ảnh
# =============================
def delete_product_image(image_id):
    try:
        product_image_service.delete_product_image(image_id)
        return jsonify({"message": "Xóa ảnh thành công"}), 200
    except ValueError as e:
        return jsonify({"message": str(e)}), 400
