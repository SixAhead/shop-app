import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
export default function Category() {
  const { slug } = useLocalSearchParams();
  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
      <Text>Category: {slug}</Text>
    </View>
  );
}
