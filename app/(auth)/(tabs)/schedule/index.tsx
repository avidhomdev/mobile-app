import ScreenEnd from "@/components/ScreenEnd";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { DISPOSITION_STATUSES } from "@/constants/disposition_statuses";
import { useUserContext } from "@/contexts/user-context";
import dayjs from "dayjs";
import { Home } from "lucide-react-native";
import { useRef, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { twMerge } from "tailwind-merge";

export default function ScheduleScreen() {
  const { location } = useUserContext();
  const horizontalDaysScrollViewRef = useRef<ScrollView>(null);
  const [selectedDayjs, setSelectedDayjs] = useState(dayjs());
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
              onPress={() => setSelectedDayjs(dayjs())}
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
                onPress={() => setSelectedDayjs(day)}
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
        {selectedDayAppointments
          .sort((a, b) => {
            return (
              new Date(a.start_datetime).getTime() -
              new Date(b.start_datetime).getTime()
            );
          })
          .flatMap((appointment) => {
            if (!appointment.customer_id) return [];
            const customer =
              locationCustomerDictionary[appointment.customer_id];
            if (!customer) return [];
            return (
              <Card key={appointment.id}>
                <View className="items-start mb-2">
                  {customer?.disposition_status &&
                    DISPOSITION_STATUSES[customer.disposition_status] && (
                      <Badge
                        action={
                          DISPOSITION_STATUSES[customer.disposition_status]
                            .action
                        }
                      >
                        <BadgeText>
                          {
                            DISPOSITION_STATUSES[customer.disposition_status]
                              .label
                          }
                        </BadgeText>
                      </Badge>
                    )}
                </View>
                <Text>{customer.full_name}</Text>
                <View className="flex-row items-center gap-x-1">
                  <Text>
                    {dayjs(appointment.start_datetime).format("hh:mm a")}
                  </Text>
                  <Text>
                    {dayjs(appointment.end_datetime).format("hh:mm a")}
                  </Text>
                </View>
              </Card>
            );
          })}
      </View>
      <ScreenEnd />
      <ScreenEnd />
    </ScrollView>
  );
}
