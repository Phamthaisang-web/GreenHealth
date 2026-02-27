from flask import Blueprint, request, jsonify
from app.controllers import address_controller
from app.utils.auth_middleware import token_required

address_bp = Blueprint("address", __name__, url_prefix="/addresses")

@address_bp.route("/", methods=["GET"])
@token_required
def get_addresses():
    return address_controller.get_addresses()


@address_bp.route("/<int:address_id>", methods=["GET"])
@token_required
def get_address_by_id(address_id):
    return address_controller.get_address_by_id(address_id)



@address_bp.route("/", methods=["POST"])
@token_required
def create_address():
    return address_controller.create_address()


@address_bp.route("/<int:address_id>", methods=["PUT"])
@token_required
def update_address(address_id):
    return address_controller.update_address(address_id)



@address_bp.route("/<int:address_id>", methods=["DELETE"])
@token_required
def delete_address(address_id):
    return address_controller.delete_address(address_id)
