import map from "@/assets/images/map.jpg";
import BackHeaderButton from "@/src/components/BackHeaderButton";
import { BidRequirementsList } from "@/src/components/BidRequirementsList";
import ScreenEnd from "@/src/components/ScreenEnd";
import SupabaseSignedImage from "@/src/components/SupabaseSignedImage";
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
} from "@/src/components/ui/actionsheet";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/src/components/ui/alert-dialog";
import { Badge, BadgeIcon, BadgeText } from "@/src/components/ui/badge";
import { Box } from "@/src/components/ui/box";
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  ButtonText,
} from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Divider } from "@/src/components/ui/divider";
import { Fab } from "@/src/components/ui/fab";
import {
  FormControl,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "@/src/components/ui/form-control";
import { Heading } from "@/src/components/ui/heading";
import { HStack } from "@/src/components/ui/hstack";
import { Icon } from "@/src/components/ui/icon";
import { Image } from "@/src/components/ui/image";
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
import { Text } from "@/src/components/ui/text";
import { Textarea, TextareaInput } from "@/src/components/ui/textarea";
import {
  Toast,
  ToastDescription,
  ToastTitle,
  useToast,
} from "@/src/components/ui/toast";
import { VStack } from "@/src/components/ui/vstack";
import {
  FRIENDLY_DATE_FORMAT,
  TIME_FORMAT,
} from "@/src/constants/date-formats";
import {
  DISPOSITION_STATUS_KEYS,
  DISPOSITION_STATUSES,
  getDispositionStatus,
} from "@/src/constants/disposition-statuses";
import { useCustomerContext } from "@/src/contexts/customer-context";
import { useLocationContext } from "@/src/contexts/location-context";
import {
  ILocationCustomer,
  ILocationCustomerBid,
  ILocationJob,
  useUserContext,
} from "@/src/contexts/user-context";
import { supabase } from "@/src/lib/supabase";
import { formatAsCompactCurrency } from "@/src/utils/format-as-compact-currency";
import { formatAsCurrency } from "@/src/utils/format-as-currency";
import { getBidRequirementsForJob } from "@/src/utils/get-bid-requirements-for-job";
import { homApiFetch } from "@/src/utils/hom-api-fetch";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import {
  Calendar1,
  CheckCircle,
  ChevronDownIcon,
  Circle,
  Construction,
  Ellipsis,
  Eye,
  HardHat,
  Info,
  LockIcon,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Settings,
  Trash,
  UserSearch,
} from "lucide-react-native";
import { Fragment, useCallback, useState, useTransition } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Linking,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";

function EmailButton() {
  const { customer } = useCustomerContext();
  const [isAlertDialogVisible, setIsAlertDialogVisible] = useState(false);
  const handleCloserAlertDialog = () => setIsAlertDialogVisible(false);
  const handleConfirm = () => {
    Linking.openURL(`mailto:${encodeURIComponent(customer.email!)}`);
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
            <Button className="grow" size="sm" onPress={handleConfirm}>
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
    Linking.openURL(`tel:${customer.phone}}`);
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
            <Button className="grow" size="sm" onPress={handleConfirm}>
              <ButtonText>Call Now</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Button
        action="secondary"
        onPress={() => setIsAlertDialogVisible(true)}
        size="sm"
      >
        <ButtonIcon as={Phone} />
        <ButtonText>Call</ButtonText>
      </Button>
    </Fragment>
  );
}

function MapPinButton() {
  const { customer } = useCustomerContext();
  const [isAlertDialogVisible, setIsAlertDialogVisible] = useState(false);
  const handleCloserAlertDialog = () => setIsAlertDialogVisible(false);
  const handleConfirm = () => {
    Linking.openURL(
      `maps://?daddr=${encodeURIComponent(
        `${customer.address}, ${customer.city}, ${customer.state}, ${customer.postal_code}`
      )}`
    );
    handleCloserAlertDialog();
  };
  return (
    <Fragment>
      <Button
        action="secondary"
        onPress={() => setIsAlertDialogVisible(true)}
        size="sm"
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
            <Button className="grow" size="sm" onPress={handleConfirm}>
              <ButtonText>Start Directions</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Fragment>
  );
}

function PlusButtonActionSheet() {
  const { bottom } = useSafeAreaInsets();
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false);
  const handleClose = () => setIsActionSheetVisible(false);
  const router = useRouter();

  return (
    <Fragment>
      <Fab
        onPress={() => setIsActionSheetVisible(true)}
        size="lg"
        placement="bottom right"
        style={{ marginBlockEnd: bottom }}
      >
        <Icon
          as={Plus}
          className="text-typography-white dark:text-typography-black"
          size="2xl"
        />
      </Fab>
      <Actionsheet isOpen={isActionSheetVisible} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent style={{ paddingBlockEnd: bottom }}>
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
              router.push(`/customer/[customerId]/bid/new`);
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

function CustomerDisposition() {
  const [isEditing, setIsEditing] = useState(false);
  const { bottom: paddingBlockEnd } = useSafeAreaInsets();
  const { customer, updateCustomer } = useCustomerContext();
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false);
  const handleClose = () => {
    setIsEditing(false);
    setIsActionSheetVisible(false);
  };

  const customerDisposition = customer?.disposition_status
    ? DISPOSITION_STATUSES[customer.disposition_status]
    : DISPOSITION_STATUSES.NEW;
  const { refreshData } = useUserContext();
  const [status, setStatus] = useState<DISPOSITION_STATUS_KEYS>(
    customer.disposition_status
  );
  const [notes, setNotes] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();
  const handleUpdate = (
    disposition_status: DISPOSITION_STATUS_KEYS | null,
    disposition_status_notes: string | null
  ) => {
    if (!disposition_status) return null;

    return () =>
      startSaving(() => {
        updateCustomer(Number(customer?.id), {
          disposition_status,
          disposition_status_notes,
        })
          .then(refreshData)
          .then(handleClose);
      });
  };
  const dispositionStatus = getDispositionStatus(customer.disposition_status);
  return (
    <Fragment>
      <Pressable className="grow" onPress={() => setIsActionSheetVisible(true)}>
        <Badge
          action={customerDisposition.action}
          size="lg"
          className="gap-x-1 justify-center"
        >
          <BadgeIcon as={customerDisposition.icon} />
          <BadgeText>{customerDisposition.label}</BadgeText>
        </Badge>
      </Pressable>

      <Actionsheet isOpen={isActionSheetVisible} onClose={handleClose}>
        <ActionsheetBackdrop />
        <KeyboardAvoidingView behavior="padding">
          <ActionsheetContent
            style={{ paddingBlockEnd: paddingBlockEnd * 1.5 }}
          >
            {isEditing ? (
              <>
                <ActionsheetDragIndicatorWrapper>
                  <ActionsheetDragIndicator />
                  <ActionsheetSectionHeaderText>
                    Change Status
                  </ActionsheetSectionHeaderText>
                </ActionsheetDragIndicatorWrapper>
                <VStack className="w-full" space="lg">
                  <FormControl isRequired>
                    <FormControlLabel>
                      <FormControlLabelText size="md">
                        Duration:
                      </FormControlLabelText>
                    </FormControlLabel>
                    <Select
                      defaultValue={status}
                      initialLabel={dispositionStatus.label}
                      isDisabled={isSaving}
                      onValueChange={(value) =>
                        setStatus(value as DISPOSITION_STATUS_KEYS)
                      }
                    >
                      <SelectTrigger>
                        <SelectInput
                          placeholder="Select option"
                          className="flex-1"
                        />
                        <SelectIcon className="mr-3" as={ChevronDownIcon} />
                      </SelectTrigger>
                      <SelectPortal>
                        <SelectBackdrop />
                        <SelectContent style={{ paddingBlockEnd }}>
                          <SelectDragIndicatorWrapper>
                            <SelectDragIndicator />
                          </SelectDragIndicatorWrapper>
                          <SelectSectionHeaderText>
                            Status
                          </SelectSectionHeaderText>
                          {Object.entries(DISPOSITION_STATUSES).map(
                            ([key, status]) => (
                              <SelectItem
                                key={key}
                                label={status.label}
                                value={key}
                              />
                            )
                          )}
                        </SelectContent>
                      </SelectPortal>
                    </Select>
                    <FormControlHelper>
                      <FormControlHelperText>
                        Select the new customer disposition status
                      </FormControlHelperText>
                    </FormControlHelper>
                  </FormControl>

                  <FormControl>
                    <FormControlLabel>
                      <FormControlLabelText>Notes</FormControlLabelText>
                    </FormControlLabel>
                    <Textarea size="lg">
                      <TextareaInput onChangeText={setNotes} />
                    </Textarea>
                  </FormControl>
                  <ButtonGroup flexDirection="row">
                    <Button
                      action="secondary"
                      disabled={isSaving}
                      onPress={() => setIsEditing(false)}
                    >
                      <ButtonText>Cancel</ButtonText>
                    </Button>
                    <Button
                      disabled={isSaving}
                      className="grow"
                      onPress={handleUpdate(status, notes)}
                    >
                      <ButtonText>{isSaving ? "Saving..." : "Save"}</ButtonText>
                    </Button>
                  </ButtonGroup>
                </VStack>
              </>
            ) : (
              <>
                <ActionsheetDragIndicatorWrapper>
                  <ActionsheetDragIndicator />
                  <ActionsheetSectionHeaderText>
                    Disposition Status
                  </ActionsheetSectionHeaderText>
                </ActionsheetDragIndicatorWrapper>
                <Pressable className="w-full">
                  <Card variant="outline">
                    <VStack space="md">
                      <Badge
                        className="self-start"
                        action={dispositionStatus.action}
                      >
                        <BadgeText>{dispositionStatus.label}</BadgeText>
                      </Badge>
                      <Text>
                        {customer.disposition_status_notes || "No notes"}
                      </Text>
                      <Button
                        action="secondary"
                        onPress={() => setIsEditing(true)}
                      >
                        <ButtonText>Change</ButtonText>
                      </Button>
                    </VStack>
                  </Card>
                </Pressable>
              </>
            )}
          </ActionsheetContent>
        </KeyboardAvoidingView>
      </Actionsheet>
    </Fragment>
  );
}

function ConvertBidToJobActionItem({
  bid,
  customer,
  handleCloseActionSheet,
}: {
  bid: ILocationCustomerBid;
  customer: ILocationCustomer;
  handleCloseActionSheet: () => void;
}) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const handleCloseDialog = () => setIsVisible(false);
  const toast = useToast();
  const handleStartBidToJob = async () =>
    homApiFetch({
      endpoint: `bid/${bid.id}/convert-to-job`,
      options: {
        method: "POST",
      },
    })
      .then(async (res) => {
        if (!res.job) return;
        handleCloseDialog();
        handleCloseActionSheet();
        router.push({
          pathname: `/(auth)/customer/[customerId]/job/[jobId]`,
          params: {
            customerId: customer.id,
            jobId: res.job.id,
          },
        });
        return toast.show({
          id: "new-job-success",
          placement: "bottom",
          duration: 3000,
          render: () => {
            return (
              <Toast action="success">
                <ToastTitle>Job created.</ToastTitle>
                <ToastDescription>Successfully created job.</ToastDescription>
              </Toast>
            );
          },
        });
      })
      .catch((err) =>
        toast.show({
          id: "new-job-error",
          placement: "bottom",
          duration: 3000,
          render: () => {
            return (
              <Toast action="error">
                <ToastTitle>Process failed.</ToastTitle>
                <ToastDescription>{err.message}</ToastDescription>
              </Toast>
            );
          },
        })
      );

  const bidRequirementsForJob = getBidRequirementsForJob(bid);
  const hasMetAllRequirementsForJob = Object.values(
    bidRequirementsForJob
  ).every((r) => r.value === true);

  return (
    <Fragment>
      <Card className="w-full" variant="filled">
        <VStack space="sm">
          <Heading className="" size="xs">
            JOB REQUIREMENTS
          </Heading>
          <BidRequirementsList requirements={bidRequirementsForJob} />
        </VStack>
      </Card>
      <AlertDialog isOpen={isVisible} onClose={handleCloseDialog} size="md">
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="md">
              Are you sure you want to convert this bid to a job?
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <Text size="sm">
              We will attempt to start this job. Please verify this is correct.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={handleCloseDialog}
              size="sm"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button className="grow" size="sm" onPress={handleStartBidToJob}>
              <ButtonText>Start</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <ActionsheetItem
        disabled={!hasMetAllRequirementsForJob}
        onPress={() => setIsVisible(true)}
      >
        <ActionsheetIcon
          as={HardHat}
          className={twMerge(
            hasMetAllRequirementsForJob
              ? "text-success-500"
              : "text-typography-500"
          )}
          size={hasMetAllRequirementsForJob ? "lg" : "sm"}
        />
        <ActionsheetItemText
          className={twMerge(
            hasMetAllRequirementsForJob
              ? "text-success-700 font-semibold"
              : "text-typography-700"
          )}
          size={hasMetAllRequirementsForJob ? "lg" : "sm"}
        >
          {`Start job${
            hasMetAllRequirementsForJob ? "" : " - Missing job requirements"
          }`}
        </ActionsheetItemText>
      </ActionsheetItem>
    </Fragment>
  );
}

