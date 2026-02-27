import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  useWindowDimensions,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import ProductCard from "../components/ProductCard";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export default function HomeScreen() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const { width } = useWindowDimensions();
  const numColumns = width >= 900 ? 4 : width >= 600 ? 3 : 2;

  useEffect(() => {
    if (!BASE_URL) {
      console.error("❌ EXPO_PUBLIC_BASE_URL is missing");
      setLoading(false);
      return;
    }
    fetchProducts();
  }, [BASE_URL]);
  const fetchProducts = async (name = "") => {
    try {
      setLoading(true);

      const url = name
        ? `http://127.0.0.1:5000/categories/`
        : `${BASE_URL}/products`;

      const res = await fetch(url);
      const productsData = await res.json();

      const productsWithImages = await Promise.all(
        productsData.map(async (product: any) => {
          try {
            const imgRes = await fetch(
              `${BASE_URL}/product-images/product/${product.id}`,
            );
            const images = await imgRes.json();

            const mainImage =
              images.find((img: any) => img.is_main === 1) || images[0];

            return {
              ...product,
              image_url: mainImage ? `${BASE_URL}${mainImage.image_url}` : null,
            };
          } catch {
            return { ...product, image_url: null };
          }
        }),
      );

      setProducts(productsWithImages);
    } catch (error) {
      console.log("❌ Lỗi lấy sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Tìm sản phẩm..."
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
          returnKeyType="search"
          onSubmitEditing={() => fetchProducts(searchText)}
        />

        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => fetchProducts(searchText)}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Tìm</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        key={numColumns}
        data={products}
        numColumns={numColumns}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={{ gap: 12 }}
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
  searchContainer: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 12,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  searchButton: {
    backgroundColor: "#1976D2",
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
});
