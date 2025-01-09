import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { useUserContext } from "@/contexts/user-context";
import { useRouter } from "expo-router";
import { Stack } from "expo-router/stack";
import { ChevronLeft } from "lucide-react-native";
import { Pressable } from "react-native";

export default function Layout() {
  const { customer } = useUserContext();
  const router = useRouter();
  return (
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
  );
}
