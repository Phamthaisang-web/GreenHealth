import os
from dotenv import load_dotenv

load_dotenv()

print("--- Database Configuration ---")
print("User:", os.getenv("NAME_MYSQL"))
print("DB Name:", os.getenv("DATABASE"))

DB_CONFIG = {
   
    "host": "172.25.26.40", 
    "user": os.getenv("NAME_MYSQL"),
    "password": os.getenv("PASSWORD_MYSQL"),
    "database": os.getenv("DATABASE"),
    "port": 3306
}