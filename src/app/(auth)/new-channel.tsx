import BackHeaderButton from "@/src/components/BackHeaderButton";
import ScreenEnd from "@/src/components/ScreenEnd";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetIcon,
  ActionsheetItem,
  ActionsheetItemText,
} from "@/src/components/ui/actionsheet";
import { Alert, AlertIcon, AlertText } from "@/src/components/ui/alert";
import { Avatar, AvatarFallbackText } from "@/src/components/ui/avatar";
import { Button, ButtonText } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Divider } from "@/src/components/ui/divider";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/src/components/ui/form-control";
import { Heading } from "@/src/components/ui/heading";
import { HStack } from "@/src/components/ui/hstack";
import { Icon } from "@/src/components/ui/icon";
import { Input, InputField } from "@/src/components/ui/input";
import { Text } from "@/src/components/ui/text";
import { Textarea, TextareaInput } from "@/src/components/ui/textarea";
import { VStack } from "@/src/components/ui/vstack";
import { useLocationContext } from "@/src/contexts/location-context";
import { useUserContext } from "@/src/contexts/user-context";
import { supabase } from "@/src/lib/supabase";
import { Tables } from "@/supabase";
import { useRouter } from "expo-router";
import {
  AlertCircleIcon,
  Construction,
  Info,
  Plus,
  Trash2,
  UserPlus2,
} from "lucide-react-native";
import { useReducer, useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function ScreenHeader() {
  return (
    <HStack className="items-center" space="md">
      <Icon as={Construction} className="text-typography-500" size="md" />
      <Divider orientation="vertical" />
      <VStack className="flex-1">
        <Heading size="md">New Channel</Heading>
        <Text size="xs">
          Start a new channel for conversation and invite participants.
        </Text>
      </VStack>
    </HStack>
  );
}

enum FormReducerActionTypes {
  SET_IS_SUBMITTING = "SET_IS_SUBMITTING",
  SET_INPUT_VALUE = "SET_INPUT_VALUE",
  SET_INVITED_PROFILES = "SET_INVITED_PROFILES",
  SET_FORM_ERROR = "SET_FORM_ERROR",
}

type SetInvitedProfilesAction = {
  type: FormReducerActionTypes.SET_INVITED_PROFILES;
  payload: string[];
};

type SetIsSubmittingAction = {
  type: FormReducerActionTypes.SET_IS_SUBMITTING;
  payload: boolean;
};

type SetInputValueAction = {
  type: FormReducerActionTypes.SET_INPUT_VALUE;
  payload: {
    input: string;
    value: string;
  };
};

type SetErrorAction = {
  type: FormReducerActionTypes.SET_FORM_ERROR;
  payload: string | null;
};

type TFormReducerAction =
  | SetIsSubmittingAction
  | SetInputValueAction
  | SetErrorAction
  | SetInvitedProfilesAction;

type FormFieldTypes = {
  name: string;
  description: string;
  profiles: string[];
};

type TFormReducerState = {
  fields: FormFieldTypes;
  isSubmitting: boolean;
  error: string | null;
  submitted: boolean;
};

function formReducer(
  state: TFormReducerState,
  action: TFormReducerAction
): TFormReducerState {
  switch (action.type) {
    case FormReducerActionTypes.SET_INVITED_PROFILES:
      return {
        ...state,
        fields: {
          ...state.fields,
          profiles: action.payload,
        },
        isSubmitting: false,
      };
    case FormReducerActionTypes.SET_INPUT_VALUE:
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.payload.input]: action.payload.value,
        },
        isSubmitting: false,
      };
    case FormReducerActionTypes.SET_IS_SUBMITTING:
      return {
        ...state,
        isSubmitting: action.payload,
        submitted: true,
      };
    case FormReducerActionTypes.SET_FORM_ERROR:
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

