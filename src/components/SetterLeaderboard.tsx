import { useLocationContext } from "@/src/contexts/location-context";
import { ILocationCustomer, useUserContext } from "@/src/contexts/user-context";
import { TrophyIcon } from "lucide-react-native";
import { twMerge } from "tailwind-merge";
import { ScreenSectionHeading } from "./ScreenSectionHeading";
import { Avatar, AvatarFallbackText, AvatarImage } from "./ui/avatar";
import { Badge, BadgeText } from "./ui/badge";
import { Card } from "./ui/card";
import { HStack } from "./ui/hstack";
import { Text } from "./ui/text";
import { VStack } from "./ui/vstack";

type SetterCustomerDictionary = {
  [k: string]: ILocationCustomer[];
};

export function SetterLeaderboard() {
  const { profile } = useUserContext();
  const { location } = useLocationContext();
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
    <VStack space="sm">
      <ScreenSectionHeading
        icon={TrophyIcon}
        heading="Setter Leaderboard"
        subHeading="Setters ranked by the number of new customers"
      />
      <VStack space="sm">
        {[...(setters ?? [])]
          .sort(
            (a, b) =>
              (setterCustomerDictionary[b.id]?.length ?? 0) -
              (setterCustomerDictionary[a.id]?.length ?? 0)
          )
          .map((setter) => (
            <Card
              className={twMerge(setter.id === profile.id ? "bg-info-50" : "")}
              key={setter.id}
              size="sm"
            >
              <HStack className="justify-between">
                <HStack className="items-center" space="sm">
                  <Avatar size="xs">
                    <AvatarFallbackText>{setter.full_name}</AvatarFallbackText>
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
  );
}
