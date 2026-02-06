from app.models.category_models import CategoryModel

class CategoryService:
    def __init__(self):
        self.category_model = CategoryModel()

    def create_category(self, name):
        """
        Tạo danh mục mới.
        Business Logic: Kiểm tra tên danh mục hợp lệ.
        """
        # 1. Validation: Tên không được để trống
        if not name or not name.strip():
            raise ValueError("Tên danh mục không được để trống")
        
        # 2. (Optional) Validation: Kiểm tra trùng tên (nếu cần thiết)
        # existing = self.category_model.select_all_categories(name=name)
        # if existing:
        #     raise ValueError("Tên danh mục đã tồn tại")

        # 3. Gọi Model để insert
        return self.category_model.insert_category(name)

    def get_all_categories(self, name=None):
        """
        Lấy danh sách danh mục (hỗ trợ tìm kiếm theo tên).
        Category thường ít nên không cần phân trang phức tạp như Product.
        """
        return self.category_model.select_all_categories(name=name)

    def get_category_details(self, category_id):
        """Lấy thông tin chi tiết một danh mục"""
        category = self.category_model.get_category_by_id(category_id)
        if not category:
            return None
        return category

    def update_category(self, category_id, name):
        """Cập nhật tên danh mục"""
        # 1. Kiểm tra tồn tại
        if not self.category_model.get_category_by_id(category_id):
            return False
            
        # 2. Validate dữ liệu mới
        if not name or not name.strip():
            raise ValueError("Tên danh mục mới không được để trống")

        # 3. Gọi Model update
        return self.category_model.update_category(category_id, name=name)

    def delete_category(self, category_id):
        """
        Xóa danh mục.
        Lưu ý: Model sẽ trả về False nếu danh mục đang dính khóa ngoại (đang chứa sản phẩm).
        """
        # Có thể thêm logic kiểm tra xem danh mục có sản phẩm không trước khi xóa
        # if self.product_service.count_by_category(category_id) > 0:
        #     raise ValueError("Không thể xóa danh mục đang chứa sản phẩm")
            
        return self.category_model.delete_category(category_id)