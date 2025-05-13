import BackHeaderButton from "@/src/components/BackHeaderButton";
import ScreenEnd from "@/src/components/ScreenEnd";
import { Button, ButtonText } from "@/src/components/ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/src/components/ui/form-control";
import { Heading } from "@/src/components/ui/heading";
import { Input, InputField } from "@/src/components/ui/input";
import { Text } from "@/src/components/ui/text";
import { useCustomerContext } from "@/src/contexts/customer-context";
import { useUserContext } from "@/src/contexts/user-context";
import { debounce } from "@/src/utils/debounce";
import { useRouter } from "expo-router";
import { useCallback, useReducer } from "react";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

enum FormReducerActionType {
  SET_FULL_NAME = "SET_FULL_NAME",
  SET_EMAIL = "SET_EMAIL",
  SET_PHONE = "SET_PHONE",
  SET_ADDRESS = "SET_ADDRESS",
  SET_CITY = "SET_CITY",
  SET_STATE = "SET_STATE",
  SET_POSTAL_CODE = "SET_POSTAL_CODE",
  SET_IS_SUBMITTING = "SET_IS_SUBMITTING",
  SET_ERROR = "SET_ERROR",
}

interface IFormFields {
  address: string;
  city: string;
  email: string;
  full_name: string;
  phone: string;
  postal_code: string;
  state: string;
}

interface IFormReducerState {
  fields: IFormFields;
  isSubmitting: boolean;
  error: string | null;
}

interface ISetNameAction {
  type: FormReducerActionType.SET_FULL_NAME;
  payload: string;
}

interface ISetEmailAction {
  type: FormReducerActionType.SET_EMAIL;
  payload: string;
}

interface ISetPhoneAction {
  type: FormReducerActionType.SET_PHONE;
  payload: string;
}

interface ISetAddressAction {
  type: FormReducerActionType.SET_ADDRESS;
  payload: string;
}
interface ISetAddressAction {
  type: FormReducerActionType.SET_ADDRESS;
  payload: string;
}
interface ISetCityAction {
  type: FormReducerActionType.SET_CITY;
  payload: string;
}
interface ISetStateAction {
  type: FormReducerActionType.SET_STATE;
  payload: string;
}
interface ISetPostalCodeAction {
  type: FormReducerActionType.SET_POSTAL_CODE;
  payload: string;
}

interface ISetIsSubmittingAction {
  type: FormReducerActionType.SET_IS_SUBMITTING;
  payload: boolean;
}

interface ISetErrorAction {
  type: FormReducerActionType.SET_ERROR;
  payload: string | null;
}

type TFormReducerAction =
  | ISetNameAction
  | ISetEmailAction
  | ISetPhoneAction
  | ISetAddressAction
  | ISetCityAction
  | ISetStateAction
  | ISetPostalCodeAction
  | ISetIsSubmittingAction
  | ISetErrorAction;

