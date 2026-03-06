import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import ProductCard from "../components/ProductCard";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const ITEM_MIN_WIDTH = 180;
const GAP = 12;

export default function ProductsScreen() {
  const route = useRoute<any>();
  const { name, category_name, title } = route.params || {};

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { width } = useWindowDimensions();

  // 👉 TÍNH SỐ CỘT GIỐNG HOME
  const numColumns = Math.min(
    6,
    Math.max(2, Math.floor((width - 32 + GAP) / (ITEM_MIN_WIDTH + GAP))),
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      let url = `${BASE_URL}/products?`;
      if (name) url += `name=${encodeURIComponent(name)}&`;
      if (category_name)
        url += `category_name=${encodeURIComponent(category_name)}&`;

      const res = await fetch(url);
      const data = await res.json();

      const withImages = await Promise.all(
        data.map(async (p: any) => {
          try {
            const imgRes = await fetch(
              `${BASE_URL}/product-images/product/${p.id}`,
            );
            const images = await imgRes.json();
            const main = images.find((i: any) => i.is_main === 1) || images[0];

            return {
              ...p,
              image_url: main ? `${BASE_URL}${main.image_url}` : null,
            };
          } catch {
            return { ...p, image_url: null };
          }
        }),
      );

      setProducts(withImages);
    } catch (e) {
      console.log("❌ Lỗi load products:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}

      <FlatList
        key={numColumns} // 👈 BẮT BUỘC
        data={products}
        numColumns={numColumns}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={
          numColumns > 1
            ? { gap: GAP, justifyContent: "space-between" }
            : undefined
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => <ProductCard product={item} />}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginVertical: 12,
  },
});
