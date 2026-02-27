import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native";

import BottomTabNavigator from "./src/navigation/BottomTabNavigator";
import { View } from "react-native";
import Header from "./src/components/Header";
import ProductDetailScreen from "./src/screens/ProductDetailScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <View style={{ flex: 1 }}>
      <Header />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={BottomTabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
