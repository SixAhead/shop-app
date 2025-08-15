import { View, Text } from "react-native";

export default function Cart() {
  return (
    <View style={{ flex:1, padding:16 }}>
      <Text style={{ fontSize:22, fontWeight:"600" }}>Cart</Text>
      <Text style={{ marginTop:8 }}>Your cart is empty (placeholder)</Text>
    </View>
  );
}
