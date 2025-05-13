import { supabase } from "@/src/lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { UploadCloud } from "lucide-react-native";
import { useCallback, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "./ui/actionsheet";
import { Box } from "./ui/box";
import { Button, ButtonGroup, ButtonText } from "./ui/button";
import { HStack } from "./ui/hstack";
import { CloseIcon, Icon } from "./ui/icon";
import { Image } from "./ui/image";
import { Text } from "./ui/text";

export default function ActionSheetUpload({
  filePath,
  isVisible,
  onUpload,
  setIsVisible,
}: {
  filePath: string;
  isVisible: boolean;
  onUpload: (p: { id: string; path: string; fullPath: string }[]) => void;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { bottom } = useSafeAreaInsets();
  const [isUploading, setIsUploading] = useState(false);
  const [selected, setSelected] = useState<
    { filePath: string; file: string; fileName: string }[]
  >([]);
  const handleCloseActionSheet = () => setIsVisible(false);

  const handleImagePicker = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const assetsMappedToSelected = result.assets.flatMap((asset) =>
        asset.fileName
          ? {
              file: asset.uri,
              fileName: asset.fileName,
              filePath: `${filePath}/${asset.fileName}`,
            }
          : []
      );

      setSelected((prevState) => [...prevState, ...assetsMappedToSelected]);
    }
  }, [filePath]);

  const handleUploadSelected = useCallback(async () => {
    setIsUploading(true);
    const files: {
      id: string;
      path: string;
      fullPath: string;
    }[] = [];

    for (const file of selected) {
      const blob = await fetch(file.file).then((r) => r.blob());
      const arrayBuffer = await new Response(blob).arrayBuffer();

      await supabase.storage
        .from("business")
        .upload(file.filePath, arrayBuffer, {
          cacheControl: "3600",
          upsert: true,
        })
        .then(async ({ data: storageFile }) => {
          if (!storageFile) return;
          files.push(storageFile);
        });
    }

    onUpload(files);
    setIsUploading(false);
    setIsVisible(false);
    setSelected([]);
  }, [onUpload, selected, setIsVisible]);

  return (
    <Actionsheet isOpen={isVisible} onClose={handleCloseActionSheet}>
      <ActionsheetBackdrop />
      <ActionsheetContent style={{ paddingBlockEnd: bottom }}>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <View className="flex-row justify-between w-full mt-3">
          <View>
            <Text className="font-semibold">
              Upload your photos for the job
            </Text>
            <Text size="sm">JPG, PDF, PNG supported</Text>
          </View>
          <Pressable onPress={handleCloseActionSheet}>
            <Icon
              as={UploadCloud}
              size="lg"
              className="stroke-background-500"
            />
          </Pressable>
        </View>
        {selected.length > 0 ? (
          <ScrollView
            contentContainerClassName="py-6"
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <HStack space="sm">
              {selected.map((file, index) => (
                <Box key={index}>
                  <Image
                    alt={file.fileName}
                    size="xl"
                    source={{ uri: file.file }}
                  />
                  <Pressable
                    onPress={() =>
                      setSelected(selected.filter((i) => i.file !== file.file))
                    }
                    className="absolute top-3 right-3 rounded-full p-1 bg-background-50"
                  >
                    <Icon as={CloseIcon} size="xl" />
                  </Pressable>
                </Box>
              ))}
            </HStack>
          </ScrollView>
        ) : (
          <Pressable
            className="my-[18px] items-center justify-center rounded-xl bg-background-50 border border-dashed border-outline-300 h-[130px] w-full"
            onPress={handleImagePicker}
          >
            <Icon
              as={UploadCloud}
              className="h-[62px] w-[62px] stroke-background-200"
            />
            <Text size="sm">No files uploaded yet</Text>
          </Pressable>
        )}

        <ButtonGroup className="w-full">
          <Button action="secondary" onPress={handleImagePicker}>
            <ButtonText>Browse photos</ButtonText>
          </Button>
          <Button
            isDisabled={selected.length === 0 || isUploading}
            onPress={handleUploadSelected}
          >
            <ButtonText>Upload</ButtonText>
          </Button>
        </ButtonGroup>
      </ActionsheetContent>
    </Actionsheet>
  );
}
