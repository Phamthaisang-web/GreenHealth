from flask import Flask
from app.routes.user_route import user_bp   
from app.routes.product_route import product_bp

app = Flask(__name__)
app.register_blueprint(user_bp)             
app.register_blueprint(product_bp)
app.json.ensure_ascii = False

if __name__ == "__main__":
    app.run(debug=True)
