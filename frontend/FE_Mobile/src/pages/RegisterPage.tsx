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
export default function RegisterScreen() {
  const navigation = useNavigation<any>();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const sendOtp = async () => {
    try {
      await api.post("/otp/send", { email });
      Alert.alert("Thành công", "OTP đã gửi về email");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        Alert.alert("Lỗi", err.response?.data?.message || "Gửi OTP thất bại");
      } else {
        Alert.alert("Lỗi", "Có lỗi không xác định");
      }
    }
  };

  // đăng ký
  const register = async () => {
    try {
      await api.post("/users/register", {
        name,
        phone,
        email,
        password,
        otp,
        role: "user",
      });

      Alert.alert("Thành công", "Đăng ký thành công");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        Alert.alert("Lỗi", err.response?.data?.message || "Đăng ký thất bại");
      } else {
        Alert.alert("Lỗi", "Có lỗi không xác định");
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tạo tài khoản</Text>
      <Text style={styles.subtitle}>
        Điền thông tin để đăng ký tài khoản mới
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Họ và tên"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.otpButton} onPress={sendOtp}>
        <Text style={styles.otpText}>Lấy OTP</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Nhập OTP"
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
      />

      <TouchableOpacity style={styles.registerButton} onPress={register}>
        <Text style={styles.registerText}>Đăng ký</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginText}>
          Đã có tài khoản? <Text style={styles.loginLink}>Đăng nhập</Text>
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

  otpButton: {
    backgroundColor: "#E3F2FD",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },

  otpText: {
    color: "#1976D2",
    fontWeight: "600",
  },

  registerButton: {
    backgroundColor: "#1976D2",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 8,
    alignItems: "center",
  },

  registerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  loginText: {
    marginTop: 20,
    textAlign: "center",
    color: "#555",
  },

  loginLink: {
    color: "#1976D2",
    fontWeight: "600",
  },
});
