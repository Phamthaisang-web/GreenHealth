from flask import Flask
from app.routes.user_route import user_bp   

app = Flask(__name__)
app.register_blueprint(user_bp)             
app.json.ensure_ascii = False

if __name__ == "__main__":
    app.run(debug=True)
