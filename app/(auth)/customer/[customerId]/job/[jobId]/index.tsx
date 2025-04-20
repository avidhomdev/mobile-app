import ActionSheetUpload from "@/components/ActionSheetUpload";
import BackHeaderButton from "@/components/BackHeaderButton";
import ScreenEnd from "@/components/ScreenEnd";
import SupabaseSignedImage from "@/components/SupabaseSignedImage";
import {
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
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Fab } from "@/components/ui/fab";
import {
  FormControl,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
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
} from "@/components/ui/select";
import { Actionsheet } from "@/components/ui/select/select-actionsheet";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { VStack } from "@/components/ui/vstack";
import {
  FRIENDLY_DATE_FORMAT,
  SERVER_DATE_FORMAT,
} from "@/constants/date-formats";
import { useCustomerContext } from "@/contexts/customer-context";
import {
  ILocationCustomer,
  ILocationJob,
  useUserContext,
} from "@/contexts/user-context";
import { supabase } from "@/lib/supabase";
import { formatAsCurrency } from "@/utils/format-as-currency";
import dayjs from "dayjs";
import {
  useGlobalSearchParams,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import {
  Banknote,
  Blocks,
  ChevronDown,
  Circle,
  CircleCheck,
  EllipsisVertical,
  EyeOff,
  File,
  HardHat,
  Image,
  Info,
  MessageCircle,
  PanelRightOpen,
  Plus,
  Timer,
  Trash,
} from "lucide-react-native";
import { Fragment, useCallback, useReducer, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";

function DeleteConfirmation({ handleClose }: { handleClose: () => void }) {
  const router = useRouter();
  const { customerId, jobId } = useGlobalSearchParams();
  const [isAlertDialogVisible, setIsAlertDialogVisible] = useState(false);
  const handleCloserAlertDialog = () => setIsAlertDialogVisible(false);
  const handleConfirmDelete = async () =>
    supabase
      .from("business_location_jobs")
      .delete()
      .eq("id", Number(jobId))
      .then(handleCloserAlertDialog)
      .then(handleClose)
      .then(() =>
        router.push({
          pathname: "/customer/[customerId]",
          params: { customerId: customerId as string },
        })
      );

  return (
    <Fragment>
      <Button
        action="negative"
        className="w-full gap-2"
        onPress={() => setIsAlertDialogVisible(true)}
        variant="outline"
      >
        <ButtonText className="text-red-600">Delete Job</ButtonText>
        <ButtonIcon as={Trash} />
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
              {`Are you sure you want to delete JOB-${Number(jobId)}?`}
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <Text size="sm">
              This action is irreversible and will delete all data related to
              this job.
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
            <Button action="negative" size="sm" onPress={handleConfirmDelete}>
              <ButtonText>Delete</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Fragment>
  );
}

function HeaderMenu() {
  const { top } = useSafeAreaInsets();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const { refreshData } = useUserContext();
  const router = useRouter();
  const { customerId, jobId } = useGlobalSearchParams();
  return (
    <Fragment>
      <Pressable onPress={() => setIsDrawerVisible(true)}>
        <Icon as={PanelRightOpen} className="text-typography-500" size="2xl" />
      </Pressable>
      <Drawer
        anchor="right"
        isOpen={isDrawerVisible}
        onClose={() => {
          setIsDrawerVisible(false);
        }}
      >
        <DrawerBackdrop />
        <DrawerContent
          className="w-[270px] md:w-[300px]"
          style={{ paddingBlockStart: top }}
        >
          <DrawerBody contentContainerClassName="gap-2">
            <Pressable
              className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md"
              onPress={() => {
                setIsDrawerVisible(false);
                router.push({
                  pathname: "/customer/[customerId]/job/[jobId]/payments",
                  params: {
                    customerId: customerId as string,
                    jobId: jobId as string,
                  },
                });
              }}
            >
              <Icon as={Banknote} size="lg" className="text-typography-600" />
              <Text>Payments</Text>
            </Pressable>
            <Pressable
              className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md"
              onPress={() => {
                setIsDrawerVisible(false);
                router.push({
                  pathname: "/customer/[customerId]/job/[jobId]/documents",
                  params: {
                    customerId: customerId as string,
                    jobId: jobId as string,
                  },
                });
              }}
            >
              <Icon as={File} size="lg" className="text-typography-600" />
              <Text>Documents</Text>
            </Pressable>
            <Pressable
              className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md"
              onPress={() => {
                setIsDrawerVisible(false);
                router.push({
                  pathname: "/customer/[customerId]/job/[jobId]/timesheet",
                  params: {
                    customerId: customerId as string,
                    jobId: jobId as string,
                  },
                });
              }}
            >
              <Icon as={Timer} size="lg" className="text-typography-600" />
              <Text>Timesheet</Text>
            </Pressable>
            <Pressable
              className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md"
              onPress={() => {
                setIsDrawerVisible(false);
                router.push({
                  pathname: "/customer/[customerId]/job/[jobId]/change-orders",
                  params: {
                    customerId: customerId as string,
                    jobId: jobId as string,
                  },
                });
              }}
            >
              <Icon as={HardHat} size="lg" className="text-typography-600" />
              <Text>Change Orders</Text>
            </Pressable>
            <Pressable
              className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md"
              onPress={() => {
                setIsDrawerVisible(false);
                router.push({
                  pathname: "/customer/[customerId]/job/[jobId]/schedule",
                  params: {
                    customerId: customerId as string,
                    jobId: jobId as string,
                  },
                });
              }}
            >
              <Icon as={HardHat} size="lg" className="text-typography-600" />
              <Text>Schedule</Text>
            </Pressable>
          </DrawerBody>
          <DrawerFooter>
            <DeleteConfirmation
              handleClose={() => {
                setIsDrawerVisible(false);
                refreshData();
              }}
            />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Fragment>
  );
}

function FabPlusActionSheetMediaItem({
  closeFabPlusMenu,
  customer,
  jobId,
  refreshData,
}: {
  closeFabPlusMenu: () => void;
  customer: ILocationCustomer;
  jobId: number;
  refreshData: () => void;
}) {
  const [isActionSheetVisible, setActionSheetVisible] = useState(false);

  const handleAttachingMediaToJob = useCallback(
    async (media: { id: string; path: string; fullPath: string }[]) => {
      const jobMediaInsert = media.map((m) => ({
        business_id: customer.business_id,
        location_id: customer.location_id,
        job_id: jobId,
        path: m.path,
        name: m.id,
      }));

      await supabase.from("business_location_job_media").insert(jobMediaInsert);
      refreshData();
      closeFabPlusMenu();
    },
    []
  );

  return (
    <Fragment>
      <ActionsheetItem onPress={() => setActionSheetVisible(true)}>
        <ActionsheetIcon as={Image} className="text-typography-500" size="lg" />
        <Box>
          <ActionsheetItemText className="text-typography-700">
            Media
          </ActionsheetItemText>
          <Text className="text-typography-500" sub>
            Attach a photo or video of the job
          </Text>
        </Box>
      </ActionsheetItem>
      <ActionSheetUpload
        filePath={`${customer.business_id}/locations/${customer.location_id}/customers/${customer.id}/jobs/${jobId}/media`}
        isVisible={isActionSheetVisible}
        setIsVisible={setActionSheetVisible}
        onUpload={handleAttachingMediaToJob}
      />
    </Fragment>
  );
}

function FabPlusActionSheetNoteItem({
  handleSubmitNoteToJob,
}: {
  closeFabPlusMenu: () => void;
  handleSubmitNoteToJob: (note: string) => Promise<void>;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [note, setNote] = useState("");
  const { bottom } = useSafeAreaInsets();
  const [isActionSheetVisible, setActionSheetVisible] = useState(false);
  const handleCloseActionSheet = () => setActionSheetVisible(false);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    await handleSubmitNoteToJob(note);
    setIsSubmitting(false);
  }, [note]);

  return (
    <Fragment>
      <ActionsheetItem
        onPress={() => {
          setActionSheetVisible(true);
        }}
      >
        <ActionsheetIcon
          as={MessageCircle}
          className="text-typography-500"
          size="lg"
        />
        <Box>
          <ActionsheetItemText className="text-typography-700">
            Notes
          </ActionsheetItemText>
          <Text className="text-typography-500" sub>
            Keep track of important notes
          </Text>
        </Box>
      </ActionsheetItem>
      <Actionsheet
        isOpen={isActionSheetVisible}
        onClose={handleCloseActionSheet}
      >
        <ActionsheetBackdrop />
        <KeyboardAvoidingView behavior="padding">
          <ActionsheetContent style={{ paddingBlockEnd: bottom }}>
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>
            <VStack className="w-full" space="lg">
              <FormControl
                isDisabled={isSubmitting}
                size="sm"
                className="w-full"
              >
                <FormControlLabel>
                  <FormControlLabelText>Take notes</FormControlLabelText>
                </FormControlLabel>
                <Textarea>
                  <TextareaInput
                    onChangeText={setNote}
                    placeholder="Once upon a time..."
                  />
                </Textarea>
                <FormControlHelper>
                  <FormControlHelperText>
                    These notes are shared to all who have access to the job
                  </FormControlHelperText>
                </FormControlHelper>
              </FormControl>
              <Button disabled={isSubmitting} onPress={handleSubmit}>
                <ButtonText>Submit</ButtonText>
              </Button>
            </VStack>
          </ActionsheetContent>
        </KeyboardAvoidingView>
      </Actionsheet>
    </Fragment>
  );
}

enum FormReducerActionType {
  SET_NAME = "SET_NAME",
  SET_TYPE = "SET_TYPE",
  SET_AMOUNT = "SET_AMOUNT",
  SUBMIT_FORM = "SUBMIT_FORM",
  SET_IS_SUBMITTING = "SET_IS_SUBMITTING",
  SET_ERROR = "SET_ERROR",
}

interface IFormFields {
  name: string;
  type: string;
  amount: number;
}

interface IFormReducerState {
  fields: IFormFields;
  isSubmitting: boolean;
  error: string | null;
  submitted: boolean;
}

interface ISetnameAction {
  type: FormReducerActionType.SET_NAME;
  payload: string;
}

interface ISetTypeAction {
  type: FormReducerActionType.SET_TYPE;
  payload: string;
}

interface ISetAmountAction {
  type: FormReducerActionType.SET_AMOUNT;
  payload: number;
}
interface ISetIsSubmittingAction {
  type: FormReducerActionType.SET_IS_SUBMITTING;
  payload: boolean;
}
interface ISubmitFormAction {
  type: FormReducerActionType.SUBMIT_FORM;
}

interface ISetErrorAction {
  type: FormReducerActionType.SET_ERROR;
  payload: string | null;
}

type TFormReducerAction =
  | ISetnameAction
  | ISetTypeAction
  | ISetAmountAction
  | ISetIsSubmittingAction
  | ISetErrorAction
  | ISubmitFormAction;

function newPaymentReducer(
  state: IFormReducerState,
  action: TFormReducerAction
): IFormReducerState {
  switch (action.type) {
    case FormReducerActionType.SET_NAME:
      return {
        ...state,
        error: null,
        fields: { ...state.fields, name: action.payload },
      };
    case FormReducerActionType.SET_TYPE:
      return {
        ...state,
        error: null,
        fields: { ...state.fields, type: action.payload },
      };
    case FormReducerActionType.SET_AMOUNT:
      return {
        ...state,
        error: null,
        fields: { ...state.fields, amount: action.payload },
      };
    case FormReducerActionType.SUBMIT_FORM:
      return { ...state, isSubmitting: true, submitted: true };
    case FormReducerActionType.SET_IS_SUBMITTING:
      return { ...state, isSubmitting: action.payload };
    case FormReducerActionType.SET_ERROR:
      return { ...state, error: action.payload, isSubmitting: false };
    default:
      return state;
  }
}

const paymentOptions = [
  {
    label: "Cash",
    value: "cash",
  },
  {
    label: "Check",
    value: "check",
  },
  {
    label: "Credit Card",
    value: "credit_card",
  },
];

function FabPlusActionSheetPaymentItem({
  customer,
  onSubmitCallback,
  job,
}: {
  customer: ILocationCustomer;
  onSubmitCallback: () => void;
  job: ILocationJob;
}) {
  const { bottom } = useSafeAreaInsets();

  const [
    {
      error,
      fields: { name, amount, type },
      isSubmitting,
      submitted,
    },
    dispatch,
  ] = useReducer(newPaymentReducer, {
    isSubmitting: false,
    error: null,
    submitted: false,
    fields: {
      name: "Deposit",
      type: "",
      amount: 500,
    },
  });

  const [isActionSheetVisible, setActionSheetVisible] = useState(false);
  const handleCloseActionSheet = () => setActionSheetVisible(false);

  const handleSubmit = useCallback(async () => {
    dispatch({ type: FormReducerActionType.SUBMIT_FORM });

    if (name === "")
      return dispatch({
        type: FormReducerActionType.SET_ERROR,
        payload: "Please enter a name",
      });

    if (type === "")
      return dispatch({
        type: FormReducerActionType.SET_ERROR,
        payload: "Please select a type",
      });

    if (amount <= 0)
      return dispatch({
        type: FormReducerActionType.SET_ERROR,
        payload: "Amount must be greater than 0",
      });

    if (type === "credit_card") {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!session || error) {
        return dispatch({
          type: FormReducerActionType.SET_ERROR,
          payload: error?.message || "No session found.",
        });
      }

      const invoiceResponse = await fetch(
        `${process.env.EXPO_PUBLIC_HOM_API_URL}/customers/${customer.id}/invoice`,
        {
          body: JSON.stringify({
            job_id: job.id,
            amount,
            name,
            type,
          }),
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            "Content-Type": "application/json",
          },
          method: "POST",
        }
      ).then((res) => res.json());

      if (invoiceResponse.error) {
        return dispatch({
          type: FormReducerActionType.SET_ERROR,
          payload: invoiceResponse.error,
        });
      }
    }

    const insertParams = {
      business_id: customer.business_id,
      location_id: customer.location_id,
      job_id: job.id,
      name: name,
      type: type,
      amount,
    };

    const { error } = await supabase
      .from("business_location_job_payments")
      .insert(insertParams);

    if (error) {
      return dispatch({
        type: FormReducerActionType.SET_ERROR,
        payload: error.message,
      });
    }

    dispatch({ type: FormReducerActionType.SET_IS_SUBMITTING, payload: false });
    onSubmitCallback();
  }, [name, amount, type, customer, job]);

  return (
    <Fragment>
      <ActionsheetItem
        onPress={() => {
          setActionSheetVisible(true);
        }}
      >
        <ActionsheetIcon
          as={Banknote}
          className="text-typography-500"
          size="lg"
        />
        <Box>
          <ActionsheetItemText className="text-typography-700">
            Payments
          </ActionsheetItemText>
          <Text className="text-typography-500" sub>
            Track cash, check or collect credit card payment
          </Text>
        </Box>
      </ActionsheetItem>
      <Actionsheet
        isOpen={isActionSheetVisible}
        onClose={handleCloseActionSheet}
      >
        <ActionsheetBackdrop />
        <KeyboardAvoidingView behavior="padding">
          <ActionsheetContent style={{ paddingBlockEnd: bottom }}>
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
              <ActionsheetSectionHeaderText>
                New Payment
              </ActionsheetSectionHeaderText>
            </ActionsheetDragIndicatorWrapper>
            <VStack className="w-full" space="lg">
              <FormControl
                isDisabled={isSubmitting}
                isInvalid={submitted && !name}
                isRequired
                size="sm"
                className="w-full"
              >
                <FormControlLabel>
                  <FormControlLabelText>name</FormControlLabelText>
                </FormControlLabel>
                <Input variant="outline" size="lg">
                  <InputField
                    onChangeText={(text) =>
                      dispatch({
                        type: FormReducerActionType.SET_NAME,
                        payload: text,
                      })
                    }
                    defaultValue={name}
                  />
                </Input>
              </FormControl>
              <FormControl
                isDisabled={isSubmitting}
                isInvalid={submitted && !type}
                isRequired
                size="sm"
                className="w-full"
              >
                <FormControlLabel>
                  <FormControlLabelText>Type</FormControlLabelText>
                </FormControlLabel>
                <Select
                  onValueChange={(payload) =>
                    dispatch({
                      type: FormReducerActionType.SET_TYPE,
                      payload,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectInput
                      placeholder="Select option"
                      className="flex-1"
                    />
                    <SelectIcon className="mr-3" as={ChevronDown} />
                  </SelectTrigger>
                  <SelectPortal>
                    <SelectBackdrop />
                    <SelectContent style={{ paddingBottom: bottom }}>
                      <SelectDragIndicatorWrapper>
                        <SelectDragIndicator />
                      </SelectDragIndicatorWrapper>
                      <SelectSectionHeaderText>
                        Select a payment type
                      </SelectSectionHeaderText>
                      {paymentOptions.map(({ label, value }) => (
                        <SelectItem key={value} label={label} value={value} />
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </FormControl>
              <FormControl
                isDisabled={isSubmitting}
                isInvalid={submitted && !amount}
                isRequired
                size="sm"
                className="w-full"
              >
                <FormControlLabel>
                  <FormControlLabelText>Amount</FormControlLabelText>
                </FormControlLabel>
                <Input variant="outline" size="lg">
                  <InputField
                    onChangeText={(text) =>
                      dispatch({
                        type: FormReducerActionType.SET_AMOUNT,
                        payload: Number(text),
                      })
                    }
                    keyboardType="numeric"
                    defaultValue={amount.toString()}
                  />
                </Input>
              </FormControl>
              {type === "credit_card" && (
                <VStack space="sm">
                  <VStack>
                    <Text size="xs">Credit Card Payment</Text>
                    <Text size="2xs">
                      We will send an email to the customer to complete the
                      payment.
                    </Text>
                  </VStack>
                  <Text italic>{customer.email || "No email found"}</Text>
                </VStack>
              )}
              {error && (
                <Alert action="error">
                  <AlertIcon as={Info} />
                  <AlertText>{error}</AlertText>
                </Alert>
              )}
              <Button
                disabled={isSubmitting || !customer.email}
                onPress={handleSubmit}
              >
                <ButtonText>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </ButtonText>
              </Button>
            </VStack>
          </ActionsheetContent>
        </KeyboardAvoidingView>
      </Actionsheet>
    </Fragment>
  );
}

function FabPlusMenu({ job }: { job: ILocationJob }) {
  const { bottom } = useSafeAreaInsets();
  const [isActionSheetVisible, setActionSheetVisible] = useState(false);
  const handleCloseActionSheet = () => setActionSheetVisible(false);
  const { customer } = useCustomerContext();
  const { profile, refreshData } = useUserContext();

  return (
    <Fragment>
      <Fab
        placement="bottom right"
        onPress={() => setActionSheetVisible(true)}
        size="lg"
        style={{ marginBlockEnd: bottom }}
      >
        <Icon as={Plus} className="text-white" size="2xl" />
      </Fab>
      <Actionsheet
        isOpen={isActionSheetVisible}
        onClose={handleCloseActionSheet}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent style={{ paddingBlockEnd: bottom }}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <FabPlusActionSheetMediaItem
            closeFabPlusMenu={handleCloseActionSheet}
            customer={customer}
            jobId={job.id}
            refreshData={refreshData}
          />
          <AddTaskMenuItem
            job={job}
            onSubmit={() => {
              refreshData();
              handleCloseActionSheet();
            }}
          />
          <FabPlusActionSheetNoteItem
            closeFabPlusMenu={handleCloseActionSheet}
            handleSubmitNoteToJob={async (note) => {
              await supabase
                .from("business_location_job_messages")
                .insert({
                  author_id: profile.id,
                  business_id: customer.business_id,
                  location_id: customer.location_id,
                  job_id: job.id,
                  message: note,
                })
                .then(refreshData)
                .then(handleCloseActionSheet);
            }}
          />
          <FabPlusActionSheetPaymentItem
            customer={customer}
            job={job}
            closeFabPlusMenu={handleCloseActionSheet}
            onSubmitCallback={() => {
              refreshData();
              handleCloseActionSheet();
            }}
          />
        </ActionsheetContent>
      </Actionsheet>
    </Fragment>
  );
}

function ProductsMenu() {
  const { bottom } = useSafeAreaInsets();
  const [isActionSheetVisible, setActionSheetVisible] = useState(false);
  const handleCloseActionSheet = () => setActionSheetVisible(false);
  return (
    <Fragment>
      <TouchableOpacity
        className="p-2 bg-gray-50 rounded"
        onPress={() => setActionSheetVisible(true)}
      >
        <Icon as={EllipsisVertical} size="lg" />
      </TouchableOpacity>
      <Actionsheet
        isOpen={isActionSheetVisible}
        onClose={handleCloseActionSheet}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent style={{ paddingBlockEnd: bottom }}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
            <ActionsheetSectionHeaderText>
              Products
            </ActionsheetSectionHeaderText>
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem onPress={() => {}}>
            <ActionsheetIcon
              as={Plus}
              className="text-typography-500"
              size="lg"
            />
            <Box>
              <ActionsheetItemText className="text-typography-700">
                Change Orders
              </ActionsheetItemText>
              <Text className="text-typography-500" sub>
                Adjust the current order products
              </Text>
            </Box>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </Fragment>
  );
}

function AddTaskMenuItem({
  job,
  onSubmit,
}: {
  job: ILocationJob;
  onSubmit: (task: string) => void;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [task, setTask] = useState("");
  const { bottom } = useSafeAreaInsets();
  const [isActionSheetVisible, setActionSheetVisible] = useState(false);
  const handleCloseActionSheet = () => setActionSheetVisible(false);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);

    const insert = {
      business_id: job.business_id,
      location_id: job.business_location_id,
      job_id: job.id,
      name: task,
      type: "checkbox",
    };
    await supabase.from("business_location_job_tasks").insert(insert);
    setIsSubmitting(false);
    onSubmit(task);
  }, [task]);

  return (
    <Fragment>
      <ActionsheetItem onPress={() => setActionSheetVisible(true)}>
        <ActionsheetIcon as={Plus} className="text-typography-500" size="lg" />
        <Box>
          <ActionsheetItemText className="text-typography-700">
            Add Task
          </ActionsheetItemText>
          <Text className="text-typography-500" sub>
            Stay on top of things to do with a new task
          </Text>
        </Box>
      </ActionsheetItem>
      <Actionsheet
        isOpen={isActionSheetVisible}
        onClose={handleCloseActionSheet}
      >
        <ActionsheetBackdrop />
        <KeyboardAvoidingView behavior="padding">
          <ActionsheetContent style={{ paddingBlockEnd: bottom }}>
            <ActionsheetDragIndicatorWrapper>
              <ActionsheetDragIndicator />
            </ActionsheetDragIndicatorWrapper>
            <VStack className="w-full" space="lg">
              <FormControl
                isDisabled={isSubmitting}
                size="sm"
                className="w-full"
              >
                <FormControlLabel>
                  <FormControlLabelText>Add Task</FormControlLabelText>
                </FormControlLabel>
                <Input variant="outline" size="lg">
                  <InputField
                    onChangeText={setTask}
                    placeholder="Send documents to customer"
                  />
                </Input>
              </FormControl>
              <Button disabled={isSubmitting} onPress={handleSubmit}>
                <ButtonText>Submit</ButtonText>
              </Button>
            </VStack>
          </ActionsheetContent>
        </KeyboardAvoidingView>
      </Actionsheet>
    </Fragment>
  );
}

function TaskMenu({
  isHidingCompleted,
  job,
  toggleCompleted,
}: {
  isHidingCompleted: boolean;
  job: ILocationJob;
  toggleCompleted: () => void;
}) {
  const { refreshData } = useUserContext();
  const { bottom } = useSafeAreaInsets();
  const [isActionSheetVisible, setActionSheetVisible] = useState(false);
  const handleCloseActionSheet = () => setActionSheetVisible(false);

  return (
    <Fragment>
      <TouchableOpacity
        className="p-2 bg-gray-50 rounded"
        onPress={() => setActionSheetVisible(true)}
      >
        <Icon as={EllipsisVertical} size="lg" />
      </TouchableOpacity>
      <Actionsheet
        isOpen={isActionSheetVisible}
        onClose={handleCloseActionSheet}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent style={{ paddingBlockEnd: bottom }}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
            <ActionsheetSectionHeaderText>Tasks</ActionsheetSectionHeaderText>
          </ActionsheetDragIndicatorWrapper>
          <AddTaskMenuItem
            job={job}
            onSubmit={() => {
              refreshData();
              handleCloseActionSheet();
            }}
          />
          <ActionsheetItem
            onPress={() => {
              toggleCompleted();
              handleCloseActionSheet();
            }}
          >
            <ActionsheetIcon
              as={EyeOff}
              className="text-typography-500"
              size="lg"
            />
            <Box>
              <ActionsheetItemText className="text-typography-700">
                {`${isHidingCompleted ? `Show` : `Hide`} Completed Tasks`}
              </ActionsheetItemText>
              <Text className="text-typography-500" sub>
                Show or hide only the complete tasks
              </Text>
            </Box>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </Fragment>
  );
}

function TaskItem({ task }: { task: ILocationJob["tasks"][0] }) {
  const [isToggling, setIsToggling] = useState(false);
  const { refreshData } = useUserContext();

  const toggleTaskCompletion = async () => {
    setIsToggling(true);
    await supabase
      .from("business_location_job_tasks")
      .update({
        complete: !task.complete,
        completed_date: !task.complete
          ? dayjs().format(SERVER_DATE_FORMAT)
          : null,
      })
      .eq("id", task.id)
      .then(refreshData)
      .then(() => setIsToggling(false));
  };

  return (
    <Pressable>
      <Card size="sm">
        <HStack space="md" className="items-center">
          <Box className="w-6">
            {isToggling ? (
              <ActivityIndicator />
            ) : (
              <TouchableOpacity onPress={toggleTaskCompletion}>
                <Icon
                  as={task.complete ? CircleCheck : Circle}
                  className={twMerge(
                    task.complete ? "text-green-500" : "text-gray-500"
                  )}
                  size="2xl"
                />
              </TouchableOpacity>
            )}
          </Box>
          <Divider orientation="vertical" />
          <Box className="flex-1">
            <Text>{task.name}</Text>
            <Text sub>
              Completed on:{" "}
              <Text bold italic sub>
                {task.completed_date
                  ? dayjs(task.completed_date).format(FRIENDLY_DATE_FORMAT)
                  : "Incomplete"}
              </Text>
            </Text>
          </Box>
        </HStack>
      </Card>
    </Pressable>
  );
}

function Tasks({ job }: { job: ILocationJob }) {
  const [isHidingCompleted, setIsHidingCompleted] = useState(false);
  const { tasks } = job;

  const filteredTasks = tasks
    .filter((task) => (isHidingCompleted ? !task.complete : true))
    .sort((a, b) => {
      const aComplete = a.complete ? 1 : 0;
      const bComplete = b.complete ? 1 : 0;
      return aComplete - bComplete;
    });

  const toggleCompleted = () => setIsHidingCompleted((prevState) => !prevState);

  return (
    <Fragment>
      <View className="flex-row items-center gap-x-2">
        <Icon as={CircleCheck} className="text-typography-500" size="lg" />
        <View className="w-0.5 h-full bg-typography-100" />
        <View className="grow">
          <Heading size="md">Tasks</Heading>
          <Text size="xs">Stay on top of your job tasks</Text>
        </View>
        <TaskMenu
          job={job}
          isHidingCompleted={isHidingCompleted}
          toggleCompleted={toggleCompleted}
        />
      </View>
      <VStack space="sm">
        {filteredTasks.length === 0 && (
          <Card variant="outline">
            <Text>No task found.</Text>
          </Card>
        )}
        {filteredTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </VStack>
    </Fragment>
  );
}

function Tiles({ job }: { job: ILocationJob }) {
  const calculateJobProductsTotal = () => {
    return job?.products.reduce((acc, product) => {
      return acc + Number(product.total_price);
    }, 0);
  };

  const calculateJobProductUnitsTotal = () => {
    return job?.products.reduce((acc, product) => {
      return acc + Number(product.number_of_units);
    }, 0);
  };
  return (
    <VStack space="sm">
      <HStack space="sm">
        <Card className="grow justify-center">
          <Text sub>Commission</Text>
          <Text size="2xl">{formatAsCurrency(Number(job?.commission))}</Text>
        </Card>
        <Card className="w-1/3">
          <Text sub>Hours</Text>
          <Text size="2xl">32</Text>
        </Card>
      </HStack>
      <HStack space="sm" reversed>
        <Card className="grow">
          <Text sub>Product Total</Text>
          <Text size="2xl">
            {formatAsCurrency(Number(calculateJobProductsTotal()))}
          </Text>
        </Card>
        <Card className="w-1/3">
          <Text sub>Payments Received</Text>
          <Text size="2xl">{calculateJobProductUnitsTotal()}</Text>
        </Card>
      </HStack>
    </VStack>
  );
}

function Products({ job }: { job: ILocationJob }) {
  return (
    <Fragment>
      <View className="flex-row items-center gap-x-2">
        <Icon as={Blocks} className="text-typography-500" size="lg" />
        <View className="w-0.5 h-full bg-typography-100" />
        <View className="grow">
          <Heading size="md">Products</Heading>
          <Text size="xs">Manage the products for this job.</Text>
        </View>
        <ProductsMenu />
      </View>
      {job.products.length === 0 ? (
        <Card variant="outline">
          <Text>No products found.</Text>
        </Card>
      ) : (
        <VStack space="sm">
          {job.products.map((product) => (
            <Card className="bg-white" key={product.id} size="sm">
              <VStack space="sm">
                <VStack>
                  <Text>{product.product.name}</Text>
                  <Text
                    sub
                  >{`Price is calculated per ${product.product.unit}`}</Text>
                </VStack>
                <Divider />
                <HStack className="justify-between">
                  <Text>{`${product.number_of_units} x ${product.product.unit}`}</Text>
                  <Text size="lg">
                    {formatAsCurrency(Number(product.total_price))}
                  </Text>
                </HStack>
              </VStack>
            </Card>
          ))}
        </VStack>
      )}
    </Fragment>
  );
}

function Media({ job }: { job: ILocationJob }) {
  return (
    <Fragment>
      <View className="flex-row items-center gap-x-2">
        <Icon as={Image} className="text-typography-500" size="lg" />
        <View className="w-0.5 h-full bg-typography-100" />
        <View>
          <Heading size="md">Media</Heading>
          <Text size="xs">Photos and videos of the job</Text>
        </View>
      </View>
      {job.media.length === 0 ? (
        <Card variant="outline">
          <Text>No media found.</Text>
        </Card>
      ) : (
        <ScrollView
          contentContainerClassName="gap-x-2"
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <HStack space="md">
            {job?.media.map((media, index) => (
              <Box key={index}>
                <SupabaseSignedImage path={media.path} size="xl" />
              </Box>
            ))}
          </HStack>
        </ScrollView>
      )}
    </Fragment>
  );
}

function Notes({ job }: { job: ILocationJob }) {
  return (
    <Fragment>
      <View className="flex-row items-center gap-x-2">
        <Icon as={MessageCircle} className="text-typography-500" size="lg" />
        <View className="w-0.5 h-full bg-typography-100" />
        <View>
          <Heading size="md">Notes</Heading>
          <Text size="xs">Notes on the job</Text>
        </View>
      </View>
      <VStack space="sm">
        {job.messages.length === 0 && (
          <Card variant="outline">
            <Text>No notes found.</Text>
          </Card>
        )}
        {job?.messages.toReversed().map((message) => {
          return (
            <Card key={message.id}>
              <VStack space="sm">
                <Text>{message.message}</Text>
                <HStack space="sm" className="items-center">
                  <Avatar size="xs">
                    <AvatarFallbackText>
                      {message.profile.full_name}
                    </AvatarFallbackText>
                  </Avatar>
                  <VStack>
                    <Text size="sm">{message.profile.full_name}</Text>
                    <Text sub>{`Posted: ${dayjs(message.created_at).format(
                      FRIENDLY_DATE_FORMAT
                    )}`}</Text>
                  </VStack>
                </HStack>
              </VStack>
            </Card>
          );
        })}
      </VStack>
    </Fragment>
  );
}

function Header({ job }: { job: ILocationJob }) {
  const { top } = useSafeAreaInsets();

  return (
    <HStack
      space="sm"
      className="p-4 bg-white items-center"
      style={{ paddingTop: top }}
    >
      <Box className="flex-1">
        <BackHeaderButton />
        <Heading size="xl">{`JOB-${job.id}`}</Heading>
      </Box>
      <HeaderMenu />
    </HStack>
  );
}

export default function Screen() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { refreshData } = useUserContext();
  const { jobId } = useLocalSearchParams();
  const { customer } = useCustomerContext();
  const job = customer.jobs.find((job) => job.id === Number(jobId));

  if (!job) return null;

  return (
    <View className="flex-1">
      <Header job={job} />
      <Divider />
      <FabPlusMenu job={job} />
      <ScrollView
        contentContainerClassName="gap-y-6 p-6"
        refreshControl={
          <RefreshControl
            onRefresh={async () => {
              setIsRefreshing(true);
              await refreshData();
              setIsRefreshing(false);
            }}
            refreshing={isRefreshing}
          />
        }
      >
        <Tiles job={job} />
        <Products job={job} />
        <Tasks job={job} />
        <Media job={job} />
        <Notes job={job} />
        <ScreenEnd />
      </ScrollView>
    </View>
  );
}
