from flask import request, jsonify, g
from app.services.review_service import ReviewService


class ReviewController:

    def __init__(self):
        self.review_service = ReviewService()

    # =========================
    # POST /review
    # =========================
    def create_review(self):

        data = request.json

        product_id = data.get("product_id")
        order_id = data.get("order_id")
        rating = data.get("rating")
        comment = data.get("comment")

        user_id = request.user["user_id"]  # lấy từ token middleware

        if not all([product_id, order_id, rating]):
            return jsonify({
                "error": "Thiếu dữ liệu"
            }), 400

        success, result = self.review_service.create_review(
            user_id,
            product_id,
            order_id,
            rating,
            comment,
        )

        if not success:
            return jsonify({"error": result}), 400

        return jsonify({
            "message": "Đánh giá thành công",
            "review_id": result
        }), 201

    # =========================
    # GET /review/product/<id>
    # =========================
    def get_by_product(self, product_id):

        reviews = self.review_service.get_reviews_by_product(product_id)

        return jsonify(reviews), 200

    # =========================
    # PUT /review/<id>/status
    # =========================
    def update_status(self, review_id):

        data = request.json
        status = data.get("status")

        if status not in ["active", "hidden"]:
            return jsonify({"error": "Status không hợp lệ"}), 400

        success = self.review_service.update_status(review_id, status)

        if not success:
            return jsonify({"error": "Không tìm thấy review"}), 404

        return jsonify({"message": "Cập nhật thành công"}), 200

    # =========================
    # DELETE /review/<id>
    # =========================
    def delete_review(self, review_id):

        success = self.review_service.delete_review(review_id)

        if not success:
            return jsonify({"error": "Không tìm thấy review"}), 404

        return jsonify({"message": "Xóa thành công"}), 200