import BackHeaderButton from "@/components/BackHeaderButton";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Screen() {
  const { top } = useSafeAreaInsets();
  return (
    <VStack space="lg" style={{ paddingBlockStart: top }}>
      <VStack className="px-6">
        <BackHeaderButton />
        <Heading className="text-typography-800" size="xl">
          Timesheet
        </Heading>
        <Text className="text-typography-400">
          Track your time working on the job
        </Text>
      </VStack>
      <VStack className="px-6">
        <Text>Coming soon...</Text>
      </VStack>
    </VStack>
  );
}
