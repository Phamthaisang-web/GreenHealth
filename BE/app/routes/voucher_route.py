from flask import Blueprint, jsonify, request
from app.controllers.voucher_controller import VoucherController
from app.utils.auth_middleware import token_required

voucher_bp = Blueprint("voucher", __name__, url_prefix="/vouchers")

voucher_controller = VoucherController()


# ========================
# Lấy danh sách voucher
# ========================
@voucher_bp.route("/", methods=["GET"])
def get_all():
    return voucher_controller.get_all()


# ========================
# Check voucher
# ========================
@voucher_bp.route("/check", methods=["POST"])
def check_voucher():
    return voucher_controller.check_voucher()


# ========================
# Tạo voucher (admin)
# ========================
@voucher_bp.route("/", methods=["POST"])
@token_required
def create_voucher():

    if request.user.get("role") != "admin":
        return jsonify({
            "message": "Chỉ admin mới có quyền"
        }), 403

    return voucher_controller.create()


# ========================
# Update voucher (admin)
# ========================
@voucher_bp.route("/<int:voucher_id>", methods=["PUT"])
@token_required
def update_voucher(voucher_id):

    if request.user.get("role") != "admin":
        return jsonify({
            "message": "Chỉ admin mới có quyền"
        }), 403

    return voucher_controller.update(voucher_id)


# ========================
# Delete voucher (admin)
# ========================
@voucher_bp.route("/<int:voucher_id>", methods=["DELETE"])
@token_required
def delete_voucher(voucher_id):

    if request.user.get("role") != "admin":
        return jsonify({
            "message": "Chỉ admin mới có quyền"
        }), 403

    return voucher_controller.delete(voucher_id)