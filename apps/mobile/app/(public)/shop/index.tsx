import { View, Text, Pressable, FlatList } from "react-native";
import { Link } from "expo-router";
import { CATEGORIES } from "../../../lib/data";

export default function ShopCategories() {
  const roots = CATEGORIES.filter(c => !c.parent);
  return (
    <View style={{ flex:1, padding:16 }}>
      <Text style={{ fontSize:22, fontWeight:"600", marginBottom:12 }}>Categories</Text>
      <FlatList
        data={roots}
        keyExtractor={(item) => item.slug}
        renderItem={({ item }) => (
          <Link href={`/(public)/shop/${item.slug}`} asChild>
            <Pressable style={{ padding:16, borderWidth:1, borderRadius:8, marginBottom:10 }}>
              <Text>{item.name}</Text>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}
