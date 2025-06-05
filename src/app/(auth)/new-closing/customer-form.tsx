import ScreenEnd from "@/src/components/ScreenEnd";
import { Button, ButtonText } from "@/src/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/src/components/ui/form-control";
import { HStack } from "@/src/components/ui/hstack";
import { Input, InputField } from "@/src/components/ui/input";
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
import { Textarea, TextareaInput } from "@/src/components/ui/textarea";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/src/components/ui/toast";
import { VStack } from "@/src/components/ui/vstack";
import { US_STATES } from "@/src/constants/us-states";
import { useUserContext } from "@/src/contexts/user-context";
import { supabase } from "@/src/lib/supabase";
import { homApiFetch } from "@/src/utils/hom-api-fetch";
import { Tables } from "@/supabase";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { AlertCircleIcon, ChevronDown } from "lucide-react-native";
import { Fragment, useReducer } from "react";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

enum FormReducerActionTypes {
  SET_IS_SUBMITTING = "SET_IS_SUBMITTING",
  SET_INPUT_VALUE = "SET_INPUT_VALUE",
  SET_FORM_ERROR = "SET_FORM_ERROR",
}

type TFormReducerAction =
  | { type: FormReducerActionTypes.SET_IS_SUBMITTING; payload: boolean }
  | {
      type: FormReducerActionTypes.SET_INPUT_VALUE;
      payload: {
        input: string;
        value: string;
      };
    }
  | { type: FormReducerActionTypes.SET_FORM_ERROR; payload: string };

interface IFormReducerState
  extends Partial<Tables<"business_location_customers">> {
  error: string | null;
  isSubmitting: boolean;
  submitted: boolean;
}

function formReducer(
  state: IFormReducerState,
  action: TFormReducerAction
): IFormReducerState {
  switch (action.type) {
    case "SET_INPUT_VALUE":
      return {
        ...state,
        isSubmitting: false,
        [action.payload.input]: action.payload.value,
      };
    case "SET_IS_SUBMITTING":
      return {
        ...state,
        isSubmitting: action.payload,
        submitted: true,
      };
    case "SET_FORM_ERROR":
      return {
        ...state,
        error: action.payload,
        isSubmitting: false,
        submitted: true,
      };
    default:
      return state;
  }
}

