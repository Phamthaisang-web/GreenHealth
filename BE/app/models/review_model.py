import mysql.connector
from config import DB_CONFIG


class ReviewModule:

    def __init__(self):
        self.db_config = DB_CONFIG
   
    def get_connection(self):
        return mysql.connector.connect(**self.db_config)

    def check_user_purchased(self, user_id, product_id):

        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = """
            SELECT od.id
            FROM Order_Detail od
            JOIN Orders o ON od.order_id = o.id
            WHERE o.user_id = %s
            AND od.product_id = %s
            AND o.status = 'completed'
        """

        cursor.execute(sql, (user_id, product_id))
        result = cursor.fetchone()

        cursor.close()
        conn.close()

        return result is not None

    def check_review_exists(self, user_id, product_id, order_id):

        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = """
            SELECT id
            FROM Review
            WHERE user_id = %s
            AND product_id = %s
            AND order_id = %s
        """

        cursor.execute(sql, (user_id, product_id, order_id))
        result = cursor.fetchone()

        cursor.close()
        conn.close()

        return result is not None

  
    def create_review(self, user_id, product_id, order_id, rating, comment):

        conn = self.get_connection()
        cursor = conn.cursor()

        sql = """
            INSERT INTO Review
            (user_id, product_id, order_id, rating, comment)
            VALUES (%s, %s, %s, %s, %s)
        """

        cursor.execute(sql, (
            user_id,
            product_id,
            order_id,
            rating,
            comment
        ))

        conn.commit()

        review_id = cursor.lastrowid

        cursor.close()
        conn.close()

        return review_id

    # ==========================
    # Thêm ảnh review
    # ==========================
    def add_review_image(self, review_id, image_url):

        conn = self.get_connection()
        cursor = conn.cursor()

        sql = """
            INSERT INTO Review_Image (review_id, image_url)
            VALUES (%s, %s)
        """

        cursor.execute(sql, (review_id, image_url))

        conn.commit()

        cursor.close()
        conn.close()

        return True

    # ==========================
    # Lấy review theo product
    # ==========================
    def get_reviews_by_product(self, product_id):

        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = """
            SELECT 
                r.id,
                r.rating,
                r.comment,
                r.created_at,

                u.name AS user_name,
                u.email

            FROM Review r

            JOIN Users u 
                ON r.user_id = u.id

            WHERE r.product_id = %s
            AND r.status = 'active'

            ORDER BY r.created_at DESC
        """

        cursor.execute(sql, (product_id,))
        results = cursor.fetchall()

        cursor.close()
        conn.close()

        return results

    # ==========================
    # Ẩn / hiện review (admin)
    # ==========================
    def update_review_status(self, review_id, status):

        conn = self.get_connection()
        cursor = conn.cursor()

        sql = """
            UPDATE Review
            SET status = %s
            WHERE id = %s
        """

        cursor.execute(sql, (status, review_id))

        conn.commit()

        cursor.close()
        conn.close()

        return cursor.rowcount > 0

    # ==========================
    # Xóa review
    # ==========================
    def delete_review(self, review_id):

        conn = self.get_connection()
        cursor = conn.cursor()

        sql = "DELETE FROM Review WHERE id = %s"

        cursor.execute(sql, (review_id,))

        conn.commit()

        cursor.close()
        conn.close()

        return cursor.rowcount > 0