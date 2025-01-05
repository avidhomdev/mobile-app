import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { useUserContext } from "@/contexts/user-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CustomerScreen() {
  const { top } = useSafeAreaInsets();
  const {
    location: { customers },
  } = useUserContext();
  const { customerId } = useLocalSearchParams();
  const customer = customers.find(
    (customer) => customer.id === Number(customerId)
  );
  const router = useRouter();

  return (
    <View>
      <View className="bg-gray-800 p-4 gap-y-4" style={{ paddingTop: top }}>
        <View className="self-start">
          <Button action="secondary" onPress={router.back}>
            <ButtonIcon as={ChevronLeft} />
            <ButtonText>Go back</ButtonText>
          </Button>
        </View>
        <Heading className="text-white">{customer?.full_name}</Heading>
      </View>
      <Text>customer id {customer?.full_name}</Text>
      <View />
    </View>
  );
}
