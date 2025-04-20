import { Text } from "@/components/ui/text";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

import BackHeaderButton from "@/components/BackHeaderButton";
import HorizontalDaySelector from "@/components/HorizontalDaySelector";
import ScreenEnd from "@/components/ScreenEnd";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetSectionHeaderText,
} from "@/components/ui/actionsheet";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
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
} from "@/components/ui/select";
import {
  FRIENDLY_DATE_FORMAT,
  SERVER_DATE_TIME_FORMAT,
} from "@/constants/date-formats";
import { useCustomerContext } from "@/contexts/customer-context";
import { useLocationContext } from "@/contexts/location-context";
import { useUserContext } from "@/contexts/user-context";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/supabase";
import { useRouter } from "expo-router";
import { ChevronDownIcon } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";

function TimeSlotRow({
  disabled = false,
  time,
}: {
  disabled?: boolean;
  time: dayjs.Dayjs;
}) {
  const { customer } = useCustomerContext();
  const router = useRouter();
  const { profile, refreshData } = useUserContext();
  const { location } = useLocationContext();
  const [duration, setDuration] = useState(30);
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

    const appointmentInsert = {
      business_id: location.business_id,
      customer_id: customer?.id,
      duration: duration,
      end_datetime: time
        .add(duration, "minute")
        ?.format(SERVER_DATE_TIME_FORMAT),
      location_id: location.id,
      name: "Customer Meeting",
      start_datetime: time?.format(SERVER_DATE_TIME_FORMAT),
    };

    return supabase
      .from("business_appointments")
      .insert(appointmentInsert)
      .select("id")
      .single()
      .then(({ data, error }) => {
        if (error) throw error.message;
        return supabase.from("business_appointment_profiles").insert({
          appointment_id: data.id,
          business_id: location.business_id,
          profile_id: profile.id,
        });
      })
      .then(refreshData)
      .then(() =>
        router.push({
          pathname: "/(auth)/customer/[customerId]",
          params: {
            customerId: customer?.id ?? "",
          },
        })
      )
      .then(handleCloseTimeSlotActionSheet);
  }, [
    customer?.id,
    duration,
    isSubmitting,
    location.business_id,
    location.id,
    profile.id,
    refreshData,
    router,
    time,
  ]);

  return (
    <TouchableOpacity
      className={twMerge(
        disabled ? "bg-gray-300" : "bg-white shadow-sm shadow-gray-200",
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
          <AvatarFallbackText>{profile.full_name}</AvatarFallbackText>
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
                Schedule Appointment
              </ActionsheetSectionHeaderText>
            </ActionsheetDragIndicatorWrapper>
            <View className="w-full pb-6 gap-y-4">
              <Heading>{time.format(FRIENDLY_DATE_FORMAT)}</Heading>
              <Text>{`Starting at ${time.format("hh:mm a")}`}</Text>

              <FormControl isRequired>
                <FormControlLabel>
                  <FormControlLabelText size="md">
                    Duration:
                  </FormControlLabelText>
                </FormControlLabel>
                <Select
                  defaultValue={duration.toString()}
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
              <View className="flex-row w-full gap-x-2">
                <Button
                  className="ml-auto"
                  size="lg"
                  action="secondary"
                  onPress={handleCloseTimeSlotActionSheet}
                >
                  <ButtonText>Cancel</ButtonText>
                </Button>
                <Button onPress={handleSubmitTimeSlot} size="lg">
                  <ButtonText>Submit</ButtonText>
                </Button>
              </View>
            </View>
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

export default function Screen() {
  const { customer } = useCustomerContext();
  const { top } = useSafeAreaInsets();
  const { location } = useLocationContext();
  const { profile } = useUserContext();
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [selectedDayJs, setSelectedDayJs] = useState(dayjs());

  useEffect(() => {
    const fetchTodaysAppointments = async () =>
      supabase
        .from("business_appointments")
        .select(
          "*, profiles: business_appointment_profiles(*, profile: profile_id(*))"
        )
        .match({
          location_id: location.id,
          "business_appointment_profiles.profile_id": profile.id,
        })
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
  }, [location.id, profile.id, selectedDayJs]);

  const timeArr = Array.from({ length: 25 }, (_, num) =>
    selectedDayJs
      .startOf("day")
      .set("hour", 8)
      .add(num * 30, "minutes")
  );

  return (
    <View className="flex-1" style={{ paddingTop: top }}>
      <View className="px-6">
        <BackHeaderButton />
        <Heading className="text-typography-800" size="xl">
          Appointment
        </Heading>
        <Text className="text-typography-400">
          {`Schedule appointment for ${customer?.full_name}`}
        </Text>
      </View>
      <Box className="border-b border-gray-200 pt-6">
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
        contentContainerClassName="p-6 gap-y-2 bg-gray-100"
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

          return (
            <TimeSlotRow
              disabled={hasOverlap || time.isBefore(dayjs())}
              key={`${time.hour()}_${time.minute()}`}
              time={time}
            />
          );
        })}
        <ScreenEnd />
      </ScrollView>
    </View>
  );
}
