import mysql.connector
from config import DB_CONFIG


class ProductImageModel:
    def __init__(self):
        self.db_config = DB_CONFIG

    def get_connection(self):
        return mysql.connector.connect(**self.db_config)

    # =============================
    # Thêm ảnh cho sản phẩm
    # =============================
    def insert_product_image(self, product_id, image_url, is_main=False):
        conn = self.get_connection()
        cursor = conn.cursor()

        # Nếu là ảnh chính → set các ảnh khác về false
        if is_main:
            cursor.execute(
                "UPDATE ProductImage SET is_main = FALSE WHERE product_id = %s",
                (product_id,)
            )

        sql = """
            INSERT INTO ProductImage (product_id, image_url, is_main)
            VALUES (%s, %s, %s)
        """
        cursor.execute(sql, (product_id, image_url, is_main))
        conn.commit()

        image_id = cursor.lastrowid
        cursor.close()
        conn.close()

        return image_id

    # =============================
    # Lấy tất cả ảnh theo product
    # =============================
    def get_images_by_product(self, product_id):
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = """
            SELECT * FROM ProductImage
            WHERE product_id = %s
            ORDER BY is_main DESC, created_at ASC
        """
        cursor.execute(sql, (product_id,))
        images = cursor.fetchall()

        cursor.close()
        conn.close()
        return images

    # =============================
    # Lấy ảnh chính
    # =============================
    def get_main_image(self, product_id):
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = """
            SELECT * FROM ProductImage
            WHERE product_id = %s AND is_main = TRUE
            LIMIT 1
        """
        cursor.execute(sql, (product_id,))
        image = cursor.fetchone()

        cursor.close()
        conn.close()
        return image

    # =============================
    # Cập nhật ảnh
    # =============================
    def update_product_image(self, image_id, **kwargs):
        conn = self.get_connection()
        cursor = conn.cursor()

        fields = []
        values = []

        for key, value in kwargs.items():
            fields.append(f"{key}=%s")
            values.append(value)

        if not fields:
            return False

        sql = f"UPDATE ProductImage SET {', '.join(fields)} WHERE id=%s"
        values.append(image_id)

        cursor.execute(sql, tuple(values))
        conn.commit()

        success = cursor.rowcount > 0
        cursor.close()
        conn.close()
        return success

    # =============================
    # Xóa ảnh
    # =============================
    def delete_product_image(self, image_id):
        conn = self.get_connection()
        cursor = conn.cursor()

        sql = "DELETE FROM ProductImage WHERE id=%s"
        cursor.execute(sql, (image_id,))
        conn.commit()

        success = cursor.rowcount > 0
        cursor.close()
        conn.close()
        return success
