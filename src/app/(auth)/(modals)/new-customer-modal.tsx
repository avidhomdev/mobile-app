import { Button, ButtonText } from "@/src/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/src/components/ui/form-control";
import { CloseIcon, Icon } from "@/src/components/ui/icon";
import { Input, InputField } from "@/src/components/ui/input";
import { Text } from "@/src/components/ui/text";
import { Textarea, TextareaInput } from "@/src/components/ui/textarea";
import { useUserContext } from "@/src/contexts/user-context";
import { supabase } from "@/src/lib/supabase";
import { Tables } from "@/supabase";
import { useRouter } from "expo-router";
import { AlertCircleIcon } from "lucide-react-native";
import { useReducer } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";

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
        submitted: false,
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

export default function ModalScreen() {
  const { location, refreshData, profile } = useUserContext();
  const { bottom } = useSafeAreaInsets();
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
    state: "",
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

          await refreshData();
          router.back();
          router.push({
            pathname: "/customer/[customerId]/new-appointment",
            params: { customerId: customer.id },
          });
        });
    }

    dispatch({
      type: FormReducerActionTypes.SET_IS_SUBMITTING,
      payload: false,
    });
  };
  return (
    <KeyboardAvoidingView behavior="padding">
      <ScrollView
        contentContainerClassName="gap-y-4"
        contentContainerStyle={{ paddingBottom: bottom }}
        stickyHeaderHiddenOnScroll
      >
        <View className="bg-slate-800 p-4 flex-row justify-between">
          <View>
            <Text className="text-typography-white" size="xl">
              Getting started
            </Text>
            <Text className="text-typography-gray">
              Tell us more about yourself to continue
            </Text>
          </View>
          <TouchableOpacity onPress={router.back}>
            <Icon as={CloseIcon} className="text-white" size="xl" />
          </TouchableOpacity>
        </View>

        <View
          className={twMerge(
            state.isSubmitting && "opacity-50",
            "gap-y-6 px-6"
          )}
        >
          <FormControl
            isInvalid={state.submitted && !state.full_name}
            isRequired
          >
            <FormControlLabel>
              <FormControlLabelText>Full Name</FormControlLabelText>
            </FormControlLabel>
            <Input variant="outline" size="lg">
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
            <Input variant="outline" size="lg">
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
          </FormControl>
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Phone</FormControlLabelText>
            </FormControlLabel>
            <Input variant="outline" size="lg">
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
            <Input variant="outline" size="lg">
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
            <Input variant="outline" size="lg">
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
              <Input variant="outline" size="lg">
                <InputField
                  autoComplete="off"
                  autoCapitalize="none"
                  onChangeText={(text) =>
                    dispatch({
                      type: FormReducerActionTypes.SET_INPUT_VALUE,
                      payload: { input: "state", value: text },
                    })
                  }
                  placeholder="CA"
                />
              </Input>
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
              <Input variant="outline" size="lg">
                <InputField
                  autoComplete="off"
                  autoCapitalize="none"
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
                <FormControlErrorText>
                  Postal Code is required
                </FormControlErrorText>
              </FormControlError>
            </FormControl>
          </View>
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Notes</FormControlLabelText>
            </FormControlLabel>
            <Textarea size="md">
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

          <Button
            disabled={state.isSubmitting}
            size="lg"
            onPress={handleSubmit}
          >
            <ButtonText>Get Started</ButtonText>
          </Button>
        </View>
        <View style={{ height: bottom }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
