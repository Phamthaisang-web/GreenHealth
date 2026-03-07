import React, { useState, useEffect } from "react";
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

import { Picker } from "@react-native-picker/picker";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";
interface Province {
  code: number;
  name: string;
}

interface District {
  code: number;
  name: string;
}

interface Ward {
  code: number;
  name: string;
}
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

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [provinceCode, setProvinceCode] = useState<number | null>(null);
  const [districtCode, setDistrictCode] = useState<number | null>(null);

  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/p/")
      .then((res) => res.json())
      .then((data) => setProvinces(data))
      .catch(() => Alert.alert("Lỗi", "Không tải được tỉnh thành"));
  }, []);

  const loadDistricts = async (code: number) => {
    const res = await fetch(
      `https://provinces.open-api.vn/api/p/${code}?depth=2`,
    );
    const data = await res.json();
    setDistricts(data.districts);
    setWards([]);
  };

  const loadWards = async (code: number) => {
    const res = await fetch(
      `https://provinces.open-api.vn/api/d/${code}?depth=2`,
    );
    const data = await res.json();
    setWards(data.wards);
  };

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
          {/* Người nhận */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>Người nhận *</Text>
            <TextInput
              style={styles.input}
              placeholder="Tên đầy đủ"
              placeholderTextColor="#CCC"
              onChangeText={(val) => setForm({ ...form, receiver_name: val })}
            />
          </View>

          {/* Phone */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>Số điện thoại *</Text>
            <TextInput
              style={styles.input}
              placeholder="090..."
              keyboardType="phone-pad"
              placeholderTextColor="#CCC"
              onChangeText={(val) => setForm({ ...form, phone: val })}
            />
          </View>

          {/* Tỉnh */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>Tỉnh/Thành *</Text>

            <Picker
              style={{ flex: 1 }}
              selectedValue={provinceCode}
              onValueChange={(value) => {
                if (value === null) return;

                setProvinceCode(value);
                const province = provinces.find((p) => p.code === value);

                setForm({ ...form, city: province?.name || "" });

                loadDistricts(value);
              }}
            >
              <Picker.Item label="Chọn tỉnh thành" value={null} />

              {provinces.map((p) => (
                <Picker.Item key={p.code} label={p.name} value={p.code} />
              ))}
            </Picker>
          </View>

          {/* Quận */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>Quận/Huyện</Text>

            <Picker
              style={{ flex: 1 }}
              selectedValue={districtCode}
              onValueChange={(value) => {
                if (value === null) return;

                setDistrictCode(value);
                const district = districts.find((d) => d.code === value);

                setForm({ ...form, district: district?.name || "" });

                loadWards(value);
              }}
            >
              <Picker.Item label="Chọn quận huyện" value={null} />

              {districts.map((d) => (
                <Picker.Item key={d.code} label={d.name} value={d.code} />
              ))}
            </Picker>
          </View>

          {/* Phường */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>Phường/Xã</Text>

            <Picker
              style={{ flex: 1 }}
              selectedValue={form.ward}
              onValueChange={(value) => setForm({ ...form, ward: value })}
            >
              <Picker.Item label="Chọn phường xã" value="" />

              {wards.map((w) => (
                <Picker.Item key={w.code} label={w.name} value={w.name} />
              ))}
            </Picker>
          </View>

          {/* Địa chỉ */}
          <View style={styles.inputRow}>
            <Text style={styles.label}>Địa chỉ *</Text>
            <TextInput
              style={styles.input}
              placeholder="Số nhà, tên đường..."
              placeholderTextColor="#CCC"
              onChangeText={(val) => setForm({ ...form, address_line: val })}
            />
          </View>

          {/* Switch */}
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
