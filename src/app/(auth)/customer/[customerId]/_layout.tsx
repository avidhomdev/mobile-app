import { CustomerProvider } from "@/src/contexts/customer-context";
import { useLocationContext } from "@/src/contexts/location-context";
import { useLocalSearchParams } from "expo-router";
import { Stack } from "expo-router/stack";
import { useColorScheme } from "react-native";

export default function Layout() {
  const colorScheme = useColorScheme();
  const params = useLocalSearchParams();
  const { location } = useLocationContext();
  const customer = location.customers?.find(
    (c) => c.id === Number(params.customerId)
  );
  if (!customer) return null;
  return (
    <CustomerProvider customer={customer}>
      <Stack
        initialRouteName="index"
        screenOptions={{
          contentStyle: {
            backgroundColor: colorScheme === "dark" ? `#181719` : `#f2f1f1`,
          },
          headerShown: false,
        }}
      />
    </CustomerProvider>
  );
}
