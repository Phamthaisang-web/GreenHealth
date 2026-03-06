from app.models.dashboard_model import DashboardModel


class DashboardService:

    def __init__(self):
        self.dashboard_model = DashboardModel()

    def get_dashboard_data(self):

        total_users = self.dashboard_model.count_users()
        total_products = self.dashboard_model.count_products()
        total_orders = self.dashboard_model.count_orders()
        revenue = self.dashboard_model.total_revenue()
        latest_orders = self.dashboard_model.latest_orders()

        return {
            "users": total_users,
            "products": total_products,
            "orders": total_orders,
            "revenue": revenue,
            "latest_orders": latest_orders
        }