from flask import Blueprint
from app.controllers.review_controller import ReviewController
from app.utils.auth_middleware import token_required


review_bp = Blueprint("review", __name__, url_prefix="/review")

controller = ReviewController()


# =========================
# Tạo review
# =========================
@review_bp.route("/", methods=["POST"])
@token_required
def create_review():
    return controller.create_review()


# =========================
# Lấy review theo product
# =========================
@review_bp.route("/product/<int:product_id>", methods=["GET"])
def get_by_product(product_id):
    return controller.get_by_product(product_id)


# =========================
# Update status (admin)
# =========================
@review_bp.route("/<int:review_id>/status", methods=["PUT"])
@token_required
def update_status(review_id):
    return controller.update_status(review_id)


# =========================
# Delete review
# =========================
@review_bp.route("/<int:review_id>", methods=["DELETE"])
@token_required
def delete_review(review_id):
    return controller.delete_review(review_id)