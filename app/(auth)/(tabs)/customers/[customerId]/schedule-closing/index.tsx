import { Text } from "@/components/ui/text";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

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
  SERVER_DATE_TIME_FORMAT_TZ,
} from "@/constants/date-formats";
import { useCustomerContext } from "@/contexts/customer-context";
import { useLocationContext } from "@/contexts/location-context";
import { IProfile, useUserContext } from "@/contexts/user-context";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronDownIcon } from "lucide-react-native";
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
  const router = useRouter();
  const { updateCustomer } = useCustomerContext();
  const { refreshData } = useUserContext();
  const { location } = useLocationContext();
  const params = useLocalSearchParams();
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
      customer_id: params.customerId,
      duration: duration,
      end_datetime: time
        .add(duration, "minute")
        ?.format(SERVER_DATE_TIME_FORMAT_TZ),
      location_id: location.id,
      name: "Customer Meeting",
      start_datetime: time?.format(SERVER_DATE_TIME_FORMAT_TZ),
    };

    return supabase
      .from("business_appointments")
      .insert(appointmentInsert)
      .select("id")
      .single()
      .then(({ data, error }) => {
        if (error) throw error.message;

        const appointmentProfileInsert = {
          appointment_id: data.id,
          business_id: location.business_id,
          profile_id: closer.id,
        };

        return supabase
          .from("business_appointment_profiles")
          .insert(appointmentProfileInsert);
      })
      .then(({ error }) => {
        if (error) throw error.message;

        return updateCustomer(Number(params.customerId), {
          closer_id: closer.id,
        });
      })
      .then(refreshData)
      .then(() =>
        router.push({
          pathname: "/(auth)/(tabs)/customers/[customerId]",
          params: {
            customerId: params.customerId as string,
          },
        })
      )
      .then(handleCloseTimeSlotActionSheet);
  }, [duration]);

  return (
    <TouchableOpacity
      className={twMerge(
        disabled ? "bg-gray-200" : "bg-white shadow-sm shadow-gray-200",
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

export default function ScheduleClosingScreen() {
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
  }, [selectedDayJs]);

  const timeArr = Array.from({ length: 25 }, (_, num) =>
    selectedDayJs
      .startOf("day")
      .set("hour", 8)
      .add(num * 30, "minutes")
  );

  return (
    <View className="flex-1">
      <Box className="bg-white p-6 pb-2">
        <Heading size="xl">Closing Appointment</Heading>
        <Text size="sm" className="text-gray-400">
          Schedule closing appointment
        </Text>
      </Box>
      <Box>
        <View className="px-6 pt-2">
          <Heading className="text-center" size="sm">
            {selectedDayJs.format("MMM YYYY")}
          </Heading>
        </View>
        <HorizontalDaySelector
          disableBeforeToday
          selectedDayJs={selectedDayJs}
          setSelectedDayJs={setSelectedDayJs}
        />
      </Box>
      {!closers?.length ? (
        <Text>No closers found.</Text>
      ) : (
        <ScrollView
          contentContainerClassName="p-6 gap-y-2"
          showsVerticalScrollIndicator={false}
        >
          {timeArr.map((time) => {
            const findOverlappingAppointment = [
              ...new Set(
                appointments.flatMap((appointment) => {
                  const profileIds = appointment.profiles.map(
                    (p) => p.profile_id
                  );

                  if (
                    !dayjs(appointment.start_datetime).diff(time, "minute") ||
                    !dayjs(appointment.end_datetime).diff(time, "minute")
                  )
                    return profileIds;
                  if (
                    dayjs(appointment.start_datetime).isBefore(time) &&
                    dayjs(appointment.end_datetime).isAfter(time)
                  )
                    return profileIds;
                  return [];
                })
              ),
            ];

            const filteredClosers = closers.filter((c) => {
              if (location.is_closer && c.id !== profile.id) return false;
              return !findOverlappingAppointment.includes(c.id);
            });

            const [closer] = filteredClosers;

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
      )}
    </View>
  );
}
