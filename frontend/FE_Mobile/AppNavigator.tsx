import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar, View } from "react-native";

import HomeScreen from "./src/screens/HomeScreen";
import BottomTabNavigator from "./src/navigation/BottomTabNavigator";
import Header from "./src/layouts/Header";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import ProductDetailScreen from "./src/screens/ProductDetailScreen";
import CartScreen from "./src/screens/CartScreen";
import ProductsScreen from "./src/screens/ProductsScreen";
import { navigationRef } from "./src/navigation/navigationRef";
import ChangePasswordScreen from "./src/screens/ChangePasswordScreen";
import AddAddressScreen from "./src/screens/AddAddressScreen";
import AddressListScreen from "./src/screens/AddressListScreen";
import EditProfileScreen from "./src/screens/EditProfileScreen";
import PaymentScreen from "./src/screens/PaymentScreen";
import OrderDetailScreen from "./src/screens/OrdersDetailScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{
            header: () => <Header />,
          }}
        >
          <Stack.Screen name="Main" component={BottomTabNavigator} />

          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Products" component={ProductsScreen} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen
            name="ChangePassword"
            component={ChangePasswordScreen}
          />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen
            name="AddressList"
            component={AddressListScreen}
            options={{ title: "Địa chỉ của tôi" }}
          />

          <Stack.Screen
            name="AddAddress"
            component={AddAddressScreen}
            options={{ title: "Thêm địa chỉ mới" }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ title: "Địa chỉ của tôi" }}
          />
          <Stack.Screen
            name="Payment"
            component={PaymentScreen}
            options={{ title: "Trang thanh toán" }}
          />
          <Stack.Screen
            name="OrderDetail"
            component={OrderDetailScreen}
            options={{ title: "Trang chi tiết sản phẩm" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}
