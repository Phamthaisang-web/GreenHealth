from flask import Blueprint
from app.controllers import chat_controller
from app.utils.auth_middleware import token_required

chat_bp = Blueprint("chat", __name__, url_prefix="/chat")


@chat_bp.route("/<int:user_id>", methods=["GET"])
@token_required
def get_chat(user_id):
    return chat_controller.get_chat_history(user_id)