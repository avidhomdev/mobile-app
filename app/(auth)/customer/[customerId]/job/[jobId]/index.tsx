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
import { Actionsheet } from "@/components/ui/select/select-actionsheet";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { VStack } from "@/components/ui/vstack";
import { FRIENDLY_DATE_FORMAT } from "@/constants/date-formats";
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
  Blocks,
  Circle,
  CircleCheck,
  EllipsisVertical,
  EyeOff,
  File,
  HardHat,
  Image,
  ListOrdered,
  MessageCircle,
  PanelRightOpen,
  Plus,
  Timer,
  Trash,
} from "lucide-react-native";
import { Fragment, useCallback, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
    // await supabase
    //   .from("business_location_job_messages")
    //   .insert()
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
        <ActionsheetContent style={{ paddingBlockEnd: bottom }}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>
          <VStack className="w-full" space="lg">
            <FormControl isDisabled={isSubmitting} size="sm" className="w-full">
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
      </Actionsheet>
    </Fragment>
  );
}

function FabPlusMenu() {
  const { jobId } = useLocalSearchParams();
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
            jobId={Number(jobId)}
            refreshData={refreshData}
          />
          <ActionsheetItem
            onPress={() => {
              // router.push(`/customer/[customerId]/job/${job.id}`);
              handleCloseActionSheet();
            }}
          >
            <ActionsheetIcon
              as={CircleCheck}
              className="text-typography-500"
              size="lg"
            />
            <Box>
              <ActionsheetItemText className="text-typography-700">
                Task
              </ActionsheetItemText>
              <Text className="text-typography-500" sub>
                Stay on top of things to do with a task
              </Text>
            </Box>
          </ActionsheetItem>
          <FabPlusActionSheetNoteItem
            closeFabPlusMenu={handleCloseActionSheet}
            handleSubmitNoteToJob={async (note) => {
              await supabase
                .from("business_location_job_messages")
                .insert({
                  author_id: profile.id,
                  business_id: customer.business_id,
                  location_id: customer.location_id,
                  job_id: Number(jobId),
                  message: note,
                })
                .then(refreshData)
                .then(handleCloseActionSheet);
            }}
          />
        </ActionsheetContent>
      </Actionsheet>
    </Fragment>
  );
}

function TaskMenu() {
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
          <ActionsheetItem onPress={() => {}}>
            <ActionsheetIcon
              as={Plus}
              className="text-typography-500"
              size="lg"
            />
            <Box>
              <ActionsheetItemText className="text-typography-700">
                Add Task
              </ActionsheetItemText>
              <Text className="text-typography-500" sub>
                Stay on top of things to do with a new task
              </Text>
            </Box>
          </ActionsheetItem>
          <ActionsheetItem onPress={() => {}}>
            <ActionsheetIcon
              as={EyeOff}
              className="text-typography-500"
              size="lg"
            />
            <Box>
              <ActionsheetItemText className="text-typography-700">
                Hide Completed Tasks
              </ActionsheetItemText>
              <Text className="text-typography-500" sub>
                Show only the incomplete tasks
              </Text>
            </Box>
          </ActionsheetItem>
          <ActionsheetItem onPress={() => {}}>
            <ActionsheetIcon
              as={ListOrdered}
              className="text-typography-500"
              size="lg"
            />
            <Box>
              <ActionsheetItemText className="text-typography-700">
                Sort Tasks
              </ActionsheetItemText>
              <Text className="text-typography-500" sub>
                Change the order of tasks
              </Text>
            </Box>
          </ActionsheetItem>
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

function Tasks() {
  return (
    <Fragment>
      <View className="flex-row items-center gap-x-2">
        <Icon as={CircleCheck} className="text-typography-500" size="lg" />
        <View className="w-0.5 h-full bg-typography-100" />
        <View className="grow">
          <Heading size="md">Tasks</Heading>
          <Text size="xs">Stay on top of your job tasks</Text>
        </View>
        <TaskMenu />
      </View>
      <VStack space="sm">
        <HStack
          space="md"
          className="items-center bg-white p-2 px-4 rounded-lg flex-1"
        >
          <Pressable>
            <Icon as={Circle} className="text-typography-500" size="lg" />
          </Pressable>
          <Divider orientation="vertical" />
          <Box className="flex-1">
            <Text>Send Docusign Agreement</Text>
            <Text sub>
              Signed on:{" "}
              <Text bold italic sub>
                Not Signed
              </Text>
            </Text>
          </Box>
        </HStack>
        <HStack
          space="md"
          className="items-center bg-white p-2 px-4 rounded-lg flex-1"
        >
          <Pressable>
            <Icon as={Circle} className="text-typography-500" size="lg" />
          </Pressable>
          <Divider orientation="vertical" />
          <Box className="flex-1">
            <Text>Collect job deposit</Text>
            <Text sub>
              Deposit Collected:{" "}
              <Text bold italic sub>
                {formatAsCurrency(500)}
              </Text>
            </Text>
          </Box>
        </HStack>
        <HStack
          space="md"
          className="items-center bg-white p-2 px-4 rounded-lg flex-1"
        >
          <Pressable>
            <Icon as={CircleCheck} className="text-typography-600" size="lg" />
          </Pressable>
          <Divider orientation="vertical" />
          <Box className="flex-1">
            <Text>Schedule installation</Text>
            <Text sub>
              Starting on:{" "}
              <Text bold italic sub>
                12/12/2021
              </Text>
            </Text>
          </Box>
        </HStack>
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
    <Fragment>
      <HStack space="sm">
        <Card className="grow">
          <Text sub>Commission</Text>
          <Text size="xl">{formatAsCurrency(Number(job?.commission))}</Text>
        </Card>
        <Card className="w-1/3">
          <Text sub>Hours</Text>
          <Text size="xl">32</Text>
        </Card>
      </HStack>
      <HStack space="sm" reversed>
        <Card className="grow">
          <Text sub>Product Total</Text>
          <Text size="xl">
            {formatAsCurrency(Number(calculateJobProductsTotal()))}
          </Text>
        </Card>
        <Card className="w-1/3">
          <Text sub>Units</Text>
          <Text size="xl">{calculateJobProductUnitsTotal()}</Text>
        </Card>
      </HStack>
    </Fragment>
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
      <VStack space="sm">
        {job?.products.map((product, index) => (
          <Card key={index}>
            <HStack space="sm">
              <Text className="flex-1">{product.product.name}</Text>

              <Box>
                <Text className="text-right">
                  {`${product.number_of_units} ${product.product.unit}`}
                </Text>
                <Text className="text-right" sub>
                  {formatAsCurrency(Number(product.total_price))}
                </Text>
              </Box>
            </HStack>
          </Card>
        ))}
      </VStack>
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
      <FabPlusMenu />
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
        <Tasks />
        <Products job={job} />
        <Media job={job} />
        <Notes job={job} />
        <ScreenEnd />
      </ScrollView>
    </View>
  );
}
