from app.models.category_models import CategoryModel

class CategoryService:
    def __init__(self):
        self.category_model = CategoryModel()

    # ---------------------------
    # Tạo category
    # ---------------------------
    def create_category(self, data):
        name = data.get("name")

        if not name:
            raise ValueError("Tên category không được để trống")

        return self.category_model.insert_category(
            name=name,
            description=data.get("description"),
            image=data.get("image")
        )

    # ---------------------------
    # Lấy tất cả category
    # ---------------------------
    def get_all_categories(self):
        return self.category_model.select_all_categories()

    # ---------------------------
    # Lấy chi tiết category
    # ---------------------------
    def get_category_details(self, category_id):
        if not category_id:
            raise ValueError("Thiếu category_id")

        category = self.category_model.get_category_by_id(category_id)
        if not category:
            raise ValueError("Category không tồn tại")

        return category

    # ---------------------------
    # Cập nhật category
    # ---------------------------
    def update_category(self, category_id, data):
        if not category_id:
            raise ValueError("Thiếu category_id")

        allowed_fields = {"name", "description", "image"}
        update_data = {k: v for k, v in data.items() if k in allowed_fields}

        if not update_data:
            raise ValueError("Không có dữ liệu hợp lệ để cập nhật")

        success = self.category_model.update_category(category_id, **update_data)
        if not success:
            raise ValueError("Cập nhật thất bại hoặc category không tồn tại")

        return True

    # ---------------------------
    # Xóa category
    # ---------------------------
    def delete_category(self, category_id):
        if not category_id:
            raise ValueError("Thiếu category_id")

        success = self.category_model.delete_category(category_id)
        if not success:
            raise ValueError("Xóa thất bại hoặc category không tồn tại")

        return True
