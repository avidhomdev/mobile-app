import map from "@/assets/images/map.jpg";
import BackHeaderButton from "@/components/BackHeaderButton";
import { BidRequirementsList } from "@/components/BidRequirementsList";
import ScreenEnd from "@/components/ScreenEnd";
import SupabaseSignedImage from "@/components/SupabaseSignedImage";
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
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Badge, BadgeIcon, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  ButtonText,
} from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { Fab } from "@/components/ui/fab";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { FRIENDLY_DATE_FORMAT, TIME_FORMAT } from "@/constants/date-formats";
import {
  DISPOSITION_STATUS_KEYS,
  DISPOSITION_STATUSES,
} from "@/constants/disposition-statuses";
import { useCustomerContext } from "@/contexts/customer-context";
import { useLocationContext } from "@/contexts/location-context";
import {
  ILocationCustomer,
  ILocationCustomerBid,
  ILocationJob,
  IProfile,
  useUserContext,
} from "@/contexts/user-context";
import { supabase } from "@/lib/supabase";
import { formatAsCompactCurrency } from "@/utils/format-as-compact-currency";
import { formatAsCurrency } from "@/utils/format-as-currency";
import { getBidRequirementsForJob } from "@/utils/get-bid-requirements-for-job";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import {
  Calendar1,
  CheckCircle,
  Circle,
  Construction,
  Ellipsis,
  Eye,
  HardHat,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
  Settings,
  Trash,
} from "lucide-react-native";
import { Fragment, useState } from "react";
import {
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
            <Button size="sm" onPress={handleConfirm}>
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
        <Icon as={Plus} className="text-white" size="2xl" />
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
  const { bottom: paddingBlockEnd } = useSafeAreaInsets();
  const { refreshData } = useUserContext();
  const { customer, updateCustomer } = useCustomerContext();
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false);
  const handleClose = () => setIsActionSheetVisible(false);
  const handleUpdate = (disposition_status: DISPOSITION_STATUS_KEYS) => () =>
    updateCustomer(Number(customer?.id), { disposition_status })
      .then(refreshData)
      .then(handleClose);
  const customerDisposition = customer?.disposition_status
    ? DISPOSITION_STATUSES[customer.disposition_status]
    : DISPOSITION_STATUSES.NEW;

  return (
    <Fragment>
      <Pressable
        className="ml-auto"
        onPress={() => setIsActionSheetVisible(true)}
      >
        <Badge
          action={customerDisposition.action}
          size="lg"
          className="gap-x-1"
        >
          <BadgeIcon as={customerDisposition.icon} />
          <BadgeText>{customerDisposition.label}</BadgeText>
        </Badge>
      </Pressable>

      <Actionsheet isOpen={isActionSheetVisible} onClose={handleClose}>
        <ActionsheetBackdrop />
        <ActionsheetContent style={{ paddingBlockEnd }}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
            <ActionsheetSectionHeaderText>
              Select a status
            </ActionsheetSectionHeaderText>
          </ActionsheetDragIndicatorWrapper>
          {Object.entries(DISPOSITION_STATUSES).map(([key, status]) => (
            <ActionsheetItem
              key={key}
              onPress={handleUpdate(key as DISPOSITION_STATUS_KEYS)}
            >
              <ActionsheetItemText>{status.label}</ActionsheetItemText>
            </ActionsheetItem>
          ))}
        </ActionsheetContent>
      </Actionsheet>
    </Fragment>
  );
}

