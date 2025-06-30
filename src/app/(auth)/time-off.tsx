import BackHeaderButton from "@/src/components/BackHeaderButton";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetSectionHeaderText,
} from "@/src/components/ui/actionsheet";
import { Avatar, AvatarFallbackText } from "@/src/components/ui/avatar";
import { Badge, BadgeText } from "@/src/components/ui/badge";
import { Button, ButtonText } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Fab } from "@/src/components/ui/fab";
import {
  FormControl,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "@/src/components/ui/form-control";
import { Heading } from "@/src/components/ui/heading";
import { HStack } from "@/src/components/ui/hstack";
import { Icon } from "@/src/components/ui/icon";
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
import { Switch } from "@/src/components/ui/switch";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import {
  SERVER_DATE_TIME_FORMAT_TZ,
  TIME_FORMAT,
} from "@/src/constants/date-formats";
import { useUserContext } from "@/src/contexts/user-context";
import { supabase } from "@/src/lib/supabase";
import { Tables } from "@/supabase";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { ChevronDownIcon, Plus } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function AddTimeOff({ refresh }: { refresh: () => void }) {
  const { bottom } = useSafeAreaInsets();
  const { profile, location, refreshData } = useUserContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false);
  const handleClose = () => setIsActionSheetVisible(false);
  const [isAllDay, setIsAllDay] = useState(true);

  const [type, setType] = useState("vacation");

  const [timeOffDate, setTimeOffDate] = useState(dayjs().startOf("day"));

  const [timeRange, setTimeRange] = useState({
    start: dayjs(timeOffDate).set("hour", 7).set("minute", 0),
    end: dayjs(timeOffDate).endOf("day").set("hour", 15).set("minute", 0),
  });

  const onChange = useCallback(
    (_: DateTimePickerEvent, selectedDate: Date | undefined) => {
      if (!selectedDate) return;
      setTimeOffDate(dayjs(selectedDate));
    },
    []
  );

  const onTimeChange = useCallback(
    (range: string) => (_: DateTimePickerEvent, time?: Date) =>
      setTimeRange((prevState) => ({ ...prevState, [range]: time })),
    []
  );

  const handleSubmitTimeOff = useCallback(() => {
    setIsSubmitting(true);

    const insert = {
      business_id: location.business_id as string,
      end_datetime: dayjs(timeOffDate)
        .set("hour", timeRange.end.get("hour"))
        .set("minute", timeRange.end.get("minute"))
        .format(SERVER_DATE_TIME_FORMAT_TZ),
      name: "Time Off",
      start_datetime: dayjs(timeOffDate)
        .set("hour", timeRange.start.get("hour"))
        .set("minute", timeRange.start.get("minute"))
        .format(SERVER_DATE_TIME_FORMAT_TZ),
      type,
    };

    return supabase
      .from("business_appointments")
      .insert(insert)
      .select("id")
      .single()
      .then(({ data, error }) => {
        if (error) throw new Error(error.message);
        return data;
      })
      .then((appointment) =>
        supabase.from("business_appointment_profiles").insert({
          business_id: location.business_id!,
          appointment_id: appointment.id,
          profile_id: profile.id,
        })
      )
      .then(refreshData)
      .then(refresh)
      .then(handleClose)
      .then(() => setIsSubmitting(false));
  }, [
    location.business_id,
    profile.id,
    refresh,
    refreshData,
    timeOffDate,
    timeRange.end,
    timeRange.start,
    type,
  ]);

  return (
    <>
      {isActionSheetVisible && (
        <Actionsheet isOpen onClose={handleClose}>
          <ActionsheetBackdrop />
          <ActionsheetContent style={{ paddingBlockEnd: bottom }}>
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
              <ActionsheetSectionHeaderText>
                Add Time Off
              </ActionsheetSectionHeaderText>
            </ActionsheetDragIndicatorWrapper>
            <VStack className="w-full" space="lg">
              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText>Date</FormControlLabelText>
                </FormControlLabel>
                <DateTimePicker
                  value={timeOffDate.toDate()}
                  mode="date"
                  is24Hour={true}
                  onChange={onChange}
                />
              </FormControl>
              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText>All Day</FormControlLabelText>
                </FormControlLabel>
                <Switch size="md" value={isAllDay} onToggle={setIsAllDay} />
              </FormControl>
              {isAllDay ? null : (
                <HStack>
                  <FormControl className="grow">
                    <FormControlLabel>
                      <FormControlLabelText>Start</FormControlLabelText>
                    </FormControlLabel>
                    <DateTimePicker
                      is24Hour={true}
                      minuteInterval={15}
                      minimumDate={timeOffDate.toDate()}
                      maximumDate={timeRange.end.toDate()}
                      mode="time"
                      onChange={onTimeChange("start")}
                      value={timeRange.start.toDate()}
                    />
                  </FormControl>
                  <FormControl className="grow">
                    <FormControlLabel>
                      <FormControlLabelText>End</FormControlLabelText>
                    </FormControlLabel>
                    <DateTimePicker
                      is24Hour={true}
                      minuteInterval={30}
                      minimumDate={timeOffDate.toDate()}
                      mode="time"
                      onChange={onTimeChange("end")}
                      value={timeRange.end.toDate()}
                    />
                  </FormControl>
                </HStack>
              )}
              <FormControl isRequired>
                <FormControlLabel>
                  <FormControlLabelText size="md">Type:</FormControlLabelText>
                </FormControlLabel>
                <Select
                  className="bg-background-100"
                  isDisabled={isSubmitting}
                  onValueChange={setType}
                  selectedValue={type}
                  initialLabel="Vacation"
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
                    <SelectContent style={{ paddingBlockEnd: bottom }}>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <SelectSectionHeaderText>
                        Select the appointment duration
                      </SelectSectionHeaderText>
                      <SelectItem label="Vacation" value="vacation" />
                      <SelectItem label="Sick" value="sick" />
                      <SelectItem label="Other" value="other" />
                    </SelectContent>
                  </SelectPortal>
                </Select>
                <FormControlHelper>
                  <FormControlHelperText>
                    Tell us more about the time off
                  </FormControlHelperText>
                </FormControlHelper>
              </FormControl>
              <Button
                className="self-end w-full"
                disabled={isSubmitting}
                onPress={handleSubmitTimeOff}
                size="lg"
              >
                <ButtonText>Add time off</ButtonText>
              </Button>
            </VStack>
          </ActionsheetContent>
        </Actionsheet>
      )}
      <Fab
        onPress={() => setIsActionSheetVisible(true)}
        size="lg"
        placement="bottom right"
        style={{ marginBlockEnd: bottom }}
      >
        <Icon
          as={Plus}
          className="text-typography-white dark:text-typography-black"
          size="2xl"
        />
      </Fab>
    </>
  );
}

