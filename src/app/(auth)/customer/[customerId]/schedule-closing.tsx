import { Text } from "@/src/components/ui/text";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";

import BackHeaderButton from "@/src/components/BackHeaderButton";
import HorizontalDaySelector from "@/src/components/HorizontalDaySelector";
import ScreenEnd from "@/src/components/ScreenEnd";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetSectionHeaderText,
} from "@/src/components/ui/actionsheet";
import { Avatar, AvatarFallbackText } from "@/src/components/ui/avatar";
import { Box } from "@/src/components/ui/box";
import { Button, ButtonText } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import {
  FormControl,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "@/src/components/ui/form-control";
import { Heading } from "@/src/components/ui/heading";
import { HStack } from "@/src/components/ui/hstack";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectSectionHeaderText,
  SelectTrigger,
} from "@/src/components/ui/select";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/src/components/ui/toast";
import { VStack } from "@/src/components/ui/vstack";
import {
  FRIENDLY_DATE_FORMAT,
  SERVER_DATE_TIME_FORMAT,
} from "@/src/constants/date-formats";
import { useCustomerContext } from "@/src/contexts/customer-context";
import { useLocationContext } from "@/src/contexts/location-context";
import { IProfile, useUserContext } from "@/src/contexts/user-context";
import { supabase } from "@/src/lib/supabase";
import { Tables } from "@/supabase";
import { homApiFetch } from "@/src/utils/hom-api-fetch";
import { useRouter } from "expo-router";
import { ChevronDownIcon } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";

function TimeSlotRow({
  closer,
  disabled = false,
  time,
}: {
  closer:
    | IProfile
    | {
        avatar_url: string | null;
        created_at: string;
        full_name: string | null;
        id: string;
        updated_at: string | null;
        username: string | null;
        website: string | null;
      };
  disabled?: boolean;
  time: dayjs.Dayjs;
}) {
  const toast = useToast();
  const { bottom } = useSafeAreaInsets();
  const { customer } = useCustomerContext();
  const router = useRouter();
  const { refreshData } = useUserContext();
  const { location } = useLocationContext();
  const [duration, setDuration] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [
    isConfirmTimeSlotActionSheetVisible,
    setIsConfirmTimeSlotActionSheetVisible,
  ] = useState(false);
  const handleCloseTimeSlotActionSheet = () => {
    setIsSubmitting(false);
    setIsConfirmTimeSlotActionSheetVisible(false);
  };

  const handleSubmitTimeSlot = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    return homApiFetch({
      endpoint: `customers/${customer.id}/schedule-appointment`,
      options: {
        method: "POST",
        body: JSON.stringify({
          appointment: {
            business_id: location.business_id,
            customer_id: customer?.id,
            duration: duration,
            end_datetime: time
              .add(duration, "minute")
              ?.format(SERVER_DATE_TIME_FORMAT),
            location_id: location.id,
            name: "Customer Meeting",
            start_datetime: time?.format(SERVER_DATE_TIME_FORMAT),
          },
          profiles: [
            { business_id: location.business_id, profile_id: closer.id },
          ],
        }),
      },
    })
      .then(({ success, error }) => {
        if (error) throw error;
        if (!success) throw new Error("Failed to fetch.");
        if (success) return refreshData();
      })
      .then(() =>
        router.push({
          pathname: "/customer/[customerId]",
          params: {
            customerId: customer.id,
          },
        })
      )
      .then(handleCloseTimeSlotActionSheet)
      .then(() =>
        toast.show({
          id: "new-appointment-success",
          placement: "bottom",
          duration: 3000,
          render: () => {
            return (
              <Toast action="success">
                <ToastTitle>Appointment created.</ToastTitle>
                <ToastDescription>
                  Email confirmations have been sent.
                </ToastDescription>
              </Toast>
            );
          },
        })
      )
      .finally(() => setIsSubmitting(false));
  }, [
    customer.id,
    duration,
    isSubmitting,
    location.business_id,
    location.id,
    closer?.id,
    refreshData,
    router,
    time,
    toast,
  ]);

  return (
    <TouchableOpacity
      className={twMerge(
        disabled
          ? "bg-background-200"
          : "bg-background-0 shadow-sm shadow-background-300",
        "p-4 rounded-full flex-row items-center"
      )}
      disabled={disabled}
      key={time.toString()}
      onPress={() => setIsConfirmTimeSlotActionSheetVisible(true)}
    >
      <Text
        className={twMerge(
          disabled ? "text-typography-400" : "text-typography-600",
          "text-center grow"
        )}
        size="md"
      >
        {time.format("hh:mm a")}
      </Text>
      {!disabled && (
        <Avatar className="absolute right-2" size="sm">
          <AvatarFallbackText>{closer.full_name}</AvatarFallbackText>
        </Avatar>
      )}

      {!disabled && (
        <Actionsheet
          isOpen={isConfirmTimeSlotActionSheetVisible}
          onClose={handleCloseTimeSlotActionSheet}
        >
          <ActionsheetBackdrop />
          <ActionsheetContent>
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
              <ActionsheetSectionHeaderText>
                {time.format(FRIENDLY_DATE_FORMAT)}
              </ActionsheetSectionHeaderText>
            </ActionsheetDragIndicatorWrapper>
            <VStack
              className={twMerge(isSubmitting ? "opacity-75" : "", "w-full")}
              space="md"
              style={{ paddingBlockEnd: bottom }}
            >
              <Card variant="filled">
                <VStack space="sm">
                  <Text>{`Starting at ${time.format("hh:mm a")}`}</Text>
                  <FormControl isRequired>
                    <FormControlLabel>
                      <FormControlLabelText size="md">
                        Duration:
                      </FormControlLabelText>
                    </FormControlLabel>
                    <Select
                      className="bg-background-100"
                      defaultValue={duration.toString()}
                      isDisabled={isSubmitting}
                      onValueChange={(payload) => setDuration(Number(payload))}
                    >
                      <SelectTrigger>
                        <SelectInput
                          placeholder="Select option"
                          className="flex-1"
                        />
                        <SelectIcon className="mr-3" as={ChevronDownIcon} />
                      </SelectTrigger>
                      <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent style={{ paddingBottom: 10 }}>
                          <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                          </SelectDragIndicatorWrapper>
                          <SelectSectionHeaderText>
                            Select the appointment duration
                          </SelectSectionHeaderText>
                          {Array.from({ length: 8 }, (_, num) => (
                            <SelectItem
                              key={num}
                              label={`${(num + 1) * 30} minutes`}
                              value={((num + 1) * 30).toString()}
                            />
                          ))}
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                    <FormControlHelper>
                      <FormControlHelperText>
                        Select the appointment duration
                      </FormControlHelperText>
                    </FormControlHelper>
                  </FormControl>
                  <Text>{`Ending at ${time
                    .add(duration, "minutes")
                    .format("hh:mm a")}`}</Text>
                </VStack>
              </Card>
              <HStack space="md">
                <Button
                  className="ml-auto"
                  disabled={isSubmitting}
                  size="lg"
                  action="secondary"
                  onPress={handleCloseTimeSlotActionSheet}
                >
                  <ButtonText>Cancel</ButtonText>
                </Button>
                <Button
                  className="grow"
                  disabled={isSubmitting}
                  onPress={handleSubmitTimeSlot}
                  size="lg"
                >
                  <ButtonText>
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </ButtonText>
                </Button>
              </HStack>
            </VStack>
          </ActionsheetContent>
        </Actionsheet>
      )}
    </TouchableOpacity>
  );
}

