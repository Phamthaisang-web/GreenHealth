from .user_route import user_bp

def register_routes(app):
    app.register_blueprint(user_bp)
