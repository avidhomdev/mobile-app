import BackHeaderButton from "@/src/components/BackHeaderButton";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Screen() {
  const { top } = useSafeAreaInsets();
  return (
    <VStack space="lg" style={{ paddingBlockStart: top }}>
      <VStack className="px-6">
        <BackHeaderButton />
        <Heading className="text-typography-800" size="xl">
          Schedule
        </Heading>
        <Text className="text-typography-400">
          View the schedule for this job
        </Text>
      </VStack>
      <VStack className="px-6">
        <Text>Coming soon...</Text>
      </VStack>
    </VStack>
  );
}