function ConvertBidToJobActionItem({
  bid,
  customer,
  handleCloseActionSheet,
  profile,
}: {
  bid: ILocationCustomerBid;
  customer: ILocationCustomer;
  handleCloseActionSheet: () => void;
  profile: IProfile;
}) {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const handleCloseDialog = () => setIsVisible(false);
  const handleStartBidToJob = async () => {
    const insert = {
      address: customer.address,
      bid_id: bid.id,
      business_id: customer.business_id,
      business_location_id: customer.location_id,
      city: customer.city,
      commission: bid.commission,
      creator_id: profile.id,
      customer_id: customer.id,
      full_name: customer.full_name,
      postal_code: customer.postal_code,
      state: customer.state,
    };

    const { data: job } = await supabase
      .from("business_location_jobs")
      .insert(insert)
      .select("id")
      .single();

    if (!job) return;

    const jobProfiles = [
      {
        profile_id: profile.id,
        role: "closer",
      },
      ...(customer.creator_id !== profile.id
        ? [
            {
              profile_id: customer.creator_id,
              role: "setter",
            },
          ]
        : []),
    ];

    const jobProfileInsert = jobProfiles.map((jobProfile) => ({
      ...jobProfile,
      business_id: customer.business_id,
      location_id: customer.location_id,
      job_id: job.id,
    }));

    await supabase
      .from("business_location_job_profiles")
      .insert(jobProfileInsert);

    const jobMediaInsert = bid.media.map((m) => ({
      business_id: m.business_id,
      location_id: m.location_id,
      job_id: job.id,
      path: m.path,
      name: m.name,
    }));

    await supabase.from("business_location_job_media").insert(jobMediaInsert);

    await supabase.from("business_location_job_products").insert(
      bid.products.map((product) => ({
        job_id: job.id,
        business_id: customer.business_id,
        location_id: customer.location_id,
        product_id: product.product_id,
        number_of_units: product.units,
        unit_price: product.unit_price,
        total_price: product.units * product.unit_price,
      }))
    );

    handleCloseDialog();
    handleCloseActionSheet();
    router.push({
      pathname: `/(auth)/customer/[customerId]/job/[jobId]`,
      params: {
        customerId: customer.id,
        jobId: job.id,
      },
    });
  };

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
            <Button size="sm" onPress={handleStartBidToJob}>
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
  const { refreshData, profile } = useUserContext();
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
            <Button action="negative" size="sm" onPress={handleConfirm}>
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
              profile={profile}
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
  const { location } = useLocationContext();
  const router = useRouter();

  const bidRequirementsForJob = getBidRequirementsForJob(bid);
  const hasMetAllRequirementsForJob = Object.values(
    bidRequirementsForJob
  ).every((r) => r.value === true);

  return (
    <Card key={bid.id} className="border border-gray-200 gap-y-4 w-80">
      <VStack space="sm">
        <HStack className="justify-between items-center">
          <HStack className="items-center" space="xs">
            <Icon
              className={twMerge(
                hasMetAllRequirementsForJob
                  ? "text-success-600"
                  : "text-typography-300"
              )}
              as={hasMetAllRequirementsForJob ? CheckCircle : Circle}
              size="xl"
            />
            <Text className="shrink" size="lg">
              {bid.name}
            </Text>
          </HStack>
          {location.is_closer && <CustomerBidMenu bid={bid} />}
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
        <ButtonGroup flexDirection="row">
          <Button
            action="secondary"
            className="grow"
            onPress={() =>
              router.push({
                pathname: "/(auth)/customer/[customerId]/bid/[bidId]/edit",
                params: {
                  customerId: bid.customer_id,
                  bidId: bid.id,
                },
              })
            }
          >
            <ButtonIcon as={Settings} />
            <ButtonText>Edit</ButtonText>
          </Button>
          <Button
            action={hasMetAllRequirementsForJob ? "primary" : "secondary"}
            className="grow"
            disabled={!hasMetAllRequirementsForJob}
            variant={hasMetAllRequirementsForJob ? "solid" : "outline"}
          >
            <ButtonIcon as={HardHat} />
            <ButtonText>Start Job</ButtonText>
          </Button>
        </ButtonGroup>
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
    <Fragment>
      <View className="flex-row items-center gap-x-2 px-6">
        <Icon as={Construction} className="text-typography-500" size="lg" />
        <View className="w-0.5 h-full bg-typography-100" />
        <View>
          <Heading size="md">Bids</Heading>
          <Text size="xs">Create bids for the customer</Text>
        </View>
      </View>

      {hasBids ? (
        <ScrollView
          contentContainerClassName="px-6"
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <HStack space="md">
            {bids
              .sort((a, b) => b.created_at.localeCompare(a.created_at))
              .map((bid) => {
                return <CustomerBid key={bid.id} bid={bid} />;
              })}
          </HStack>
          <ScreenEnd />
        </ScrollView>
      ) : (
        <View className="p-6 bg-gray-100 rounded border border-gray-200 gap-y-2 items-center mx-6">
          <Text className="text-center">No bids found.</Text>
          <Button
            action="secondary"
            onPress={() => router.push(`/customer/[customerId]/bid/new`)}
          >
            <ButtonIcon as={Construction} />
            <ButtonText>Add Bid</ButtonText>
          </Button>
        </View>
      )}
    </Fragment>
  );
}

function CustomerAppointments() {
  const { customer } = useCustomerContext();
  const router = useRouter();
  return (
    <View className="px-6">
      <View className="flex-row items-center gap-x-2">
        <Icon as={Calendar1} className="text-typography-500" size="lg" />
        <View className="w-0.5 h-full bg-typography-100" />
        <View>
          <Heading size="md">Appointments</Heading>
          <Text size="xs">Schedule appointments with the customer</Text>
        </View>
      </View>
      {customer?.appointments?.length ? (
        <View className="gap-y-2 py-6">
          {customer?.appointments
            .sort(
              (a, b) =>
                new Date(b.start_datetime).getTime() -
                new Date(a.start_datetime).getTime()
            )
            .map((appointment) => (
              <View
                key={appointment.id}
                className="bg-gray-50 flex-row items-center gap-x-2 border border-gray-200"
              >
                <View className="aspect-square p-4 border-r border-gray-200">
                  <Icon as={Calendar1} />
                </View>
                <View className="p-2">
                  <Text>
                    {dayjs(appointment.start_datetime).format(
                      FRIENDLY_DATE_FORMAT
                    )}
                  </Text>
                  <Text size="xs">
                    {`${dayjs(appointment.start_datetime).format(
                      TIME_FORMAT
                    )} - ${dayjs(appointment.end_datetime).format(
                      TIME_FORMAT
                    )}`}
                  </Text>
                </View>
              </View>
            ))}
        </View>
      ) : (
        <View className="p-6 bg-gray-100 rounded border mt-6 border-gray-200 gap-y-2 items-center">
          <Text className="text-center">No appointments found.</Text>
          <Button
            action="secondary"
            onPress={() =>
              router.push("/customer/[customerId]/new-appointment")
            }
          >
            <ButtonIcon as={Calendar1} />
            <ButtonText>Add Appointment</ButtonText>
          </Button>
        </View>
      )}
    </View>
  );
}

