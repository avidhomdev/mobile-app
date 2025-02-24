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
          Documents
        </Heading>
        <Text className="text-typography-400">
          Documents belonging to the job
        </Text>
      </VStack>
    </VStack>
  );
}
