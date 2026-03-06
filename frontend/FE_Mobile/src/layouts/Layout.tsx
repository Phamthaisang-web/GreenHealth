import React from "react";
import { View, StyleSheet } from "react-native";
import Header from "./Header";
import BottomTabNavigator from "../navigation/BottomTabNavigator";

export default function HeaderLayout() {
  return (
    <View style={styles.container}>
      <Header />
      <BottomTabNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
