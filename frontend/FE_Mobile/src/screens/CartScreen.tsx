import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { getCart, removeFromCart, updateQuantity } from "../utils/cart";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export default function CartScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);

      const cart = await getCart();

      const data = await Promise.all(
        cart.map(async (item: any) => {
          const res = await fetch(`${BASE_URL}/products/${item.productId}`);
          const product = await res.json();

          return {
            ...product,
            quantity: item.quantity,
          };
        }),
      );

      setItems(data);
    } catch (err) {
      console.log("❌ Lỗi load giỏ hàng", err);
    } finally {
      setLoading(false);
    }
  };
  const changeQty = async (id: number, qty: number) => {
    if (qty <= 0) {
      removeItem(id);
      return;
    }

    // ✅ Update UI ngay
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item)),
    );

    // ✅ Lưu vào AsyncStorage
    await updateQuantity(id, qty);
  };
  const removeItem = async (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    await removeFromCart(id);
  };
  useEffect(() => {
    loadCart();
  }, []);

  const total = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  if (items.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="cart-outline" size={60} color="#ccc" />
        <Text style={styles.emptyText}>Giỏ hàng trống</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{
                uri: item.image_url ?? "https://via.placeholder.com/150",
              }}
              style={styles.image}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>
                {Number(item.price).toLocaleString()} đ
              </Text>

              <View style={styles.qtyRow}>
                <TouchableOpacity
                  onPress={() => changeQty(item.id, item.quantity - 1)}
                >
                  <Ionicons name="remove-circle-outline" size={24} />
                </TouchableOpacity>

                <Text style={styles.qty}>{item.quantity}</Text>

                <TouchableOpacity
                  onPress={() => changeQty(item.id, item.quantity + 1)}
                >
                  <Ionicons name="add-circle-outline" size={24} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => removeItem(item.id)}
                  style={{ marginLeft: "auto" }}
                >
                  <Ionicons name="trash-outline" size={22} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/* 💰 Total */}
      <View style={styles.footer}>
        <Text style={styles.totalText}>Tổng cộng</Text>
        <Text style={styles.totalPrice}>{total.toLocaleString()} đ</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 12,
    padding: 10,
    gap: 10,
    elevation: 2,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  name: {
    fontSize: 15,
    fontWeight: "600",
  },
  price: {
    color: "#1976D2",
    fontWeight: "bold",
    marginVertical: 4,
  },
  qtyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qty: {
    fontSize: 16,
    minWidth: 24,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  totalText: {
    fontSize: 14,
    color: "#666",
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0ea91d",
    marginTop: 4,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    marginTop: 12,
    color: "#888",
  },
});
