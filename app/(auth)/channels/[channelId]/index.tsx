import BackHeaderButton from "@/components/BackHeaderButton";
import { VStack } from "@/components/ui/vstack";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChannelScreen() {
  const { top } = useSafeAreaInsets();
  return (
    <VStack style={{ paddingBlockStart: top }}>
      <BackHeaderButton />
    </VStack>
  );
}
