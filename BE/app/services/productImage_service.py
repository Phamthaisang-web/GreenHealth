from app.models.productImage_model import ProductImageModel


class ProductImageService:
    def __init__(self):
        self.product_image_model = ProductImageModel()
        
    def add_product_image(self, data):
        product_id = data.get("product_id")
        image_url = data.get("image_url")
        is_main = data.get("is_main", False)

        if not product_id:
            raise ValueError("Thiếu product_id")

        if not image_url:
            raise ValueError("Thiếu image_url")

        return self.product_image_model.insert_product_image(
            product_id=product_id,
            image_url=image_url,
            is_main=is_main
        )

    # =============================
    # Lấy tất cả ảnh theo product
    # =============================
    def get_images_by_product(self, product_id):
        if not product_id:
            raise ValueError("Thiếu product_id")

        return self.product_image_model.get_images_by_product(product_id)

    # =============================
    # Lấy ảnh chính
    # =============================
    def get_main_image(self, product_id):
        if not product_id:
            raise ValueError("Thiếu product_id")

        return self.product_image_model.get_main_image(product_id)

    # =============================
    # Cập nhật ảnh
    # =============================
    def update_product_image(self, image_id, data):
        if not image_id:
            raise ValueError("Thiếu image_id")

        allowed_fields = {"image_url", "is_main"}
        update_data = {k: v for k, v in data.items() if k in allowed_fields}

        if not update_data:
            raise ValueError("Không có dữ liệu hợp lệ để cập nhật")

        success = self.product_image_model.update_product_image(
            image_id,
            **update_data
        )

        if not success:
            raise ValueError("Cập nhật thất bại hoặc ảnh không tồn tại")

        return True

    # =============================
    # Xóa ảnh
    # =============================
    def delete_product_image(self, image_id):
        if not image_id:
            raise ValueError("Thiếu image_id")

        success = self.product_image_model.delete_product_image(image_id)

        if not success:
            raise ValueError("Xóa thất bại hoặc ảnh không tồn tại")

        return True
