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
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Checkbox,
  CheckboxGroup,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@/components/ui/drawer";
import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import {
  DISPOSITION_STATUS_KEYS,
  DISPOSITION_STATUSES,
} from "@/constants/disposition_statuses";
import { useLocationContext } from "@/contexts/location-context";
import { ILocationCustomer, useUserContext } from "@/contexts/user-context";
import { supabase } from "@/lib/supabase";
import { debounce } from "@/utils/debounce";
import {
  useGlobalSearchParams,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import {
  Calendar,
  CheckIcon,
  Search,
  Settings2,
  TrashIcon,
  UserSearch,
  X,
} from "lucide-react-native";
import { Fragment, useCallback, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";

function CustomerCard({ customer }: { customer: ILocationCustomer }) {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false);
  const handleCloseActionSheet = () => setIsActionSheetVisible(false);
  const [isAlertDialogVisible, setIsAlertDialogVisible] = useState(false);
  const { location } = useLocationContext();
  const { refreshData } = useUserContext();

  const handleCloserAlertDialog = () => setIsActionSheetVisible(false);

  const handleDelete = useCallback(
    async () =>
      supabase
        .from("business_location_customers")
        .delete()
        .eq("id", customer.id)
        .then(refreshData)
        .then(handleCloserAlertDialog)
        .then(handleCloseActionSheet),
    []
  );

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
              Are you sure you want to delete this appointment?
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <Text size="sm">
              Deleting the appointment will remove it permanently and cannot be
              undone. Please confirm if you want to proceed.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter className="">
            <Button
              variant="outline"
              action="secondary"
              onPress={handleCloserAlertDialog}
              size="sm"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button action="negative" size="sm" onPress={handleDelete}>
              <ButtonText>Delete</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Actionsheet
        isOpen={isActionSheetVisible}
        onClose={handleCloseActionSheet}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent style={{ paddingBottom: bottom }}>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
            <ActionsheetSectionHeaderText>
              {customer.full_name}
            </ActionsheetSectionHeaderText>
          </ActionsheetDragIndicatorWrapper>
          <ActionsheetItem
            onPress={() => {
              router.push({
                pathname: "/(auth)/(tabs)/customers/[customerId]",
                params: { customerId: customer.id },
              });
              handleCloseActionSheet();
            }}
          >
            <ActionsheetIcon as={UserSearch} className="text-typography-500" />
            <ActionsheetItemText className="text-typography-700">
              View Customer
            </ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem
            onPress={() => {
              router.push({
                pathname:
                  "/(auth)/(tabs)/customers/[customerId]/schedule-appointment",
                params: {
                  customerId: customer.id,
                },
              });
              handleCloseActionSheet();
            }}
          >
            <ActionsheetIcon as={Calendar} className="text-typography-500" />
            <ActionsheetItemText className="text-typography-700">
              Schedule Appointment
            </ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem
            onPress={() => {
              setIsAlertDialogVisible(true);
            }}
          >
            <ActionsheetIcon as={TrashIcon} className="text-red-500" />
            <ActionsheetItemText className="text-red-700">
              Delete
            </ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
      <TouchableOpacity
        onLongPress={() => setIsActionSheetVisible(true)}
        onPress={() =>
          router.push({
            pathname: "/(auth)/(tabs)/customers/[customerId]",
            params: { customerId: customer.id },
          })
        }
      >
        <Card size="sm" variant="elevated">
          <View className="self-start">
            {customer?.disposition_status &&
              DISPOSITION_STATUSES[customer.disposition_status] && (
                <Badge
                  action={
                    DISPOSITION_STATUSES[customer.disposition_status].action
                  }
                >
                  <BadgeText>
                    {DISPOSITION_STATUSES[customer.disposition_status].label}
                  </BadgeText>
                </Badge>
              )}
          </View>
          <View className="flex-row justify-between items-center">
            <View>
              <Text bold>{customer.full_name}</Text>
              <Text isTruncated size="xs">
                {`${customer.address}, ${customer.city} ${customer.state} ${customer.postal_code}`}
              </Text>
            </View>
            {location.is_setter && customer.closer && (
              <Avatar className="bg-gray-200" size="md">
                <AvatarFallbackText>
                  {customer.closer.full_name}
                </AvatarFallbackText>
                <AvatarImage />
              </Avatar>
            )}
          </View>
        </Card>
      </TouchableOpacity>
    </Fragment>
  );
}

