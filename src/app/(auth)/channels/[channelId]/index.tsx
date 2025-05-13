import BackHeaderButton from "@/src/components/BackHeaderButton";
import { ScreenSectionHeading } from "@/src/components/ScreenSectionHeading";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
} from "@/src/components/ui/actionsheet";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/src/components/ui/alert-dialog";
import {
  Avatar,
  AvatarFallbackText,
  AvatarGroup,
} from "@/src/components/ui/avatar";
import { Button, ButtonIcon, ButtonText } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Divider } from "@/src/components/ui/divider";
import { Heading } from "@/src/components/ui/heading";
import { HStack } from "@/src/components/ui/hstack";
import { Icon } from "@/src/components/ui/icon";
import { Text } from "@/src/components/ui/text";
import { Textarea, TextareaInput } from "@/src/components/ui/textarea";
import { VStack } from "@/src/components/ui/vstack";
import { useLocationContext } from "@/src/contexts/location-context";
import { useUserContext } from "@/src/contexts/user-context";
import { supabase } from "@/src/lib/supabase";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useGlobalSearchParams, useRouter } from "expo-router";
import { Plus, Send, Settings, Trash2 } from "lucide-react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";

dayjs.extend(relativeTime);

function NewAttachmentActionsheet() {
  const { bottom: paddingBlockEnd } = useSafeAreaInsets();
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false);
  const handleClose = () => setIsActionSheetVisible(false);

  return (
    <>
      <Button
        action="secondary"
        className="rounded-full aspect-square"
        onPress={() => setIsActionSheetVisible(true)}
      >
        <ButtonIcon as={Plus} />
      </Button>
      <Actionsheet isOpen={isActionSheetVisible} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent style={{ paddingBlockEnd }}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem>
            <ActionsheetItemText>Link job</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem>
            <ActionsheetItemText>Share customer</ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem>
            <ActionsheetItemText>Add photo</ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </>
  );
}

function NewMessageActionsheet() {
  const { profile, refreshData } = useUserContext();
  const { channelId } = useGlobalSearchParams();
  const { location } = useLocationContext();
  const [message, setMessage] = useState("");
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false);
  const handleClose = () => setIsActionSheetVisible(false);
  const { bottom: paddingBlockEnd } = useSafeAreaInsets();

  return (
    <>
      <HStack
        className="bg-background-light dark:bg-background-dark px-6 border-t border-background-200 pt-2"
        space="md"
        style={{ paddingBlockEnd }}
      >
        <NewAttachmentActionsheet />
        <Button
          action="secondary"
          className="grow justify-start px-3"
          onPress={() => setIsActionSheetVisible(true)}
          variant="outline"
        >
          <ButtonText>Write your message</ButtonText>
        </Button>
      </HStack>
      <Actionsheet isOpen={isActionSheetVisible} onClose={handleClose}>
        <ActionsheetBackdrop />
        <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={-25}>
          <ActionsheetContent style={{ paddingBlockEnd }}>
            <VStack className="w-full" space="sm">
              <ActionsheetDragIndicatorWrapper>
                <ActionsheetDragIndicator />
              </ActionsheetDragIndicatorWrapper>
              <Text>Write your message</Text>
              <Textarea>
                <TextareaInput autoFocus onChangeText={setMessage} />
              </Textarea>
              <HStack className="justify-end">
                <Button
                  action={message.length ? "primary" : "secondary"}
                  className={twMerge(message.length ? "" : "opacity-20")}
                  disabled={!message.length}
                  onPress={() =>
                    supabase
                      .from("business_location_channel_messages")
                      .insert({
                        business_id: location.business_id,
                        location_id: location.id,
                        channel_id: channelId,
                        message,
                        profile_id: profile.id,
                      })
                      .then(({ error }) => {
                        if (!error) {
                          setMessage("");
                          handleClose();
                          refreshData();
                        }
                      })
                  }
                  variant="link"
                >
                  <ButtonIcon as={Send} />
                </Button>
              </HStack>
            </VStack>
          </ActionsheetContent>
        </KeyboardAvoidingView>
      </Actionsheet>
    </>
  );
}

