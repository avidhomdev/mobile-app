import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useCustomerContext } from "@/contexts/customer-context";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Screen() {
  const { top } = useSafeAreaInsets();
  const { customer } = useCustomerContext();
  const router = useRouter();
  return (
    <ScrollView
      contentContainerClassName="gap-y-6"
      contentContainerStyle={{ paddingTop: top }}
    >
      <Pressable
        className="p-2 gap-x-2 flex-row items-center"
        onPress={router.back}
      >
        <Icon as={ChevronLeft} className="text-typography-500" />
        <Text className="text-typography-500">Back</Text>
      </Pressable>
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
