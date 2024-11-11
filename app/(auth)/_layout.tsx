import { UserProvider } from "@/contexts/user-context";
import { supabase } from "@/lib/supabase";
import { Redirect, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useSession } from "../../contexts/auth-context";
import { Tables } from "@/supabase";

export default function AppLayout() {
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
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </UserProvider>
  );
}
