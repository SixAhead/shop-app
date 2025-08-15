import { Tabs } from "expo-router";
import { CartProvider } from "../context/cart";
import CartLink from "../components/CartLink";

export default function RootLayout() {
  return (
    <CartProvider>
      <Tabs screenOptions={{ headerRight: () => <CartLink /> }}>
        <Tabs.Screen name="(public)/index" options={{ title: "Home", href: "/" }} />
        <Tabs.Screen name="(public)/shop/index" options={{ title: "Shop" }} />
        <Tabs.Screen name="cart/index" options={{ title: "Cart" }} />
        <Tabs.Screen name="(account)/index" options={{ title: "Account" }} />
      </Tabs>
    </CartProvider>
  );
}
