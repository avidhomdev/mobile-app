import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { SHORT_FRIENDLY_DATE_TIME_FORMAT } from "@/constants/date-formats";
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
} from "lucide-react-native";
import { ScrollView, View } from "react-native";

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

export default function CustomerScreen() {
  const { customer } = useUserContext();

  return (
    <View className="p-4 gap-y-4">
      <Card>
        <Heading>Appointments</Heading>
        <Text>Scheduled appointments for this customer</Text>
        <ScrollView
          horizontal
          contentContainerClassName="gap-x-2 py-4"
          showsHorizontalScrollIndicator={false}
        >
          {customer?.appointments.map((appointment) => {
            const startDayjs = dayjs(appointment.start_datetime);
            const StartIcon =
              clocks[Number(startDayjs.format("h")) as keyof typeof clocks];
            const endDayjs = dayjs(appointment.end_datetime);
            const EndIcon =
              clocks[Number(endDayjs.format("h")) as keyof typeof clocks];

            return (
              <Card key={appointment.id} variant="filled">
                <View className="flex-row items-center gap-x-1">
                  <Icon as={Calendar1} />
                  <Text isTruncated>{appointment.name}</Text>
                </View>
                <View className="flex-row items-center gap-x-1">
                  <Icon as={StartIcon} />
                  <Text>
                    {dayjs(startDayjs).format(SHORT_FRIENDLY_DATE_TIME_FORMAT)}
                  </Text>
                </View>
                <View className="flex-row items-center gap-x-1">
                  <Icon as={EndIcon} />
                  <Text>
                    {dayjs(endDayjs).format(SHORT_FRIENDLY_DATE_TIME_FORMAT)}
                  </Text>
                </View>
              </Card>
            );
          })}
        </ScrollView>
      </Card>
    </View>
  );
}
