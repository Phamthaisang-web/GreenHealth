from app.models.product_model import ProductModel
from datetime import datetime, date

class ProductService:
    def __init__(self):
        self.product_model = ProductModel()

    # Tạo sản phẩm
    def create_product(self, data):

        required_fields = [
            "name", "price", "expiry_date",
            "manufacture_date", "origin",
            "unit", "supplier_id", "category_id"
        ]

        for field in required_fields:
            if not data.get(field):
                raise ValueError(f"Thiếu trường bắt buộc: {field}")
        try:
            price = float(data["price"])
        except ValueError:
            raise ValueError("Giá sản phẩm phải là số")

        if price < 0:
            raise ValueError("Giá sản phẩm không được âm")

        try:
            expiry_date = datetime.strptime(data["expiry_date"], "%Y-%m-%d").date()
            manufacture_date = datetime.strptime(data["manufacture_date"], "%Y-%m-%d").date()
        except ValueError:
            raise ValueError("Ngày phải có định dạng YYYY-MM-DD")
        
        if expiry_date <= manufacture_date:
            raise ValueError("Ngày hết hạn phải lớn hơn ngày sản xuất")

        if int(data["supplier_id"]) <= 0:
            raise ValueError("supplier_id không hợp lệ")

        if int(data["category_id"]) <= 0:
            raise ValueError("category_id không hợp lệ")
 
        return  self.product_model.insert_product(
            name=data["name"],
            description=data.get("description"),
            price=price,
            expiry_date=expiry_date,
            manufacture_date=manufacture_date,
            origin=data["origin"],
            unit=data["unit"],
            supplier_id=data["supplier_id"],
            category_id=data["category_id"]
        )
       

    def get_all_products(
    self,
    name=None,
    category_name=None,
    supplier_name=None,
    min_price=None,
    max_price=None,
    sort=None,
    page=1,
    page_size=10
    ):
        return self.product_model.select_all_products(
        name=name,
        category_name=category_name,
        supplier_name=supplier_name,
        min_price=min_price,
        max_price=max_price,
        sort=sort,
        page=page,
        page_size=page_size
    )
    # tìm kiếm bằng id
    def get_product_details(self, product_id):
        product = self.product_model.get_product_by_id(product_id)
        if not product:
            raise ValueError("Sản phẩm không tồn tại")
        return product
    # Cập nhật sản phẩm
    def update_product(self, product_id, data):

        if not self.product_model.get_product_by_id(product_id):
            raise ValueError("Sản phẩm không tồn tại")

        allowed_fields = {
            "name", "description", "price",
            "expiry_date", "manufacture_date",
            "origin", "unit", "supplier_id", "category_id"
        }

        update_data = {k: v for k, v in data.items() if k in allowed_fields}

        if not update_data:
            raise ValueError("Không có dữ liệu hợp lệ để cập nhật")

        if "price" in update_data:
            if float(update_data["price"]) < 0:
                raise ValueError("Giá sản phẩm không được âm")

        return self.product_model.update_product(product_id, **update_data)

    # Xóa sản phẩm
    def delete_product(self, product_id):
        if not self.product_model.get_product_by_id(product_id):
            raise ValueError("Sản phẩm không tồn tại")

        return self.product_model.delete_product(product_id)

    # Logic nghiệp vụ: kiểm tra hạn dùng
    def check_expiry_status(self, product_id):
        product = self.get_product_details(product_id)
        expiry = product["expiry_date"]

        if expiry < date.today():
            return "Expired"
        return "Valid"
    