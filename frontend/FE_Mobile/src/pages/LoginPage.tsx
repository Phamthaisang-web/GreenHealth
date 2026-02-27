import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackButton from "../components/BackButton";

export default function LoginScreen() {
  const navigation = useNavigation<any>();

  const [login, setLogin] = useState(""); // email hoặc phone
  const [password, setPassword] = useState("");
  const handleLogin = async () => {
    if (!login || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const res = await api.post("/users/login", {
        login,
        password,
      });

      const { token, user } = res.data;

      // 🔐 Lưu token & user
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      Alert.alert("Thành công", "Đăng nhập thành công", [
        {
          text: "OK",
          onPress: () => navigation.replace("Home"),
        },
      ]);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        Alert.alert("Lỗi", err.response?.data?.message || "Đăng nhập thất bại");
      } else {
        Alert.alert("Lỗi", "Có lỗi không xác định");
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>
      <Text style={styles.subtitle}>Chào mừng bạn quay trở lại</Text>

      <TextInput
        style={styles.input}
        placeholder="Email hoặc số điện thoại"
        autoCapitalize="none"
        value={login}
        onChangeText={setLogin}
      />

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Đăng nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.registerText}>
          Chưa có tài khoản? <Text style={styles.registerLink}>Đăng ký</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 24,
    textAlign: "center",
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: "#fafafa",
  },

  loginButton: {
    backgroundColor: "#1976D2",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
  },

  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  registerText: {
    marginTop: 20,
    textAlign: "center",
    color: "#555",
  },

  registerLink: {
    color: "#1976D2",
    fontWeight: "600",
  },
});
