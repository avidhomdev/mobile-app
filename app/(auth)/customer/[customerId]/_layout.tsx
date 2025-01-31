import { CustomerProvider } from "@/contexts/customer-context";
import { useLocationContext } from "@/contexts/location-context";
import { useLocalSearchParams } from "expo-router";
import { Stack } from "expo-router/stack";

export default function Layout() {
  const params = useLocalSearchParams();
  const { location } = useLocationContext();
  const customer = location.customers?.find(
    (c) => c.id === Number(params.customerId)
  );

  return (
    <CustomerProvider customer={customer ?? null}>
      <Stack
        initialRouteName="index"
        screenOptions={{
          contentStyle: {
            backgroundColor: "white",
          },
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="new-appointment"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen name="new-bid" options={{ presentation: "modal" }} />
        <Stack.Screen name="new-job" options={{ presentation: "modal" }} />
      </Stack>
    </CustomerProvider>
  );
}
