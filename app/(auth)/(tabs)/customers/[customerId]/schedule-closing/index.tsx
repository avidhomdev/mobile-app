import { Text } from "@/components/ui/text";
import dayjs from "dayjs";
import { useReducer } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

import HorizontalDaySelector from "@/components/HorizontalDaySelector";
import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { twMerge } from "tailwind-merge";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";

enum FormReducerActionTypes {
  SET_IS_SUBMITTING = "SET_IS_SUBMITTING",
  SET_SELECTED_DAYJS = "SET_SELECTED_DAYJS",
}

interface ISET_SELECTED_DAYS {
  type: FormReducerActionTypes.SET_SELECTED_DAYJS;
  payload: dayjs.Dayjs;
}

interface ISET_IS_SUBMITTING {
  type: FormReducerActionTypes.SET_IS_SUBMITTING;
  payload: boolean;
}

type IFormReducerAction = ISET_SELECTED_DAYS | ISET_IS_SUBMITTING;

interface IFormReducerState {
  isSubmitting: boolean;
  selectedDayjs: dayjs.Dayjs;
}

function formReducer(
  prevState: IFormReducerState,
  action: IFormReducerAction
): IFormReducerState {
  switch (action.type) {
    case FormReducerActionTypes.SET_IS_SUBMITTING:
      return {
        ...prevState,
        error: null,
        isSubmitting: action.payload,
      };
    case FormReducerActionTypes.SET_SELECTED_DAYJS:
      return {
        ...prevState,
        selectedDayjs: action.payload,
      };
    default:
      return prevState;
  }
}

export default function ScheduleClosingScreen() {
  const [state, dispatch] = useReducer(formReducer, {
    isSubmitting: false,
    selectedDayjs: dayjs(),
  });

  const timeArr = Array.from({ length: 25 }, (_, num) =>
    dayjs()
      .set("hour", 8)
      .set("minute", 0)
      .set("second", 0)
      .add(num * 30, "minutes")
  );

  const TEMP_MATCHES: { [k: string]: string } = {
    "08:30 am": "John Doe",
    "09:00 am": "John Doe",
    "09:30 am": "Ron Burgundy",
    "10:00 am": "Ron Burgundy",
    "12:00 pm": "Ron Burgundy",
    "12:30 pm": "Ron Burgundy",
    "03:30 pm": "John Doe",
    "04:00 pm": "John Doe",
    "04:30 pm": "Ron Burgundy",
    "05:00 pm": "Ron Burgundy",
  };

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
            {state.selectedDayjs.format("MMM YYYY")}
          </Heading>
        </View>
        <HorizontalDaySelector
          selectedDayJs={state.selectedDayjs}
          setSelectedDayJs={(payload) =>
            dispatch({
              type: FormReducerActionTypes.SET_SELECTED_DAYJS,
              payload,
            })
          }
        />
      </Box>
      <ScrollView
        contentContainerClassName="p-6 gap-y-2"
        showsVerticalScrollIndicator={false}
      >
        {timeArr.map((time) => {
          const match = TEMP_MATCHES[time.format("hh:mm a")];
          const hasMatch = !!match;
          return (
            <TouchableOpacity
              className={twMerge(
                hasMatch ? "bg-white shadow-sm shadow-gray-200" : "bg-gray-200",
                "p-4 rounded-full flex-row items-center"
              )}
              disabled={!hasMatch}
              key={time.toString()}
            >
              <Text
                className={twMerge(
                  hasMatch ? "text-typography-600" : "text-typography-400",
                  "text-center grow"
                )}
                size="md"
              >
                {time.format("hh:mm a")}
              </Text>
              {hasMatch && (
                <Avatar className="absolute right-2" size="sm">
                  <AvatarFallbackText>{match}</AvatarFallbackText>
                </Avatar>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
