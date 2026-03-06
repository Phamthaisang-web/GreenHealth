import os
from dotenv import load_dotenv
load_dotenv()
DB_CONFIG = {
    "host": "127.0.0.1", 
    "user": os.getenv("NAME_MYSQL"),
    "password": os.getenv("PASSWORD_MYSQL"),
    "database": os.getenv("DATABASE"),
    "port": 3306
}
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "gif"}
MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5MB