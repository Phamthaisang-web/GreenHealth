from flask import jsonify
from app.services.dashboard_service import DashboardService

dashboard_service = DashboardService()


def get_dashboard():

    try:
        data = dashboard_service.get_dashboard_data()

        return jsonify({
            "message": "Lấy dữ liệu dashboard thành công",
            "data": data
        }), 200

    except Exception as e:
        return jsonify({
            "message": str(e)
        }), 500