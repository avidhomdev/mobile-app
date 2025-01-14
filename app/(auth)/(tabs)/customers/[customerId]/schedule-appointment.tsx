import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
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
import { Text } from "@/components/ui/text";
import { useUserContext } from "@/contexts/user-context";
import dayjs from "dayjs";
import { Calendar1Icon, ChevronDownIcon, Settings } from "lucide-react-native";
import { Fragment, useCallback, useReducer } from "react";
import { ScrollView, View } from "react-native";
import DatePicker from "react-native-date-picker";

import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { supabase } from "@/lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCustomerContext } from "@/contexts/customer-context";

enum FormReducerActionTypes {
  SET_CLOSER_ID = "SET_CLOSER_ID",
  SET_DURATION = "SET_DURATION",
  SET_IS_SUBMITTING = "SET_IS_SUBMITTING",
  SET_SELECTED_DAYJS = "SET_SELECTED_DAYJS",
  SET_START_DATETIME = "SET_START_DATETIME",
}

interface ISET_SELECTED_DAYS {
  type: FormReducerActionTypes.SET_SELECTED_DAYJS;
  payload: dayjs.Dayjs;
}

interface ISET_CLOSER_ID {
  type: FormReducerActionTypes.SET_CLOSER_ID;
  payload: string;
}

interface ISET_DURATION {
  type: FormReducerActionTypes.SET_DURATION;
  payload: string;
}

interface ISET_IS_SUBMITTING {
  type: FormReducerActionTypes.SET_IS_SUBMITTING;
  payload: boolean;
}

interface ISET_START_DATETIME {
  type: FormReducerActionTypes.SET_START_DATETIME;
  payload: dayjs.Dayjs | null;
}

type IFormReducerAction =
  | ISET_SELECTED_DAYS
  | ISET_CLOSER_ID
  | ISET_DURATION
  | ISET_IS_SUBMITTING
  | ISET_START_DATETIME;

interface IFormReducerState {
  fields: {
    closer_id: string;
    duration: number | string;
    end_datetime: dayjs.Dayjs | null;
    location_id: number | string;
    start_datetime: dayjs.Dayjs | null;
  };
  isSubmitting: boolean;
  selectedDayjs: dayjs.Dayjs;
}

function formReducer(
  prevState: IFormReducerState,
  action: IFormReducerAction
): IFormReducerState {
  const { start_datetime, duration } = prevState.fields;
  switch (action.type) {
    case "SET_SELECTED_DAYJS":
      return {
        ...prevState,
        selectedDayjs: action.payload,
      };
    case "SET_CLOSER_ID":
      return {
        ...prevState,
        fields: {
          ...prevState.fields,
          closer_id: action.payload,
          start_datetime: null,
          end_datetime: null,
        },
      };
    case "SET_DURATION":
      return {
        ...prevState,
        fields: {
          ...prevState.fields,
          duration: Number(action.payload),
          end_datetime:
            start_datetime &&
            start_datetime.add(Number(action.payload), "minutes"),
        },
      };
    case "SET_IS_SUBMITTING":
      return {
        ...prevState,
        isSubmitting: action.payload,
      };
    case "SET_START_DATETIME":
      return {
        ...prevState,
        fields: {
          ...prevState.fields,
          start_datetime: action.payload,
          end_datetime:
            action.payload && action.payload.add(Number(duration), "minutes"),
        },
      };
    default:
      return prevState;
  }
}

