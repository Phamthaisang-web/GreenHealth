from app.models.product_model import ProductModel
from datetime import datetime

class ProductService:
    def __init__(self):
        self.product_model = ProductModel()

    def create_product(self, data):
        """
        Tạo sản phẩm mới sau khi kiểm tra các ràng buộc cơ bản.
        data: dictionary chứa các trường thông tin sản phẩm
        """
        # Ví dụ logic nghiệp vụ: Kiểm tra tên sản phẩm không được để trống
        if not data.get('name'):
            raise ValueError("Tên sản phẩm không được để trống")
        
        # Kiểm tra giá phải là số dương
        if float(data.get('price', 0)) < 0:
            raise ValueError("Giá sản phẩm không hợp lệ")

        return self.product_model.insert_product(
            name=data.get('name'),
            image=data.get('image'),
            description=data.get('description'),
            price=data.get('price'),
            expiry_date=data.get('expiry_date'),
            manufacture_date=data.get('manufacture_date'),
            origin=data.get('origin'),
            unit=data.get('unit'),
            supplier_id=data.get('supplier_id'),
            category_id=data.get('category_id')
        )

    def get_all_products(self, filters=None, page=1, page_size=10):
        """
        Lấy danh sách sản phẩm có kèm lọc và phân trang.
        filters: dict chứa các điều kiện lọc (name, category_id, min_price, ...)
        """
        if filters is None:
            filters = {}

        return self.product_model.select_all_products(
            name=filters.get('name'),
            category_id=filters.get('category_id'),
            min_price=filters.get('min_price'),
            max_price=filters.get('max_price'),
            from_mfg_date=filters.get('from_mfg_date'),
            to_mfg_date=filters.get('to_mfg_date'),
            from_exp_date=filters.get('from_exp_date'),
            to_exp_date=filters.get('to_exp_date'),
            page=page,
            page_size=page_size
        )

    def get_product_details(self, product_id):
        """Lấy thông tin chi tiết một sản phẩm"""
        product = self.product_model.get_product_by_id(product_id)
        if not product:
            return None
        return product

    def update_product(self, product_id, **kwargs):
        """Cập nhật thông tin sản phẩm"""
        # Kiểm tra xem sản phẩm có tồn tại không trước khi update
        if not self.product_model.get_product_by_id(product_id):
            return False
            
        return self.product_model.update_product(product_id, **kwargs)

    def delete_product(self, product_id):
        """Xóa sản phẩm"""
        return self.product_model.delete_product(product_id)

    def check_expiry_status(self, product_id):
        """
        Một ví dụ về Logic nghiệp vụ: Kiểm tra trạng thái hết hạn của sản phẩm
        """
        product = self.get_product_details(product_id)
        if not product or not product['expiry_date']:
            return "Unknown"
        
        # So sánh ngày hết hạn với ngày hiện tại
        expiry = product['expiry_date']
        if isinstance(expiry, str):
            expiry = datetime.strptime(expiry, '%Y-%m-%d').date()
            
        if expiry < datetime.now().date():
            return "Expired"
        return "Valid"