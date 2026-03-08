import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Pressable,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export default function OrderScreen({ navigation }: any) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("ALL");

  const filters = [
    { key: "ALL", label: "Tất cả" },
    { key: "PENDING", label: "Chờ xử lý" },
    { key: "COMPLETED", label: "Hoàn thành" },
    { key: "CANCELLED", label: "Đã hủy" },
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setOrders(data || []);
    } catch (err) {
      console.log("❌ Error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const cancelOrder = async (orderId: number) => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/orders/${orderId}/cancel`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error();

      Alert.alert("Thành công", "Đã hủy đơn hàng");

      fetchOrders();
    } catch (error) {
      Alert.alert("Lỗi", "Không thể hủy đơn");
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "PENDING":
        return { label: "Chờ xử lý", color: "#F2994A", bg: "#FFF9F2" };
      case "COMPLETED":
        return { label: "Hoàn thành", color: "#27AE60", bg: "#F2FAF5" };
      case "CANCELLED":
        return { label: "Đã hủy", color: "#EB5757", bg: "#FFF5F5" };
      default:
        return { label: status, color: "#828282", bg: "#F2F2F2" };
    }
  };

  const filteredOrders =
    filter === "ALL"
      ? orders
      : orders.filter((order) => order.status === filter);

  const renderItem = ({ item }: { item: any }) => {
    const status = getStatusInfo(item.status);

    return (
      <Pressable
        style={styles.card}
        onPress={() => navigation.navigate("OrderDetail", { orderId: item.id })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.date}>
            {new Date(item.created_at).toLocaleDateString("vi-VN")}
          </Text>

          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Text style={[styles.statusText, { color: status.color }]}>
              {status.label}
            </Text>
          </View>
        </View>

        <Text style={styles.orderCode}>#{item.order_code}</Text>

        <Text style={styles.address} numberOfLines={1}>
          {item.full_address}
        </Text>

        <View style={styles.cardFooter}>
          <Text style={styles.price}>
            {Number(item.total_amount).toLocaleString()} đ
          </Text>

          {item.status === "PENDING" && (
            <Pressable
              hitSlop={10}
              onPress={() =>
                Alert.alert("Xác nhận", "Bạn muốn hủy đơn?", [
                  { text: "Quay lại" },
                  {
                    text: "Hủy đơn",
                    style: "destructive",
                    onPress: () => cancelOrder(item.id),
                  },
                ])
              }
            >
              <Text style={styles.cancelLink}>Hủy đơn</Text>
            </Pressable>
          )}
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
      </View>

      {/* Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
        style={{ maxHeight: 40 }}
      >
        {filters.map((item) => (
          <Pressable
            key={item.key}
            style={[
              styles.filterBtn,
              filter === item.key && styles.filterActive,
            ]}
            onPress={() => setFilter(item.key)}
          >
            <Text
              style={[
                styles.filterText,
                filter === item.key && styles.filterTextActive,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {loading ? (
        <ActivityIndicator color="#000" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchOrders();
              }}
            />
          }
          ListEmptyComponent={
            <Text style={styles.empty}>Bạn chưa có đơn hàng nào</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1A1A1A",
  },

  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 8,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#F2F2F2",
    marginRight: 8,
  },

  filterActive: {
    backgroundColor: "#0ea91d",
  },

  filterText: {
    fontSize: 13,
    color: "#828282",
    fontWeight: "600",
  },

  filterTextActive: {
    color: "#FFFFFF",
  },

  list: {
    paddingHorizontal: 20,
  },

  card: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  date: {
    fontSize: 13,
    color: "#828282",
  },

  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  orderCode: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 4,
  },

  address: {
    fontSize: 13,
    color: "#828282",
    marginBottom: 12,
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },

  price: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0ea91d",
  },

  cancelLink: {
    fontSize: 13,
    color: "#EB5757",
    fontWeight: "600",
    textDecorationLine: "underline",
  },

  empty: {
    textAlign: "center",
    marginTop: 100,
    color: "#BDBDBD",
    fontSize: 15,
  },
});