function InviteLocationProfiles({
  defaultProfiles,
  dispatch,
}: {
  defaultProfiles: string[];
  dispatch: React.Dispatch<TFormReducerAction>;
}) {
  const [selectedProfiles, setSelectedProfiles] =
    useState<string[]>(defaultProfiles);
  const { location } = useLocationContext();
  const { bottom: paddingBlockEnd } = useSafeAreaInsets();
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false);
  const handleClose = () => setIsActionSheetVisible(false);

  const user = useUserContext();
  const { profiles = [] } = location;

  return (
    <>
      <TouchableOpacity
        className="ml-auto bg-background-50 rounded-full p-1"
        onPress={() => setIsActionSheetVisible(true)}
      >
        <Icon as={Plus} className="text-typography-600 ml-auto" />
      </TouchableOpacity>
      <Actionsheet isOpen={isActionSheetVisible} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent className="gap-y-2" style={{ paddingBlockEnd }}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <Heading size="sm">Select profiles to invite</Heading>
          <ScrollView className="w-full" contentContainerClassName="gap-y-1">
            {profiles.flatMap((profile) => {
              if (profile.profile_id === user.profile.id) return [];
              return (
                <ActionsheetItem
                  className={
                    selectedProfiles.includes(profile.profile_id)
                      ? "bg-success-100"
                      : "bg-background-50"
                  }
                  key={profile.profile_id}
                  onPress={() => {
                    setSelectedProfiles((prevState) =>
                      prevState.includes(profile.profile_id)
                        ? prevState.filter(
                            (prevProfile) => prevProfile !== profile.profile_id
                          )
                        : [...prevState, profile.profile_id]
                    );
                  }}
                >
                  <ActionsheetIcon
                    as={UserPlus2}
                    className="text-typography-500"
                  />
                  <Avatar size="xs">
                    <AvatarFallbackText>
                      {profile.profile.full_name}
                    </AvatarFallbackText>
                  </Avatar>
                  <ActionsheetItemText className="text-typography-700">
                    {profile.profile.full_name}
                  </ActionsheetItemText>
                </ActionsheetItem>
              );
            })}
          </ScrollView>
          <Button
            className="self-end w-full"
            onPress={() => {
              dispatch({
                type: FormReducerActionTypes.SET_INVITED_PROFILES,
                payload: selectedProfiles,
              });
              handleClose();
            }}
          >
            <ButtonText>{`Invite (${selectedProfiles.length})`}</ButtonText>
          </Button>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
}

const useChannelForm = () => {
  const router = useRouter();
  const user = useUserContext();
  const { location } = useLocationContext();
  const [state, dispatch] = useReducer(formReducer, {
    error: null,
    fields: {
      name: "",
      description: "",
      profiles: [],
    },
    isSubmitting: false,
    submitted: false,
  });

  const onSubmit = async () => {
    dispatch({ type: FormReducerActionTypes.SET_IS_SUBMITTING, payload: true });
    const { profiles, ...channelInsertFields } = state.fields;

    const { data: channel, error } = await supabase
      .from("business_location_channels")
      .insert({
        business_id: location.business_id,
        location_id: location.id,
        creator_id: user.profile.id,
        ...channelInsertFields,
      })
      .select("id")
      .single();

    if (error) {
      return dispatch({
        type: FormReducerActionTypes.SET_FORM_ERROR,
        payload: error.message,
      });
    }

    return supabase
      .from("business_location_channel_profiles")
      .insert(
        [...profiles, user.profile.id].map((profile_id) => ({
          business_id: location.business_id,
          location_id: location.id,
          channel_id: channel.id,
          profile_id,
        }))
      )
      .then(({ error: profilesInsertError }) => {
        if (profilesInsertError) {
          dispatch({
            type: FormReducerActionTypes.SET_FORM_ERROR,
            payload: profilesInsertError.message,
          });
        }

        router.push({
          pathname: "/(auth)/channels/[channelId]",
          params: {
            channelId: channel.id,
          },
        });

        user.refreshData();

        return dispatch({
          type: FormReducerActionTypes.SET_IS_SUBMITTING,
          payload: false,
        });
      });
  };

  return {
    dispatch,
    onSubmit,
    state,
  };
};

