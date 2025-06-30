import BackHeaderButton from "@/src/components/BackHeaderButton";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Screen() {
  const { top } = useSafeAreaInsets();
  return (
    <ScrollView
      contentContainerClassName="px-6"
      contentContainerStyle={{ paddingTop: top }}
    >
      <VStack space="lg">
        <VStack>
          <BackHeaderButton />
          <Heading>Availability</Heading>
          <Text size="sm">
            Control the hours you are available during the week.
          </Text>
        </VStack>
      </VStack>
    </ScrollView>
  );
}
