import { Text } from "@/src/components/ui/text";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";

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
import { VStack } from "@/src/components/ui/vstack";
import {
  FRIENDLY_DATE_FORMAT,
  SERVER_DATE_TIME_FORMAT,
} from "@/src/constants/date-formats";
import { useLocationContext } from "@/src/contexts/location-context";
import { IProfile, useUserContext } from "@/src/contexts/user-context";
import { supabase } from "@/src/lib/supabase";
import { Tables } from "@/supabase";
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
  const { bottom } = useSafeAreaInsets();
  const router = useRouter();
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

  async function handleSubmitTimeSlot() {
    handleCloseTimeSlotActionSheet();
    router.push({
      pathname: "/new-closing/customer-form",
      params: {
        closer_id: closer.id,
        duration,
        start_datetime: time?.format(SERVER_DATE_TIME_FORMAT),
        end_datetime: time
          .add(duration, "minute")
          ?.format(SERVER_DATE_TIME_FORMAT),
      },
    });
  }

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

export default function NewClosingScreen() {
  const { location } = useLocationContext();
  const { closers } = useUserContext();
  const closerIds = (closers ?? [])?.map((c) => c.id);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [selectedDayJs, setSelectedDayJs] = useState(dayjs());

  useEffect(() => {
    const fetchTodaysAppointments = async () =>
      supabase
        .from("business_appointments")
        .select(
          "*, profiles: business_appointment_profiles!inner(*, profile: profile_id(*))"
        )
        .in(
          "business_appointment_profiles.profile_id",
          (closers ?? []).map((c) => c.id)
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
  }, [location.id, selectedDayJs, closers]);

  const timeArr = Array.from({ length: 25 }, (_, num) =>
    selectedDayJs
      .startOf("day")
      .set("hour", 8)
      .add(num * 30, "minutes")
  );

  return (
    <>
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
          const busyProfiles = appointments.flatMap((appointment) => {
            const startDayjs = dayjs(appointment.start_datetime);
            const endDayjs = dayjs(appointment.end_datetime);
            const noTimeDiff =
              !startDayjs.diff(time, "minute") ||
              !endDayjs.diff(time, "minute");
            const overlap = startDayjs.isBefore(time) && endDayjs.isAfter(time);

            return noTimeDiff || overlap
              ? appointment.profiles.flatMap((p) =>
                  closerIds.includes(p.profile_id) ? p.profile_id : []
                )
              : [];
          });

          const [closer] = (closers ?? []).filter(
            (c) => !busyProfiles.includes(c.id)
          );

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
    </>
  );
}