function CustomersFilter() {
  const router = useRouter();
  const params = useGlobalSearchParams<{
    dispositionStatuses: DISPOSITION_STATUS_KEYS[];
  }>();

  const { top } = useSafeAreaInsets();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const closeDrawer = () => setIsDrawerOpen(false);
  const [selectedDispositionStatuses, setSelectedDispositionStatuses] =
    useState<DISPOSITION_STATUS_KEYS[]>(params.dispositionStatuses ?? []);
  return (
    <Fragment>
      <TouchableOpacity
        className="p-2.5 border-gray-300 border rounded"
        onPress={() => setIsDrawerOpen(true)}
      >
        <Icon as={Settings2} className="text-typography-500" />
      </TouchableOpacity>
      <Drawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        anchor="right"
        size="lg"
      >
        <DrawerBackdrop />
        <DrawerContent style={{ paddingTop: top }}>
          <DrawerHeader>
            <View>
              <Heading>Filter Customers</Heading>
              <Text>Narrow down you customer list with multiple filters</Text>
            </View>
          </DrawerHeader>
          <DrawerBody>
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>Disposition Status</FormControlLabelText>
              </FormControlLabel>
              <CheckboxGroup
                className="gap-y-2"
                onChange={setSelectedDispositionStatuses}
                value={selectedDispositionStatuses}
              >
                {Object.entries(DISPOSITION_STATUSES).map(([key, status]) => (
                  <Checkbox
                    size="md"
                    isChecked={selectedDispositionStatuses.includes(
                      key as DISPOSITION_STATUS_KEYS
                    )}
                    key={key}
                    isInvalid={false}
                    isDisabled={false}
                    value={key}
                  >
                    <CheckboxIndicator>
                      <CheckboxIcon as={CheckIcon} />
                    </CheckboxIndicator>
                    <CheckboxLabel>{status.label}</CheckboxLabel>
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </FormControl>
          </DrawerBody>
          <DrawerFooter>
            <Button
              onPress={() => {
                router.setParams({
                  ...params,
                  dispositionStatuses: selectedDispositionStatuses,
                });
                closeDrawer();
              }}
              className="flex-1"
            >
              <ButtonText>Submit</ButtonText>
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Fragment>
  );
}

export default function CustomersScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    dispositionStatuses: DISPOSITION_STATUS_KEYS[];
    searchTerm: string;
  }>();

  const {
    location: { customers },
  } = useUserContext();

  const customerResults = customers
    .sort((a, b) => a.full_name.localeCompare(b.full_name))
    .filter((customer) => {
      if (
        params.dispositionStatuses?.length &&
        !params.dispositionStatuses.includes(customer.disposition_status)
      )
        return false;
      return params.searchTerm
        ? customer.full_name
            .toLowerCase()
            .includes(params.searchTerm.toLowerCase())
        : true;
    });

  return (
    <ScrollView contentContainerClassName="gap-2">
      <Box className="bg-white p-6">
        <Heading size="xl">Customers</Heading>
        <Text size="sm" className="text-gray-400">
          Manage customers you have created.
        </Text>
        <View className="flex-row items-center gap-x-2 mt-4">
          <Input className="grow">
            <InputSlot className="pl-3">
              <InputIcon as={Search} />
            </InputSlot>
            <InputField
              onChangeText={debounce(
                (searchTerm) => router.setParams({ searchTerm }),
                500
              )}
              placeholder="Search..."
            />
          </Input>
          <CustomersFilter key={params.dispositionStatuses?.toString()} />
        </View>
        {params.dispositionStatuses?.length ? (
          <View className="mt-4 gap-2">
            <Text className="uppercase" size="xs">
              Disposition Status
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {params.dispositionStatuses.map((dispositionStatus) => (
                <TouchableOpacity
                  className={twMerge(
                    DISPOSITION_STATUSES[dispositionStatus].bg,
                    "self-start p-1 flex-row rounded border px-2 items-center gap-x-2"
                  )}
                  key={dispositionStatus}
                  onPress={() =>
                    router.setParams({
                      ...params,
                      dispositionStatuses: params.dispositionStatuses.filter(
                        (prev) => prev !== dispositionStatus
                      ),
                    })
                  }
                >
                  <Text className="uppercase" size="sm">
                    {DISPOSITION_STATUSES[dispositionStatus].label}
                  </Text>
                  <Icon as={X} className="text-typography-400" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : null}
      </Box>
      <View className="p-6 gap-2">
        {customerResults.map((customer) => (
          <CustomerCard customer={customer} key={customer.id} />
        ))}
      </View>
      <ScreenEnd />
    </ScrollView>
  );
}
