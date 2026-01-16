from flask import Blueprint
from app.controllers.user_controller import user_controller

user_bp = Blueprint("user", __name__, url_prefix="/users")

user_bp.route("/register", methods=["POST"])(user_controller.register)
user_bp.route("/login", methods=["POST"])(user_controller.login)
user_bp.route("/", methods=["GET"])(user_controller.get_users)
