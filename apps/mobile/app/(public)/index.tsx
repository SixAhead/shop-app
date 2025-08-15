import { Link } from "expo-router";
import { View, Text, Pressable } from "react-native";

export default function Home() {
  return (
    <View style={{ flex:1, padding:16, gap:16 }}>
      <Text style={{ fontSize:24, fontWeight:"600" }}>Welcome to the Shop</Text>
      <Link href="/(public)/shop" asChild>
        <Pressable style={{ padding:16, borderWidth:1, borderRadius:8 }}>
          <Text>Browse Categories</Text>
        </Pressable>
      </Link>
    </View>
  );
}
