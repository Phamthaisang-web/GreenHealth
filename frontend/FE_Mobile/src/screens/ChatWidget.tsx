import { MaterialIcons } from "@expo/vector-icons";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";

import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"ai" | "admin">("ai");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");

  const socketRef = useRef<any>(null);
  const flatListRef = useRef<FlatList>(null);

  // Animation state
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [open]);

  useEffect(() => {
    if (mode === "admin") {
      initChat();
    }
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [mode]);

  const initChat = async () => {
    const user = await AsyncStorage.getItem("user");
    const parsed = JSON.parse(user || "{}");
    setUserId(parsed.id);
    loadHistory(parsed.id);

    socketRef.current = io(BASE_URL, { transports: ["websocket"] });
    socketRef.current.emit("join_room", { user_id: parsed.id });
    socketRef.current.on("receive_message", (data: any) => {
      if (data.user_id == parsed.id) {
        setMessages((prev) => [...prev, { id: Date.now(), ...data }]);
      }
    });
  };

  const loadHistory = async (id: any) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/chat/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setMessages(data.map((m: any) => ({ id: Math.random(), ...m })));
      }
    } catch (err) {
      console.log("history error", err);
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    const currentMsg = message;
    setMessage("");

    if (mode === "ai") {
      const userMsg = { id: Date.now(), role: "user", text: currentMsg };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/ai/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: currentMsg }),
        });
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { id: Date.now() + 1, role: "ai", text: data.answer },
        ]);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    } else {
      const msg = {
        id: Date.now(),
        user_id: userId,
        message: currentMsg,
        sender: "user",
      };
      socketRef.current.emit("user_send_message", msg);
      setMessages((prev) => [...prev, msg]);
    }
  };

  const renderItem = ({ item }: any) => {
    const isUser =
      mode === "ai" ? item.role === "user" : item.sender === "user";
    const content = mode === "ai" ? item.text : item.message;

    return (
      <View
        style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.botBubble,
        ]}
      >
        <Text style={{ color: isUser ? "#fff" : "#333", fontSize: 15 }}>
          {content}
        </Text>
      </View>
    );
  };

  return (
    <>
      <Modal visible={open} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[styles.chatWindow, { transform: [{ scale: scaleAnim }] }]}
          >
            {/* CUSTOM HEADER TAB */}
            <View style={styles.tabHeader}>
              <TouchableOpacity
                style={[styles.tab, mode === "ai" && styles.activeTab]}
                onPress={() => {
                  setMode("ai");
                  setMessages([]);
                }}
              >
                <Text
                  style={[
                    styles.tabText,
                    mode === "ai" && styles.activeTabText,
                  ]}
                >
                  🤖 AI Chat
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tab, mode === "admin" && styles.activeTab]}
                onPress={() => {
                  setMode("admin");
                  setMessages([]);
                }}
              >
                <Text
                  style={[
                    styles.tabText,
                    mode === "admin" && styles.activeTabText,
                  ]}
                >
                  👨‍💼 Nhân viên
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setOpen(false)}
                style={styles.closeBtn}
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              onContentSizeChange={() =>
                flatListRef.current?.scrollToEnd({ animated: true })
              }
            />

            {loading && (
              <View style={styles.loadingArea}>
                <ActivityIndicator size="small" color="#0ea91d" />
                <Text style={styles.loadingText}>AI đang suy nghĩ...</Text>
              </View>
            )}

            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
              <View style={styles.inputArea}>
                <TextInput
                  placeholder="Viết tin nhắn..."
                  value={message}
                  onChangeText={setMessage}
                  style={styles.input}
                  multiline
                />
                <TouchableOpacity style={styles.sendIcon} onPress={sendMessage}>
                  <MaterialIcons name="send" size={24} color="#0ea91d" />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </Animated.View>
        </View>
      </Modal>

      {/* FLOAT BUTTON */}
      {!open && (
        <TouchableOpacity style={styles.fab} onPress={() => setOpen(true)}>
          <MaterialIcons name="chat" size={28} color="#fff" />
          <View style={styles.badge} />
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#0ea91d",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 15,
    height: 15,
    backgroundColor: "#ff4d4d",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  chatWindow: {
    width: width * 0.9,
    height: height * 0.7,
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 10,
  },
  tabHeader: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#0ea91d",
  },
  tabText: {
    fontSize: 14,
    color: "#888",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#0ea91d",
  },
  closeBtn: {
    paddingHorizontal: 15,
  },
  listContent: {
    padding: 15,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
    marginBottom: 10,
    maxWidth: "85%",
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#0ea91d",
    borderBottomRightRadius: 2,
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderBottomLeftRadius: 2,
    elevation: 1,
  },
  loadingArea: {
    flexDirection: "row",
    paddingLeft: 20,
    alignItems: "center",
    marginBottom: 10,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
  },
  inputArea: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  input: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendIcon: {
    marginLeft: 10,
  },
});
