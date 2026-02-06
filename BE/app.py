from flask import Flask,render_template
from app.routes.user_route import user_bp   
from app.routes.product_route import product_bp
from app.routes.category_route import category_bp
# Giả sử bạn import DB_CONFIG từ file config trên
# from config import DB_CONFIG 
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.register_blueprint(user_bp)
app.register_blueprint(product_bp)
app.register_blueprint(category_bp)
app.json.ensure_ascii = False

@app.route('/')
def home():
    return render_template('index.html')
if __name__ == "__main__":
    # host='0.0.0.0': Cho phép mọi thiết bị trong mạng truy cập qua IP máy bạn
    # port=5000: Cổng mặc định của Flask
    print("Server đang chạy tại: http://127.0.0.1:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
   