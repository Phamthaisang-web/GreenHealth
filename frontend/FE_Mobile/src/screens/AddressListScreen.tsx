import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import { api } from "../services/api";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

export default function AddressListScreen() {
  const navigation = useNavigation<any>();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAddresses = async () => {
    try {
      const res = await api.get("/addresses");
      setAddresses(res.data);
    } catch (err) {
      Alert.alert("Lỗi", "Không thể tải danh sách địa chỉ");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadAddresses();
    }, []),
  );

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.addressRow}
      onPress={() => {
        /* Có thể thêm logic chọn địa chỉ mặc định hoặc chỉnh sửa */
      }}
    >
      <View style={styles.content}>
        <View style={styles.rowHeader}>
          <Text style={styles.receiverName}>{item.receiver_name}</Text>
          {item.is_default === 1 && (
            <Text style={styles.defaultText}>Mặc định</Text>
          )}
        </View>
        <Text style={styles.phoneText}>{item.phone}</Text>
        <Text style={styles.addressDetail} numberOfLines={2}>
          {item.address_line}, {item.ward}, {item.district}, {item.city}
        </Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Địa chỉ nhận hàng</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AddAddress")}>
          <Text style={styles.addText}>Thêm mới</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="small"
          color="#000"
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={styles.empty}>Chưa có địa chỉ lưu trữ</Text>
          }
          contentContainerStyle={styles.listContent}
        />
      )}
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
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F2F2F2",
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#000" },
  addText: { fontSize: 15, color: "#000", fontWeight: "500" },

  listContent: { paddingHorizontal: 20 },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "#F2F2F2",
  },
  content: { flex: 1, paddingRight: 10 },
  rowHeader: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  receiverName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginRight: 10,
  },
  defaultText: {
    fontSize: 11,
    color: "#888",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: "hidden",
  },

  phoneText: { fontSize: 14, color: "#666", marginBottom: 4 },
  addressDetail: { fontSize: 14, color: "#999", lineHeight: 20 },
  arrow: { fontSize: 22, color: "#CCC", fontWeight: "300" },

  empty: { textAlign: "center", marginTop: 100, color: "#AAA", fontSize: 14 },
});