const useBusinessAppointments = ({ profile_id }: { profile_id: string }) => {
  const [data, setData] = useState<Tables<"business_appointments">[]>();
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    return supabase
      .from("business_appointments")
      .select("*, profiles: business_appointment_profiles!inner(*)")
      .eq("business_appointment_profiles.profile_id", profile_id)
      .in("type", ["vacation", "sick", "other"])
      .order("start_datetime")
      .then(({ data }) => {
        if (data) {
          setData(data);
        }
        setIsLoading(false);
      });
  }, [profile_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData, profile_id]);

  return { data: data || [], isLoading, refresh: fetchData };
};

function AppointmentCard({
  appointment,
  isPast,
}: {
  appointment: Tables<"business_appointments">;
  isPast?: boolean;
}) {
  const startDayjs = dayjs(appointment.start_datetime);
  const endDayjs = dayjs(appointment.end_datetime);

  return (
    <Card className={isPast ? "opacity-50" : ""}>
      <HStack space="sm">
        <VStack className="bg-background-100 px-4 rounded justify-center">
          <Text className="text-center" bold size="xl">
            {startDayjs.format("DD")}
          </Text>
          <Text bold size="sm" className="text-center">
            {startDayjs.format("MMM")}
          </Text>
        </VStack>
        <VStack className="flex-1" space="sm">
          <VStack>
            <Heading size="md">Event name</Heading>
            <Badge action="info" className="self-start">
              <BadgeText>Vacation</BadgeText>
            </Badge>
          </VStack>
          <HStack className="justify-between items-center">
            <HStack>
              <Avatar size="sm">
                <AvatarFallbackText>Jon Do</AvatarFallbackText>
              </Avatar>
              <Avatar size="sm">
                <AvatarFallbackText>Jon Do</AvatarFallbackText>
              </Avatar>
            </HStack>
            <Text>{`${startDayjs.format(TIME_FORMAT)}-${endDayjs.format(
              TIME_FORMAT
            )}`}</Text>
          </HStack>
        </VStack>
      </HStack>
    </Card>
  );
}

type AppointmentGroupType = Record<
  "previous" | "next",
  Tables<"business_appointments">[]
>;

export default function Screen() {
  const { top } = useSafeAreaInsets();
  const { profile } = useUserContext();
  const {
    data: appointments,
    isLoading,
    refresh,
  } = useBusinessAppointments({
    profile_id: profile.id,
  });

  const groupByPastOrUpcoming = appointments.reduce<AppointmentGroupType>(
    (agg, cur) => {
      const today = dayjs();
      const isBefore = dayjs(cur.start_datetime).isBefore(today);
      const aggKey = isBefore ? "previous" : "next";

      agg[aggKey] = (agg[aggKey] ?? []).concat(cur);

      return agg;
    },
    {
      previous: [],
      next: [],
    }
  );

  return (
    <VStack className="flex-1" space="lg" style={{ paddingTop: top }}>
      <VStack className="px-6">
        <BackHeaderButton />
        <Heading>Time Off</Heading>
        <Text size="sm">
          Manage your time off to prevent scheduling conflicts with appointments
        </Text>
      </VStack>
      <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <VStack space="lg">
            <VStack space="sm">
              <Heading size="sm">Upcoming</Heading>
              {groupByPastOrUpcoming.next.map((appt) => (
                <AppointmentCard appointment={appt} key={appt.id} />
              ))}
            </VStack>
            <VStack space="sm">
              <Heading size="sm">Past</Heading>
              {groupByPastOrUpcoming.previous.reverse().map((appt) => (
                <AppointmentCard appointment={appt} key={appt.id} isPast />
              ))}
            </VStack>
          </VStack>
        )}
      </ScrollView>
      <AddTimeOff refresh={refresh} />
    </VStack>
  );
}
