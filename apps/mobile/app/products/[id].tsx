import { View, Text, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { PRODUCTS, formatPrice } from "../../lib/data";
import { useCart } from "../../context/cart";

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const product = PRODUCTS.find(p => p.id === id);
  const { add } = useCart();

  if (!product) {
    return <View style={{flex:1,alignItems:"center",justifyContent:"center"}}><Text>Product not found.</Text></View>;
  }

  return (
    <View style={{ flex:1, padding:16, gap:12 }}>
      <Text style={{ fontSize:22, fontWeight:"600" }}>{product.title}</Text>
      <Text style={{ fontSize:18 }}>{formatPrice(product.priceCents)}</Text>
      <Pressable
        onPress={() => add({ id: product.id, title: product.title, priceCents: product.priceCents })}
        style={{ padding:16, borderWidth:1, borderRadius:8, alignSelf:"flex-start" }}
      >
        <Text>Add to Cart</Text>
      </Pressable>
    </View>
  );
}
