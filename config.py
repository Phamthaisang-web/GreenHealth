import os
from dotenv import load_dotenv

load_dotenv()
print("DB User:", os.getenv("NAME_MYSQL"))
print("DB Password:", os.getenv("PASSWORD_MYSQL"))
print("DB Name:", os.getenv("DATABASE"))
DB_CONFIG = {
    "host": "localhost",
    "user": os.getenv("NAME_MYSQL"),
    "password": os.getenv("PASSWORD_MYSQL"),
    "database": os.getenv("DATABASE")

}
