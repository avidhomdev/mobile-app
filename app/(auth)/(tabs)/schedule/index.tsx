import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import dayjs from "dayjs";
import { Home } from "lucide-react-native";
import { useRef, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { twMerge } from "tailwind-merge";

export default function ScheduleScreen() {
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

  return (
    <View className="gap-6">
      <HStack space="md" className="justify-between p-6 bg-white items-center">
        <Box>
          <Heading size="xl">Schedule</Heading>
          <Text size="sm" className="text-gray-400">
            View upcoming schedule for your selected day.
          </Text>
        </Box>
      </HStack>

      <View>
        {!selectedDayjs.isSame(dayjs(), "date") && (
          <View className="self-start px-6">
            <Button onPress={() => setSelectedDayjs(dayjs())} variant="link">
              <ButtonIcon as={Home} />
              <ButtonText>Back to Today</ButtonText>
            </Button>
          </View>
        )}
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
                className={twMerge(
                  isToday
                    ? "bg-white border-gray-200 border-t-sky-400"
                    : "bg-gray-200 border-gray-300 opacity-70",
                  "border border-t-8 py-2 w-14 rounded"
                )}
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
                  className="text-center text-typography-400 uppercase"
                  size="2xs"
                >
                  {day.format("MMM")}
                </Text>
                <Text
                  className="text-center text-typography-500 uppercase tracking-tighter font-semibold"
                  size="sm"
                >
                  {day.format("ddd")}
                </Text>
                <Text
                  bold
                  className="text-center text-typography-800"
                  size="xl"
                >
                  {day.format("DD")}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <ScrollView contentContainerClassName="px-6 gap-y-2">
        <Card>
          <Text>{`Appointment on ${selectedDayjs.format(
            "MMM DD, YYYY"
          )}`}</Text>
        </Card>
        <Card>
          <Text>{`Appointment on ${selectedDayjs.format(
            "MMM DD, YYYY"
          )}`}</Text>
        </Card>
        <Card>
          <Text>{`Appointment on ${selectedDayjs.format(
            "MMM DD, YYYY"
          )}`}</Text>
        </Card>
      </ScrollView>
    </View>
  );
}
