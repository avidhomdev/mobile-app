import BackHeaderButton from "@/src/components/BackHeaderButton";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { Stack } from "expo-router";

import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Layout() {
  const { top } = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  return (
    <VStack className="flex-1">
      <VStack className="px-6 bg-background-50" style={{ paddingTop: top }}>
        <BackHeaderButton />
        <Heading className="text-typography-800" size="xl">
          Planning Appointment
        </Heading>
        <Text className="text-typography-400">{`Schedule appointment`}</Text>
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
