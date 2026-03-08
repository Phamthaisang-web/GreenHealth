import mysql.connector
from config import DB_CONFIG


class ChatModel:
    def __init__(self):
        self.db_config = DB_CONFIG

    def get_connection(self):
        return mysql.connector.connect(**self.db_config)

    def save_message(self, user_id, sender, message):
        conn = self.get_connection()
        cursor = conn.cursor()

        sql = """
        INSERT INTO chat_messages (user_id, sender, message)
        VALUES (%s, %s, %s)
        """

        cursor.execute(sql, (user_id, sender, message))
        conn.commit()

        message_id = cursor.lastrowid

        cursor.close()
        conn.close()

        return message_id

    def get_messages_by_user(self, user_id):
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = """
        SELECT *
        FROM chat_messages
        WHERE user_id = %s
        ORDER BY created_at ASC
        """

        cursor.execute(sql, (user_id,))
        messages = cursor.fetchall()

        cursor.close()
        conn.close()

        return messages

    def get_chat_users(self):
        conn = self.get_connection()
        cursor = conn.cursor(dictionary=True)

        sql = """
        SELECT DISTINCT user_id
        FROM chat_messages
        ORDER BY user_id
        """

        cursor.execute(sql)
        users = cursor.fetchall()

        cursor.close()
        conn.close()

        return users