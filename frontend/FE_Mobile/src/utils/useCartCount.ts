import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CART_KEY = "CART_ITEMS";

export function useCartCount() {
  const [count, setCount] = useState(0);

  const loadCart = async () => {
    const data = await AsyncStorage.getItem(CART_KEY);
    const cart = data ? JSON.parse(data) : [];

    const total = cart.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0,
    );

    setCount(total);
  };

  useEffect(() => {
    loadCart();

    const interval = setInterval(loadCart, 500); // auto refresh
    return () => clearInterval(interval);
  }, []);

  return count;
}
