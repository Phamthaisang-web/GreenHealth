import AsyncStorage from "@react-native-async-storage/async-storage";

const CART_KEY = "CART_ITEMS";

export interface CartItem {
  productId: number;
  quantity: number;
}

export async function getCart(): Promise<CartItem[]> {
  const data = await AsyncStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
}

export async function addToCart(productId: number, quantity = 1) {
  const cart = await getCart();

  const index = cart.findIndex((item) => item.productId === productId);

  if (index !== -1) {
    cart[index].quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export async function removeFromCart(productId: number) {
  const cart = await getCart();
  const newCart = cart.filter((item) => item.productId !== productId);
  await AsyncStorage.setItem(CART_KEY, JSON.stringify(newCart));
}

export async function updateQuantity(productId: number, quantity: number) {
  const cart = await getCart();

  const index = cart.findIndex((item) => item.productId === productId);

  if (index !== -1) {
    if (quantity <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].quantity = quantity;
    }
  }

  await AsyncStorage.setItem(CART_KEY, JSON.stringify(cart));
}
