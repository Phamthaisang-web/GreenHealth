from flask import Blueprint
from app.controllers.ai_controller import ask_ai

ai_bp = Blueprint("ai", __name__, url_prefix="/ai")

ai_bp.route("/ask", methods=["POST"])(ask_ai)