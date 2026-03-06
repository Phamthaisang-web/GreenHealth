from app.models.review_model import ReviewModule


class ReviewService:

    def __init__(self):
        self.review_module = ReviewModule()

    # =========================
    # Tạo review
    # =========================
    def create_review(self, user_id, product_id, order_id, rating, comment):

        # Check đã mua chưa
        if not self.review_module.check_user_purchased(user_id, product_id):
            return False, "Bạn chưa mua sản phẩm này"

        # Check đã review chưa
        if self.review_module.check_review_exists(user_id, product_id, order_id):
            return False, "Bạn đã đánh giá sản phẩm này rồi"

        # Tạo review
        review_id = self.review_module.create_review(
            user_id,
            product_id,
            order_id,
            rating,
            comment
        )



        return True, review_id

    # =========================
    # Lấy review theo product
    # =========================
    def get_reviews_by_product(self, product_id):

        return self.review_module.get_reviews_by_product(product_id)

    # =========================
    # Ẩn / hiện review
    # =========================
    def update_status(self, review_id, status):

        return self.review_module.update_review_status(review_id, status)

    # =========================
    # Xóa review
    # =========================
    def delete_review(self, review_id):

        return self.review_module.delete_review(review_id)