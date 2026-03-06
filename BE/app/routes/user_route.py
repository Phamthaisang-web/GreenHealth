from flask import Blueprint
from app.controllers import user_controller
from app.utils.auth_middleware import token_required
from app.utils.role_middleware import role_required

user_bp = Blueprint("user", __name__, url_prefix="/users")

# =====================================================
# PUBLIC ROUTES (KHÔNG CẦN TOKEN)
# =====================================================

@user_bp.route("/register", methods=["POST"])
def register():
    return user_controller.register()


@user_bp.route("/login", methods=["POST"])
def login():
    return user_controller.login()


@user_bp.route("/change-password", methods=["POST"])
@token_required
def change_password():
    return user_controller.change_password()



@user_bp.route("/", methods=["GET"])
@token_required
@role_required("admin", "staff")
def get_users():
    return user_controller.get_users()


@user_bp.route("/<int:user_id>", methods=["GET"])
@token_required
def get_user_by_id(user_id):
    return user_controller.get_user_by_id(user_id)


@user_bp.route("/", methods=["PUT"])
@token_required
def update_user():
    return user_controller.update_user()

@user_bp.route("/me", methods=["GET"])
@token_required
def get_me():
    return user_controller.get_me()

@user_bp.route("/<int:user_id>", methods=["DELETE"])
@token_required
def delete_user(user_id):
    return user_controller.delete_user(user_id)
