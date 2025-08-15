import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "cart";

export async function loadCart<T>(): Promise<T | null> {
  try { const v = await AsyncStorage.getItem(KEY); return v ? JSON.parse(v) : null; } catch { return null; }
}
export async function saveCart<T>(data: T) {
  try { await AsyncStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}