function CustomerBidMenu({ bid }: { bid: ILocationCustomerBid }) {
  const { location } = useLocationContext();
  const { refreshData } = useUserContext();
  const { customer } = useCustomerContext();
  const { bottom: paddingBlockEnd } = useSafeAreaInsets();
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false);
  const [isAlertDialogVisible, setIsAlertDialogVisible] = useState(false);
  const handleCloserAlertDialog = () => setIsAlertDialogVisible(false);
  const handleClose = () => setIsActionSheetVisible(false);
  const handleConfirm = async () =>
    supabase
      .from("business_location_customer_bids")
      .delete()
      .eq("id", bid.id)
      .then(refreshData)
      .then(handleCloserAlertDialog)
      .then(handleClose);
  const router = useRouter();

  return (
    <Fragment>
      <Button
        action="secondary"
        onPress={() => setIsActionSheetVisible(true)}
        size="sm"
        variant="outline"
      >
        <ButtonIcon as={Ellipsis} />
      </Button>
      <AlertDialog
        isOpen={isAlertDialogVisible}
        onClose={handleCloserAlertDialog}
        size="md"
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="md">
              {`Are you sure you want to delete ${bid.name}?`}
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <Text size="sm">
              This action is irreversible and will delete all data related to
              this bid.
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
            <Button
              action="negative"
              className="grow"
              size="sm"
              onPress={handleConfirm}
            >
              <ButtonText>Delete</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Actionsheet isOpen={isActionSheetVisible} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent style={{ paddingBlockEnd }}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
            <ActionsheetSectionHeaderText>{`Manage ${bid.name}`}</ActionsheetSectionHeaderText>
          </ActionsheetDragIndicatorWrapper>
          {location.is_closer && (
            <ConvertBidToJobActionItem
              bid={bid}
              customer={customer}
              handleCloseActionSheet={() => {
                refreshData();
                handleClose();
              }}
            />
          )}
          <ActionsheetItem
            onPress={() => {
              router.push(`/customer/[customerId]/bid/${bid.id}`);
              handleClose();
            }}
          >
            <ActionsheetIcon as={Eye} className="text-typography-500" />
            <ActionsheetItemText className="text-typography-700">
              View
            </ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem
            onPress={() => {
              router.push(`/customer/[customerId]/bid/${bid.id}/edit`);
              handleClose();
            }}
          >
            <ActionsheetIcon as={Settings} className="text-typography-500" />
            <ActionsheetItemText className="text-typography-700">
              Edit
            </ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem onPress={() => setIsAlertDialogVisible(true)}>
            <ActionsheetIcon as={Trash} className="text-red-500" />
            <ActionsheetItemText className="text-red-700">
              Delete
            </ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </Fragment>
  );
}

