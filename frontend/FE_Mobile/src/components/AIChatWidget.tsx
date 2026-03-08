import { MaterialIcons } from "@expo/vector-icons";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
  PanResponder,
} from "react-native";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  // vị trí nút
  const pan = useRef(new Animated.ValueXY({ x: 20, y: 80 })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),

      onPanResponderRelease: () => {},
    }),
  ).current;

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/ai/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userMessage.text,
        }),
      });

      const data = await res.json();

      const aiMessage = {
        id: Date.now() + 1,
        role: "ai",
        text: data.answer,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.log("AI error:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: any) => {
    const isUser = item.role === "user";

    return (
      <View
        style={[styles.message, isUser ? styles.userMessage : styles.aiMessage]}
      >
        <Text style={{ color: isUser ? "#fff" : "#000" }}>{item.text}</Text>
      </View>
    );
  };

  return (
    <>
      {open && (
        <View style={styles.chatContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>🤖 Trợ lý ảo</Text>

            <TouchableOpacity onPress={() => setOpen(false)}>
              <Text style={styles.close}>✕</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 12 }}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />

          {loading && <Text style={styles.loading}>AI đang trả lời...</Text>}

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Hỏi AI..."
              value={message}
              onChangeText={setMessage}
              style={styles.input}
            />

            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Gửi</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* DRAG BUTTON */}
      <Animated.View
        style={[
          styles.chatButton,
          {
            transform: [{ translateX: pan.x }, { translateY: pan.y }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity onPress={() => setOpen(!open)}>
          <MaterialIcons name="chat" size={26} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  chatButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: "#0ea91d",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  chatContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#1976D2",
  },

  headerTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  close: {
    color: "#fff",
    fontSize: 20,
  },

  message: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    maxWidth: "80%",
  },

  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#1976D2",
  },

  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#eee",
  },

  loading: {
    paddingLeft: 14,
    paddingBottom: 6,
    color: "#888",
    fontStyle: "italic",
  },

  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 40,
  },

  sendButton: {
    marginLeft: 8,
    backgroundColor: "#1976D2",
    paddingHorizontal: 18,
    borderRadius: 20,
    justifyContent: "center",
  },
});
