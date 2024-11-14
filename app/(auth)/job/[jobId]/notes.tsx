import Input from "@/components/Input";
import Text from "@/components/Text";
import { useJobContext } from "@/contexts/job-context";
import { useUserContext } from "@/contexts/user-context";
import { supabase } from "@/lib/supabase";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router, useGlobalSearchParams } from "expo-router";
import { LegacyRef, useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";

function NewMessage() {
  const [isSending, setIsSending] = useState(false);
  const { profile } = useUserContext();
  const { job } = useJobContext();
  const inputRef = useRef<TextInput>(null);
  const [message, setMessage] = useState<string>();
  const insets = useSafeAreaInsets();

  const handleNewMessage = async () => {
    if (isSending) return;
    setIsSending(true);
    const insert = {
      business_id: job?.business_id,
      location_id: job?.business_location_id,
      job_id: job?.id,
      author_id: profile.id,
      message,
    };

    return supabase
      .from("business_location_job_messages")
      .insert(insert)
      .then(() => inputRef.current?.clear())
      .then(() => setIsSending(false));
  };

  return (
    <View className="bg-gray-800 p-6" style={{ paddingBottom: insets.bottom }}>
      <View className="relative">
        <Input
          editable={!isSending}
          multiline
          onChangeText={setMessage}
          onSubmitEditing={handleNewMessage}
          ref={inputRef}
          textAlignVertical="top"
          withSendIcon
        />
        <View className="absolute bottom-1 right-1">
          <TouchableOpacity
            className="bg-sky-600 rounded-full size-8 justify-center items-center"
            disabled={isSending}
            onPress={handleNewMessage}
          >
            <Ionicons name="arrow-up" color="white" size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function JobNotesScreen() {
  const flatListRef = useRef<FlatList>(null);
  const { jobId } = useGlobalSearchParams();
  const { profile } = useUserContext();
  const { job, refreshData } = useJobContext();

  const insets = useSafeAreaInsets();

  useEffect(() => {
    const channel = supabase
      .channel("job_message_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "business_location_job_messages",
          filter: `job_id=eq.${jobId}`,
        },
        refreshData
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [jobId, router, supabase]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View
        className="bg-gray-900 relative p-6 gap-y-2"
        style={{ paddingTop: insets.top }}
      >
        <TouchableOpacity
          className="flex-row items-center gap-x-2"
          onPress={router.back}
        >
          <FontAwesome name="chevron-left" size={20} color="white" />
          <Text className="text-white">Back</Text>
        </TouchableOpacity>

        <Text className="text-white" variant="headline">
          Notes
        </Text>
      </View>
      <FlatList
        contentContainerClassName="gap-y-6 py-6"
        data={job?.notes.toReversed()}
        ref={flatListRef}
        ListEmptyComponent={() => (
          <Text className="px-6">
            No notes found. Get started by composing a note below.
          </Text>
        )}
        renderItem={({ item: note }) => {
          const isAuthor = note.author_id === profile.id;
          return (
            <View
              key={note.id}
              className={twMerge(
                "gap-x-4 px-6",
                isAuthor ? "flex-row-reverse" : "flex-row "
              )}
            >
              <View
                className={twMerge(
                  isAuthor ? "bg-gray-200" : "bg-sky-600",
                  "size-12  rounded-full"
                )}
              />
              <View className="w-2/3 gap-y-1">
                <View
                  className={twMerge(
                    isAuthor ? "bg-gray-200" : "bg-sky-600",
                    " rounded shadow-sm p-3"
                  )}
                >
                  <Text className={twMerge(isAuthor ? "" : "text-white")}>
                    {note.message}
                  </Text>
                </View>
                <Text
                  className={twMerge(
                    isAuthor ? "text-right" : "",
                    "text-xs text-gray-400"
                  )}
                >
                  {new Date(note.created_at).toDateString()}
                </Text>
              </View>
            </View>
          );
        }}
        inverted
      />
      {/* <ScrollView
        contentContainerClassName="gap-y-6 py-6"
        showsVerticalScrollIndicator={false}
      >
        {job?.notes && job.notes.length > 0 ? (
          job.notes.map((note) => {
            const isAuthor = note.author_id === profile.id;
            return (
              <View
                key={note.id}
                className={twMerge(
                  "gap-x-4 px-6",
                  isAuthor ? "flex-row-reverse" : "flex-row "
                )}
              >
                <View
                  className={twMerge(
                    isAuthor ? "bg-gray-200" : "bg-sky-600",
                    "size-12  rounded-full"
                  )}
                />
                <View
                  className={twMerge(
                    isAuthor ? "bg-gray-200" : "bg-sky-600",
                    " rounded shadow-sm w-3/4 p-3"
                  )}
                >
                  <Text className={twMerge(isAuthor ? "" : "text-white")}>
                    {note.message}
                  </Text>
                </View>
              </View>
            );
          })
        ) : (
          <Text>No messages.</Text>
        )}
      </ScrollView> */}
      <NewMessage />
    </KeyboardAvoidingView>
  );
}
