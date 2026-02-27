import mysql.connector
from datetime import datetime
from config import DB_CONFIG


class OTPModel:
    def __init__(self):
        self.db_config = DB_CONFIG

    def get_connection(self):
        return mysql.connector.connect(**self.db_config)

    def create_otp(self, email, otp, expired_at):
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = """
            INSERT INTO email_otp (email, otp, expired_at)
            VALUES (%s, %s, %s)
        """
        cursor.execute(sql, (email, otp, expired_at))

        conn.commit()
        cursor.close()
        conn.close()

    def get_valid_otp(self, email, otp):
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = """
            SELECT * FROM email_otp
            WHERE email = %s
              AND otp = %s
              AND is_used = FALSE
              AND expired_at > %s
            ORDER BY created_at DESC
            LIMIT 1
        """
        cursor.execute(sql, (email, otp, datetime.utcnow()))
        result = cursor.fetchone()

        cursor.close()
        conn.close()
        return result

    def mark_used(self, otp_id):
        conn = self.get_connection()
        cursor = conn.cursor()

        sql = """
            UPDATE email_otp
            SET is_used = TRUE
            WHERE id = %s
        """
        cursor.execute(sql, (otp_id,))
        conn.commit()

        cursor.close()
        conn.close()
