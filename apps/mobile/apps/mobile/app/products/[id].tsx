import { View, Text, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { PRODUCTS, formatPrice } from "../../lib/data";

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return <View style={{flex:1,alignItems:"center",justifyContent:"center"}}><Text>Product not found.</Text></View>;

  return (
    <View style={{ flex:1, padding:16, gap:12 }}>
      <Text style={{ fontSize:22, fontWeight:"600" }}>{product.title}</Text>
      <Text style={{ fontSize:18 }}>{formatPrice(product.priceCents)}</Text>
      <Pressable style={{ padding:16, borderWidth:1, borderRadius:8, alignSelf:"flex-start" }}>
        <Text>Add to Cart (placeholder)</Text>
      </Pressable>
    </View>
  );
}
