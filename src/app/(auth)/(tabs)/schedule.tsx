import HorizontalDaySelector from "@/src/components/HorizontalDaySelector";
import ScreenEnd from "@/src/components/ScreenEnd";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetIcon,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetSectionHeaderText,
} from "@/src/components/ui/actionsheet";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/src/components/ui/alert-dialog";
import { Badge, BadgeText } from "@/src/components/ui/badge";
import { Box } from "@/src/components/ui/box";
import { Button, ButtonText } from "@/src/components/ui/button";
import { Heading } from "@/src/components/ui/heading";
import { HStack } from "@/src/components/ui/hstack";
import { Icon } from "@/src/components/ui/icon";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { TIME_FORMAT } from "@/src/constants/date-formats";
import { DISPOSITION_STATUSES } from "@/src/constants/disposition-statuses";
import {
  IAppointments,
  ILocationCustomer,
  useUserContext,
} from "@/src/contexts/user-context";
import { supabase } from "@/src/lib/supabase";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Home, MapPin, Trash2 } from "lucide-react-native";
import { Fragment, useCallback, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";

function ConfirmCancelAppointment({
  id,
  setIsActionSheetVisible,
}: {
  id: number;
  setIsActionSheetVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { refreshData } = useUserContext();
  const [isCancelAlertDialogOpen, setIsCancelAlertDialogOpen] = useState(false);
  const handleClose = () => setIsCancelAlertDialogOpen(false);

  const handleDelete = useCallback(
    async () =>
      supabase
        .from("business_appointments")
        .delete()
        .eq("id", id)
        .then(refreshData)
        .then(() => setIsActionSheetVisible(false))
        .then(handleClose),
    [id, refreshData, setIsActionSheetVisible]
  );

  return (
    <Fragment>
      <AlertDialog
        isOpen={isCancelAlertDialogOpen}
        onClose={handleClose}
        size="md"
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="md">
              Are you sure you want to delete this appointment?
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <Text size="sm">
              Deleting the appointment will remove it permanently and cannot be
              undone. Please confirm if you want to proceed.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter className="">
            <Button
              variant="outline"
              action="secondary"
              onPress={handleClose}
              size="sm"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button size="sm" onPress={handleDelete}>
              <ButtonText>Delete</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ActionsheetItem onPress={() => setIsCancelAlertDialogOpen(true)}>
        <ActionsheetIcon as={Trash2} className="text-red-500" />
        <ActionsheetItemText className="text-red-700">
          Cancel Appointment
        </ActionsheetItemText>
      </ActionsheetItem>
    </Fragment>
  );
}

function ScheduleRow({
  appointment,
  customer,
}: {
  appointment: IAppointments;
  customer: ILocationCustomer;
}) {
  const { bottom } = useSafeAreaInsets();
  const hasPassed = dayjs().isAfter(appointment.end_datetime);
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false);
  const router = useRouter();
  return (
    <TouchableOpacity
      className={twMerge(hasPassed ? "opacity-50" : "")}
      disabled={hasPassed}
      key={appointment.id}
      onPress={() =>
        router.push({
          pathname: "/customer/[customerId]",
          params: { customerId: customer.id },
        })
      }
      onLongPress={() => setIsActionSheetVisible(true)}
    >
      <Actionsheet
        isOpen={isActionSheetVisible}
        onClose={() => setIsActionSheetVisible(false)}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent style={{ paddingBottom: bottom }}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
            <ActionsheetSectionHeaderText>
              {`${customer.full_name} at ${dayjs(
                appointment.start_datetime
              ).format(TIME_FORMAT)}`}
            </ActionsheetSectionHeaderText>
          </ActionsheetDragIndicatorWrapper>
          <ConfirmCancelAppointment
            id={appointment.id}
            setIsActionSheetVisible={setIsActionSheetVisible}
          />
        </ActionsheetContent>
      </Actionsheet>
      <HStack
        className="bg-background-light dark:bg-background-dark border border-background-200 rounded mx-6"
        space="sm"
      >
        <View
          className={twMerge(
            DISPOSITION_STATUSES[customer.disposition_status].bg,
            "px-4 justify-center"
          )}
        >
          <Icon
            as={DISPOSITION_STATUSES[customer.disposition_status].icon}
            className="text-typography-700"
            size="2xl"
          />
        </View>
        <View className="p-2 px-1 grow gap-2">
          <View className="flex-row justify-between grow items-start">
            {DISPOSITION_STATUSES[customer.disposition_status] && (
              <Badge
                action={
                  hasPassed
                    ? "muted"
                    : DISPOSITION_STATUSES[customer.disposition_status].action
                }
              >
                <BadgeText>
                  {DISPOSITION_STATUSES[customer.disposition_status].label}
                </BadgeText>
              </Badge>
            )}
            <View>
              <Text size="xs">
                {dayjs(appointment.start_datetime).format("MM/DD hh:mm a")}
              </Text>
              <Text size="xs">
                {dayjs(appointment.end_datetime).format("MM/DD hh:mm a")}
              </Text>
            </View>
          </View>
          <View>
            <Text bold className="text-typography-700">
              {customer.full_name}
            </Text>
            <View className="flex-row gap-x-1 items-center">
              <Icon as={MapPin} className="text-typography-400" size="xs" />
              <Text size="xs">{`${customer.address}, ${customer.city}`}</Text>
            </View>
          </View>
        </View>
      </HStack>
    </TouchableOpacity>
  );
}

export default function ScheduleScreen() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { location, refreshData } = useUserContext();
  const router = useRouter();
  const params = useLocalSearchParams<{
    selectedDate?: string;
  }>();

  const selectedDayjs = dayjs(params.selectedDate);

  const selectedDayAppointments = location.appointments.filter(
    (appointment) => {
      const startDayjs = dayjs(appointment.start_datetime);
      const endDayjs = dayjs(appointment.end_datetime);
      const isStartDate = startDayjs.isSame(selectedDayjs, "date");
      const isEndDate = endDayjs.isSame(selectedDayjs, "date");
      if (isStartDate || isEndDate) return true;

      const startsBeforeToday = startDayjs.isBefore(selectedDayjs, "date");
      const endsAfterToday = endDayjs.isAfter(selectedDayjs, "date");

      return startsBeforeToday && endsAfterToday;
    }
  );

  const locationCustomerDictionary = location.customers.reduce<{
    [k: number]: (typeof location.customers)[0];
  }>((dictionary, customer) => {
    if (!customer) return dictionary;
    dictionary[customer.id] = customer;

    return dictionary;
  }, {});

  const filteredDayAppointments = selectedDayAppointments.filter(
    (appointment) => {
      if (!appointment.customer_id) return false;
      const customer = locationCustomerDictionary[appointment.customer_id];
      if (!customer) return false;
      return true;
    }
  );

  return (
    <ScrollView
      contentContainerClassName="gap-y-2"
      refreshControl={
        <RefreshControl
          onRefresh={async () => {
            setIsRefreshing(true);
            await refreshData();
            setIsRefreshing(false);
          }}
          refreshing={isRefreshing}
        />
      }
    >
      <Box className="p-6 bg-background-50">
        <Heading size="xl">Schedule</Heading>
        <Text size="sm" className="text-gray-400">
          View upcoming schedule for your selected day.
        </Text>
      </Box>
      <VStack>
        <HStack className="px-6 justify-between" space="sm">
          <Text className="text-typography-800 font-semibold">
            {selectedDayjs.format("MMM YYYY")}
          </Text>
          {!selectedDayjs.isSame(dayjs(), "date") && (
            <TouchableOpacity
              className="flex-row items-center gap-x-1"
              onPress={() =>
                router.setParams({ selectedDate: dayjs().toISOString() })
              }
            >
              <Icon size="xs" as={Home} className="text-typography-800" />
              <Text size="xs">Today</Text>
            </TouchableOpacity>
          )}
        </HStack>
        <HorizontalDaySelector
          disableBeforeToday
          selectedDayJs={dayjs(params.selectedDate)}
          setSelectedDayJs={(day) =>
            router.setParams({ selectedDate: day.toISOString() })
          }
        />
      </VStack>

      {filteredDayAppointments.length ? (
        filteredDayAppointments
          .sort((a, b) => {
            if (
              dayjs().isAfter(a.end_datetime) ||
              dayjs().isAfter(b.end_datetime)
            )
              return -1;
            return (
              new Date(a.start_datetime).getTime() -
              new Date(b.start_datetime).getTime()
            );
          })
          .map((appointment) => {
            const customer =
              locationCustomerDictionary[Number(appointment.customer_id)];
            return (
              <ScheduleRow
                appointment={appointment}
                customer={customer}
                key={appointment.id}
              />
            );
          })
      ) : (
        <Text className="text-center">No events scheduled on this date.</Text>
      )}
      <ScreenEnd />
      <ScreenEnd />
    </ScrollView>
  );
}