function caculateJobTotal(job: ILocationJob) {
  const productsTotal = job.products.reduce((acc, product) => {
    return acc + Number(product.unit_price) * Number(product.number_of_units);
  }, 0);
  return productsTotal + job.commission;
}

function CustomerJobs() {
  const { customer } = useCustomerContext();
  const { jobs } = customer;
  const router = useRouter();
  return (
    <Fragment>
      <View className="flex-row items-center gap-x-2 px-6">
        <Icon as={HardHat} className="text-typography-500" size="lg" />
        <View className="w-0.5 h-full bg-typography-100" />
        <View>
          <Heading size="md">Jobs</Heading>
          <Text size="xs">Create job for the customer</Text>
        </View>
      </View>

      {jobs.length > 0 ? (
        <ScrollView
          contentContainerClassName="gap-x-4 items-start px-6"
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {jobs.map((job) => (
            <TouchableOpacity
              key={job.id}
              onPress={() =>
                router.push({
                  pathname: `/(auth)/customer/[customerId]/job/[jobId]`,
                  params: {
                    customerId: customer.id,
                    jobId: job.id,
                  },
                })
              }
            >
              <Card
                className="border border-gray-200 gap-y-4 w-80"
                key={job.id}
              >
                <View className="flex-row items-center justify-between">
                  <Badge action="info">
                    <BadgeText>{job.status}</BadgeText>
                  </Badge>
                  <Heading>{`JOB-${job.id}`}</Heading>
                </View>
                {job.media.length > 0 ? (
                  <ScrollView
                    contentContainerClassName="flex-row items-center gap-x-2"
                    horizontal
                    showsHorizontalScrollIndicator={false}
                  >
                    {job.media.slice(0, 3).map((media) => (
                      <SupabaseSignedImage key={media.id} path={media.path} />
                    ))}
                  </ScrollView>
                ) : (
                  <View className="bg-warning-50 aspect-video justify-center items-center">
                    <Text>No media found</Text>
                  </View>
                )}
                <Divider />
                <Text className="text-right text-success-300" size="2xl" bold>
                  {formatAsCurrency(caculateJobTotal(job))}
                </Text>
              </Card>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View className="p-6 bg-gray-100 rounded border mt-6 border-gray-200 gap-y-2 items-center">
          <Text className="text-center">
            No jobs found. Start with a bid to begin a job
          </Text>
        </View>
      )}
    </Fragment>
  );
}

export default function Screen() {
  const { top } = useSafeAreaInsets();
  const router = useRouter();
  const { customer } = useCustomerContext();
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
      <View
        className="flex-row items-center p-4 gap-x-4 border-b-8 border-gray-500"
        style={{ paddingBlockStart: top }}
      >
        <BackHeaderButton
          onPress={() => router.push(`/(auth)/(tabs)/customers`)}
        />
        <CustomerDisposition />
        <Pressable
          onPress={() => router.push("/(auth)/customer/[customerId]/settings")}
        >
          <Icon as={Settings} className="text-typography-600" size="xl" />
        </Pressable>
      </View>
      <ScrollView contentContainerClassName="gap-y-6">
        <View className="w-full aspect-video border-gray-500 border-b-8">
          <Image alt="Map" source={map} size="full" />
        </View>
        <View className="px-6">
          <Heading size="2xl">{customer?.full_name}</Heading>
          <Text size="sm">{customer?.address}</Text>
          <View className="mt-2 flex-row items-center gap-x-2">
            {customer.address && <MapPinButton />}
            {customer.phone && <PhoneButton />}
            {customer.email && <EmailButton />}
          </View>
        </View>
        <View className="px-6 flex-row items-center gap-x-4">
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
        </View>
        <Divider className="w-[50%] mx-auto" />
        <CustomerAppointments />
        <Divider className="w-[50%] mx-auto" />
        <CustomerJobs />
        <Divider className="w-[50%] mx-auto" />
        <CustomerBids />
        <ScreenEnd />
      </ScrollView>
      <PlusButtonActionSheet />
    </Fragment>
  );
}