function Form() {
  const { dispatch, onSubmit, state } = useChannelForm();
  const { profile } = useUserContext();
  const {
    location: { profiles },
  } = useLocationContext();

  const profileDictionary = (profiles ?? []).reduce<{
    [k: string]: Tables<"profiles">;
  }>((dictionary, profile) => {
    dictionary[profile.profile_id] = profile.profile;
    return dictionary;
  }, {});

  return (
    <VStack space="lg">
      {state.error && (
        <Alert action="error">
          <AlertIcon as={Info} />
          <AlertText>{state.error}</AlertText>
        </Alert>
      )}
      <VStack space="md">
        <Heading size="sm">Info</Heading>
        <FormControl
          isInvalid={state.submitted && !state.fields.name}
          isRequired
        >
          <FormControlLabel>
            <FormControlLabelText>Name</FormControlLabelText>
          </FormControlLabel>
          <Input className="bg-background-50" variant="outline" size="md">
            <InputField
              autoComplete="off"
              autoCapitalize="none"
              onChangeText={(text) =>
                dispatch({
                  type: FormReducerActionTypes.SET_INPUT_VALUE,
                  payload: { input: "name", value: text },
                })
              }
              placeholder="General Chat"
            />
          </Input>
          <FormControlError>
            <FormControlErrorIcon as={AlertCircleIcon} />
            <FormControlErrorText className="flex-1">
              Name is required
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
        <FormControl>
          <FormControlLabel>
            <FormControlLabelText>Description</FormControlLabelText>
          </FormControlLabel>
          <Textarea className="bg-background-50" size="md">
            <TextareaInput
              onChangeText={(text) =>
                dispatch({
                  type: FormReducerActionTypes.SET_INPUT_VALUE,
                  payload: { input: "description", value: text },
                })
              }
              placeholder="Start typing..."
            />
          </Textarea>
        </FormControl>
      </VStack>
      <VStack space="md">
        <HStack className="justify-between" space="md">
          <Heading size="sm">Invite</Heading>
          <InviteLocationProfiles
            dispatch={dispatch}
            defaultProfiles={state.fields.profiles}
          />
        </HStack>
        <VStack space="sm">
          <Card size="sm" variant="filled">
            <HStack className="items-center" space="md">
              <Avatar size="xs">
                <AvatarFallbackText>{profile.full_name}</AvatarFallbackText>
              </Avatar>
              <Text>{profile.full_name}</Text>
            </HStack>
          </Card>
          {state.fields.profiles.map((profile_id) => {
            const profile = profileDictionary[profile_id] ?? {};

            return (
              <Card key={profile_id} size="sm">
                <HStack className="items-center" space="md">
                  <Avatar size="xs">
                    <AvatarFallbackText>{profile.full_name}</AvatarFallbackText>
                  </Avatar>
                  <Text>{profile.full_name}</Text>
                  <TouchableOpacity
                    className="ml-auto bg-background-50 rounded-full p-1"
                    onPress={() =>
                      dispatch({
                        type: FormReducerActionTypes.SET_INVITED_PROFILES,
                        payload: state.fields.profiles.filter(
                          (fieldProfileId) => fieldProfileId !== profile_id
                        ),
                      })
                    }
                  >
                    <Icon as={Trash2} className="text-error-400 ml-auto" />
                  </TouchableOpacity>
                </HStack>
              </Card>
            );
          })}
        </VStack>
      </VStack>
      <Button disabled={state.isSubmitting} size="md" onPress={onSubmit}>
        <ButtonText>
          {state.isSubmitting ? "Creating..." : "Create Channel"}
        </ButtonText>
      </Button>
    </VStack>
  );
}

export default function NewChannel() {
  const { top } = useSafeAreaInsets();
  return (
    <VStack
      className="flex-1 px-6"
      space="md"
      style={{ paddingBlockStart: top }}
    >
      <BackHeaderButton />
      <ScreenHeader />
      <KeyboardAvoidingView behavior="padding" className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <Form />
          <ScreenEnd />
        </ScrollView>
      </KeyboardAvoidingView>
    </VStack>
  );
}