interface IAppointmentProfile extends Tables<"business_appointment_profiles"> {
  profile: Tables<"profiles">;
}

interface IAppointment extends Tables<"business_appointments"> {
  profiles: IAppointmentProfile[];
}

export default function ScheduleClosingScreen() {
  const { top } = useSafeAreaInsets();
  const { customer } = useCustomerContext();
  const { location } = useLocationContext();
  const { closers, profile } = useUserContext();
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [selectedDayJs, setSelectedDayJs] = useState(dayjs());

  useEffect(() => {
    const fetchTodaysAppointments = async () =>
      supabase
        .from("business_appointments")
        .select(
          "*, profiles: business_appointment_profiles(*, profile: profile_id(*))"
        )
        .eq("location_id", location.id)
        .gte(
          "start_datetime",
          selectedDayJs.startOf("day").format(SERVER_DATE_TIME_FORMAT)
        )
        .lte(
          "start_datetime",
          selectedDayJs.endOf("day").format(SERVER_DATE_TIME_FORMAT)
        )
        .returns<IAppointment[]>()
        .then(({ data }) => {
          if (data) setAppointments(data);
        });
    fetchTodaysAppointments();
  }, [location.id, selectedDayJs]);

  const timeArr = Array.from({ length: 25 }, (_, num) =>
    selectedDayJs
      .startOf("day")
      .set("hour", 8)
      .add(num * 30, "minutes")
  );

  return (
    <VStack className="flex-1">
      <VStack className="px-6 bg-background-50" style={{ paddingTop: top }}>
        <BackHeaderButton />
        <Heading className="text-typography-800" size="xl">
          Planning Appointment
        </Heading>
        <Text className="text-typography-400">
          {`Schedule appointment for ${customer?.full_name}`}
        </Text>
      </VStack>
      <Box className="border-b border-background-200 bg-background-50 pt-6">
        <Heading className="text-center" size="sm">
          {selectedDayJs.format("MMM YYYY")}
        </Heading>
        <HorizontalDaySelector
          disableBeforeToday
          selectedDayJs={selectedDayJs}
          setSelectedDayJs={setSelectedDayJs}
        />
      </Box>

      <ScrollView
        contentContainerClassName="p-6 gap-y-2"
        key={selectedDayJs.date()}
        showsVerticalScrollIndicator={false}
      >
        {timeArr.map((time) => {
          const hasOverlap = appointments.some((appointment) => {
            const startDayjs = dayjs(appointment.start_datetime);
            const endDayjs = dayjs(appointment.end_datetime);
            const noTimeDiff =
              !startDayjs.diff(time, "minute") ||
              !endDayjs.diff(time, "minute");
            const overlap = startDayjs.isBefore(time) && endDayjs.isAfter(time);

            return noTimeDiff || overlap;
          });

          const filteredClosers = closers?.filter((c) => {
            if (location.is_closer && c.id !== profile.id) return false;
            return !hasOverlap;
          });

          const [closer] = filteredClosers ?? [];

          return (
            <TimeSlotRow
              disabled={!closer || time.isBefore(dayjs())}
              closer={closer}
              key={`${time.toISOString()}_${closer?.id}`}
              time={time}
            />
          );
        })}
        <ScreenEnd />
      </ScrollView>
    </VStack>
  );
}