function CustomerBid({ bid }: { bid: ILocationCustomerBid }) {
  const { customer } = useCustomerContext();
  const { location } = useLocationContext();
  const { refreshData } = useUserContext();
  const toast = useToast();
  const router = useRouter();
  const [isStarting, setIsStarting] = useState(false);

  const bidRequirementsForJob = getBidRequirementsForJob(bid);
  const hasMetAllRequirementsForJob = Object.values(
    bidRequirementsForJob
  ).every((r) => r.value === true);

  const handleStartJob = useCallback(async () => {
    if (isStarting) return;
    setIsStarting(true);

    return homApiFetch({
      endpoint: `bid/${bid.id}/convert-to-job`,
      options: {
        method: "POST",
      },
    })
      .then(async (res) => {
        await refreshData();
        router.push({
          pathname: "/customer/[customerId]/job/[jobId]",
          params: {
            customerId: customer.id,
            jobId: res.job.id,
          },
        });
        return toast.show({
          id: "new-job-success",
          placement: "bottom",
          duration: 3000,
          render: () => {
            return (
              <Toast action="success">
                <ToastTitle>Job created.</ToastTitle>
                <ToastDescription>Successfully created job.</ToastDescription>
              </Toast>
            );
          },
        });
      })
      .finally(() => {
        setIsStarting(false);
      })
      .catch((err) => {
        toast.show({
          id: "new-job-error",
          placement: "bottom",
          duration: 3000,
          render: () => {
            return (
              <Toast action="error">
                <ToastTitle>Process failed.</ToastTitle>
                <ToastDescription>{err.message}</ToastDescription>
              </Toast>
            );
          },
        });
      });
  }, [bid.id, customer.id, isStarting, refreshData, router, toast]);

  const BidWithRequirementsIcon = bid.converted_to_job_id
    ? HardHat
    : CheckCircle;
  const bidWithRequirementsIconColor = bid.converted_to_job_id
    ? "text-typography-800"
    : "text-success-600";

  return (
    <Card key={bid.id} className="border border-background-100 w-80">
      <VStack space="md">
        <HStack className="justify-between items-center">
          <HStack className="items-center" space="xs">
            <Icon
              className={twMerge(
                hasMetAllRequirementsForJob
                  ? bidWithRequirementsIconColor
                  : "text-typography-300"
              )}
              as={
                hasMetAllRequirementsForJob ? BidWithRequirementsIcon : Circle
              }
              size="xl"
            />
            <Text className="shrink" size="lg">
              {bid.name}
            </Text>
          </HStack>
          {location.is_closer && !bid.converted_to_job_id && (
            <CustomerBidMenu bid={bid} />
          )}
        </HStack>
        {bid.media.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="flex-row gap-x-2"
          >
            {bid.media.map((media) => (
              <SupabaseSignedImage key={media.id} path={media.path} size="xl" />
            ))}
          </ScrollView>
        ) : (
          <Box className="bg-warning-50 aspect-video justify-center items-center">
            <Text>No media found</Text>
          </Box>
        )}
        <Card variant="filled">
          <Text>{`${bid.products.length} products`}</Text>
        </Card>
        {bid.converted_to_job_id ? (
          <Button
            action="secondary"
            onPress={() => {
              router.push({
                pathname: "/customer/[customerId]/job/[jobId]",
                params: {
                  customerId: customer.id,
                  jobId: bid.converted_to_job_id!,
                },
              });
            }}
          >
            <ButtonText>View Job</ButtonText>
          </Button>
        ) : (
          <Button
            action={hasMetAllRequirementsForJob ? "primary" : "secondary"}
            className="grow"
            disabled={isStarting || !hasMetAllRequirementsForJob}
            onPress={handleStartJob}
            variant={hasMetAllRequirementsForJob ? "solid" : "outline"}
          >
            {isStarting ? (
              <ActivityIndicator size="small" />
            ) : (
              <ButtonIcon
                as={hasMetAllRequirementsForJob ? HardHat : LockIcon}
              />
            )}
            <ButtonText>
              {isStarting
                ? "Starting..."
                : hasMetAllRequirementsForJob
                ? "Start job"
                : "Missing job requirements"}
            </ButtonText>
          </Button>
        )}
      </VStack>
    </Card>
  );
}

