import { Text } from "@/components/ui/text";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Screen() {
  const { bidId } = useLocalSearchParams();
  const { top } = useSafeAreaInsets();
  return (
    <View style={{ top }}>
      <Text>{`Edit ${bidId}`}</Text>
    </View>
  );
}
