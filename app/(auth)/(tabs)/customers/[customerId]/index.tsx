import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetSectionHeaderText,
} from "@/components/ui/actionsheet";
import { Alert, AlertIcon, AlertText } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { FRIENDLY_DATE_FORMAT, TIME_FORMAT } from "@/constants/date-formats";
import {
  DISPOSITION_STATUS_KEYS,
  DISPOSITION_STATUSES,
} from "@/constants/disposition_statuses";
import { useCustomerContext } from "@/contexts/customer-context";
import { useUserContext } from "@/contexts/user-context";
import dayjs from "dayjs";
import {
  Calendar1,
  Clock,
  Clock1,
  Clock10,
  Clock11,
  Clock12,
  Clock2,
  Clock3,
  Clock4,
  Clock5,
  Clock6,
  Clock7,
  Clock8,
  Clock9,
  InfoIcon,
  Timer,
} from "lucide-react-native";
import { Fragment, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const clocks = {
  0: Clock,
  1: Clock1,
  2: Clock2,
  3: Clock3,
  4: Clock4,
  5: Clock5,
  6: Clock6,
  7: Clock7,
  8: Clock8,
  9: Clock9,
  10: Clock10,
  11: Clock11,
  12: Clock12,
};

function CustomerDisposition() {
  const { bottom: paddingBlockEnd } = useSafeAreaInsets();
  const { refreshData } = useUserContext();
  const { customer, updateCustomer } = useCustomerContext();
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false);
  const handleClose = () => setIsActionSheetVisible(false);
  const handleUpdate = (disposition_status: DISPOSITION_STATUS_KEYS) => () =>
    updateCustomer(Number(customer?.id), { disposition_status })
      .then(refreshData)
      .then(handleClose);

  return (
    <Fragment>
      {customer?.disposition_status && (
        <TouchableOpacity onPress={() => setIsActionSheetVisible(true)}>
          <Alert
            action={DISPOSITION_STATUSES[customer?.disposition_status]?.action}
            variant="solid"
          >
            <AlertIcon as={InfoIcon} />
            <AlertText className="capitalize pr-2">
              {customer?.disposition_status?.replaceAll("_", " ")}
            </AlertText>
          </Alert>
        </TouchableOpacity>
      )}
      <Actionsheet isOpen={isActionSheetVisible} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent style={{ paddingBlockEnd }}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
            <ActionsheetSectionHeaderText>
              Select a status
            </ActionsheetSectionHeaderText>
          </ActionsheetDragIndicatorWrapper>
          {Object.entries(DISPOSITION_STATUSES).map(([key, status]) => (
            <ActionsheetItem
              key={key}
              onPress={handleUpdate(key as DISPOSITION_STATUS_KEYS)}
            >
              <ActionsheetItemText>{status.label}</ActionsheetItemText>
            </ActionsheetItem>
          ))}
        </ActionsheetContent>
      </Actionsheet>
    </Fragment>
  );
}

export default function CustomerScreen() {
  const { customer } = useCustomerContext();

  return (
    <ScrollView contentContainerClassName="p-6 gap-y-6">
      <CustomerDisposition />
      <View>
        <View>
          <Heading>Appointments</Heading>
          <Text>Scheduled appointments for this customer</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-x-2 py-2"
        >
          {customer?.appointments?.map((appointment) => {
            const startDayjs = dayjs(appointment.start_datetime);
            const StartIcon =
              clocks[Number(startDayjs.format("h")) as keyof typeof clocks];
            const endDayjs = dayjs(appointment.end_datetime);
            const EndIcon =
              clocks[Number(endDayjs.format("h")) as keyof typeof clocks];

            return (
              <Card key={appointment.id}>
                <Text className="mb-2" isTruncated>
                  {appointment.name ?? "Appointment"}
                </Text>
                <View className="flex-row items-center gap-x-2">
                  <Icon as={Calendar1} />
                  <Text>{dayjs(startDayjs).format(FRIENDLY_DATE_FORMAT)}</Text>
                </View>
                <View className="flex-row items-center gap-x-2">
                  <View className="flex-row items-center gap-x-1">
                    <Icon as={StartIcon} />
                    <Text>{dayjs(startDayjs).format(TIME_FORMAT)}</Text>
                  </View>
                  <Text>-</Text>
                  <View className="flex-row items-center gap-x-1">
                    <Icon as={EndIcon} />
                    <Text>{dayjs(endDayjs).format(TIME_FORMAT)}</Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-x-2">
                  <Icon as={Timer} />
                  <Text>{`${appointment.duration ?? 0} minutes`}</Text>
                </View>
              </Card>
            );
          })}
        </ScrollView>
      </View>
    </ScrollView>
  );
}
