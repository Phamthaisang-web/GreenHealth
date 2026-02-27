import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Hoặc từ 'react-native-vector-icons/Ionicons'

export default function BackButton() {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.goBack()}
      activeOpacity={0.7} // Hiệu ứng nhấn
    >
      <View style={styles.content}>
        <Ionicons name="arrow-back" size={20} color="#1976D2" />
        <Text style={styles.text}>Trở về</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    backgroundColor: "#F5F5F5", // Nền nhẹ
    borderRadius: 8, // Bo góc
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: "flex-start", // Không chiếm toàn bộ chiều rộng
    // Shadow cho iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation cho Android
    elevation: 3,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    color: "#1976D2",
    fontWeight: "600",
    marginLeft: 8, // Khoảng cách giữa icon và text
  },
});
