import { useRouter } from "expo-router";
import { Pressable } from "react-native";
import { Icon } from "./ui/icon";
import { ChevronLeft } from "lucide-react-native";
import { Text } from "./ui/text";

export default function BackHeaderButton() {
  const router = useRouter();
  return (
    <Pressable className="items-center flex-row gap-x-1" onPress={router.back}>
      <Icon as={ChevronLeft} />
      <Text>Back</Text>
    </Pressable>
  );
}
