import map from "@/assets/images/map.jpg";
import BackHeaderButton from "@/components/BackHeaderButton";
import ScreenEnd from "@/components/ScreenEnd";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetIcon,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetSectionHeaderText,
} from "@/components/ui/actionsheet";
import { Alert, AlertIcon, AlertText } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { DISPOSITION_STATUSES } from "@/constants/disposition_statuses";
import { useCustomerContext } from "@/contexts/customer-context";
import { formatAsCompactCurrency } from "@/utils/format-as-compact-currency";
import { formatAsCurrency } from "@/utils/format-as-currency";
import { useRouter } from "expo-router";
import {
  Calendar1,
  Construction,
  HardHat,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Settings,
} from "lucide-react-native";
import { Fragment, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function EmailButton() {
  const { customer } = useCustomerContext();
  const [isAlertDialogVisible, setIsAlertDialogVisible] = useState(false);
  const handleCloserAlertDialog = () => setIsAlertDialogVisible(false);
  const handleConfirm = () => {
    handleCloserAlertDialog();
  };
  return (
    <Fragment>
      <AlertDialog
        isOpen={isAlertDialogVisible}
        onClose={handleCloserAlertDialog}
        size="md"
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="md">
              Are you sure you want email to this customer?
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <Text size="sm">
              We will attempt to email the email linked to the account. Please
              verify this is correct.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={handleCloserAlertDialog}
              size="sm"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button size="sm" onPress={handleConfirm}>
              <ButtonText>Compose message</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Button
        action="secondary"
        disabled={!customer?.email}
        onPress={() => setIsAlertDialogVisible(true)}
        size="sm"
        variant="outline"
      >
        <ButtonIcon as={Mail} />
        <ButtonText>Email</ButtonText>
      </Button>
    </Fragment>
  );
}

function PhoneButton() {
  const { customer } = useCustomerContext();
  const [isAlertDialogVisible, setIsAlertDialogVisible] = useState(false);
  const handleCloserAlertDialog = () => setIsAlertDialogVisible(false);
  const handleConfirm = () => {
    handleCloserAlertDialog();
  };
  return (
    <Fragment>
      <AlertDialog
        isOpen={isAlertDialogVisible}
        onClose={handleCloserAlertDialog}
        size="md"
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="md">
              Are you sure you want call to this customer?
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <Text size="sm">
              We will attempt to call the phone number linked to the account.
              Please verify this is correct.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={handleCloserAlertDialog}
              size="sm"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button size="sm" onPress={handleConfirm}>
              <ButtonText>Call Now</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Button
        action="secondary"
        disabled={!customer?.phone}
        onPress={() => setIsAlertDialogVisible(true)}
        size="sm"
        variant="outline"
      >
        <ButtonIcon as={Phone} />
        <ButtonText>Call</ButtonText>
      </Button>
    </Fragment>
  );
}

function MapPinButton() {
  const [isAlertDialogVisible, setIsAlertDialogVisible] = useState(false);
  const handleCloserAlertDialog = () => setIsAlertDialogVisible(false);
  const handleConfirm = () => {
    handleCloserAlertDialog();
  };
  return (
    <Fragment>
      <Button
        action="secondary"
        onPress={() => setIsAlertDialogVisible(true)}
        size="sm"
        variant="outline"
      >
        <ButtonIcon as={MapPin} />
        <ButtonText>Map</ButtonText>
      </Button>
      <AlertDialog
        isOpen={isAlertDialogVisible}
        onClose={handleCloserAlertDialog}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="md">
              Are you sure you want directions to this customer?
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <Text size="sm">
              Directions to the customer are based off of the address linked to
              the account. Please verify this is correct.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={handleCloserAlertDialog}
              size="sm"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button size="sm" onPress={handleConfirm}>
              <ButtonText>Start Directions</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Fragment>
  );
}

function PlusButtonActionSheet() {
  const { bottom: paddingBlockEnd } = useSafeAreaInsets();
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false);
  const handleClose = () => setIsActionSheetVisible(false);
  const router = useRouter();

  return (
    <Fragment>
      <Button
        action="primary"
        className="rounded-full aspect-square"
        onPress={() => setIsActionSheetVisible(true)}
        size="xl"
      >
        <Icon as={Plus} className="text-typography-white" size="xl" />
      </Button>
      <Actionsheet isOpen={isActionSheetVisible} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent style={{ paddingBlockEnd }}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
            <ActionsheetSectionHeaderText>New</ActionsheetSectionHeaderText>
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem
            onPress={() => {
              router.push(`/customer/[customerId]/new-appointment`);
              handleClose();
            }}
          >
            <ActionsheetIcon as={Calendar1} className="text-typography-500" />
            <ActionsheetItemText className="text-typography-700">
              Appointment
            </ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem
            onPress={() => {
              router.push(`/customer/[customerId]/new-bid`);
              handleClose();
            }}
          >
            <ActionsheetIcon
              as={Construction}
              className="text-typography-500"
            />
            <ActionsheetItemText className="text-typography-700">
              Bid
            </ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem
            onPress={() => {
              router.push(`/customer/[customerId]/new-job`);
              handleClose();
            }}
          >
            <ActionsheetIcon as={HardHat} className="text-typography-500" />
            <ActionsheetItemText className="text-typography-700">
              Job
            </ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem
            onPress={() => {
              router.push(`/customer/[customerId]/notes`);
              handleClose();
            }}
          >
            <ActionsheetIcon
              as={MessageCircle}
              className="text-typography-500"
            />
            <ActionsheetItemText className="text-typography-700">
              Note
            </ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </Fragment>
  );
}

