import Text from "@/components/Text";
import { FontAwesome } from "@expo/vector-icons";
import { router, useGlobalSearchParams } from "expo-router";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function JobEditScreen() {
  const { jobId } = useGlobalSearchParams();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView contentContainerClassName="gap-y-6">
      <View
        className="bg-gray-900 relative p-6 gap-y-2"
        style={{ paddingTop: insets.top }}
      >
        <TouchableOpacity
          className="flex-row items-center gap-x-2"
          onPress={router.back}
        >
          <FontAwesome name="chevron-left" size={20} color="white" />
          <Text className="text-white">Back</Text>
        </TouchableOpacity>

        <Text className="text-white" variant="headline">
          Edit
        </Text>
      </View>
      <Text>Some fields here</Text>
      <Text>Some fields here</Text>
      <Text>Some fields here</Text>
      <Text>Some fields here</Text>
    </ScrollView>
  );
}