function CustomerBids() {
  const router = useRouter();
  const { customer } = useCustomerContext();
  const { bids = [] } = customer ?? {};
  const hasBids = bids.length > 0;

  return (
    <VStack space="xl">
      <HStack className="items-center px-6" space="sm">
        <Icon as={Construction} className="text-typography-500" size="lg" />
        <Divider orientation="vertical" />
        <VStack>
          <Heading size="md">Bids</Heading>
          <Text className="text-typography-500" size="xs">
            Create bids for the customer
          </Text>
        </VStack>
      </HStack>
      {hasBids ? (
        <ScrollView
          contentContainerClassName="items-start gap-x-4 px-4"
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {bids
            .sort((a, b) => b.created_at.localeCompare(a.created_at))
            .map((bid) => {
              return <CustomerBid key={bid.id} bid={bid} />;
            })}
        </ScrollView>
      ) : (
        <Card className="mx-6" variant="filled">
          <VStack space="lg">
            <Text className="text-center">No bids found.</Text>
            <Button
              action="secondary"
              className="self-center"
              onPress={() => router.push(`/customer/[customerId]/bid/new`)}
            >
              <ButtonIcon as={Construction} />
              <ButtonText>Add Bid</ButtonText>
            </Button>
          </VStack>
        </Card>
      )}
    </VStack>
  );
}

