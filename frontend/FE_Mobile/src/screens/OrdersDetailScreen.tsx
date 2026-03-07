import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export default function OrderDetailScreen({ route }: any) {
  const { orderId } = route.params;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!data.items) return;

      const itemsWithImages = await Promise.all(
        data.items.map(async (item: any) => {
          try {
            const imgRes = await fetch(
              `${BASE_URL}/product-images/product/${item.product_id}`,
            );
            const imgData = await imgRes.json();
            return {
              ...item,
              image_url: imgData?.[0]?.image_url
                ? `${BASE_URL}${encodeURI(imgData[0].image_url)}`
                : "https://via.placeholder.com/150",
            };
          } catch {
            return { ...item, image_url: "https://via.placeholder.com/150" };
          }
        }),
      );

      setOrder({ ...data, items: itemsWithImages });
    } catch (err) {
      console.log("❌ Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <ActivityIndicator size="small" color="#000" style={{ marginTop: 50 }} />
    );
  if (!order)
    return <Text style={styles.emptyText}>Không tìm thấy đơn hàng</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Section 1: Tóm tắt trạng thái */}
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.labelSmall}>Mã đơn hàng</Text>
            <Text style={styles.valueSmall}>#{order.order_code}</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.labelSmall}>Trạng thái</Text>
            <Text
              style={[
                styles.statusText,
                { color: order.status === "CANCELLED" ? "#E53935" : "#2E7D32" },
              ]}
            >
              {order.status}
            </Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.labelSmall}>Thời gian đặt</Text>
            <Text style={styles.valueSmall}>
              {new Date(order.created_at).toLocaleString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>

        {/* Section 2: Thông tin nhận hàng (Dựa trên JSON mới) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Địa chỉ nhận hàng</Text>
          <Text style={styles.userName}>{order.user_name}</Text>
          <Text style={styles.userPhone}>{order.user_phone}</Text>
          <Text style={styles.addressDetail}>{order.full_address}</Text>
        </View>

        {/* Section 3: Sản phẩm (Đã sửa item.product_name) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Sản phẩm ({order.items.length})
          </Text>
          {order.items.map((item: any, index: number) => (
            <View key={index} style={styles.productItem}>
              <Image
                source={{ uri: item.image_url }}
                style={styles.productImg}
              />
              <View style={styles.productContent}>
                <View>
                  <Text numberOfLines={2} style={styles.productName}>
                    {item.product_name}
                  </Text>
                  {/* THÊM DÒNG XUẤT XỨ Ở ĐÂY */}
                  <Text style={styles.productOrigin}>
                    Xuất xứ: {item.origin || "Việt Nam"}
                  </Text>
                </View>

                <View style={styles.productMeta}>
                  <Text style={styles.productQty}>x{item.quantity}</Text>
                  <Text style={styles.productPrice}>
                    {parseFloat(item.price).toLocaleString()} đ
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Section 4: Thanh toán */}
        <View style={[styles.section, { marginBottom: 30 }]}>
          <Text style={styles.sectionTitle}>Chi tiết thanh toán</Text>
          <View style={styles.payRow}>
            <Text style={styles.payLabel}>Tổng tiền hàng</Text>
            <Text style={styles.payValue}>
              {parseFloat(order.total_amount_before).toLocaleString()} đ
            </Text>
          </View>
          {parseFloat(order.discount_amount) > 0 && (
            <View style={styles.payRow}>
              <Text style={styles.payLabel}>
                Giảm giá ({order.voucher_code})
              </Text>
              <Text style={[styles.payValue, { color: "#E53935" }]}>
                -{parseFloat(order.discount_amount).toLocaleString()} đ
              </Text>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.payRow}>
            <Text style={styles.totalLabel}>Thực thanh toán</Text>
            <Text style={styles.totalValue}>
              {parseFloat(order.total_amount).toLocaleString()} đ
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F8F8" },
  section: { backgroundColor: "#FFF", padding: 16, marginBottom: 8 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#AAA",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Thông tin chung
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  labelSmall: { fontSize: 12, color: "#888" },
  valueSmall: { fontSize: 12, color: "#333", fontWeight: "500" },
  statusText: { fontSize: 11, fontWeight: "700", textTransform: "uppercase" },

  // Địa chỉ
  userName: { fontSize: 14, fontWeight: "700", color: "#222", marginBottom: 2 },
  userPhone: { fontSize: 13, color: "#666", marginBottom: 4 },
  addressDetail: { fontSize: 13, color: "#888", lineHeight: 18 },

  // Sản phẩm
  productItem: { flexDirection: "row", marginBottom: 16 },
  productImg: {
    width: 60,
    height: 60,
    borderRadius: 4,
    backgroundColor: "#F9F9F9",
  },
  productContent: { flex: 1, marginLeft: 12, justifyContent: "space-between" },
  productName: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
    lineHeight: 18,
    flexShrink: 1,
  },
  productOrigin: {
    fontSize: 11,
    color: "#AAA",
    marginTop: 2,
  },
  productMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productQty: {
    fontSize: 12,
    color: "#999",
  },
  productPrice: { fontSize: 13, fontWeight: "600", color: "#222" },

  // Thanh toán
  payRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  payLabel: { fontSize: 12, color: "#777" },
  payValue: { fontSize: 12, color: "#333" },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#EEE",
    marginVertical: 10,
  },
  totalLabel: { fontSize: 14, fontWeight: "700", color: "#000" },
  totalValue: { fontSize: 16, fontWeight: "800", color: "#000" },

  emptyText: { textAlign: "center", marginTop: 100, color: "#999" },
});
