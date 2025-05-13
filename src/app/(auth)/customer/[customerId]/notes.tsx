import BackHeaderButton from "@/src/components/BackHeaderButton";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import { useCustomerContext } from "@/src/contexts/customer-context";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Screen() {
  const { top } = useSafeAreaInsets();
  const { customer } = useCustomerContext();

  return (
    <ScrollView
      contentContainerClassName="gap-y-6"
      contentContainerStyle={{ paddingTop: top }}
    >
      <BackHeaderButton />
      <View className="px-6">
        <Heading className="text-typography-800" size="xl">
          Notes
        </Heading>
        <Text className="text-typography-400">
          {`Manage notes for ${customer?.full_name}`}
        </Text>
      </View>
    </ScrollView>
  );
}
