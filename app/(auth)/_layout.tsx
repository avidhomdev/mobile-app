import { UserProvider } from "@/contexts/user-context";
import { Redirect, Stack } from "expo-router";
import { Text, useColorScheme, View } from "react-native";
import { useSession } from "../../contexts/auth-context";

export default function AppLayout() {
  const colorScheme = useColorScheme();
  const { session, isLoading } = useSession();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center">
        <Text className="text-center text-3xl">Loading...</Text>
      </View>
    );
  }
  if (!session) {
    return <Redirect href="/login" />;
  }

  return (
    <UserProvider session={session}>
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: colorScheme === "dark" ? `#181719` : `#FBFBFB`,
          },
          headerShown: false,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="customer/[customerId]" />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
        <Stack.Screen
          name="(modals)/new-customer-modal"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="(modals)/image-view-modal"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="(modals)/new-proposal-modal"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen
          name="(modals)/new-job-modal"
          options={{ presentation: "modal" }}
        />
      </Stack>
    </UserProvider>
  );
}
