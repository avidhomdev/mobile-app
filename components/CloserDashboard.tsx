import { DISPOSITION_STATUSES } from "@/constants/disposition-statuses";
import { useLocationContext } from "@/contexts/location-context";
import { useUserContext } from "@/contexts/user-context";
import { useRouter } from "expo-router";
import { TrophyIcon, UserIcon } from "lucide-react-native";
import { ScrollView, TouchableOpacity } from "react-native";
import { twMerge } from "tailwind-merge";
import { Avatar, AvatarFallbackText, AvatarImage } from "./ui/avatar";
import { Badge, BadgeText } from "./ui/badge";
import { Card } from "./ui/card";
import { Divider } from "./ui/divider";
import { Heading } from "./ui/heading";
import { HStack } from "./ui/hstack";
import { Icon } from "./ui/icon";
import { Text } from "./ui/text";
import { VStack } from "./ui/vstack";

export function CloserDashboard() {
  const { closers, profile } = useUserContext();
  const { location } = useLocationContext();
  const router = useRouter();

  const sortedCustomers = location.customers?.sort((a, b) => {
    if (a.disposition_status === "NEW" && b.disposition_status != "NEW")
      return -1;
    if (b.disposition_status === "NEW" && a.disposition_status != "NEW")
      return 1;
    return 0;
  });

  const closerLeaderboardDictionary = (location.jobs ?? []).reduce<{
    [k: string]: number;
  }>((dictionary, job) => {
    job.profiles.forEach((profile) => {
      if (profile.role === "closer")
        dictionary[profile.profile_id] =
          (dictionary[profile.profile_id] ?? 0) + 1;
    });

    return dictionary;
  }, {});

  return (
    <VStack className="p-6" space="xl">
      <VStack space="sm">
        <HStack className="items-center" space="sm">
          <Icon as={UserIcon} className="text-typography-500" size="lg" />
          <Divider orientation="vertical" />
          <VStack>
            <Heading size="md">Recent Customers</Heading>
            <Text size="xs" className="text-typography-500">
              Customers that were recently added
            </Text>
          </VStack>
        </HStack>
        {sortedCustomers?.length ? (
          <ScrollView
            contentContainerClassName="gap-x-4"
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {sortedCustomers?.map((customer) => {
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

      <VStack space="sm">
        <HStack className="items-center" space="sm">
          <Icon as={TrophyIcon} className="text-typography-500" size="lg" />
          <Divider orientation="vertical" />
          <VStack>
            <Heading size="md">Closer Leaderboard</Heading>
            <Text size="xs" className="text-typography-500">
              Closers ranked by the number of jobs
            </Text>
          </VStack>
        </HStack>
        <VStack space="sm">
          {closers?.map((closer) => (
            <Card
              className={twMerge(closer.id === profile.id ? "bg-info-50" : "")}
              key={closer.id}
              size="sm"
            >
              <HStack className="justify-between">
                <HStack className="items-center" space="sm">
                  <Avatar size="xs">
                    <AvatarFallbackText>{closer.full_name}</AvatarFallbackText>
                    <AvatarImage
                      source={{
                        uri: closer.avatar_url ?? undefined,
                      }}
                    />
                  </Avatar>
                  <Text>{closer.full_name}</Text>
                </HStack>
                <Badge action="success">
                  <BadgeText>
                    {closerLeaderboardDictionary[closer.id] ?? 0}
                  </BadgeText>
                </Badge>
              </HStack>
            </Card>
          ))}
        </VStack>
      </VStack>
    </VStack>
  );
}
