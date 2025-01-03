import Button from "@/components/Button";
import Input from "@/components/Input";
import Text from "@/components/Text";
import { useUserContext } from "@/contexts/user-context";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useReducer } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";

type FormReducerActionTypes =
  | "SET_IS_SUBMITTING"
  | "SET_INPUT_VALUE"
  | "SET_FORM_ERROR";

interface IFormReducerAction {
  type: FormReducerActionTypes;
  payload: any;
}

interface IFormReducerState
  extends Partial<Tables<"business_location_customers">> {
  error: string | null;
  isSubmitting: boolean;
  submitted: boolean;
}

function formReducer(state: IFormReducerState, action: IFormReducerAction) {
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
  const { location, refreshData } = useUserContext();
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
    disposition_status: "new",
    email: "",
    error: null,
    full_name: "",
    isSubmitting: false,
    submitted: false,
    lead_source: "setter",
    notes: "",
    postal_code: "",
    state: "",
  });

  const handleSubmit = async () => {
    dispatch({
      type: "SET_IS_SUBMITTING",
      payload: true,
    });
    if (!requiredFields.some((field) => state[field] === "")) {
      await supabase
        .from("business_location_customers")
        .insert({
          business_id: location.business_id,
          location_id: location.id,
          full_name: state.full_name,
          address: state.address,
          city: state.city,
          state: state.state,
          postal_code: state.postal_code,
          lead_source: state.lead_source,
          notes: state.notes,
          disposition_status: state.disposition_status,
        })
        .then(async ({ error }) => {
          if (error)
            return dispatch({ type: "SET_FORM_ERROR", payload: error.message });

          await refreshData();
          router.back();
        });
    }
    dispatch({
      type: "SET_IS_SUBMITTING",
      payload: false,
    });
  };
  return (
    <ScrollView
      contentContainerClassName="gap-y-4"
      contentContainerStyle={{ paddingBottom: bottom * 2 }}
      stickyHeaderHiddenOnScroll
    >
      <View className="bg-gray-50 p-4 flex-row justify-between">
        <View>
          <Text variant="header">New Lead</Text>
          <Text variant="subheader">More information about the lead</Text>
        </View>
        <TouchableOpacity onPress={router.back}>
          <Ionicons name="close-circle-outline" size={32} />
        </TouchableOpacity>
      </View>
      <View
        className={twMerge(state.isSubmitting && "opacity-50", "gap-y-4 px-4")}
      >
        <View className="gap-y-2">
          <Text
            variant="label"
            className={twMerge(
              state.submitted && !state.full_name ? "text-red-600" : ""
            )}
          >
            {`Full name ${
              state.submitted && !state.full_name ? "is required" : ""
            }`}
          </Text>
          <Input
            autoCapitalize="none"
            className={twMerge(
              state.submitted && !state.full_name ? "border-red-300" : ""
            )}
            onChangeText={(text) =>
              dispatch({
                type: "SET_INPUT_VALUE" as FormReducerActionTypes,
                payload: { input: "full_name", value: text },
              })
            }
            placeholder="John Doe"
            readOnly={state.isSubmitting}
            value={state.full_name}
          />
        </View>
        <View className="gap-y-2">
          <Text variant="label">Email</Text>
          <Input
            autoCapitalize="none"
            onChangeText={(text) =>
              dispatch({
                type: "SET_INPUT_VALUE" as FormReducerActionTypes,
                payload: { input: "email", value: text },
              })
            }
            placeholder="email@example.com"
            readOnly={state.isSubmitting}
            value={state.email}
          />
        </View>
        <View className="gap-y-2">
          <Text
            variant="label"
            className={twMerge(
              state.submitted && !state.address ? "text-red-600" : ""
            )}
          >{`Address ${
            state.submitted && !state.address ? "is required" : ""
          }`}</Text>
          <Input
            autoCapitalize="none"
            className={twMerge(
              state.submitted && !state.address ? "border-red-300" : ""
            )}
            onChangeText={(text) =>
              dispatch({
                type: "SET_INPUT_VALUE" as FormReducerActionTypes,
                payload: { input: "address", value: text },
              })
            }
            placeholder="1234 Fake St"
            readOnly={state.isSubmitting}
            value={state.address ?? ""}
          />
        </View>
        <View className="gap-y-2">
          <Text
            variant="label"
            className={twMerge(
              state.submitted && !state.city ? "text-red-600" : ""
            )}
          >{`City ${
            state.submitted && !state.city ? "is required" : ""
          }`}</Text>
          <Input
            autoCapitalize="none"
            className={twMerge(
              state.submitted && !state.city ? "border-red-300" : ""
            )}
            onChangeText={(text) =>
              dispatch({
                type: "SET_INPUT_VALUE" as FormReducerActionTypes,
                payload: { input: "city", value: text },
              })
            }
            placeholder="City"
            readOnly={state.isSubmitting}
            value={state.city ?? ""}
          />
        </View>
        <View className="flex-row gap-x-2">
          <View className="gap-y-2 grow">
            <Text
              variant="label"
              className={twMerge(
                state.submitted && !state.state ? "text-red-600" : ""
              )}
            >{`State ${
              state.submitted && !state.state ? "is required" : ""
            }`}</Text>
            <Input
              autoCapitalize="none"
              className={twMerge(
                state.submitted && !state.state ? "border-red-300" : ""
              )}
              onChangeText={(text) =>
                dispatch({
                  type: "SET_INPUT_VALUE" as FormReducerActionTypes,
                  payload: { input: "state", value: text },
                })
              }
              placeholder="UT"
              readOnly={state.isSubmitting}
              value={state.state ?? ""}
            />
          </View>
          <View className="gap-y-2 grow">
            <Text
              variant="label"
              className={twMerge(
                state.submitted && !state.postal_code ? "text-red-600" : ""
              )}
            >{`Postal Code ${
              state.submitted && !state.postal_code ? "is required" : ""
            }`}</Text>
            <Input
              autoCapitalize="none"
              className={twMerge(
                state.submitted && !state.postal_code ? "border-red-300" : ""
              )}
              onChangeText={(text) =>
                dispatch({
                  type: "SET_INPUT_VALUE" as FormReducerActionTypes,
                  payload: { input: "postal_code", value: text },
                })
              }
              placeholder="UT"
              readOnly={state.isSubmitting}
              value={state.postal_code ?? ""}
            />
          </View>
        </View>
        <View className="gap-y-2">
          <Text variant="label">Notes</Text>
          <Input
            autoCapitalize="none"
            multiline
            numberOfLines={4}
            onChangeText={(text) =>
              dispatch({
                type: "SET_INPUT_VALUE" as FormReducerActionTypes,
                payload: { input: "notes", value: text },
              })
            }
            placeholder="notes"
          />
        </View>
        <Button
          disabled={state.isSubmitting}
          className={state.isSubmitting && "bg-gray-600"}
          size="lg"
          onPress={handleSubmit}
        >
          <Text className="font-bold text-white text-center">Submit</Text>
        </Button>
      </View>
      <View style={{ height: bottom }} />
    </ScrollView>
  );
}
