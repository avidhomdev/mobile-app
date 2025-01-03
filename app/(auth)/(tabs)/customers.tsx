import Button from "@/components/Button";
import { useUserContext } from "@/contexts/user-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

function CustomersList() {
  const {
    location: { customers },
  } = useUserContext();
  const router = useRouter();

  return (
    <ScrollView contentContainerClassName="px-4 gap-2">
      {customers.toReversed().map((customer) => (
        <View className="p-2 bg-white rounded" key={customer.id}>
          <View className="py-1 px-2 rounded bg-blue-400 self-start">
            <Text className="text-white uppercase text-xs font-bold">
              {customer.disposition_status}
            </Text>
          </View>
          <View className="justify-between flex-row items-center">
            <View className="gap-1">
              <Text className="font-bold text-base text-gray-600">
                {customer.full_name}
              </Text>
              <Text className="text-gray-400 text-sm">{customer.address}</Text>
            </View>
            {customer.closer_id ? (
              <View className="flex-row items-center gap-x-2">
                <View className="size-10 bg-gray-100 rounded-full" />
                <View>
                  <Text className="text-gray-500 text-xs">JUL 31</Text>
                  <Text className="text-gray-700 font-bold">02:00 PM</Text>
                </View>
              </View>
            ) : (
              <Button
                onPress={() => router.push(`/new-lead-schedule-modal`)}
                size="sm"
                variant="outline"
              >
                <Text>Add to Schedule</Text>
              </Button>
            )}
          </View>
        </View>
      ))}
      <View />
    </ScrollView>
  );
}

export default function CustomersScreen() {
  const router = useRouter();

  return (
    <View className="gap-4 flex-1">
      <View className="flex-row justify-between items-center bg-white p-4">
        <View>
          <Text className="text-xl font-semibold text-gray-600">Customers</Text>
          <Text className="text-xs text-gray-400">
            Manage customers you have created.
          </Text>
        </View>
        <TouchableOpacity
          className="p-1 bg-gray-200 rounded-full"
          onPress={() => router.push(`/new-customer-modal`)}
        >
          <Ionicons name="add-circle-outline" size={26} />
        </TouchableOpacity>
      </View>
      <CustomersList />
    </View>
  );
}
