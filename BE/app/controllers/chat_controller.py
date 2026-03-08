from flask import jsonify
from app.models.chat_model import ChatModel

chat_model = ChatModel()


def get_chat_history(user_id):
    messages = chat_model.get_messages_by_user(user_id)
    return jsonify(messages), 200