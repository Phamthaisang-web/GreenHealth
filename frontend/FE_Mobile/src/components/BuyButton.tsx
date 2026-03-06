import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function BuyButton({ onPress }: { onPress: () => void }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.85}
        onPress={onPress}
      >
        <Ionicons name="cart-outline" size={22} color="#fff" />
        <Text style={styles.text}>Mua sản phẩm</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  button: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#0ea91d",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    elevation: 4,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
