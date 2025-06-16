import { CloserLeaderboard } from "@/src/components/CloserLeaderboard";
import { InstallerDashboard } from "@/src/components/InstallerDashboard";
import ScreenEnd from "@/src/components/ScreenEnd";
import { ScreenSectionHeading } from "@/src/components/ScreenSectionHeading";
import { SetterLeaderboard } from "@/src/components/SetterLeaderboard";
import { Badge, BadgeText } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { DISPOSITION_STATUSES } from "@/src/constants/disposition-statuses";
import { useLocationContext } from "@/src/contexts/location-context";
import { useUserContext } from "@/src/contexts/user-context";
import { Link, useRouter } from "expo-router";
import { HardHat, UserIcon } from "lucide-react-native";
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

function JobsDashboardCard() {
  const {
    location: { jobs },
  } = useLocationContext();
  return (
    <VStack space="sm">
      <ScreenSectionHeading
        icon={HardHat}
        heading="Jobs"
        subHeading="List of recent jobs"
      />
      <VStack space="sm">
        {jobs?.slice(0, 4).map((job) => (
          <Card key={job.id}>
            <Link
              href={{
                pathname: "/customer/[customerId]/job/[jobId]",
                params: {
                  customerId: job.customer_id,
                  jobId: job.id,
                },
              }}
            >
              <VStack>
                <Text bold underline>{`JOB-${job.id} - ${job.full_name}`}</Text>
                <Text isTruncated size="xs">
                  {`${job.address}, ${job.city} ${job.state} ${job.postal_code}`}
                </Text>
              </VStack>
            </Link>
          </Card>
        ))}
      </VStack>
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
        <JobsDashboardCard />
      </VStack>
      <ScreenEnd />
    </ScrollView>
  );
}
