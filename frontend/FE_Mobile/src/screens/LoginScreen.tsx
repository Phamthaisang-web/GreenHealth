import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!login || !password) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/users/login", { login, password });
      const { token, user } = res.data;
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));
      navigation.replace("Main");
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message
        : "Lỗi kết nối";
      Alert.alert("Lỗi", msg || "Thông tin không chính xác");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Đăng nhập</Text>
          <Text style={styles.subtitle}>Chào mừng bạn quay trở lại</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email hoặc số điện thoại"
            placeholderTextColor="#BBB"
            autoCapitalize="none"
            value={login}
            onChangeText={setLogin}
          />

          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            placeholderTextColor="#BBB"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={[styles.loginButton, loading && { opacity: 0.6 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginText}>
              {loading ? "Đang xử lý..." : "Tiếp tục"}
            </Text>
          </TouchableOpacity>

          {/* Nút phụ trở về Home nếu không muốn dùng nút ✕ ở trên */}
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => navigation.navigate("Main")}
          >
            <Text style={styles.skipText}>Trở về trang chủ</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.footer}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.footerText}>
            Chưa có tài khoản? <Text style={styles.registerLink}>Đăng ký</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  topBar: {
    paddingHorizontal: 25,
    paddingTop: 10,
    height: 50,
    justifyContent: "center",
  },
  backText: {
    fontSize: 20,
    color: "#000",
    fontWeight: "300",
  },
  container: { flex: 1, paddingHorizontal: 40, justifyContent: "center" },

  header: { marginBottom: 30 },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#999",
  },

  form: { marginBottom: 15 },
  input: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    fontSize: 15,
    color: "#000",
    marginBottom: 10,
    paddingHorizontal: 4,
  },

  loginButton: {
    backgroundColor: "#000",
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  loginText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  skipButton: {
    marginTop: 15,
    alignItems: "center",
  },
  skipText: {
    fontSize: 13,
    color: "#AAA",
    textDecorationLine: "underline",
  },

  footer: { marginTop: 20, alignItems: "center" },
  footerText: { fontSize: 13, color: "#AAA" },
  registerLink: { color: "#000", fontWeight: "600" },
});
