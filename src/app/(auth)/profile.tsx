import ActionSheetUploader from "@/src/components/ActionSheetUploader";
import BackHeaderButton from "@/src/components/BackHeaderButton";
import ScreenEnd from "@/src/components/ScreenEnd";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button, ButtonText } from "@/src/components/ui/button";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/src/components/ui/form-control";
import { Heading } from "@/src/components/ui/heading";
import { Input, InputField } from "@/src/components/ui/input";
import { Text } from "@/src/components/ui/text";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/src/components/ui/toast";
import { VStack } from "@/src/components/ui/vstack";
import { useUserContext } from "@/src/contexts/user-context";
import { supabase } from "@/src/lib/supabase";
// import { useUserContext } from "@/src/contexts/user-context";
import { debounce } from "@/src/utils/debounce";
import { useRouter } from "expo-router";
import { useCallback, useReducer, useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

enum FormReducerActionType {
  SET_FULL_NAME = "SET_FULL_NAME",
  SET_AVATAR_URL = "SET_AVATAR_URL",
  SET_PHONE = "SET_PHONE",
  SET_IS_SUBMITTING = "SET_IS_SUBMITTING",
  SET_ERROR = "SET_ERROR",
}

interface IFormFields {
  id: string;
  avatar_url: string;
  full_name: string;
  phone: string;
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

interface ISetAvatarUrlAction {
  type: FormReducerActionType.SET_AVATAR_URL;
  payload: string;
}

interface ISetPhoneAction {
  type: FormReducerActionType.SET_PHONE;
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
  | ISetAvatarUrlAction
  | ISetPhoneAction
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
    case FormReducerActionType.SET_PHONE:
      return { ...state, fields: { ...state.fields, phone: action.payload } };
    case FormReducerActionType.SET_AVATAR_URL:
      return {
        ...state,
        fields: { ...state.fields, avatar_url: action.payload },
      };
    case FormReducerActionType.SET_IS_SUBMITTING:
      return { ...state, isSubmitting: action.payload };
    case FormReducerActionType.SET_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

function AvatarFormControl({
  dispatch,
  state,
}: {
  dispatch: React.Dispatch<TFormReducerAction>;
  state: IFormReducerState;
}) {
  const [isUploadVisible, setIsUploadVisible] = useState(false);

  return (
    <FormControl>
      <FormControlLabel>
        <FormControlLabelText>Avatar</FormControlLabelText>
      </FormControlLabel>

      <TouchableOpacity onPress={() => setIsUploadVisible(true)}>
        <Avatar className="bg-gray-700" size="xl">
          <AvatarFallbackText>{state.fields.full_name}</AvatarFallbackText>
          {state.fields.avatar_url && (
            <AvatarImage
              source={{
                uri: state.fields.avatar_url,
              }}
            />
          )}
        </Avatar>
      </TouchableOpacity>
      {isUploadVisible && (
        <ActionSheetUploader
          bucket="avatars"
          fileRootPath={state.fields.id}
          handleClose={() => setIsUploadVisible(false)}
          onUploadComplete={async (path) => {
            if (!path) return;

            const { data } = await supabase.storage
              .from("avatars")
              .getPublicUrl(path, {
                transform: {
                  width: 100,
                  height: 100,
                  resize: "fill",
                  quality: 100,
                },
              });

            dispatch({
              type: FormReducerActionType.SET_AVATAR_URL,
              payload: data.publicUrl,
            });
            setIsUploadVisible(false);
          }}
        />
      )}
    </FormControl>
  );
}

export default function Screen() {
  const toast = useToast();
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const { refreshData, profile } = useUserContext();
  const [state, dispatch] = useReducer(formReducer, {
    isSubmitting: false,
    error: null,
    fields: {
      id: profile.id,
      full_name: profile.full_name || "",
      phone: profile.phone || "",
      avatar_url: profile.avatar_url || "",
    },
  });

  const handleSave = useCallback(async () => {
    dispatch({ type: FormReducerActionType.SET_IS_SUBMITTING, payload: true });
    await supabase
      .from("profiles")
      .update(state.fields)
      .eq("id", profile.id)
      .then(({ error }) => {
        if (error)
          dispatch({
            type: FormReducerActionType.SET_ERROR,
            payload: error.message,
          });
      })
      .then(refreshData)
      .then(router.back)
      .then(() =>
        toast.show({
          id: "profile-update-success",
          placement: "bottom",
          duration: 3000,
          render: () => {
            return (
              <Toast action="success">
                <ToastTitle>Profile Updated.</ToastTitle>
                <ToastDescription>
                  Successfully updated your public profile.
                </ToastDescription>
              </Toast>
            );
          },
        })
      );
  }, [profile.id, refreshData, router.back, state.fields, toast]);

  return (
    <KeyboardAvoidingView behavior="padding">
      <ScrollView
        contentContainerClassName="px-6"
        contentContainerStyle={{ paddingTop: top }}
      >
        <VStack space="lg">
          <VStack>
            <BackHeaderButton />
            <Heading>Edit Profile</Heading>
            <Text size="sm">
              Manage your profile. This information is viewable by others.
            </Text>
          </VStack>
          <VStack space="md">
            <AvatarFormControl dispatch={dispatch} state={state} />
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
          </VStack>
          <Button onPress={handleSave} disabled={state.isSubmitting}>
            <ButtonText>Save</ButtonText>
          </Button>
        </VStack>
        <ScreenEnd />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
