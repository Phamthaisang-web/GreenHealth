import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

type Product = {
  id: number;
  name: string;
  price: string;
  origin: string;
  image_url?: string | null;
};

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const navigation = useNavigation<any>();

  const imageUri =
    product.image_url ??
    "https://via.placeholder.com/300x300.png?text=No+Image";

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={() =>
        navigation.navigate("ProductDetail", {
          productId: product.id,
        })
      }
    >
      <View style={styles.card}>
        <Image
          source={{
            uri: imageUri,
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          }}
          style={styles.image}
        />

        <Text numberOfLines={2} style={styles.name}>
          {product.name}
        </Text>

        <Text style={styles.price}>
          {Number(product.price).toLocaleString()} đ
        </Text>

        <Text style={styles.origin}>Xuất xứ: {product.origin}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: "#ddd",
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
  },
  price: {
    fontSize: 14,
    color: "#0ea91d",
    fontWeight: "bold",
  },
  origin: {
    fontSize: 12,
    color: "#555",
  },
});
