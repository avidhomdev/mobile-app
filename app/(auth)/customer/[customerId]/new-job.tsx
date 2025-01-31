import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { CloseIcon, Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useCustomerContext } from "@/contexts/customer-context";
import { useRouter } from "expo-router";
import { ScrollView, TouchableOpacity, View } from "react-native";

export default function Screen() {
  const { customer } = useCustomerContext();
  const router = useRouter();
  return (
    <ScrollView contentContainerClassName="gap-y-6 p-6">
      <View className="flex-row justify-between">
        <View>
          <Heading className="text-typography-800" size="xl">
            New Job
          </Heading>
          <Text className="text-typography-400">
            {`Start a new job for ${customer?.full_name}`}
          </Text>
        </View>
        <TouchableOpacity onPress={router.back}>
          <Icon as={CloseIcon} className="text-typography-600" size="xl" />
        </TouchableOpacity>
      </View>
      <Text>Select the bid</Text>
      <Text>Schedule the first appointment</Text>
      <Text>Delegate the team lead</Text>
      <Text>Job photos</Text>
      <Button>
        <ButtonText>Submit Job</ButtonText>
      </Button>
    </ScrollView>
  );
}