export default function ScheduleAppointmentScreen() {
  const params = useLocalSearchParams();
  const { updateCustomer } = useCustomerContext();
  const { closers, location, refreshData } = useUserContext();
  const router = useRouter();
  const [state, dispatch] = useReducer(formReducer, {
    fields: {
      closer_id: "",
      duration: 15,
      end_datetime: null,
      location_id: Number(location.id),
      start_datetime: null,
    },
    isSubmitting: false,
    selectedDayjs: dayjs(),
  });
  const { bottom } = useSafeAreaInsets();

  const handleSave = useCallback(async () => {
    if (state.isSubmitting) return;

    const insert = {
      business_id: location.business_id,
      location_id: location.id,
      name: "Customer Meeting",
      customer_id: params.customerId,
      duration: state.fields.duration,
      start_datetime: state.fields.start_datetime?.toISOString(),
      end_datetime: state.fields.end_datetime?.toISOString(),
    };

    return supabase
      .from("business_appointments")
      .insert(insert)
      .then(({ error }) => {
        if (error) throw error;

        return updateCustomer(Number(params.customerId), {
          disposition_status: "SCHEDULED",
        });
      })
      .then(refreshData)
      .then(() =>
        router.push({
          pathname:
            "/(auth)/(tabs)/customers/[customerId]/schedule-appointment-confirmation",
          params: {
            ...insert,
            closer_id: state.fields.closer_id,
            customerId: params.customerId as string,
          },
        })
      );
  }, [state.fields, state.isSubmitting]);

  return (
    <Fragment>
      <View className="p-4 bg-white">
        <Heading>Appointment</Heading>
        <Text className="sm text-typography-600">
          Schedule appointment for your customer
        </Text>
      </View>
      <ScrollView contentContainerClassName="gap-y-4">
        <View className="p-4 gap-y-4">
          <Card>
            <FormControl isRequired>
              <FormControlLabel>
                <FormControlLabelText size="md">
                  Select closer:
                </FormControlLabelText>
              </FormControlLabel>
              <Select
                onValueChange={(payload) =>
                  dispatch({
                    type: FormReducerActionTypes.SET_CLOSER_ID,
                    payload,
                  })
                }
              >
                <SelectTrigger>
                  <SelectInput placeholder="Select option" className="flex-1" />
                  <SelectIcon className="mr-3" as={ChevronDownIcon} />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent style={{ paddingBottom: bottom }}>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectSectionHeaderText>Closers</SelectSectionHeaderText>
                    {closers?.map((closer) => (
                      <SelectItem
                        key={closer.id}
                        label={closer.full_name ?? ""}
                        value={closer.id}
                      />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>
              <FormControlHelper>
                <FormControlHelperText>
                  You can only select one option
                </FormControlHelperText>
              </FormControlHelper>
            </FormControl>
          </Card>
          {state.fields.closer_id && (
            <Fragment>
              {state.fields.start_datetime ? (
                <Card>
                  <FormControl>
                    <FormControlLabel>
                      <FormControlLabelText size="md">
                        Appointment Start
                      </FormControlLabelText>
                    </FormControlLabel>
                    <View className="flex-row gap-x-2 items-center">
                      <Icon
                        as={Calendar1Icon}
                        className="text-typography-500"
                        size="lg"
                      />
                      <Text className="text-typography-700">
                        {state.fields.start_datetime.format(
                          "MM/DD/YYYY hh:mm a"
                        )}
                      </Text>
                      <Button
                        action="secondary"
                        className="ml-auto"
                        onPress={() =>
                          dispatch({
                            type: FormReducerActionTypes.SET_START_DATETIME,
                            payload: null,
                          })
                        }
                        size="sm"
                      >
                        <ButtonIcon as={Settings} />
                      </Button>
                    </View>
                  </FormControl>
                </Card>
              ) : (
                <DatePicker
                  date={new Date()}
                  minuteInterval={15}
                  modal
                  mode="datetime"
                  onConfirm={(payload) =>
                    dispatch({
                      type: FormReducerActionTypes.SET_START_DATETIME,
                      payload: dayjs(payload),
                    })
                  }
                  open
                />
              )}
            </Fragment>
          )}
          {state.fields.start_datetime && (
            <Card>
              <FormControl isRequired>
                <FormControlLabel>
                  <FormControlLabelText size="md">
                    Duration:
                  </FormControlLabelText>
                </FormControlLabel>
                <Select
                  defaultValue={state.fields.duration.toString()}
                  onValueChange={(payload) =>
                    dispatch({
                      type: FormReducerActionTypes.SET_DURATION,
                      payload,
                    })
                  }
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
                    <SelectContent style={{ paddingBottom: bottom }}>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <SelectSectionHeaderText>
                        Select the appointment duration
                      </SelectSectionHeaderText>
                      {Array.from({ length: 8 }, (_, num) => (
                        <SelectItem
                          key={num}
                          label={`${(num + 1) * 15} minutes`}
                          value={((num + 1) * 15).toString()}
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
            </Card>
          )}
          {state.fields.end_datetime && (
            <Card>
              <FormControl>
                <FormControlLabel>
                  <FormControlLabelText size="md">
                    Appointment End
                  </FormControlLabelText>
                </FormControlLabel>
                <View className="flex-row gap-x-2">
                  <Icon
                    as={Calendar1Icon}
                    className="text-typography-500"
                    size="lg"
                  />
                  <Text className="text-typography-700">
                    {state.fields.end_datetime.format("MM/DD/YYYY hh:mm a")}
                  </Text>
                </View>
              </FormControl>
            </Card>
          )}
        </View>
      </ScrollView>
      <View className="p-4">
        <Button onPress={handleSave}>
          <ButtonText>Save</ButtonText>
        </Button>
      </View>
    </Fragment>
  );
}
