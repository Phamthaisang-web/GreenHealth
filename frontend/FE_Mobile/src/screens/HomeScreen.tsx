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
import { useNavigation } from "@react-navigation/native";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const ITEM_MIN_WIDTH = 180;
const GAP = 12;

export default function HomeScreen() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  const { width } = useWindowDimensions();
  const navigation = useNavigation<any>();
  const numColumns = Math.min(
    6,
    Math.max(2, Math.floor((width - 32 + GAP) / (ITEM_MIN_WIDTH + GAP))),
  );
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };
  useEffect(() => {
    if (!BASE_URL) {
      console.error("❌ EXPO_PUBLIC_BASE_URL is missing");
      setLoading(false);
      return;
    }
    fetchProducts();
  }, []);

  const fetchProducts = async (name = "") => {
    try {
      setLoading(true);

      const url = name
        ? `${BASE_URL}/products?name=${name}`
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
      {/* 🔍 Search */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Tìm sản phẩm..."
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
          returnKeyType="search"
          onSubmitEditing={() =>
            navigation.navigate("Products", {
              name: searchText,
              title: `Kết quả: "${searchText}"`,
            })
          }
        />

        <TouchableOpacity
          style={styles.searchButton}
          onPress={() =>
            navigation.navigate("Products", {
              name: searchText,
              title: `Kết quả: "${searchText}"`,
            })
          }
        >
          <Text style={styles.searchText}>Tìm</Text>
        </TouchableOpacity>
      </View>
      {/* 🥬 Categories */}
      <View style={styles.categoryContainer}>
        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() =>
            navigation.navigate("Products", {
              category_name: "Rau",
              title: "Rau củ",
            })
          }
        >
          <Text style={styles.categoryText}>🥬 Rau củ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() =>
            navigation.navigate("Products", {
              category_name: "Trái",
              title: "Trái cây",
            })
          }
        >
          <Text style={styles.categoryText}>🍎 Trái cây</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.categoryButton}
          onPress={() =>
            navigation.navigate("Products", {
              category_name: "Thịt",
              title: "Thịt tươi",
            })
          }
        >
          <Text style={styles.categoryText}>🥩 Thịt tươi</Text>
        </TouchableOpacity>
      </View>
      {/* 🧱 Grid */}
      <FlatList
        key={numColumns}
        data={products}
        numColumns={numColumns}
        refreshing={refreshing}
        onRefresh={onRefresh}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={
          numColumns > 1
            ? {
                gap: GAP,
                justifyContent: "space-between",
              }
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
  searchText: {
    color: "#fff",
    fontWeight: "600",
  },
  categoryContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },

  categoryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#1976D2",
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: "center",
  },

  categoryText: {
    color: "#1976D2",
    fontWeight: "600",
  },
});