function CustomerAppointments() {
  const [visibleNumberOfAppointments, setVisibleNumberOfAppointments] =
    useState(5);
  const { customer } = useCustomerContext();
  const router = useRouter();

  const { appointments } = customer;
  const slicedAppointments = appointments.slice(0, visibleNumberOfAppointments);
  const hasAppointments = appointments.length > 0;

  return (
    <VStack className="px-6" space="xl">
      <HStack className="items-center" space="sm">
        <Icon as={Calendar1} className="text-typography-500" size="lg" />
        <Divider orientation="vertical" />
        <VStack>
          <Heading size="md">Appointments</Heading>
          <Text className="text-typography-500" size="xs">
            Schedule appointments with the customer
          </Text>
        </VStack>
      </HStack>
      {hasAppointments ? (
        <VStack space="sm">
          {slicedAppointments
            .sort(
              (a, b) =>
                new Date(b.start_datetime).getTime() -
                new Date(a.start_datetime).getTime()
            )
            .map((appointment) => (
              <Card key={appointment.id} size="sm">
                <HStack className="items-center" space="md">
                  <Icon as={Calendar1} />
                  <Divider orientation="vertical" />
                  <VStack>
                    <Text>
                      {dayjs(appointment.start_datetime).format(
                        FRIENDLY_DATE_FORMAT
                      )}
                    </Text>
                    <Text className="text-typography-500" size="xs">
                      {`${dayjs(appointment.start_datetime).format(
                        TIME_FORMAT
                      )} - ${dayjs(appointment.end_datetime).format(
                        TIME_FORMAT
                      )}`}
                    </Text>
                  </VStack>
                </HStack>
              </Card>
            ))}

          {slicedAppointments.length < appointments.length && (
            <Button
              action="secondary"
              className="self-center mt-2"
              onPress={() =>
                setVisibleNumberOfAppointments((prevState) => prevState + 5)
              }
            >
              <ButtonText>Load More</ButtonText>
            </Button>
          )}
        </VStack>
      ) : (
        <Card variant="filled">
          <VStack space="lg">
            <Text className="text-center">No appointments found.</Text>
            <ButtonGroup className="justify-center" flexDirection="row">
              <Button
                action="secondary"
                onPress={() =>
                  router.push({
                    pathname: "/customer/[customerId]/schedule-closing",
                    params: {
                      customerId: customer.id,
                    },
                  })
                }
                size="sm"
              >
                <ButtonIcon as={Calendar1} />
                <ButtonText>Close</ButtonText>
              </Button>
              <Button
                action="secondary"
                onPress={() =>
                  router.push({
                    pathname: "/customer/[customerId]/new-appointment",
                    params: {
                      customerId: customer.id,
                    },
                  })
                }
                size="sm"
              >
                <ButtonIcon as={Calendar1} />
                <ButtonText>Meet</ButtonText>
              </Button>
            </ButtonGroup>
          </VStack>
        </Card>
      )}
    </VStack>
  );
}

