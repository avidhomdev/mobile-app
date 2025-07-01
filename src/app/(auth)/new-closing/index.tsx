import { Text } from "@/src/components/ui/text";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";

import HorizontalDaySelector from "@/src/components/HorizontalDaySelector";
import ScreenEnd from "@/src/components/ScreenEnd";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
} from "@/src/components/ui/actionsheet";
import { Avatar, AvatarFallbackText } from "@/src/components/ui/avatar";
import { Box } from "@/src/components/ui/box";
import { Button, ButtonText } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Heading } from "@/src/components/ui/heading";
import { HStack } from "@/src/components/ui/hstack";
import { Icon } from "@/src/components/ui/icon";
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
import { Calendar, Clock, User2 } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";
import { DAYS_OF_WEEK } from "@/src/constants/days-of-week";

const CLOSING_DURATION = 60;

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
  const [
    isConfirmTimeSlotActionSheetVisible,
    setIsConfirmTimeSlotActionSheetVisible,
  ] = useState(false);
  const handleCloseTimeSlotActionSheet = () => {
    setIsConfirmTimeSlotActionSheetVisible(false);
  };

  async function handleSubmitTimeSlot() {
    handleCloseTimeSlotActionSheet();
    router.push({
      pathname: "/new-closing/customer-form",
      params: {
        closer_id: closer.id,
        duration: CLOSING_DURATION,
        start_datetime: time?.format(SERVER_DATE_TIME_FORMAT),
        end_datetime: time
          .add(CLOSING_DURATION, "minute")
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
          <ActionsheetContent style={{ paddingBlockEnd: bottom }}>
            <VStack className="w-full mt-4" space="lg">
              <VStack>
                <Heading size="md">Confirm Appointment</Heading>
                <Text size="sm">
                  You&apos;re about to schedule a planning appointment for the
                  customer. Please confirm the details below are correct.
                </Text>
              </VStack>
              <Card size="sm" variant="filled">
                <VStack space="sm">
                  <VStack>
                    <HStack className="items-center" space="xs">
                      <Icon
                        className="text-typography-500"
                        as={User2}
                        size="sm"
                      />
                      <Text className="text-typography-500">Closer</Text>
                    </HStack>
                    <Text size="lg" className="text-typography-800">
                      {closer.full_name}
                    </Text>
                  </VStack>
                  <VStack>
                    <HStack className="items-center" space="xs">
                      <Icon
                        className="text-typography-500"
                        as={Calendar}
                        size="sm"
                      />
                      <Text className="text-typography-500">Date</Text>
                    </HStack>
                    <Text size="lg" className="text-typography-800">
                      {time.format(FRIENDLY_DATE_FORMAT)}
                    </Text>
                  </VStack>
                  <VStack>
                    <HStack className="items-center" space="xs">
                      <Icon
                        className="text-typography-500"
                        as={Clock}
                        size="sm"
                      />
                      <Text className="text-typography-500">Time</Text>
                    </HStack>
                    <Text
                      size="lg"
                      className="text-typography-800"
                    >{`${time.format("hh:mm a")} - ${time
                      .add(CLOSING_DURATION, "minutes")
                      .format("hh:mm a")}`}</Text>
                  </VStack>
                </VStack>
              </Card>

              <HStack space="md">
                <Button
                  className="ml-auto"
                  size="lg"
                  action="secondary"
                  onPress={handleCloseTimeSlotActionSheet}
                >
                  <ButtonText>Cancel</ButtonText>
                </Button>
                <Button
                  className="grow"
                  onPress={handleSubmitTimeSlot}
                  size="lg"
                >
                  <ButtonText>Confirm</ButtonText>
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
  const closerIds = useMemo(() => (closers ?? [])?.map((c) => c.id), [closers]);
  const [appointments, setAppointments] = useState<IAppointment[]>([]);
  const [selectedDayJs, setSelectedDayJs] = useState(dayjs());
  const [availability, setAvailability] = useState();

  useEffect(() => {
    const fetchCloserAvailability = async () =>
      supabase
        .from("business_profiles")
        .select("*")
        .eq("business_id", location.business_id)
        .in("profile_id", closerIds)
        .then(({ data }) => {
          if (!data) return;
          const closerAvailabilityDictionary = data.reduce((agg, cur) => {
            agg[cur.profile_id] = cur.availability;
            return agg;
          }, {});

          return setAvailability(closerAvailabilityDictionary);
        });
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
    fetchCloserAvailability();
  }, [location.id, selectedDayJs, closers, location.business_id, closerIds]);

  const timeArr = Array.from({ length: 25 }, (_, num) =>
    selectedDayJs
      .startOf("day")
      .set("hour", 8)
      .add(num * 30, "minutes")
  );

  return (
    <>
      <Heading className="px-6 text-typography-800" size="xl">
        Planning Appointment
      </Heading>
      <Box className="border-b border-background-200 px-6">
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

          const notBusyProfiles = (closers ?? []).filter((c) => {
            const profileAvailability = availability && availability[c.id];
            if (!profileAvailability) return;
            const selectedDayOfWeek = DAYS_OF_WEEK[selectedDayJs.get("day")];
            const dayAvailability = profileAvailability[selectedDayOfWeek];
            const slotAvailable = dayAvailability[time.get("hour")];

            return slotAvailable && !busyProfiles.includes(c.id);
          });

          const [closer] = notBusyProfiles;

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
