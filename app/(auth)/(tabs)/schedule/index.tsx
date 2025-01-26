import ScreenEnd from "@/components/ScreenEnd";
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
} from "@/components/ui/actionsheet";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { TIME_FORMAT } from "@/constants/date-formats";
import { DISPOSITION_STATUSES } from "@/constants/disposition_statuses";
import {
  IAppointments,
  ILocationCustomer,
  useUserContext,
} from "@/contexts/user-context";
import { supabase } from "@/lib/supabase";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Home, Trash2 } from "lucide-react-native";
import { Fragment, useCallback, useRef, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
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
    []
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

  return (
    <TouchableOpacity
      disabled={hasPassed}
      key={appointment.id}
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
      <Card variant={hasPassed ? "outline" : undefined}>
        <View className="items-start mb-2">
          {customer?.disposition_status &&
            DISPOSITION_STATUSES[customer.disposition_status] && (
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
        </View>
        <Text>{customer.full_name}</Text>
        <View className="flex-row items-center gap-x-1">
          <Text>{`${dayjs(appointment.start_datetime).format(
            "hh:mm a"
          )} - ${dayjs(appointment.end_datetime).format("hh:mm a")}`}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

export default function ScheduleScreen() {
  const { location } = useUserContext();
  const router = useRouter();
  const params = useLocalSearchParams<{
    selectedDate?: string;
  }>();

  const selectedDayjs = dayjs(params.selectedDate);
  const horizontalDaysScrollViewRef = useRef<ScrollView>(null);

  const days = Array.from({ length: 60 }, (_, index) =>
    dayjs()
      .set("hour", 0)
      .set("minute", 0)
      .set("second", 0)
      .subtract(30, "days")
      .add(index + 1, "days")
  );

  const selectedDayAppointments = location.appointments.filter((appointment) =>
    dayjs(appointment.start_datetime).isSame(dayjs(selectedDayjs), "date")
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
    <ScrollView contentContainerClassName="gap-y-2">
      <Box className="p-6 bg-white">
        <Heading size="xl">Schedule</Heading>
        <Text size="sm" className="text-gray-400">
          View upcoming schedule for your selected day.
        </Text>
      </Box>

      <View>
        <View className="flex-row items-center gap-x-2 px-6 justify-between">
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
        </View>
        <ScrollView
          contentContainerClassName="gap-x-2 p-2"
          horizontal
          ref={horizontalDaysScrollViewRef}
          showsHorizontalScrollIndicator={false}
        >
          {days.map((day) => {
            const isToday = day.isSame(selectedDayjs, "date");

            return (
              <TouchableOpacity
                className="p-2 gap-y-2"
                key={day.toISOString()}
                onLayout={(event) => {
                  const layout = event.nativeEvent.layout;
                  if (isToday && horizontalDaysScrollViewRef.current) {
                    horizontalDaysScrollViewRef.current.scrollTo({
                      x: layout.x - 150,
                      animated: true,
                    });
                  }
                }}
                onPress={() =>
                  router.setParams({ selectedDate: day.toISOString() })
                }
              >
                <Text
                  className={twMerge(
                    isToday ? "text-typography-900" : "text-typography-500",
                    "text-center uppercase tracking-tighter font-semibold"
                  )}
                  size="xs"
                >
                  {day.format("ddd")}
                </Text>
                <Text
                  bold
                  className={twMerge(
                    isToday
                      ? "bg-slate-900 text-typography-white"
                      : "text-typography-800",
                    "text-center p-1 px-2 rounded"
                  )}
                >
                  {day.format("DD")}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <View className="px-6 gap-y-2">
        {filteredDayAppointments.length ? (
          filteredDayAppointments
            .sort((a, b) => {
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
      </View>
      <ScreenEnd />
      <ScreenEnd />
    </ScrollView>
  );
}
