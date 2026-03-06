import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
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
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [sendingOtp, setSendingOtp] = useState(false);
  const register = async () => {
    console.log("aaaaaaaa");
    if (!name || !phone || !email || !password || !otp) {
      return Alert.alert("Thông báo", "Vui lòng điền đầy đủ thông tin");
    }
    setLoading(true);
    try {
      console.log("SSSSSSSSSS", name, phone, email, password, otp);
      await api.post("/users/register", {
        name,
        phone,
        email,
        password,
        otp,
        role: "user",
      });
      console.log("saaaas");
      Alert.alert("Thành công", "Tài khoản đã được tạo", [
        { text: "Đăng nhập", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message
        : "Đăng ký thất bại";
      Alert.alert("Lỗi", msg);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown]);
  const sendOtp = async () => {
    if (!email) {
      return Alert.alert("Thông báo", "Vui lòng nhập email trước");
    }

    if (countdown > 0 || sendingOtp) return;

    setSendingOtp(true); // khóa ngay lập tức

    try {
      await api.post("/otp/send", { email });

      Alert.alert("Thành công", "OTP đã được gửi đến email");

      setCountdown(60);
    } catch (err) {
      Alert.alert("Lỗi", "Gửi OTP thất bại");
    } finally {
      setSendingOtp(false);
    }
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Header nhỏ gọn */}
          <View style={styles.header}>
            <Text style={styles.title}>Tạo tài khoản</Text>
            <Text style={styles.subtitle}>
              Gia nhập cộng đồng thực phẩm sạch
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Họ và tên"
              placeholderTextColor="#BBB"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              placeholderTextColor="#BBB"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#BBB"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />

            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              placeholderTextColor="#BBB"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {/* OTP Container dạng gạch chân */}
            <View style={styles.otpWrapper}>
              <TextInput
                style={[
                  styles.input,
                  { flex: 1, borderBottomWidth: 0, marginBottom: 0 },
                ]}
                placeholder="Nhập mã OTP"
                placeholderTextColor="#BBB"
                keyboardType="number-pad"
                value={otp}
                onChangeText={setOtp}
              />
              <TouchableOpacity
                onPress={sendOtp}
                style={styles.otpBtn}
                disabled={countdown > 0 || sendingOtp}
              >
                <Text
                  style={[
                    styles.otpBtnText,
                    (countdown > 0 || sendingOtp) && { color: "#999" },
                  ]}
                >
                  {sendingOtp
                    ? "Đang gửi..."
                    : countdown > 0
                      ? `${countdown}s`
                      : "Gửi mã"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.registerButton, loading && { opacity: 0.6 }]}
            onPress={register}
            disabled={loading}
          >
            <Text style={styles.registerButtonText}>
              {loading ? "Đang tạo..." : "Đăng ký"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={styles.footer}
          >
            <Text style={styles.footerText}>
              Đã có tài khoản? <Text style={styles.loginLink}>Đăng nhập</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { paddingHorizontal: 40, paddingVertical: 30 },

  header: { marginBottom: 25 },
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

  form: { width: "100%" },
  input: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    fontSize: 15,
    color: "#000",
    marginBottom: 12,
    paddingHorizontal: 4,
  },

  otpWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    marginBottom: 20,
  },
  otpBtn: {
    paddingLeft: 15,
    paddingVertical: 10,
  },
  otpBtnText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 13,
  },

  registerButton: {
    backgroundColor: "#000",
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  footer: { marginTop: 20, alignItems: "center" },
  footerText: { fontSize: 13, color: "#AAA" },
  loginLink: { color: "#000", fontWeight: "600" },
});
