import { Link } from "expo-router";
import { Text, Pressable } from "react-native";
import { useCartCount } from "../context/cart";

export default function CartLink() {
  const count = useCartCount();
  return (
    <Link href="/cart" asChild>
      <Pressable style={{ paddingHorizontal: 12, paddingVertical: 6 }}>
        <Text>Cart{count ? ` (${count})` : ""}</Text>
      </Pressable>
    </Link>
  );
}
