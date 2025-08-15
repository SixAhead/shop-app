import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="(public)/index" options={{ title: "Home", href: "/" }} />
      <Tabs.Screen name="(public)/shop/index" options={{ title: "Shop" }} />
      <Tabs.Screen name="cart/index" options={{ title: "Cart" }} />
      <Tabs.Screen name="(account)/index" options={{ title: "Account" }} />
    </Tabs>
  );
}