export default function Screen() {
  const { top, bottom } = useSafeAreaInsets();
  const router = useRouter();
  const { customer } = useCustomerContext();
  const customerDisposition = customer?.disposition_status
    ? DISPOSITION_STATUSES[customer.disposition_status]
    : DISPOSITION_STATUSES.NEW;

  return (
    <Fragment>
      <ScrollView contentContainerClassName="gap-y-6">
        <View
          className="flex-row items-center justify-between px-6"
          style={{ paddingBlockStart: top }}
        >
          <BackHeaderButton />
          <Pressable
            onPress={() =>
              router.push("/(auth)/customer/[customerId]/settings")
            }
          >
            <Icon as={Settings} className="text-typography-600" size="xl" />
          </Pressable>
        </View>
        <View className="h-72 aspect-video border-t-8 border-gray-500 border-b-8">
          <Image alt="Map" source={map} size="full" />
        </View>
        <View className="px-6">
          <Alert action="info">
            <AlertIcon as={Calendar1} />
            <AlertText>Upcoming appointment</AlertText>
          </Alert>
        </View>
        <View className="px-6">
          <View>
            <View>
              <Heading size="2xl">{customer?.full_name}</Heading>
              <Text size="sm">{customer?.address}</Text>
            </View>
          </View>
          {customerDisposition && (
            <View className="self-start mt-2">
              <Badge action={customerDisposition.action} size="lg">
                <BadgeIcon as={customerDisposition.icon} />
                <BadgeText>{customerDisposition.label}</BadgeText>
              </Badge>
            </View>
          )}
        </View>
        <View className="px-6 flex-row items-center gap-x-2">
          <MapPinButton />
          <PhoneButton />
          <EmailButton />
        </View>
        <View className="px-6 flex-row items-center gap-x-4">
          <Card className="grow" variant="filled">
            <Text size="xs">JOBS TOTAL</Text>
            <Text size="xl">{formatAsCurrency(0)}</Text>
          </Card>
          <Card variant="filled">
            <Text size="xs">BID TOTAL</Text>
            <Text size="xl">{formatAsCompactCurrency(0)}</Text>
          </Card>
        </View>
        <Divider className="w-[50%] mx-auto" />
        <View className="px-6">
          <View className="flex-row items-center gap-x-2">
            <Icon as={Calendar1} className="text-typography-500" size="lg" />
            <View className="w-0.5 h-full bg-typography-100" />
            <View>
              <Heading size="md">Appointments</Heading>
              <Text size="xs">Schedule appointments with the customer</Text>
            </View>
          </View>
          <View className="p-6 bg-gray-100 rounded border mt-6 border-gray-200 gap-y-2 items-center">
            <Text className="text-center">No appointments found.</Text>
            <Button
              action="secondary"
              onPress={() =>
                router.push(`/customer/[customerId]/new-appointment`)
              }
            >
              <ButtonIcon as={Calendar1} />
              <ButtonText>Add Appointment</ButtonText>
            </Button>
          </View>
        </View>
        <Divider className="w-[50%] mx-auto" />
        <View className="px-6">
          <View className="flex-row items-center gap-x-2">
            <Icon as={Construction} className="text-typography-500" size="lg" />
            <View className="w-0.5 h-full bg-typography-100" />
            <View>
              <Heading size="md">Bids</Heading>
              <Text size="xs">Create bids for the customer</Text>
            </View>
          </View>
          <View className="p-6 bg-gray-100 rounded border mt-6 border-gray-200 gap-y-2 items-center">
            <Text className="text-center">No bids found.</Text>
            <Button
              action="secondary"
              onPress={() => router.push(`/customer/[customerId]/new-bid`)}
            >
              <ButtonIcon as={Construction} />
              <ButtonText>Add Bid</ButtonText>
            </Button>
          </View>
        </View>
        <Divider className="w-[50%] mx-auto" />
        <View className="px-6">
          <View className="flex-row items-center gap-x-2">
            <Icon as={HardHat} className="text-typography-500" size="lg" />
            <View className="w-0.5 h-full bg-typography-100" />
            <View>
              <Heading size="md">Jobs</Heading>
              <Text size="xs">Create job for the customer</Text>
            </View>
          </View>
          <View className="p-6 bg-gray-100 rounded border mt-6 border-gray-200 gap-y-2 items-center">
            <Text className="text-center">No jobs found.</Text>
            <Button
              action="secondary"
              onPress={() => router.push(`/customer/[customerId]/new-job`)}
            >
              <ButtonIcon as={HardHat} />
              <ButtonText>Add Job</ButtonText>
            </Button>
          </View>
        </View>
        <ScreenEnd />
      </ScrollView>
      <View
        className="px-6 flex-row gap-x-1 justify-end items-center absolute right-0"
        style={{ bottom: bottom }}
      >
        {/* <MapPinButton />
        <PhoneButton />
        <EmailButton />
        <Button
          action="secondary"
          className="rounded-full aspect-square"
          onPress={() => router.push(`/customer/[customerId]/notes`)}
          size="xl"
        >
          <Icon as={MessageCircle} size="xl" />
        </Button> */}
        <PlusButtonActionSheet />
      </View>
    </Fragment>
  );
}
