import { useLocationContext } from "@/src/contexts/location-context";
import { useUserContext } from "@/src/contexts/user-context";
import { TrophyIcon } from "lucide-react-native";
import { twMerge } from "tailwind-merge";
import { ScreenSectionHeading } from "./ScreenSectionHeading";
import { Avatar, AvatarFallbackText, AvatarImage } from "./ui/avatar";
import { Badge, BadgeText } from "./ui/badge";
import { Card } from "./ui/card";
import { HStack } from "./ui/hstack";
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
      <ScreenSectionHeading
        icon={TrophyIcon}
        heading="Closer Leaderboard"
        subHeading="Closers ranked by the number of jobs"
      />

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
