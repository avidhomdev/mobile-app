import BackHeaderButton from "@/src/components/BackHeaderButton";
import { Card } from "@/src/components/ui/card";
import { Heading } from "@/src/components/ui/heading";
import { HStack } from "@/src/components/ui/hstack";
import { Icon } from "@/src/components/ui/icon";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { useCustomerContext } from "@/src/contexts/customer-context";
import { useRouter } from "expo-router";
import { Mail, MapPin, Phone, Settings, User } from "lucide-react-native";
import { Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Screen() {
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const { customer } = useCustomerContext();

  return (
    <ScrollView
      contentContainerClassName="px-6"
      contentContainerStyle={{ paddingTop: top }}
    >
      <VStack space="lg">
        <VStack>
          <HStack className="justify-between">
            <BackHeaderButton />

            <Pressable
              onPress={() =>
                router.push("/(auth)/customer/[customerId]/settings")
              }
            >
              <Icon as={Settings} className="text-typography-600" size="xl" />
            </Pressable>
          </HStack>
          <Heading>Information</Heading>
          <Text size="sm">View additional details about the customer</Text>
        </VStack>

        <Card>
          <VStack space="sm">
            <VStack>
              <Text className="text-typography-500" size="xs">
                Name
              </Text>
              <HStack className="items-center" space="sm">
                <Icon as={User} className="text-typography-500" size="sm" />
                <Text>{customer.full_name}</Text>
              </HStack>
            </VStack>
            <VStack>
              <Text className="text-typography-500" size="xs">
                Email
              </Text>
              <HStack className="items-center" space="sm">
                <Icon as={Mail} className="text-typography-500" size="sm" />
                <Text>{customer.email || "Missing"}</Text>
              </HStack>
            </VStack>
            <VStack>
              <Text className="text-typography-500" size="xs">
                Phone
              </Text>
              <HStack className="items-center" space="sm">
                <Icon as={Phone} className="text-typography-500" size="sm" />
                <Text>{customer.phone || "Missing"}</Text>
              </HStack>
            </VStack>
            <VStack>
              <Text className="text-typography-500" size="xs">
                Address
              </Text>
              <HStack className="items-center" space="sm">
                <Icon as={MapPin} className="text-typography-500" size="sm" />
                <VStack>
                  <Text>{customer.address || "Missing"}</Text>
                  <Text>{`${customer.city},${customer.state} ${customer.postal_code}`}</Text>
                </VStack>
              </HStack>
            </VStack>
          </VStack>
        </Card>

        <Card>
          <VStack space="sm">
            <Heading size="sm">Creator</Heading>
            <VStack>
              <Text className="text-typography-500" size="xs">
                Name
              </Text>
              <HStack className="items-center" space="sm">
                <Icon as={User} className="text-typography-500" size="sm" />
                <Text>{customer.creator?.full_name}</Text>
              </HStack>
            </VStack>
            <VStack>
              <Text className="text-typography-500" size="xs">
                Email
              </Text>
              <HStack className="items-center" space="sm">
                <Icon as={Mail} className="text-typography-500" size="sm" />
                <Text>{customer.creator?.email || "Missing"}</Text>
              </HStack>
            </VStack>
            <VStack>
              <Text className="text-typography-500" size="xs">
                Phone
              </Text>
              <HStack className="items-center" space="sm">
                <Icon as={Phone} className="text-typography-500" size="sm" />
                <Text>{customer.creator?.phone || "Missing"}</Text>
              </HStack>
            </VStack>
          </VStack>
        </Card>

        <Card>
          <VStack space="sm">
            <Heading size="sm">Notes</Heading>
            <Text>{customer.notes || "No notes found."}</Text>
          </VStack>
        </Card>
      </VStack>
    </ScrollView>
  );
}
