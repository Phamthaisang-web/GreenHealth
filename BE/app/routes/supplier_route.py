from flask import Blueprint, request, jsonify
from app.controllers import supplier_controller
from app.utils.auth_middleware import token_required
supplier_bp = Blueprint("supplier", __name__, url_prefix="/suppliers")
@supplier_bp.route("/", methods=["GET"])
def get_suppliers():
    return supplier_controller.get_suppliers()
@supplier_bp.route("/<int:supplier_id>", methods=["GET"])
def get_supplier_id(supplier_id):
    return supplier_controller.get_supplier_id(supplier_id)
@supplier_bp.route("/", methods=["POST"])
def create_supplier():
    return supplier_controller.create_supplier()
@supplier_bp.route("/<int:supplier_id>", methods=["PUT"])
def update_supplier(supplier_id):
    return supplier_controller.update_supplier(supplier_id)
@supplier_bp.route("/<int:supplier_id>", methods=["DELETE"])
def delete_supplier(supplier_id):
    return supplier_controller.delete_supplier(supplier_id)
