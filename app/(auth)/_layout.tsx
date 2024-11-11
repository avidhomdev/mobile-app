import { Redirect, Stack } from "expo-router";

import { useSession } from "../ctx";
import { Text, View } from "react-native";

export default function AppLayout() {
  const { session, isLoading } = useSession();
  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return (
      <View className="flex-1 justify-center">
        <Text className="text-center text-3xl">Loading...</Text>
      </View>
    );
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: "modal" }} />
    </Stack>
  );
}
