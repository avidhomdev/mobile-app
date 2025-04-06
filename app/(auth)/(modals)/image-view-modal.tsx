import BackHeaderButton from "@/components/BackHeaderButton";
import { Image } from "@/components/ui/image";
import { useGlobalSearchParams } from "expo-router/build/hooks";
import { StatusBar } from "expo-status-bar";
import { Platform, View } from "react-native";

export default function ImageViewModal() {
  const { uri, path } = useGlobalSearchParams();

  return (
    <View className="p-6 gap-4">
      <View>
        <BackHeaderButton />
      </View>
      <Image
        alt={path as string}
        className="bg-gray-100 aspect-square"
        size="square"
        source={uri as string}
      />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}
