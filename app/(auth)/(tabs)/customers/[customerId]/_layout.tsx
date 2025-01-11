import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { CustomerProvider } from "@/contexts/customer-context";
import { useUserContext } from "@/contexts/user-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Stack } from "expo-router/stack";
import { ChevronLeft } from "lucide-react-native";
import { Pressable } from "react-native";

export default function Layout() {
  const params = useLocalSearchParams();
  const { location } = useUserContext();
  const router = useRouter();
  const customer = location.customers.find(
    (c) => c.id === Number(params.customerId)
  );

  return (
    <CustomerProvider customer={customer ?? null}>
      <Stack
        initialRouteName="index"
        screenOptions={{
          header: customer
            ? () => (
                <Pressable
                  className="bg-slate-800 p-4 pt-0 items-center flex-row border-b-8 border-gray-900 gap-x-2"
                  onPress={router.back}
                >
                  <Icon as={ChevronLeft} className="text-white" size="xl" />
                  <Heading className="text-white">{customer.full_name}</Heading>
                </Pressable>
              )
            : undefined,
        }}
      />
    </CustomerProvider>
  );
}