function caculateJobTotal(job: ILocationJob) {
  const productsTotal = job.products.reduce((acc, product) => {
    return acc + Number(product.unit_price) * Number(product.number_of_units);
  }, 0);
  return productsTotal + job.commission;
}

function JobCard({ job }: { job: ILocationJob }) {
  const { location } = useLocationContext();
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false);
  const handleCloseActionSheet = () => setIsActionSheetVisible(false);

  const { completed, total } = job.tasks.reduce(
    (dictionary, task) => {
      dictionary.total++;

      if (task.complete) dictionary.completed++;

      return dictionary;
    },
    { completed: 0, total: 0 }
  );

  return (
    <Fragment>
      <Actionsheet
        isOpen={isActionSheetVisible}
        onClose={handleCloseActionSheet}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent style={{ paddingBottom: bottom }}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
            <ActionsheetSectionHeaderText>
              {job.full_name}
            </ActionsheetSectionHeaderText>
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem
            onPress={() => {
              router.push({
                pathname: "/customer/[customerId]/job/[jobId]",
                params: { customerId: job.customer_id!, jobId: job.id },
              });
              handleCloseActionSheet();
            }}
          >
            <ActionsheetIcon as={UserSearch} className="text-typography-500" />
            <ActionsheetItemText className="text-typography-700">
              View Job
            </ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
      <TouchableOpacity
        onLongPress={() => setIsActionSheetVisible(true)}
        onPress={() =>
          router.push({
            pathname: `/(auth)/customer/[customerId]/job/[jobId]`,
            params: {
              customerId: job.customer_id,
              jobId: job.id,
            },
          })
        }
      >
        <Card size="sm" variant="elevated">
          <HStack className="items-center justify-between">
            <VStack>
              <Text bold>{`JOB-${job.id} - ${job.full_name}`}</Text>
              <Text isTruncated size="xs">
                {`${job.address}, ${job.city} ${job.state} ${job.postal_code}`}
              </Text>
            </VStack>
            {location.is_closer && (
              <Badge action="info" variant="outline" size="lg">
                <BadgeText>{`${completed}/${total}`}</BadgeText>
              </Badge>
            )}
          </HStack>
        </Card>
      </TouchableOpacity>
    </Fragment>
  );
}

