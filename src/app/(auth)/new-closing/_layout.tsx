import BackHeaderButton from "@/src/components/BackHeaderButton";
import { VStack } from "@/src/components/ui/vstack";
import { Stack } from "expo-router";

import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Layout() {
  const { top } = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  return (
    <VStack className="flex-1">
      <VStack className="px-6" style={{ paddingTop: top }}>
        <BackHeaderButton />
      </VStack>

      <Stack
        initialRouteName="index"
        screenOptions={{
          contentStyle: {
            backgroundColor: colorScheme === "dark" ? `#181719` : `#f2f1f1`,
          },
          headerShown: false,
        }}
      />
    </VStack>
  );
}
