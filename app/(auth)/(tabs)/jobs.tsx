import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

export default function JobsScreen() {
  return (
    <View className="gap-6 flex-1">
      <HStack space="md" className="justify-between p-6 bg-white items-center">
        <Box>
          <Heading size="xl">Jobs</Heading>
          <Text size="sm" className="text-gray-400">
            Manage jobs for your have customers.
          </Text>
        </Box>
      </HStack>
    </View>
  );
}