function CustomerJobs() {
  const [visibleNumberOfJobs, setVisibleNumberOfJobs] = useState(5);
  const { location } = useLocationContext();
  const { customer } = useCustomerContext();
  const { jobs } = customer;

  const sortedJobs = jobs.sort((a, b) =>
    b.created_at.localeCompare(a.created_at)
  );

  const slicedJobs = sortedJobs.slice(0, visibleNumberOfJobs);

  return (
    <VStack className="px-6" space="xl">
      <HStack className="items-center" space="sm">
        <Icon as={HardHat} className="text-typography-500" size="lg" />
        <Divider orientation="vertical" />
        <VStack>
          <Heading size="md">Jobs</Heading>
          <Text className="text-typography-500" size="xs">
            Create job for the customer
          </Text>
        </VStack>
      </HStack>

      {slicedJobs.length > 0 ? (
        <VStack space="sm">
          {slicedJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
          {slicedJobs.length < jobs.length && (
            <Button
              action="secondary"
              className="self-center mt-2"
              onPress={() =>
                setVisibleNumberOfJobs((prevState) => prevState + 5)
              }
            >
              <ButtonText>Load More</ButtonText>
            </Button>
          )}
        </VStack>
      ) : (
        <Card variant="filled">
          <Text className="text-center">
            {`No jobs found.${
              location.is_closer ? ` Start with a bid to begin a job` : ""
            }`}
          </Text>
        </Card>
      )}
    </VStack>
  );
}

export default function Screen() {
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const { customer } = useCustomerContext();
  const { location } = useLocationContext();
  const bidsTotal =
    customer?.bids.reduce((acc, bid) => {
      const bidTotal = bid.products.reduce((acc, product) => {
        return acc + Number(product.unit_price) * Number(product.units);
      }, 0);

      return acc + bidTotal + bid.commission;
    }, 0) ?? 0;

  const jobsTotal =
    customer?.jobs.reduce((acc, job) => {
      return acc + caculateJobTotal(job);
    }, 0) ?? 0;

  return (
    <Fragment>
      <HStack
        className="items-center border-b-8 border-gray-500 px-4 pb-4"
        space="lg"
        style={{ paddingBlockStart: top }}
      >
        <BackHeaderButton
          onPress={() => router.push(`/(auth)/(tabs)/customers`)}
        />
        <CustomerDisposition />
        <Pressable
          onPress={() => router.push("/(auth)/customer/[customerId]/info")}
        >
          <Icon as={Info} className="text-typography-600" size="xl" />
        </Pressable>
      </HStack>
      <ScrollView contentContainerClassName="gap-y-6">
        <View className="w-full aspect-video border-gray-500 border-b-8">
          <Image alt="Map" source={map} size="full" />
        </View>
        <VStack className="px-6" space="sm">
          <VStack>
            <Heading size="2xl">{customer?.full_name}</Heading>
            <Text size="sm">{customer?.address}</Text>
          </VStack>
          <HStack space="sm">
            {customer.address && <MapPinButton />}
            {customer.phone && <PhoneButton />}
            {customer.email && <EmailButton />}
          </HStack>
        </VStack>
        <HStack className="px-6 flex-row items-center" space="md">
          <Card className="grow">
            <Text size="xs">JOBS TOTAL</Text>
            <Text bold size="xl">
              {formatAsCurrency(jobsTotal)}
            </Text>
          </Card>
          <Card>
            <Text size="xs">BID TOTAL</Text>
            <Text bold size="xl">
              {formatAsCompactCurrency(bidsTotal)}
            </Text>
          </Card>
        </HStack>
        <Divider className="w-[50%] mx-auto" />
        <CustomerAppointments />
        <Divider className="w-[50%] mx-auto" />
        <CustomerJobs />
        {location.is_closer && (
          <>
            <Divider className="w-[50%] mx-auto" />
            <CustomerBids />
          </>
        )}
        <ScreenEnd />
      </ScrollView>
      {location.is_closer && <PlusButtonActionSheet />}
    </Fragment>
  );
}
