import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    loadCurrentData();
  }, []);

  const loadCurrentData = async () => {
    try {
      const res = await api.get("/users/me");
      setName(res.data.name);
      setPhone(res.data.phone);
    } catch (err) {
      Alert.alert("Lỗi", "Không thể kết nối máy chủ");
    } finally {
      setFetching(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) return Alert.alert("Lỗi", "Tên không được để trống");

    setLoading(true);
    try {
      await api.put("/users", { name: name.trim(), phone: phone.trim() });
      navigation.goBack();
    } catch (err) {
      Alert.alert("Lỗi", "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <ActivityIndicator style={{ flex: 1 }} color="#000" />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>Hủy</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hồ sơ</Text>
        <TouchableOpacity onPress={handleSave} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text style={styles.doneBtn}>Xong</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Tên</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Bắt buộc"
            autoFocus
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Điện thoại</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Tùy chọn"
            keyboardType="phone-pad"
          />
        </View>

        <Text style={styles.hint}>
          Thông tin này sẽ được hiển thị trên trang cá nhân và đơn hàng của bạn.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F2F2F2",
  },
  headerTitle: { fontSize: 17, fontWeight: "600" },
  backBtn: { fontSize: 16, color: "#666" },
  doneBtn: { fontSize: 16, color: "#000", fontWeight: "700" },
  content: { padding: 20 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F2F2F2",
  },
  label: { width: 100, fontSize: 15, color: "#888" },
  input: { flex: 1, fontSize: 15, color: "#000", padding: 0 },
  hint: { fontSize: 13, color: "#AAA", marginTop: 20, lineHeight: 18 },
});
