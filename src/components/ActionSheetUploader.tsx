import dayjs from "dayjs";
import * as ImagePicker from "expo-image-picker";
import { Camera, Upload, UploadCloudIcon } from "lucide-react-native";
import { useCallback, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from "./ui/actionsheet";
import { Box } from "./ui/box";
import { Button, ButtonGroup, ButtonIcon, ButtonText } from "./ui/button";
import { Icon } from "./ui/icon";
import { Image } from "./ui/image";
import { Text } from "./ui/text";
import { VStack } from "./ui/vstack";

export interface SelectedMedia {
  filePath: string;
  file: string;
  fileName: string;
}

type ActionSheetUploaderProps = {
  bucket: string;
  fileRootPath: string;
  handleClose: () => void;
  onUploadComplete: (path: string) => void | Promise<void>;
};

export default function ActionSheetUploader({
  bucket,
  fileRootPath,
  handleClose,
  onUploadComplete,
}: ActionSheetUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selected, setSelected] = useState<SelectedMedia>();
  const { bottom } = useSafeAreaInsets();

  const handleImagePicker = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });

    if (!result.canceled) {
      const [asset] = result.assets.flat();

      setSelected({
        filePath: `${fileRootPath}/${dayjs().unix()}_${asset.fileName}`,
        file: asset.uri,
        fileName: asset.fileName ?? "avatar",
      });
    }
  }, [fileRootPath]);

  const handleUpload = useCallback(async () => {
    if (!selected) return;
    setIsUploading(true);
    const blob = await fetch(selected.file).then((r) => r.blob());
    const arrayBuffer = await new Response(blob).arrayBuffer();
    await supabase.storage
      .from(bucket)
      .upload(selected.filePath, arrayBuffer, {
        cacheControl: "3600",
        upsert: true,
      })
      .then(async ({ data: storageFile }) => {
        if (!storageFile) return;
        return onUploadComplete(storageFile.path);
      })
      .catch(() => {
        alert("Error uploading file");
      })
      .finally(() => setIsUploading(false));
  }, [bucket, onUploadComplete, selected]);

  return (
    <Actionsheet isOpen onClose={handleClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent style={{ paddingBlockEnd: bottom }}>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <VStack className="w-full" space="lg">
          <VStack>
            <Text className="font-semibold">Upload your avatar</Text>
            <Text size="sm">JPG, PNG supported</Text>
          </VStack>

          {selected ? (
            <Image
              alt={selected.fileName}
              size="square"
              source={{ uri: selected.file }}
            />
          ) : (
            <Box className="my-[18px] items-center justify-center rounded-xl bg-background-50 border border-dashed border-outline-300 h-[130px] w-full">
              <Icon
                as={UploadCloudIcon}
                className="h-[62px] w-[62px] stroke-background-200"
              />
              <Text size="sm">No file uploaded yet</Text>
            </Box>
          )}

          <ButtonGroup flexDirection="row">
            <Button action="secondary" variant="outline" onPress={handleClose}>
              <ButtonIcon as={Camera} />
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              action="primary"
              className="grow"
              disabled={selected && isUploading}
              variant="solid"
              onPress={selected ? handleUpload : handleImagePicker}
            >
              <ButtonIcon as={selected ? Upload : Camera} />
              <ButtonText>{selected ? "Upload" : "Browse"}</ButtonText>
            </Button>
          </ButtonGroup>
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
}
