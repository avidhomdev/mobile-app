import {
  Avatar,
  AvatarFallbackText,
  AvatarGroup,
} from "@/src/components/ui/avatar";
import { Box } from "@/src/components/ui/box";
import { Card } from "@/src/components/ui/card";
import { Heading } from "@/src/components/ui/heading";
import { HStack } from "@/src/components/ui/hstack";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { useLocationContext } from "@/src/contexts/location-context";
import { Link } from "expo-router";
import { ScrollView } from "react-native";

export default function ChatsScreen() {
  const {
    location: { channels = [] },
  } = useLocationContext();

  return (
    <VStack className="flex-1" space="md">
      <HStack
        space="md"
        className="justify-between p-6 bg-background-50 items-center"
      >
        <Box>
          <Heading size="xl">Channels</Heading>
          <Text size="sm" className="text-gray-400">
            Manage channels to host conversations
          </Text>
        </Box>
      </HStack>
      <ScrollView className="flex-1">
        <VStack className="p-6" space="sm">
          {channels.length ? (
            channels.map((channel) => (
              <Link
                key={channel.id}
                href={{
                  pathname: "/(auth)/channels/[channelId]",
                  params: { channelId: channel.id },
                }}
              >
                <Card className="w-full">
                  <HStack space="sm" className="justify-between items-center">
                    <VStack>
                      <Heading className="text-typography-600" size="md">
                        {channel.name}
                      </Heading>
                      <Text className="text-typography-400" size="sm">
                        {`${channel.profiles.length} Participants`}
                      </Text>
                    </VStack>
                    <AvatarGroup>
                      {channel.profiles.slice(0, 3).map((profile) => (
                        <Avatar key={profile.profile_id} size="sm">
                          <AvatarFallbackText>
                            {profile.profile.full_name}
                          </AvatarFallbackText>
                        </Avatar>
                      ))}
                    </AvatarGroup>
                  </HStack>
                </Card>
              </Link>
            ))
          ) : (
            <Card variant="filled">
              <Text>No channels found</Text>
            </Card>
          )}
        </VStack>
      </ScrollView>
    </VStack>
  );
}
