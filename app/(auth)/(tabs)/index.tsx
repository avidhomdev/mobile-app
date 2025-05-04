import { CloserLeaderboard } from "@/components/CloserLeaderboard";
import { InstallerDashboard } from "@/components/InstallerDashboard";
import ScreenEnd from "@/components/ScreenEnd";
import { ScreenSectionHeading } from "@/components/ScreenSectionHeading";
import { SetterLeaderboard } from "@/components/SetterLeaderboard";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { DISPOSITION_STATUSES } from "@/constants/disposition-statuses";
import { useLocationContext } from "@/contexts/location-context";
import { useUserContext } from "@/contexts/user-context";
import { useRouter } from "expo-router";
import { UserIcon } from "lucide-react-native";
import { useState } from "react";
import { RefreshControl, ScrollView, TouchableOpacity } from "react-native";
import { twMerge } from "tailwind-merge";

function RecentCustomerCarousel() {
  const router = useRouter();
  const {
    location: { customers = [] },
  } = useLocationContext();
  const sortedCustomers = customers.sort((a, b) => {
    if (a.disposition_status === "NEW" && b.disposition_status != "NEW")
      return -1;
    if (b.disposition_status === "NEW" && a.disposition_status != "NEW")
      return 1;
    return 0;
  });

  const hasCustomers = customers.length > 0;

  return (
    <VStack space="sm">
      <VStack className="px-6">
        <ScreenSectionHeading
          icon={UserIcon}
          heading="Customers"
          subHeading="Customers that were recently added"
        />
      </VStack>

      {hasCustomers ? (
        <ScrollView
          contentContainerClassName="gap-x-4 px-2"
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {sortedCustomers.map((customer) => {
            const dispositionStatus =
              DISPOSITION_STATUSES[customer.disposition_status] ||
              DISPOSITION_STATUSES.NEW;
            return (
              <TouchableOpacity
                key={customer.id}
                onPress={() =>
                  router.push({
                    pathname: "/customer/[customerId]",
                    params: { customerId: customer.id },
                  })
                }
              >
                <Card
                  className={twMerge(dispositionStatus.bg, "w-72")}
                  variant="outline"
                >
                  <Badge action={dispositionStatus?.action} size="sm">
                    <BadgeText>{dispositionStatus?.label}</BadgeText>
                  </Badge>
                  <Heading className="font-normal tracking-tighter" size="xl">
                    {customer.full_name}
                  </Heading>
                </Card>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        <Card variant="outline">
          <Text className="text-center">No customers found.</Text>
        </Card>
      )}
    </VStack>
  );
}

export default function Dashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { refreshData } = useUserContext();
  const { location } = useLocationContext();

  return (
    <ScrollView
      contentContainerClassName="gap-y-6 py-6"
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
      <RecentCustomerCarousel />
      <VStack className="px-6" space="xl">
        {location.is_installer && <InstallerDashboard />}
        {location.is_closer && <CloserLeaderboard />}
        {location.is_setter && <SetterLeaderboard />}
      </VStack>
      <ScreenEnd />
    </ScrollView>
  );
}
