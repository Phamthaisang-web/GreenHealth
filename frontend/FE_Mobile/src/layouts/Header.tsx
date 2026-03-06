import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useCartCount } from "../utils/useCartCount";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Header() {
  const navigation = useNavigation<any>();
  const route = useRoute();

  // Kiểm tra xem có thể quay lại hay không
  const canGoBack = navigation.canGoBack();
  const cartCount = useCartCount();

  const handleBack = () => {
    if (canGoBack) {
      navigation.goBack();
    }
  };

  const goToCart = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Yêu cầu đăng nhập", "Bạn cần đăng nhập để xem giỏ hàng.", [
        { text: "Để sau", style: "cancel" },
        { text: "Đăng nhập", onPress: () => navigation.navigate("Login") },
      ]);
      return;
    }
    navigation.navigate("Cart");
  };

  return (
    <View style={styles.container}>
      {/* Chỉ hiện nút back nếu có trang để quay lại và không phải trang Main */}
      {canGoBack && route.name !== "Main" && (
        <TouchableOpacity style={styles.back} onPress={handleBack}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </TouchableOpacity>
      )}

      <Text style={styles.title}>Green Health</Text>

      <TouchableOpacity style={styles.cart} onPress={goToCart}>
        <Ionicons name="cart-outline" size={26} color="#fff" />
        {cartCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {cartCount > 99 ? "99+" : cartCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0ea91d",
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingBottom: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "700" },
  back: { position: "absolute", left: 16, bottom: 12 },
  cart: { position: "absolute", right: 16, bottom: 12 },
  badge: {
    position: "absolute",
    right: -6,
    top: -4,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#0ea91d",
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
});
