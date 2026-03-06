import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";

import BuyButton from "../components/BuyButton";
import { addToCart } from "../utils/cart";
import { Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export default function ProductDetailScreen({ route }: any) {
  const { productId } = route.params;

  const [product, setProduct] = useState<any>(null);
  const [category, setCategory] = useState<any>(null);
  const [supplier, setSupplier] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<any>();
  useEffect(() => {
    fetchAll();
  }, [productId]);

  const fetchAll = async () => {
    try {
      setLoading(true);

      const productRes = await fetch(`${BASE_URL}/products/${productId}`);
      const productData = await productRes.json();
      const imgRes = await fetch(
        `${BASE_URL}/product-images/product/${productId}`,
      );
      const imagesData = await imgRes.json();

      const mappedImages = imagesData.map((img: any) => ({
        ...img,
        full_url: `${BASE_URL}${encodeURI(img.image_url)}`,
      }));

      setImages(mappedImages);
      setCurrentIndex(0);

      const categoryRes = await fetch(
        `${BASE_URL}/categories/${productData.category_id}`,
      );
      const categoryData = await categoryRes.json();

      const supplierRes = await fetch(
        `${BASE_URL}/suppliers/${productData.supplier_id}`,
      );
      const supplierData = await supplierRes.json();

      setProduct(productData);
      setCategory(categoryData);
      setSupplier(supplierData);
    } catch (error) {
      console.log("❌ Lỗi lấy chi tiết sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        Alert.alert("Yêu cầu đăng nhập", "Bạn cần đăng nhập để xem giỏ hàng.", [
          { text: "Để sau", style: "cancel" },
          { text: "Đăng nhập", onPress: () => navigation.navigate("Login") },
        ]);
        return;
      }

      await addToCart(product.id, 1);

      Alert.alert("🛒 Thành công", "Đã thêm sản phẩm vào giỏ hàng");
    } catch (error) {
      Alert.alert("❌ Lỗi", "Không thể thêm vào giỏ hàng");
    }
  };
  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  }

  if (!product) {
    return <Text style={{ textAlign: "center" }}>Không tìm thấy sản phẩm</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 🖼 Ảnh lớn */}
        <View style={styles.imageWrapper}>
          <Image
            source={{
              uri:
                images[currentIndex]?.full_url ??
                "https://via.placeholder.com/600x600.png?text=No+Image",
            }}
            style={styles.image}
          />

          {/* ◀ */}
          {images.length > 1 && (
            <Text
              style={[styles.navBtn, { left: 10 }]}
              onPress={() =>
                setCurrentIndex((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1,
                )
              }
            >
              ‹
            </Text>
          )}

          {/* ▶ */}
          {images.length > 1 && (
            <Text
              style={[styles.navBtn, { right: 10 }]}
              onPress={() =>
                setCurrentIndex((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1,
                )
              }
            >
              ›
            </Text>
          )}
        </View>

        {/* 🖼 Thumbnails */}
        {images.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbContainer}
          >
            {images.map((img, index) => (
              <Pressable key={img.id} onPress={() => setCurrentIndex(index)}>
                <Image
                  source={{ uri: img.full_url }}
                  style={[
                    styles.thumb,
                    index === currentIndex && styles.thumbActive,
                  ]}
                />
              </Pressable>
            ))}
          </ScrollView>
        )}

        {/* 📦 Thông tin */}
        <View style={styles.card}>
          <Text style={styles.name}>{product.name}</Text>

          <Text style={styles.price}>
            {Number(product.price).toLocaleString()} đ / {product.unit}
          </Text>

          <View style={styles.divider} />

          <InfoRow label="Danh mục" value={category?.name} />
          <InfoRow label="Xuất xứ" value={product.origin} />
          <InfoRow label="Nhà cung cấp" value={supplier?.name} />
          <InfoRow label="NSX" value={formatDate(product.manufacture_date)} />
          <InfoRow label="HSD" value={formatDate(product.expiry_date)} />

          <View style={styles.divider} />

          <Text style={styles.descTitle}>Mô tả</Text>
          <Text style={styles.desc}>
            {product.description || "Chưa có mô tả sản phẩm"}
          </Text>
        </View>
      </ScrollView>

      <BuyButton onPress={handleBuy} />
    </View>
  );
}

/* ===== COMPONENT PHỤ ===== */

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value || "--"}</Text>
    </View>
  );
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "--";
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

/* ===== STYLE ===== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  imageWrapper: {
    position: "relative",
  },

  image: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: "#eee",
  },

  navBtn: {
    position: "absolute",
    top: "45%",
    fontSize: 40,
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 12,
    borderRadius: 20,
    overflow: "hidden",
  },

  thumbContainer: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
  },

  thumb: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },

  thumbActive: {
    borderColor: "#0ea91d",
    borderWidth: 2,
  },

  card: {
    backgroundColor: "#fff",
    marginTop: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
  },

  price: {
    fontSize: 20,
    color: "#0ea91d",
    fontWeight: "700",
    marginBottom: 12,
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  label: {
    fontSize: 14,
    color: "#777",
  },

  value: {
    fontSize: 14,
    fontWeight: "600",
  },

  descTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },

  desc: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
});
