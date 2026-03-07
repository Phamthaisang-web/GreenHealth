import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCart, clearCart } from "../utils/cart";
import { useNavigation } from "@react-navigation/native";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export default function PaymentScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [voucher, setVoucher] = useState("");
  const [address, setAddress] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<any>();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadCart(), loadAddress()]);
    setLoading(false);
  };

  const loadCart = async () => {
    try {
      const cart = await getCart();
      const data = await Promise.all(
        cart.map(async (item: any) => {
          const res = await fetch(`${BASE_URL}/products/${item.productId}`);
          const product = await res.json();
          const imgRes = await fetch(
            `${BASE_URL}/product-images/product/${item.productId}`,
          );
          const images = await imgRes.json();
          const mainImage = images.find((i: any) => i.is_main === 1);

          return {
            ...product,
            quantity: item.quantity,
            image_url: mainImage
              ? `${BASE_URL}${encodeURI(mainImage.image_url)}`
              : null,
          };
        }),
      );
      setItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadAddress = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/addresses/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        const def = data.find((a: any) => a.is_default === 1);
        setAddress(def || data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const total = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);

  const handleOrder = async () => {
    if (!address)
      return Alert.alert("Thông báo", "Vui lòng chọn địa chỉ giao hàng");

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const body = {
        address_id: address.id,
        voucher_code: voucher || null,
        cart_items: items.map((i) => ({
          product_id: i.id,
          quantity: i.quantity,
        })),
      };

      const res = await fetch(`${BASE_URL}/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Đặt hàng không thành công");

      await clearCart();
      Alert.alert("Thành công", "Đơn hàng của bạn đang được xử lý!", [
        { text: "OK", onPress: () => navigation.navigate("Main") },
      ]);
    } catch (err: any) {
      Alert.alert("Lỗi", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && items.length === 0) {
    return <ActivityIndicator style={{ flex: 1 }} color="#0ea91d" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ĐỊA CHỈ GIAO HÀNG */}
        <TouchableOpacity
          style={styles.section}
          onPress={() => navigation.navigate("AddressList")}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📍 Địa chỉ nhận hàng</Text>
            <Text style={styles.changeText}>Thay đổi</Text>
          </View>
          {address ? (
            <View style={styles.addressContent}>
              <Text style={styles.receiverText}>
                {address.receiver_name} • {address.phone}
              </Text>
              <Text style={styles.addressDetail}>
                {address.address_line}, {address.ward}, {address.district},{" "}
                {address.city}
              </Text>
            </View>
          ) : (
            <Text style={styles.emptyText}>
              Chưa có địa chỉ. Nhấp để thêm mới.
            </Text>
          )}
        </TouchableOpacity>

        {/* DANH SÁCH SẢN PHẨM */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sản phẩm</Text>
          {items.map((item) => (
            <View key={item.id} style={styles.productItem}>
              <Image
                source={{
                  uri: item.image_url || "https://via.placeholder.com/150",
                }}
                style={styles.productImg}
              />
              <View style={styles.productInfo}>
                <Text numberOfLines={1} style={styles.productName}>
                  {item.name}
                </Text>
                <Text style={styles.productPrice}>
                  {Number(item.price).toLocaleString()} đ
                </Text>
                <Text style={styles.productQty}>x{item.quantity}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* MÃ GIẢM GIÁ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ưu đãi</Text>
          <TextInput
            style={styles.voucherInput}
            placeholder="Nhập mã giảm giá (nếu có)"
            value={voucher}
            onChangeText={setVoucher}
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FOOTER ĐẶT HÀNG */}
      <View style={styles.footer}>
        <View style={styles.footerPriceRow}>
          <Text style={styles.footerLabel}>Tổng thanh toán:</Text>
          <Text style={styles.footerPrice}>{total.toLocaleString()} đ</Text>
        </View>
        <TouchableOpacity
          style={[styles.orderBtn, loading && { opacity: 0.7 }]}
          onPress={handleOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.orderBtnText}>ĐẶT HÀNG</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  section: { backgroundColor: "#FFF", padding: 16, marginBottom: 10 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#333" },
  changeText: { color: "#0ea91d", fontSize: 13 },
  addressContent: { marginTop: 4 },
  receiverText: { fontWeight: "600", fontSize: 14, color: "#222" },
  addressDetail: { color: "#666", fontSize: 13, marginTop: 2, lineHeight: 18 },
  emptyText: { color: "#999", fontStyle: "italic" },

  productItem: { flexDirection: "row", marginTop: 15, alignItems: "center" },
  productImg: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  productInfo: { flex: 1, marginLeft: 12 },
  productName: { fontSize: 14, color: "#333", marginBottom: 4 },
  productPrice: { fontSize: 14, fontWeight: "600", color: "#222" },
  productQty: { fontSize: 12, color: "#888", marginTop: 2 },

  voucherInput: {
    backgroundColor: "#F1F3F5",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    fontSize: 14,
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  footerPriceRow: { flex: 1 },
  footerLabel: { fontSize: 12, color: "#666" },
  footerPrice: { fontSize: 18, fontWeight: "bold", color: "#E74C3C" },
  orderBtn: {
    backgroundColor: "#0ea91d",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  orderBtnText: { color: "#FFF", fontWeight: "bold", fontSize: 15 },
});
