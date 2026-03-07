import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
} from "react-native";

const EVENTS = [
  {
    id: "1",
    title: "Tuần lễ rau sạch Đà Lạt",
    description:
      "Ưu đãi các loại rau củ hữu cơ, thu hoạch trong ngày và vận chuyển lạnh.",
    supplier: "Nông trại Xanh",
    time: "01/03 – 07/03/2026",
    type: "Khuyến mãi",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e",
  },
  {
    id: "2",
    title: "Cách chọn trái cây tươi & an toàn",
    description:
      "Trái cây tươi thường có màu sắc tự nhiên, không quá bóng và mùi thơm nhẹ.",
    supplier: "GreenHealth",
    time: "Hàng tuần",
    type: "Kiến thức",
    image: "https://images.unsplash.com/photo-1574226516831-e1dff420e43e",
  },
  {
    id: "3",
    title: "Đối tác mới: Nông trại Xanh",
    description:
      "Hợp tác cung cấp rau củ tươi mỗi ngày với nguồn gốc minh bạch.",
    supplier: "GreenHealth",
    time: "28/02/2026",
    type: "Thông báo",
    image: "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2",
  },
];

export default function EventsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={EVENTS}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />

            <View style={styles.content}>
              <View style={styles.headerRow}>
                <Text style={styles.type}>{item.type}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>

              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc} numberOfLines={2}>
                {item.description}
              </Text>

              <View style={styles.footer}>
                <Text style={styles.supplier}>Nguồn: {item.supplier}</Text>
                <Text style={styles.readMore}>Chi tiết ›</Text>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    marginBottom: 30,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    backgroundColor: "#F5F5F7",
  },
  content: {
    paddingVertical: 12,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  type: {
    color: "#0ea91d",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  time: {
    fontSize: 11,
    color: "#BBB",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#000",
    marginBottom: 6,
    letterSpacing: -0.4,
  },
  desc: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderTopColor: "#F0F0F0",
    paddingTop: 10,
  },
  supplier: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
  readMore: {
    fontSize: 12,
    color: "#000",
    fontWeight: "600",
  },
});