function ScreenContent() {
  const params = useGlobalSearchParams();
  const { bottom } = useSafeAreaInsets();
  const { location, refreshData, profile } = useUserContext();
  const toast = useToast();
  const router = useRouter();
  const requiredFields: (keyof IFormReducerState)[] = [
    "full_name",
    "address",
    "city",
    "state",
    "postal_code",
  ];
  const [state, dispatch] = useReducer(formReducer, {
    address: "",
    city: "",
    disposition_status: "NEW",
    email: "",
    error: null,
    full_name: "",
    isSubmitting: false,
    lead_source: "setter",
    notes: "",
    postal_code: "",
    state: location.state || "",
    submitted: false,
  });

  const handleSubmit = async () => {
    dispatch({
      type: FormReducerActionTypes.SET_IS_SUBMITTING,
      payload: true,
    });
    if (!requiredFields.some((field) => state[field] === "")) {
      await supabase
        .from("business_location_customers")
        .insert({
          address: state.address,
          business_id: location.business_id,
          city: state.city,
          creator_id: profile.id,
          disposition_status: state.disposition_status,
          email: state.email,
          full_name: state.full_name,
          lead_source: state.lead_source,
          location_id: location.id,
          notes: state.notes,
          phone: state.phone,
          postal_code: state.postal_code,
          state: state.state,
        })
        .select("id")
        .single()
        .then(async ({ data: customer, error }) => {
          if (error) {
            return dispatch({
              type: FormReducerActionTypes.SET_FORM_ERROR,
              payload: error.message,
            });
          }

          const scheduleAppointmentBody = {
            appointment: {
              business_id: location.business_id,
              customer_id: customer.id,
              duration: params.duration,
              end_datetime: params.end_datetime,
              location_id: location.id,
              name: "Customer Meeting",
              start_datetime: params.start_datetime,
            },
            profiles: [
              {
                business_id: location.business_id,
                profile_id: params.closer_id,
              },
            ],
          };

          return homApiFetch({
            endpoint: `customers/${customer.id}/schedule-appointment`,
            options: {
              method: "POST",
              body: JSON.stringify(scheduleAppointmentBody),
            },
          })
            .then(refreshData)
            .then(() =>
              router.replace({
                pathname: "/customer/[customerId]",
                params: {
                  customerId: customer.id,
                },
              })
            )
            .then(() =>
              toast.show({
                id: "new-appointment-success",
                placement: "bottom",
                duration: 3000,
                render: () => {
                  return (
                    <Toast action="success">
                      <ToastTitle>Appointment created.</ToastTitle>
                      <ToastDescription>
                        Email confirmations have been sent.
                      </ToastDescription>
                    </Toast>
                  );
                },
              })
            )
            .catch((error) =>
              toast.show({
                id: "new-appointment-success",
                placement: "bottom",
                duration: 3000,
                render: () => {
                  return (
                    <Toast action="error">
                      <ToastTitle>Did not create appointment.</ToastTitle>
                      <ToastDescription>{error.message}</ToastDescription>
                    </Toast>
                  );
                },
              })
            )
            .finally(() =>
              dispatch({
                type: FormReducerActionTypes.SET_IS_SUBMITTING,
                payload: false,
              })
            );
        });
    }
  };
  return (
    <VStack space="lg">
      <FormControl isInvalid={state.submitted && !state.full_name} isRequired>
        <FormControlLabel>
          <FormControlLabelText>Full Name</FormControlLabelText>
        </FormControlLabel>
        <Input className="bg-background-50" variant="outline" size="md">
          <InputField
            autoComplete="off"
            autoCapitalize="none"
            onChangeText={(text) =>
              dispatch({
                type: FormReducerActionTypes.SET_INPUT_VALUE,
                payload: { input: "full_name", value: text },
              })
            }
            placeholder="John Doe"
          />
        </Input>
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>Full name is required</FormControlErrorText>
        </FormControlError>
      </FormControl>
      <FormControl isInvalid={state.submitted && !state.email} isRequired>
        <FormControlLabel>
          <FormControlLabelText>Email</FormControlLabelText>
        </FormControlLabel>
        <Input className="bg-background-50" variant="outline" size="md">
          <InputField
            autoComplete="off"
            autoCapitalize="none"
            onChangeText={(text) =>
              dispatch({
                type: FormReducerActionTypes.SET_INPUT_VALUE,
                payload: { input: "email", value: text },
              })
            }
            placeholder="johndoe@example.com"
          />
        </Input>
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText className="flex-1">
            Email is required
          </FormControlErrorText>
        </FormControlError>
      </FormControl>
      <FormControl>
        <FormControlLabel>
          <FormControlLabelText>Phone</FormControlLabelText>
        </FormControlLabel>
        <Input className="bg-background-50" variant="outline" size="md">
          <InputField
            autoComplete="off"
            autoCapitalize="none"
            onChangeText={(text) =>
              dispatch({
                type: FormReducerActionTypes.SET_INPUT_VALUE,
                payload: { input: "phone", value: text },
              })
            }
            placeholder="555-555-5555"
          />
        </Input>
      </FormControl>
      <FormControl isInvalid={state.submitted && !state.address} isRequired>
        <FormControlLabel>
          <FormControlLabelText>Address</FormControlLabelText>
        </FormControlLabel>
        <Input className="bg-background-50" variant="outline" size="md">
          <InputField
            autoComplete="off"
            autoCapitalize="none"
            onChangeText={(text) =>
              dispatch({
                type: FormReducerActionTypes.SET_INPUT_VALUE,
                payload: { input: "address", value: text },
              })
            }
            placeholder="1234 Fake St"
          />
        </Input>
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>Address is required</FormControlErrorText>
        </FormControlError>
      </FormControl>
      <FormControl isInvalid={state.submitted && !state.city} isRequired>
        <FormControlLabel>
          <FormControlLabelText>City</FormControlLabelText>
        </FormControlLabel>
        <Input className="bg-background-50" variant="outline" size="md">
          <InputField
            autoComplete="off"
            autoCapitalize="none"
            onChangeText={(text) =>
              dispatch({
                type: FormReducerActionTypes.SET_INPUT_VALUE,
                payload: { input: "city", value: text },
              })
            }
            placeholder="Los Angeles"
          />
        </Input>
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>City is required</FormControlErrorText>
        </FormControlError>
      </FormControl>
      <View className="flex-row gap-x-2">
        <FormControl
          className="basis-1/2"
          isInvalid={state.submitted && !state.state}
          isRequired
        >
          <FormControlLabel>
            <FormControlLabelText>State</FormControlLabelText>
          </FormControlLabel>
          <Select
            defaultValue={state.state}
            onValueChange={(payload) =>
              dispatch({
                type: FormReducerActionTypes.SET_INPUT_VALUE,
                payload: { input: "state", value: payload },
              })
            }
          >
            <SelectTrigger className="bg-background-50">
              <SelectInput placeholder="Select option" className="flex-1" />
              <SelectIcon className="mr-3" as={ChevronDown} />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent
                className="max-h-80"
                style={{ paddingBottom: bottom }}
              >
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator />
                </SelectDragIndicatorWrapper>
                <SelectSectionHeaderText>
                  Select a state
                </SelectSectionHeaderText>
                <ScrollView className="w-full">
                  {Object.entries(US_STATES).map(([value, label]) => (
                    <SelectItem key={value} label={label} value={value} />
                  ))}
                </ScrollView>
              </SelectContent>
            </SelectPortal>
          </Select>
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText>State is required</FormControlErrorText>
          </FormControlError>
        </FormControl>
        <FormControl
          className="basis-1/2"
          isInvalid={state.submitted && !state.postal_code}
          isRequired
        >
          <FormControlLabel>
            <FormControlLabelText>Postal Code</FormControlLabelText>
          </FormControlLabel>
          <Input className="bg-background-50" variant="outline">
            <InputField
              autoComplete="off"
              autoCapitalize="none"
              defaultValue={state.postal_code}
              onChangeText={(text) =>
                dispatch({
                  type: FormReducerActionTypes.SET_INPUT_VALUE,
                  payload: { input: "postal_code", value: text },
                })
              }
              placeholder="90650"
            />
          </Input>
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText className="flex-1">
              Postal Code is required
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
      </View>
      <FormControl>
        <FormControlLabel>
          <FormControlLabelText>Notes</FormControlLabelText>
        </FormControlLabel>
        <Textarea className="bg-background-50" size="md">
          <TextareaInput
            onChangeText={(text) =>
              dispatch({
                type: FormReducerActionTypes.SET_INPUT_VALUE,
                payload: { input: "notes", value: text },
              })
            }
            placeholder="Share notes that may be helpful"
          />
        </Textarea>
      </FormControl>
      <HStack space="md">
        <Button
          className="ml-auto"
          size="lg"
          action="secondary"
          onPress={router.back}
        >
          <ButtonText>Cancel</ButtonText>
        </Button>
        <Button
          disabled={state.isSubmitting}
          className="grow"
          size="lg"
          onPress={handleSubmit}
        >
          <ButtonText>
            {state.isSubmitting ? "Submitting..." : "Submit"}
          </ButtonText>
        </Button>
      </HStack>
    </VStack>
  );
}

export default function Screen() {
  return (
    <Fragment>
      <KeyboardAvoidingView behavior="padding">
        <ScrollView contentContainerClassName="gap-y-6 p-6">
          <ScreenContent />
          <ScreenEnd />
        </ScrollView>
      </KeyboardAvoidingView>
    </Fragment>
  );
}
