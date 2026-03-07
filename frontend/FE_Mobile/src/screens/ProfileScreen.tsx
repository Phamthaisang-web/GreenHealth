import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { api } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useIsFocused } from "@react-navigation/native";

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isFocused) {
      checkLoginStatus();
    }
  }, [isFocused]);

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

    setIsLoggedIn(true);
    loadProfile();
  };

  const loadProfile = async () => {
    try {
      const res = await api.get("/users/me");
      setUser(res.data);
    } catch (err) {
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    Alert.alert("Xác nhận", "Bạn muốn đăng xuất?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Đăng xuất",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.multiRemove(["token", "user"]);
          setIsLoggedIn(false);
          setUser(null);
          navigation.navigate("Login");
        },
      },
    ]);
  };

  if (loading)
    return <ActivityIndicator style={{ flex: 1 }} size="small" color="#000" />;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {isLoggedIn ? (
          <View style={styles.content}>
            {/* PROFILE HEADER */}
            <View style={styles.headerProfile}>
              <View style={styles.avatarMini}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0)?.toUpperCase()}
                </Text>
              </View>

              <Text style={styles.name}>{user?.name}</Text>
              <Text style={styles.email}>{user?.email}</Text>
            </View>

            {/* USER INFO */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>

              <InfoRow label="Tên" value={user?.name} />
              <InfoRow label="Email" value={user?.email} />
              <InfoRow label="Số điện thoại" value={user?.phone} />
              <InfoRow label="Điểm thưởng" value={user?.reward_points} />
              <InfoRow label="Vai trò" value={user?.role} />
              <InfoRow label="Trạng thái" value={user?.status} />
            </View>

            {/* ACCOUNT MENU */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tài khoản</Text>

              <MenuRow
                label="Chỉnh sửa hồ sơ"
                onPress={() => navigation.navigate("EditProfile")}
              />

              <MenuRow
                label="Địa chỉ nhận hàng"
                onPress={() => navigation.navigate("AddressList")}
              />

              <MenuRow
                label="Đơn hàng của tôi"
                onPress={() => navigation.navigate("OrderHistory")}
              />
            </View>

            {/* FOOTER */}
            <View style={styles.footer}>
              <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                <Text style={styles.homeLinkText}>Về trang chủ</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
                <Text style={styles.logoutText}>Đăng xuất</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.unauthorizedContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Tài khoản</Text>
              <Text style={styles.subtitle}>
                Vui lòng đăng nhập để trải nghiệm đầy đủ tính năng
              </Text>
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.loginButtonText}>Đăng nhập ngay</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.homeLink}
              onPress={() => navigation.navigate("")}
            >
              <Text style={styles.homeLinkText}>Khám phá thêm</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const InfoRow = ({ label, value }: any) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const MenuRow = ({ label, onPress }: any) => (
  <TouchableOpacity style={styles.row} onPress={onPress}>
    <Text style={styles.rowLabel}>{label}</Text>
    <Text style={styles.arrow}>›</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  content: { flex: 1 },

  unauthorizedContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 40,
  },

  header: { marginBottom: 30 },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: "#999",
    lineHeight: 20,
  },

  loginButton: {
    backgroundColor: "#000",
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  loginButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  headerProfile: {
    alignItems: "center",
    paddingVertical: 40,
  },

  avatarMini: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F5F5F7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  avatarText: {
    color: "#000",
    fontSize: 24,
    fontWeight: "600",
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
  },

  email: {
    fontSize: 13,
    color: "#AAA",
  },

  section: {
    paddingHorizontal: 30,
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#CCC",
    textTransform: "uppercase",
    marginBottom: 10,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },

  infoLabel: {
    fontSize: 14,
    color: "#888",
  },

  infoValue: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F9F9F9",
  },

  rowLabel: {
    fontSize: 15,
    color: "#333",
  },

  arrow: {
    fontSize: 18,
    color: "#DDD",
  },

  footer: {
    paddingHorizontal: 40,
    marginTop: 30,
    alignItems: "center",
    paddingBottom: 40,
  },

  homeLink: {
    marginTop: 10,
    alignItems: "center",
  },

  homeLinkText: {
    fontSize: 14,
    color: "#000",
    textDecorationLine: "underline",
    fontWeight: "500",
  },

  logoutBtn: {
    marginTop: 20,
    width: "100%",
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },

  logoutText: {
    color: "#FF3B30",
    fontWeight: "600",
  },
});
