import BackHeaderButton from "@/components/BackHeaderButton";
import {
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetIcon,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetSectionHeaderText,
} from "@/components/ui/actionsheet";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Fab, FabIcon } from "@/components/ui/fab";
import { Heading } from "@/components/ui/heading";
import { Actionsheet } from "@/components/ui/select/select-actionsheet";
import { Text } from "@/components/ui/text";
import { useLocalSearchParams } from "expo-router";
import { Ellipsis, Eye, PlusIcon } from "lucide-react-native";
import { Fragment, useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function HeaderMenu() {
  const { bottom: paddingBlockEnd } = useSafeAreaInsets();
  const [isActionSheetVisible, setActionSheetVisible] = useState(false);
  const handleCloseActionSheet = () => setActionSheetVisible(false);
  return (
    <Fragment>
      <Button
        action="secondary"
        onPress={() => setActionSheetVisible(true)}
        size="sm"
      >
        <ButtonIcon as={Ellipsis} />
      </Button>
      <Actionsheet
        isOpen={isActionSheetVisible}
        onClose={handleCloseActionSheet}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent style={{ paddingBlockEnd }}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
            <ActionsheetSectionHeaderText>
              Manage Job
            </ActionsheetSectionHeaderText>
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem
            onPress={() => {
              // router.push(`/customer/[customerId]/job/${job.id}`);
              handleCloseActionSheet();
            }}
          >
            <ActionsheetIcon as={Eye} className="text-typography-500" />
            <ActionsheetItemText className="text-typography-700">
              View
            </ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </Fragment>
  );
}

export default function Screen() {
  const { jobId } = useLocalSearchParams();
  const { top } = useSafeAreaInsets();
  return (
    <View className="flex-1">
      <View
        className="p-4 gap-y-4 border-b-8 border-gray-500"
        style={{ paddingBlockStart: top }}
      >
        <BackHeaderButton />
        <View className="flex-row justify-between items-center">
          <Heading>{`View job ${jobId}`}</Heading>
          <HeaderMenu />
        </View>
      </View>
      <Fab placement="bottom right" size="lg">
        <FabIcon as={PlusIcon} />
      </Fab>
      <ScrollView contentContainerClassName="gap-y-6">
        <Text>Send Docusign</Text>
        <Text>Select a method of payment and amount</Text>
        <Text>Send link for financing</Text>
      </ScrollView>
    </View>
  );
}
