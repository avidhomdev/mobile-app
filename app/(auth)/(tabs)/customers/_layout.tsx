import { Text } from "@/components/ui/text";
import { Stack } from "expo-router/stack";
import { View } from "react-native";

export default function Layout() {
  return (
    <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[customerId]" />
    </Stack>
  );
}
