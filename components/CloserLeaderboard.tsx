import { useLocationContext } from "@/contexts/location-context";
import { useUserContext } from "@/contexts/user-context";
import { TrophyIcon } from "lucide-react-native";
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

export function CloserLeaderboard() {
  const { closers, profile } = useUserContext();
  const { location } = useLocationContext();

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
        {[...(closers ?? [])]
          .sort(
            (a, b) =>
              Number(closerLeaderboardDictionary[b.id] ?? 0) -
              Number(closerLeaderboardDictionary[a.id] ?? 0)
          )
          .map((closer) => (
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
  );
}
