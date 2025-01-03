import Button from "@/components/Button";
import Input from "@/components/Input";
import Text from "@/components/Text";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useReducer, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

enum FormReducerActionTypes {
  SET_IS_SUBMITTING = "SET_IS_SUBMITTING",
  SET_INPUT_VALUE = "SET_INPUT_VALUE",
}

interface IFormReducerAction {
  type: FormReducerActionTypes;
  payload: any;
}

interface IFormReducerState {
  isSubmitting: unknown;
}

function formReducer(state: IFormReducerState, action: IFormReducerAction) {
  switch (action.type) {
    case "SET_INPUT_VALUE":
      return {
        ...state,
        [action.payload.input]: action.payload.value,
      };
    case "SET_IS_SUBMITTING":
      return {
        ...state,
        isSubmitting: action.payload as boolean,
      };
    default:
      return state;
  }
}

export default function ModalScreen() {
  const [state, dipatch] = useReducer(formReducer, { isSubmitting: false });
  const { bottom } = useSafeAreaInsets();
  const router = useRouter();
  return (
    <ScrollView
      contentContainerClassName="gap-y-4"
      contentContainerStyle={{ paddingBottom: bottom * 2 }}
    >
      <View className="bg-gray-50 p-4 flex-row justify-between">
        <View>
          <Text variant="header">Add to Schedule</Text>
          <Text variant="subheader">Schedule appointment for your lead</Text>
        </View>
        <TouchableOpacity onPress={router.back}>
          <Ionicons name="close-circle-outline" size={32} />
        </TouchableOpacity>
      </View>
      <View className="gap-y-4 px-4">
        <View className="bg-white p-4 rounded border border-gray-100 flex-row items-center gap-x-2">
          <View className="size-10 rounded-full bg-gray-100" />
          <View>
            <Text>Name</Text>
            <Text variant="subheader">Closer</Text>
          </View>
          <TouchableOpacity className="ml-auto">
            <Ionicons name="refresh-circle-outline" size={32} color="gray" />
          </TouchableOpacity>
        </View>
        <View className="gap-y-2">
          <View className="flex-row justify-between items-center mb-2">
            <TouchableOpacity>
              <Ionicons name="chevron-back" size={24} />
            </TouchableOpacity>
            <Text>Jan 04, 2025</Text>
            <TouchableOpacity>
              <Ionicons name="chevron-forward" size={24} />
            </TouchableOpacity>
          </View>
          <View className="flex-row gap-x-1">
            <View className="rounded-full bg-gray-200 border border-gray-300 aspect-square grow items-center justify-center">
              <Text>01</Text>
            </View>
            <View className="rounded-full bg-gray-200 border border-gray-300 aspect-square grow items-center justify-center">
              <Text>02</Text>
            </View>
            <View className="rounded-full bg-gray-200 border border-gray-300 aspect-square grow items-center justify-center">
              <Text>03</Text>
            </View>
            <View className="rounded-full bg-primary-400 border border-primary-600 aspect-square grow items-center justify-center">
              <Text className="font-bold text-white">04</Text>
            </View>
            <View className="rounded-full bg-gray-200 border border-gray-300 aspect-square grow items-center justify-center">
              <Text>05</Text>
            </View>
            <View className="rounded-full bg-gray-200 border border-gray-300 aspect-square grow items-center justify-center">
              <Text>06</Text>
            </View>
            <View className="rounded-full bg-gray-200 border border-gray-300 aspect-square grow items-center justify-center">
              <Text>07</Text>
            </View>
          </View>
        </View>
      </View>
      <View className="gap-y-2 px-4">
        <Button variant="outline" size="lg">
          <Text className="text-gray-400">9:00 AM</Text>
        </Button>
        <Button variant="outline" size="lg">
          <Text className="text-gray-400">9:00 AM</Text>
        </Button>
        <Button variant="outline" size="lg">
          <Text className="text-gray-400">9:00 AM</Text>
        </Button>
        <Button variant="outline" size="lg">
          <Text className="text-gray-400">9:00 AM</Text>
        </Button>
        <Button variant="outline" size="lg">
          <Text>9:00 AM</Text>
        </Button>
        <Button variant="outline" size="lg">
          <Text>9:00 AM</Text>
        </Button>
        <Button variant="outline" size="lg">
          <Text>9:00 AM</Text>
        </Button>
        <Button variant="outline" size="lg">
          <Text>9:00 AM</Text>
        </Button>
        <Button variant="outline" size="lg">
          <Text>9:00 AM</Text>
        </Button>
        <Button variant="outline" size="lg">
          <Text>9:00 AM</Text>
        </Button>
        <Button variant="outline" size="lg">
          <Text>9:00 AM</Text>
        </Button>
        <Button variant="outline" size="lg">
          <Text>9:00 AM</Text>
        </Button>
        <Button variant="outline" size="lg">
          <Text>9:00 AM</Text>
        </Button>
        <Button variant="outline" size="lg">
          <Text>9:00 AM</Text>
        </Button>
        <Button variant="outline" size="lg">
          <Text>9:00 AM</Text>
        </Button>
        <Button variant="outline" size="lg">
          <Text className="text-gray-400">9:00 AM</Text>
        </Button>
        <Button variant="outline" size="lg">
          <Text className="text-gray-400">9:00 AM</Text>
        </Button>
        <Button variant="outline" size="lg">
          <Text className="text-gray-400">9:00 AM</Text>
        </Button>
      </View>
    </ScrollView>
  );
}
