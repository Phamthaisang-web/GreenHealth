from flask import Flask, send_from_directory
from config import UPLOAD_FOLDER, MAX_CONTENT_LENGTH
from flask_cors import CORS

# routes
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
from app.routes.ai_routes import ai_bp
from app.routes.chat_routes import chat_bp

# socket
from flask_socketio import SocketIO
from app.socket.chat_socket import register_chat_events

app = Flask(__name__)

CORS(app)

# ===============================
# SOCKET.IO
# ===============================
socketio = SocketIO(app, cors_allowed_origins="*")

register_chat_events(socketio)

# ===============================
# REGISTER ROUTES
# ===============================

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
app.register_blueprint(ai_bp)
app.register_blueprint(upload_bp)
app.register_blueprint(chat_bp)

# ===============================
# CONFIG
# ===============================

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = MAX_CONTENT_LENGTH
app.json.ensure_ascii = False

# ===============================
# ROUTES
# ===============================

@app.route('/')
def home():
    return "Hello, welcome to the API!"


@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


# ===============================
# RUN SERVER
# ===============================

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)