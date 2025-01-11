import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useLocationContext } from "@/contexts/location-context";
import { useUserContext } from "@/contexts/user-context";
import {
  CheckCircle2,
  CircleIcon,
  MapPinHouse,
  PlusSquareIcon,
  UserPlus2Icon,
} from "lucide-react-native";
import { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";

function CloserDashboard() {
  const { location } = useLocationContext();
  return (
    <View className="gap-y-6">
      <WelcomeBanner />
      <View className="gap-y-2">
        <Heading className="text-typography-600 uppercase" size="sm">
          Customers
        </Heading>
        {location.customers?.slice(0, 5).map((customer) => (
          <Card className="gap-y-2" key={customer.id}>
            <View className="flex-row justify-between">
              <View>
                <Text>{customer.full_name}</Text>
                <View className="flex-row items-center gap-x-2">
                  <Icon as={MapPinHouse} className="text-typography-500" />
                  <View>
                    <Text size="xs">{customer.address}</Text>
                    <Text size="xs">{`${customer.city}, ${customer.state} ${customer.postal_code}`}</Text>
                  </View>
                </View>
              </View>
              <View className="bg-gray-100 rounded p-1">
                <Text
                  bold
                  className="text-center bg-primary-400 py-1 px-2 text-typography-white"
                  size="sm"
                >
                  MON
                </Text>
                <Text className="text-center p-2 text-typography-600" size="xl">
                  21
                </Text>
                <Text className="text-typography-500" size="sm">
                  2:00pm - 2:30pm
                </Text>
              </View>
            </View>
          </Card>
        ))}
      </View>
    </View>
  );
}

function SetterDashboard() {
  const { location } = useLocationContext();
  return (
    <View className="gap-y-6">
      <WelcomeBanner />
      <Quote />
      <View className="gap-y-2">
        <Heading className="text-typography-600 uppercase" size="sm">
          Tasks
        </Heading>
        <Card>
          <TouchableOpacity className="flex-row items-center gap-x-2">
            <Icon as={CircleIcon} className="text-typography-500" size="xl" />
            <Text>Setter Dashboard</Text>
          </TouchableOpacity>
        </Card>
        <Card>
          <TouchableOpacity className="flex-row items-center gap-x-2">
            <Icon as={CheckCircle2} className="text-success-400" size="xl" />
            <Text>Setter Dashboard</Text>
          </TouchableOpacity>
        </Card>
        <Card>
          <TouchableOpacity className="flex-row items-center gap-x-2">
            <Icon as={CircleIcon} className="text-typography-500" size="xl" />
            <Text>Setter Dashboard</Text>
          </TouchableOpacity>
        </Card>
        <Card>
          <TouchableOpacity className="flex-row items-center gap-x-2">
            <Icon as={CircleIcon} className="text-typography-500" size="xl" />
            <Text>Setter Dashboard</Text>
          </TouchableOpacity>
        </Card>
        <View className="items-end">
          <Button action="secondary" variant="link">
            <ButtonIcon as={PlusSquareIcon} />
            <ButtonText>Add Task</ButtonText>
          </Button>
        </View>
      </View>
      <View className="gap-y-2">
        <Heading className="text-typography-600 uppercase" size="sm">
          Customers
        </Heading>
        <ScrollView
          horizontal
          contentContainerClassName="gap-x-4"
          showsHorizontalScrollIndicator={false}
        >
          {location.customers?.slice(0, 5).map((customer) => (
            <Card className="basis-1/2 max-w-72 gap-y-2" key={customer.id}>
              <Text>{customer.full_name}</Text>
              <View>
                <Text size="sm">{customer.phone || "No phone"}</Text>
                <Text size="sm">{customer.email || "No email"}</Text>
              </View>
              <View className="flex-row items-center gap-x-2">
                <Icon as={MapPinHouse} className="text-typography-500" />
                <View>
                  <Text size="xs">{customer.address}</Text>
                  <Text size="xs">{`${customer.city}, ${customer.state} ${customer.postal_code}`}</Text>
                </View>
              </View>
            </Card>
          ))}
        </ScrollView>
        <View className="items-end">
          <Button action="secondary" variant="link">
            <ButtonIcon as={UserPlus2Icon} />
            <ButtonText>Add Customer</ButtonText>
          </Button>
        </View>
      </View>
    </View>
  );
}

function Quote() {
  return (
    <Card className="bg-gray-800 gap-y-2 flex-1">
      <Text className="text-gray-300 text-sm">Today&apos;s quote</Text>
      <Text className="text-white italic text-xl font-semibold">
        I find that the harder I work, the more luck I seem to have
      </Text>
      <Text className="text-sm -mt-1">- Thomas Jefferson</Text>
    </Card>
  );
}

function WelcomeBanner() {
  const { profile } = useUserContext();

  return (
    <View>
      <Text>Welcome back,</Text>
      <Heading>{profile.full_name}</Heading>
    </View>
  );
}

export default function Dashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { refreshData } = useUserContext();
  const { location } = useLocationContext();

  return (
    <ScrollView
      contentContainerClassName="p-6"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          onRefresh={async () => {
            setIsRefreshing(true);
            await refreshData();
            setIsRefreshing(false);
          }}
          refreshing={isRefreshing}
        />
      }
    >
      {location.is_setter && <SetterDashboard />}
      {location.is_closer && <CloserDashboard />}
    </ScrollView>
  );
}
