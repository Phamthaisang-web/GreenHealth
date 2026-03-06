from flask import Blueprint
from app.controllers import dashboard_controller
from app.utils.auth_middleware import token_required

# Tạo Blueprint
dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/dashboard")

# Lấy dữ liệu dashboard
@dashboard_bp.route("/", methods=["GET"])
@token_required
def get_dashboard():
    return dashboard_controller.get_dashboard()