function formReducer(
  state: IFormReducerState,
  action: TFormReducerAction
): IFormReducerState {
  switch (action.type) {
    case FormReducerActionType.SET_FULL_NAME:
      return {
        ...state,
        fields: { ...state.fields, full_name: action.payload },
      };
    case FormReducerActionType.SET_EMAIL:
      return { ...state, fields: { ...state.fields, email: action.payload } };
    case FormReducerActionType.SET_PHONE:
      return { ...state, fields: { ...state.fields, phone: action.payload } };
    case FormReducerActionType.SET_ADDRESS:
      return { ...state, fields: { ...state.fields, address: action.payload } };
    case FormReducerActionType.SET_CITY:
      return { ...state, fields: { ...state.fields, city: action.payload } };
    case FormReducerActionType.SET_STATE:
      return { ...state, fields: { ...state.fields, state: action.payload } };
    case FormReducerActionType.SET_POSTAL_CODE:
      return {
        ...state,
        fields: { ...state.fields, postal_code: action.payload },
      };
    case FormReducerActionType.SET_IS_SUBMITTING:
      return { ...state, isSubmitting: action.payload };
    case FormReducerActionType.SET_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export default function Screen() {
  const { top } = useSafeAreaInsets();
  const { refreshData } = useUserContext();
  const { customer, updateCustomer } = useCustomerContext();
  const router = useRouter();
  const [state, dispatch] = useReducer(formReducer, {
    isSubmitting: false,
    error: null,
    fields: {
      address: customer?.address ?? "",
      city: customer?.city ?? "",
      email: customer?.email ?? "",
      full_name: customer?.full_name ?? "",
      phone: customer?.phone ?? "",
      postal_code: customer?.postal_code ?? "",
      state: customer?.state ?? "",
    },
  });

  const handleSave = useCallback(async () => {
    if (!customer) return;
    dispatch({ type: FormReducerActionType.SET_IS_SUBMITTING, payload: true });

    return updateCustomer(customer.id, state.fields)
      .then(() =>
        dispatch({
          type: FormReducerActionType.SET_IS_SUBMITTING,
          payload: false,
        })
      )
      .then(refreshData)
      .then(router.back);
  }, [customer, updateCustomer, state.fields, refreshData, router.back]);

  return (
    <KeyboardAvoidingView behavior="padding">
      <ScrollView
        contentContainerClassName="gap-y-6 px-6"
        contentContainerStyle={{ paddingTop: top }}
      >
        <BackHeaderButton />
        <View>
          <Heading>Edit Customer</Heading>
          <Text size="sm">Manage generic customer information</Text>
        </View>
        <View className="gap-y-2">
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Full Name</FormControlLabelText>
            </FormControlLabel>
            <Input variant="outline" size="lg">
              <InputField
                autoCapitalize="none"
                autoComplete="off"
                defaultValue={state.fields.full_name}
                onChangeText={debounce(
                  (payload) =>
                    dispatch({
                      type: FormReducerActionType.SET_FULL_NAME,
                      payload,
                    }),
                  500
                )}
              />
            </Input>
          </FormControl>
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Phone</FormControlLabelText>
            </FormControlLabel>
            <Input variant="outline" size="lg">
              <InputField
                autoCapitalize="none"
                autoComplete="off"
                defaultValue={state.fields.phone}
                onChangeText={debounce(
                  (payload) =>
                    dispatch({
                      type: FormReducerActionType.SET_PHONE,
                      payload,
                    }),
                  500
                )}
              />
            </Input>
          </FormControl>
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Email</FormControlLabelText>
            </FormControlLabel>
            <Input variant="outline" size="lg">
              <InputField
                autoCapitalize="none"
                autoComplete="off"
                defaultValue={state.fields.email}
                onChangeText={debounce(
                  (payload) =>
                    dispatch({
                      type: FormReducerActionType.SET_EMAIL,
                      payload,
                    }),
                  500
                )}
              />
            </Input>
          </FormControl>
        </View>
        <View>
          <Heading>Location</Heading>
          <Text size="sm">Address is important for jobs and appointments</Text>
        </View>
        <View className="gap-y-2">
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Address</FormControlLabelText>
            </FormControlLabel>
            <Input size="lg">
              <InputField
                autoCapitalize="none"
                autoComplete="off"
                defaultValue={state.fields.address}
                onChangeText={debounce(
                  (payload) =>
                    dispatch({
                      type: FormReducerActionType.SET_ADDRESS,
                      payload,
                    }),
                  500
                )}
              />
            </Input>
          </FormControl>
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>City</FormControlLabelText>
            </FormControlLabel>
            <Input variant="outline" size="lg">
              <InputField
                autoCapitalize="none"
                autoComplete="off"
                defaultValue={state.fields.city}
                onChangeText={debounce(
                  (payload) =>
                    dispatch({
                      type: FormReducerActionType.SET_CITY,
                      payload,
                    }),
                  500
                )}
              />
            </Input>
          </FormControl>
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>State</FormControlLabelText>
            </FormControlLabel>
            <Input variant="outline" size="lg">
              <InputField
                autoCapitalize="none"
                autoComplete="off"
                defaultValue={state.fields.state}
                onChangeText={debounce(
                  (payload) =>
                    dispatch({
                      type: FormReducerActionType.SET_STATE,
                      payload,
                    }),
                  500
                )}
              />
            </Input>
          </FormControl>
          <FormControl>
            <FormControlLabel>
              <FormControlLabelText>Postal Code</FormControlLabelText>
            </FormControlLabel>
            <Input variant="outline" size="lg">
              <InputField
                autoCapitalize="none"
                autoComplete="off"
                defaultValue={state.fields.postal_code}
                onChangeText={debounce(
                  (payload) =>
                    dispatch({
                      type: FormReducerActionType.SET_POSTAL_CODE,
                      payload,
                    }),
                  500
                )}
              />
            </Input>
          </FormControl>
        </View>
        <Button onPress={handleSave} disabled={state.isSubmitting}>
          <ButtonText>Save</ButtonText>
        </Button>
        <ScreenEnd />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
