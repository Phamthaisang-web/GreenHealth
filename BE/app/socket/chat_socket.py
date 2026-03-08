from flask_socketio import emit, join_room
from app.models.chat_model import ChatModel

chat_model = ChatModel()


def register_chat_events(socketio):

    # =========================
    # JOIN ROOM
    # =========================
    @socketio.on("join_room")
    def handle_join(data):

        user_id = data.get("user_id")

        if not user_id:
            return

        if user_id == "admin":
            join_room("admin")
        else:
            join_room(f"user_{user_id}")

        users = chat_model.get_chat_users()
        emit("user_list", users, broadcast=True)

    # =========================
    # USER SEND MESSAGE
    # =========================
    @socketio.on("user_send_message")
    def handle_user_message(data):

        print("USER MESSAGE:", data)

        user_id = data.get("user_id")
        message = data.get("message")

        if not user_id or not message:
            return

        room = f"user_{user_id}"

        # save db
        chat_model.save_message(user_id, "user", message)

        # send to admin
        emit(
            "receive_message",
            {
                "user_id": user_id,
                "sender": "user",
                "message": message
            },
            room="admin"
        )

        # send to user room
        emit(
            "receive_message",
            {
                "user_id": user_id,
                "sender": "user",
                "message": message
            },
            room=room
        )

        users = chat_model.get_chat_users()
        emit("user_list", users, broadcast=True)

    # =========================
    # ADMIN SEND MESSAGE
    # =========================
    @socketio.on("admin_send_message")
    def handle_admin_message(data):

        print("ADMIN MESSAGE:", data)

        user_id = data.get("user_id")
        message = data.get("message")

        if not user_id or not message:
            return

        room = f"user_{user_id}"

        chat_model.save_message(user_id, "admin", message)

        emit(
            "receive_message",
            {
                "user_id": user_id,
                "sender": "admin",
                "message": message
            },
            room=room
        )