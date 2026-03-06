from flask import Flask,send_from_directory
from config import UPLOAD_FOLDER, MAX_CONTENT_LENGTH
from app.routes.user_route import user_bp   
from app.routes.product_route import product_bp
from app.routes.productImage_route import product_image_bp
from app.routes.category_route import category_bp
from app.routes.address_route import address_bp
from app.routes.supplier_route import supplier_bp
from app.routes.order_route import order_bp
from app.routes.otp_route import otp_bp
from app.routes.upload_route import upload_bp
from app.routes.voucher_route import voucher_bp
from app.routes.dashboard_routes import dashboard_bp
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
app.register_blueprint(user_bp)
app.register_blueprint(category_bp)
app.register_blueprint(product_bp)
app.register_blueprint(product_image_bp)
app.register_blueprint(address_bp)
app.register_blueprint(supplier_bp)
app.register_blueprint(order_bp)
app.register_blueprint(otp_bp)
app.register_blueprint(voucher_bp)
app.register_blueprint(dashboard_bp)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = MAX_CONTENT_LENGTH
app.register_blueprint(upload_bp)
app.json.ensure_ascii = False

@app.route('/')
def home():
    return "Hello, welcome to the API!"

@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
   