function ConfirmDeleteChannelMessage({ id }: { id: number }) {
  const { refreshData } = useUserContext();
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const handleClose = () => setIsAlertVisible(false);

  const handleDelete = useCallback(
    () =>
      supabase
        .from("business_location_channel_messages")
        .delete()
        .eq("id", id)
        .then(refreshData)
        .then(handleClose),
    [id, refreshData]
  );

  return (
    <>
      <AlertDialog isOpen={isAlertVisible} onClose={handleClose} size="md">
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="md">
              Are you sure you want to delete this message?
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <Text size="sm">
              Deleting the message will remove it permanently and cannot be
              undone. Please confirm if you want to proceed.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter className="">
            <Button
              variant="outline"
              action="secondary"
              onPress={handleClose}
              size="sm"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button size="sm" onPress={handleDelete}>
              <ButtonText>Delete</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Button
        action="negative"
        onPress={() => setIsAlertVisible(true)}
        size="xs"
      >
        <ButtonIcon as={Trash2} />
      </Button>
    </>
  );
}

export default function ChannelScreen() {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const { profile, refreshData } = useUserContext();
  const {
    location: { channels },
  } = useLocationContext();
  const { channelId } = useGlobalSearchParams();
  const channel = channels?.find((c) => c.id === Number(channelId));
  const { top } = useSafeAreaInsets();

  useEffect(() => {
    const businessLocationChannelMessages = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "business_location_channel_messages",
        },
        refreshData
      )
      .subscribe();

    return () => {
      businessLocationChannelMessages.unsubscribe();
    };
  }, [refreshData]);

  useEffect(() => {
    const ref = scrollViewRef.current;
    if (ref) ref.scrollToEnd({ animated: true });
  }, [channel?.messages]);

  if (!channel) {
    return <Text>No channel found.</Text>;
  }

  return (
    <VStack
      className="bg-background-light dark:bg-background-dark flex-1"
      style={{ paddingBlockStart: top }}
    >
      <VStack className="border-b border-background-200 px-6 pb-2" space="md">
        <HStack className="justify-between items-center">
          <BackHeaderButton
            onPress={() => router.push({ pathname: "/(auth)/(tabs)/channels" })}
          />
          <Icon as={Settings} className="text-typography-500" size="lg" />
        </HStack>
        <VStack>
          <ScreenSectionHeading
            heading={channel.name}
            subHeading={channel.description ?? ""}
          />
          <AvatarGroup>
            {channel.profiles.slice(0, 10).map((profile) => (
              <Avatar key={profile.profile_id} size="xs">
                <AvatarFallbackText>
                  {profile.profile.full_name}
                </AvatarFallbackText>
              </Avatar>
            ))}
          </AvatarGroup>
        </VStack>
      </VStack>
      <ScrollView
        ref={scrollViewRef}
        className="bg-background-100"
        contentContainerClassName="bg-background-100 p-4 z-0"
        showsVerticalScrollIndicator={false}
      >
        <VStack space="sm">
          {channel.messages.map((message) => (
            <Card key={message.id}>
              <VStack space="md">
                <Text>{message.message}</Text>
                <Divider />
                <HStack className="items-center" space="sm">
                  <Avatar size="xs">
                    <AvatarFallbackText>
                      {message.profile.full_name}
                    </AvatarFallbackText>
                  </Avatar>
                  <VStack>
                    <Text className="text-typography-700">
                      {message.profile.full_name}
                    </Text>
                    <Text size="xs">{dayjs(message.created_at).fromNow()}</Text>
                  </VStack>
                  {message.profile_id === profile.id && (
                    <HStack className="ml-auto">
                      <ConfirmDeleteChannelMessage id={message.id} />
                    </HStack>
                  )}
                </HStack>
              </VStack>
            </Card>
          ))}
        </VStack>
      </ScrollView>
      <NewMessageActionsheet />
    </VStack>
  );
}
