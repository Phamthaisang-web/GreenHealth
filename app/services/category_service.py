from app.models.category_models import CategoryModel

class CategoryService:
    def __init__(self):
        self.category_model = CategoryModel()

    # ---------------------------
    # Tạo danh mục mới
    # ---------------------------
    def create_category(self, data):
        """
        Tạo danh mục mới với kiểm tra ràng buộc.
        data: dictionary chứa 'name'
        """
        name = data.get('name', '').strip()
        
        # Logic nghiệp vụ: Tên không được để trống
        if not name:
            raise ValueError("Tên danh mục không được để trống")
        
        # Logic nghiệp vụ: Tên không nên quá ngắn
        if len(name) < 2:
            raise ValueError("Tên danh mục phải có ít nhất 2 ký tự")

        return self.category_model.insert_category(name)

    # ---------------------------
    # Lấy danh sách danh mục
    # ---------------------------
    def get_all_categories(self):
        """Lấy toàn bộ danh sách danh mục để hiển thị"""
        return self.category_model.get_all_categories()

    # ---------------------------
    # Lấy chi tiết danh mục
    # ---------------------------
    def get_category_details(self, category_id):
        """Lấy thông tin một danh mục theo ID"""
        category = self.category_model.get_category_by_id(category_id)
        if not category:
            return None
        return category

    # ---------------------------
    # Cập nhật danh mục
    # ---------------------------
    def update_category(self, category_id, data):
        """
        Cập nhật danh mục.
        data: dictionary chứa 'name' mới
        """
        name = data.get('name', '').strip()
        
        if not name:
            raise ValueError("Tên danh mục mới không được để trống")
            
        # Kiểm tra tồn tại trước khi cập nhật
        if not self.category_model.get_category_by_id(category_id):
            return False
            
        return self.category_model.update_category(category_id, name)

    # ---------------------------
    # Xóa danh mục
    # ---------------------------
    def delete_category(self, category_id):
        """
        Xóa danh mục. 
        Lưu ý: Model sẽ trả về False nếu có ràng buộc khóa ngoại (sản phẩm đang dùng ID này).
        """
        return self.category_model.delete_category(category_id)