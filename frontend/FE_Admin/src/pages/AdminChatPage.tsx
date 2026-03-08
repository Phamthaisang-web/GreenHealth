import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://127.0.0.1:5000", { transports: ["websocket"] });

interface Message {
  sender: string;
  message: string;
  user_id: number;
}

export default function AdminChatPage() {
  const [users, setUsers] = useState<number[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [unread, setUnread] = useState<{ [key: number]: number }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.emit("join_room", { user_id: "admin" });
    socket.on("user_list", (data) => setUsers(data.map((u: any) => u.user_id)));
    socket.on("receive_message", (msg: Message) => {
      if (selectedUser === msg.user_id) setMessages((prev) => [...prev, msg]);
      else
        setUnread((prev) => ({
          ...prev,
          [msg.user_id]: (prev[msg.user_id] || 0) + 1,
        }));
    });
    return () => {
      socket.off("user_list");
      socket.off("receive_message");
    };
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectUser = async (userId: number) => {
    setSelectedUser(userId);
    socket.emit("join_room", { user_id: userId });
    setUnread((prev) => ({ ...prev, [userId]: 0 }));
    try {
      const res = await fetch(`http://127.0.0.1:5000/chat/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      setMessages([]);
    }
  };

  const sendMessage = () => {
    if (!input.trim() || !selectedUser) return;
    socket.emit("admin_send_message", {
      user_id: selectedUser,
      message: input,
    });
    setMessages((prev) => [
      ...prev,
      { sender: "admin", message: input, user_id: selectedUser },
    ]);
    setInput("");
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        {/* SIDEBAR */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <div style={styles.brand}>Chats</div>
            <div style={styles.onlineStatus}>{users.length} online</div>
          </div>
          <div style={styles.userList}>
            {users.map((user) => (
              <div
                key={user}
                style={{
                  ...styles.userCard,
                  backgroundColor:
                    selectedUser === user ? "#f8fafc" : "transparent",
                }}
                onClick={() => selectUser(user)}
              >
                <div style={styles.avatar}>U{user}</div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: selectedUser === user ? "600" : "500",
                    }}
                  >
                    User {user}
                  </div>
                </div>
                {unread[user] > 0 && <div style={styles.dot} />}
              </div>
            ))}
          </div>
        </div>

        {/* CHAT AREA */}
        <div style={styles.chatArea}>
          {selectedUser ? (
            <>
              <div style={styles.chatHeader}>
                <span style={{ fontWeight: 600 }}>User {selectedUser}</span>
                <span style={styles.activeLabel}>Active now</span>
              </div>

              <div style={styles.messageBox}>
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    style={
                      msg.sender === "admin" ? styles.adminRow : styles.userRow
                    }
                  >
                    <div
                      style={
                        msg.sender === "admin"
                          ? styles.adminBubble
                          : styles.userBubble
                      }
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div style={styles.inputArea}>
                <input
                  style={styles.input}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                />
                <button onClick={sendMessage} style={styles.sendBtn}>
                  Send
                </button>
              </div>
            </>
          ) : (
            <div style={styles.emptyState}>Select a conversation</div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  container: {
    width: "1100px",
    height: "85vh",
    display: "flex",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    overflow: "hidden",
  },
  sidebar: {
    width: "280px",
    borderRight: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
  },
  sidebarHeader: {
    padding: "24px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  brand: { fontSize: "20px", fontWeight: 700, letterSpacing: "-0.5px" },
  onlineStatus: { fontSize: "12px", color: "#64748b" },
  userList: { flex: 1, overflowY: "auto" },
  userCard: {
    display: "flex",
    alignItems: "center",
    padding: "12px 20px",
    cursor: "pointer",
    gap: "12px",
    transition: "background 0.1s ease",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#f1f5f9",
    color: "#475569",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: 600,
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#3b82f6",
  },
  chatArea: { flex: 1, display: "flex", flexDirection: "column" },
  chatHeader: {
    padding: "18px 25px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  activeLabel: { fontSize: "12px", color: "#22c55e" },
  messageBox: {
    flex: 1,
    padding: "25px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  userRow: { display: "flex", justifyContent: "flex-start" },
  adminRow: { display: "flex", justifyContent: "flex-end" },
  userBubble: {
    backgroundColor: "#f1f5f9",
    color: "#1e293b",
    padding: "10px 16px",
    borderRadius: "16px",
    maxWidth: "60%",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  adminBubble: {
    backgroundColor: "#1e293b",
    color: "#ffffff",
    padding: "10px 16px",
    borderRadius: "16px",
    maxWidth: "60%",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  inputArea: {
    padding: "20px 25px",
    display: "flex",
    gap: "12px",
  },
  input: {
    flex: 1,
    padding: "12px 18px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    outline: "none",
    fontSize: "14px",
    backgroundColor: "#f8fafc",
  },
  sendBtn: {
    backgroundColor: "transparent",
    color: "#1e293b",
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "14px",
  },
  emptyState: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#94a3b8",
    fontSize: "14px",
  },
};
