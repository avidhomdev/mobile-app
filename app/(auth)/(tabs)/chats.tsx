import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

export default function ChatsScreen() {
  return (
    <View className="gap-6">
      <HStack space="md" className="justify-between p-6 bg-white items-center">
        <Box>
          <Heading size="xl">Chats</Heading>
          <Text size="sm" className="text-gray-400">
            Manage chats between you and others
          </Text>
        </Box>
      </HStack>
      <View className="px-6">
        <Text>No chats found</Text>
      </View>
    </View>
  );
}
