import { View, Text, Pressable, FlatList } from "react-native";
import { useLocalSearchParams, Link } from "expo-router";
import { CATEGORIES, PRODUCTS, formatPrice } from "../../../lib/data";

export default function SubCategoryOrProducts() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const current = CATEGORIES.find(c => c.slug === slug);
  if (!current) return <View style={{flex:1,alignItems:"center",justifyContent:"center"}}><Text>Category not found.</Text></View>;

  const children = CATEGORIES.filter(c => c.parent === current.slug);
  const items = PRODUCTS.filter(p => p.category === slug);

  return (
    <View style={{ flex:1, padding:16 }}>
      <Text style={{ fontSize:22, fontWeight:"600", marginBottom:12 }}>{current.name}</Text>

      {children.length > 0 && (
        <>
          <Text style={{ fontSize:16, marginBottom:8 }}>Subcategories</Text>
          <FlatList
            data={children}
            keyExtractor={(item) => item.slug}
            renderItem={({ item }) => (
              <Link href={`/(public)/shop/${item.slug}`} asChild>
                <Pressable style={{ padding:14, borderWidth:1, borderRadius:8, marginBottom:10 }}>
                  <Text>{item.name}</Text>
                </Pressable>
              </Link>
            )}
          />
        </>
      )}

      {items.length > 0 && (
        <>
          <Text style={{ fontSize:16, marginVertical:8 }}>Products</Text>
          <FlatList
            data={items}
            keyExtractor={(p) => p.id}
            renderItem={({ item }) => (
              <Link href={/products/} asChild>
                <Pressable style={{ padding:14, borderWidth:1, borderRadius:8, marginBottom:10 }}>
                  <Text style={{ fontWeight:"600" }}>{item.title}</Text>
                  <Text>{formatPrice(item.priceCents)}</Text>
                </Pressable>
              </Link>
            )}
          />
        </>
      )}

      {children.length === 0 && items.length === 0 && <Text>No items here yet.</Text>}
    </View>
  );
}
