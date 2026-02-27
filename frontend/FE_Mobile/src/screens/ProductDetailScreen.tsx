import React from "react";
import { Text } from "react-native";

export default function ProductDetailScreen({ route }: any) {
  const { productId } = route.params;

  return <Text>Product ID: {productId}</Text>;
}
