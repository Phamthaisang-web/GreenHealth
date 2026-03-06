import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export default function AddAddressScreen() {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    receiver_name: "",
    phone: "",
    address_line: "",
    ward: "",
    district: "",
    city: "",
    is_default: false,
  });

  const saveAddress = async () => {
    if (
      !form.receiver_name ||
      !form.phone ||
      !form.address_line ||
      !form.city
    ) {
      return Alert.alert(
        "Thông báo",
        "Vui lòng điền các thông tin bắt buộc (*)",
      );
    }

    try {
      await api.post("/addresses", form);
      navigation.goBack();
    } catch (err) {
      Alert.alert("Lỗi", "Không thể lưu địa chỉ. Vui lòng thử lại.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header tối giản */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelBtn}>Hủy</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Địa chỉ mới</Text>
        <TouchableOpacity onPress={saveAddress}>
          <Text style={styles.saveBtn}>Lưu</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputRow}>
            <Text style={styles.label}>Người nhận *</Text>
            <TextInput
              style={styles.input}
              placeholder="Tên đầy đủ"
              placeholderTextColor="#CCC"
              onChangeText={(val) => setForm({ ...form, receiver_name: val })}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Số điện thoại *</Text>
            <TextInput
              style={styles.input}
              placeholder="090..."
              placeholderTextColor="#CCC"
              keyboardType="phone-pad"
              onChangeText={(val) => setForm({ ...form, phone: val })}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Tỉnh/Thành *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ví dụ: Hà Nội"
              placeholderTextColor="#CCC"
              onChangeText={(val) => setForm({ ...form, city: val })}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Quận/Huyện</Text>
            <TextInput
              style={styles.input}
              placeholder="Tên quận/huyện"
              placeholderTextColor="#CCC"
              onChangeText={(val) => setForm({ ...form, district: val })}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Phường/Xã</Text>
            <TextInput
              style={styles.input}
              placeholder="Tên phường/xã"
              placeholderTextColor="#CCC"
              onChangeText={(val) => setForm({ ...form, ward: val })}
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.label}>Địa chỉ *</Text>
            <TextInput
              style={styles.input}
              placeholder="Số nhà, tên đường..."
              placeholderTextColor="#CCC"
              onChangeText={(val) => setForm({ ...form, address_line: val })}
            />
          </View>

          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchLabel}>Đặt làm mặc định</Text>
              <Text style={styles.switchSubLabel}>
                Sử dụng cho các đơn hàng sau này
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#EEE", true: "#000" }}
              thumbColor={Platform.OS === "ios" ? "" : "#FFF"}
              value={form.is_default}
              onValueChange={(val) => setForm({ ...form, is_default: val })}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  headerTitle: { fontSize: 17, fontWeight: "600", color: "#000" },
  cancelBtn: { fontSize: 16, color: "#888" },
  saveBtn: { fontSize: 16, color: "#000", fontWeight: "700" },

  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F2F2F2",
  },
  label: { width: 110, fontSize: 15, color: "#888" },
  input: { flex: 1, fontSize: 15, color: "#000", padding: 0 },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    paddingVertical: 10,
  },
  switchLabel: { fontSize: 16, fontWeight: "500", color: "#333" },
  switchSubLabel: { fontSize: 13, color: "#AAA", marginTop: 2 },
});
