import { FRIENDLY_DATE_FORMAT } from "@/constants/date-formats";
import { DISPOSITION_STATUSES } from "@/constants/disposition-statuses";
import { useLocationContext } from "@/contexts/location-context";
import { ILocationCustomer, useUserContext } from "@/contexts/user-context";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { Calendar1, EllipsisVertical, TrophyIcon } from "lucide-react-native";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Avatar, AvatarFallbackText, AvatarImage } from "./ui/avatar";
import { Badge, BadgeText } from "./ui/badge";
import { Card } from "./ui/card";
import { Heading } from "./ui/heading";
import { HStack } from "./ui/hstack";
import { Icon } from "./ui/icon";
import { Text } from "./ui/text";
import { VStack } from "./ui/vstack";
import { Divider } from "./ui/divider";

type SetterCustomerDictionary = {
  [k: string]: ILocationCustomer[];
};

export function SetterDashboard() {
  const { profile } = useUserContext();
  const { location } = useLocationContext();
  const router = useRouter();
  const sortedCustomers = [...(location?.customers ?? [])].sort((a, b) => {
    return a.created_at.localeCompare(b.created_at);
  });
  const { profiles } = location;
  const setters = profiles?.flatMap((profile) =>
    profile.is_setter ? profile.profile : []
  );

  const setterCustomerDictionary =
    sortedCustomers.reduce<SetterCustomerDictionary>((dictionary, customer) => {
      dictionary[customer.creator_id] = (
        dictionary[customer.creator_id] ?? []
      ).concat(customer);
      return dictionary;
    }, {});

  return (
    <View className="gap-y-6 p-6">
      {location.customers && (
        <ScrollView
          contentContainerClassName="gap-x-4"
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
                <Card className={twMerge(dispositionStatus.bg, "w-72 border")}>
                  <View className="items-start mb-1 justify-between flex-row">
                    <Badge action={dispositionStatus?.action} size="sm">
                      <BadgeText>{dispositionStatus?.label}</BadgeText>
                    </Badge>
                    <Icon as={EllipsisVertical} />
                  </View>
                  <Heading className="font-normal tracking-tighter" size="xl">
                    {customer.full_name}
                  </Heading>

                  <View className="flex-row justify-between items-center">
                    <View className="flex-row gap-x-1 items-center">
                      <Icon as={Calendar1} size="xs" />
                      <Text size="xs">
                        {dayjs(customer.created_at).format(
                          FRIENDLY_DATE_FORMAT
                        )}
                      </Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
      <VStack space="sm">
        <HStack className="items-center" space="sm">
          <Icon as={TrophyIcon} className="text-typography-500" size="lg" />
          <Divider orientation="vertical" />
          <VStack>
            <Heading size="md">Setter Leaderboard</Heading>
            <Text size="xs" className="text-typography-500">
              Setters ranked by the number of new customers
            </Text>
          </VStack>
        </HStack>
        <VStack space="sm">
          {[...(setters ?? [])]
            .sort(
              (a, b) =>
                Number(setterCustomerDictionary[b.id] ?? 0) -
                Number(setterCustomerDictionary[a.id] ?? 0)
            )
            .map((setter) => (
              <Card
                className={twMerge(
                  setter.id === profile.id ? "bg-info-50" : ""
                )}
                key={setter.id}
                size="sm"
              >
                <HStack className="justify-between">
                  <HStack className="items-center" space="sm">
                    <Avatar size="xs">
                      <AvatarFallbackText>
                        {setter.full_name}
                      </AvatarFallbackText>
                      <AvatarImage
                        source={{
                          uri: setter.avatar_url ?? undefined,
                        }}
                      />
                    </Avatar>
                    <Text>{setter.full_name}</Text>
                  </HStack>
                  <Badge action="success">
                    <BadgeText>
                      {setterCustomerDictionary[setter.id]?.length ?? 0}
                    </BadgeText>
                  </Badge>
                </HStack>
              </Card>
            ))}
        </VStack>
      </VStack>
    </View>
  );
}
