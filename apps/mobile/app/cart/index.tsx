import { View, Text, Pressable, FlatList } from "react-native";
import { useCart, useCartTotalCents } from "../../context/cart";
import { formatPrice } from "../../lib/data";

export default function Cart() {
  const { state, setQty, removeOne, clear } = useCart();
  const total = useCartTotalCents();

  return (
    <View style={{ flex:1, padding:16, gap:12 }}>
      <Text style={{ fontSize:22, fontWeight:"600" }}>Cart</Text>
      <FlatList
        data={state.items}
        keyExtractor={(i) => i.id}
        ListEmptyComponent={<Text>Your cart is empty.</Text>}
        renderItem={({ item }) => (
          <View style={{ borderWidth:1, borderRadius:8, padding:12, marginBottom:10 }}>
            <Text style={{ fontWeight:"600" }}>{item.title}</Text>
            <Text>{formatPrice(item.priceCents)} × {item.qty}</Text>
            <View style={{ flexDirection:"row", gap:8, marginTop:8 }}>
              <Pressable onPress={() => removeOne(item.id)} style={{ padding:8, borderWidth:1, borderRadius:6 }}>
                <Text>-</Text>
              </Pressable>
              <Pressable onPress={() => setQty(item.id, item.qty + 1)} style={{ padding:8, borderWidth:1, borderRadius:6 }}>
                <Text>+</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
      <View style={{ paddingTop:8, borderTopWidth:1 }}>
        <Text style={{ fontSize:18, fontWeight:"600" }}>Subtotal: {formatPrice(total)}</Text>
        <Pressable onPress={clear} style={{ padding:12, borderWidth:1, borderRadius:8, marginTop:8, alignSelf:"flex-start" }}>
          <Text>Clear Cart</Text>
        </Pressable>
      </View>
    </View>
  );
}
