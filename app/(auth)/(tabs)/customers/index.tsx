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
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { CloseIcon, Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";

import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import { DISPOSITION_STATUSES } from "@/constants/disposition_statuses";
import { useLocationContext } from "@/contexts/location-context";
import { ILocationCustomer, useUserContext } from "@/contexts/user-context";
import { debounce } from "@/utils/debounce";
import { useRouter } from "expo-router";
import { Calendar, Search, TrashIcon, UserSearch } from "lucide-react-native";
import { Fragment, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function CustomerCard({ customer }: { customer: ILocationCustomer }) {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false);
  const handleClose = () => setIsActionSheetVisible(false);
  const [showModal, setShowModal] = useState(false);
  const { location } = useLocationContext();

  return (
    <Fragment>
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
        }}
        size="md"
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="md" className="text-typography-950">
              Delete customer
            </Heading>
            <ModalCloseButton>
              <Icon
                as={CloseIcon}
                size="md"
                className="stroke-background-400 group-[:hover]/modal-close-button:stroke-background-700 group-[:active]/modal-close-button:stroke-background-900 group-[:focus-visible]/modal-close-button:stroke-background-900"
              />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Text size="sm" className="text-typography-500">
              Deleting this customer will permanently remove them from your
              records. This action cannot be undone. Are you sure you want to
              proceed?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => {
                setShowModal(false);
              }}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              action="negative"
              onPress={() => {
                setShowModal(false);
              }}
            >
              <ButtonText>Delete</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Actionsheet isOpen={isActionSheetVisible} onClose={handleClose}>
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
              handleClose();
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
                params: { customerId: customer.id },
              });
              handleClose();
            }}
          >
            <ActionsheetIcon as={Calendar} className="text-typography-500" />
            <ActionsheetItemText className="text-typography-700">
              Schedule Appointment
            </ActionsheetItemText>
          </ActionsheetItem>
          <ActionsheetItem
            onPress={() => {
              setShowModal(true);
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
            {location.is_setter && (
              <Avatar className="bg-gray-200" size="md">
                <AvatarFallbackText>{customer.closer_id}</AvatarFallbackText>
                <AvatarImage />
              </Avatar>
            )}
          </View>
        </Card>
      </TouchableOpacity>
    </Fragment>
  );
}

function CustomersList() {
  const [searchTerm, setSearchTerm] = useState("");
  const {
    location: { customers },
  } = useUserContext();

  const customerResults = customers
    .toReversed()
    .filter((customer) =>
      customer.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <ScrollView contentContainerClassName="px-6 pb-6 gap-2">
      <Input className="grow" size="xl" variant="underlined">
        <InputSlot className="pl-3 mr-2">
          <InputIcon as={Search} />
        </InputSlot>
        <InputField
          onChangeText={debounce(setSearchTerm, 500)}
          placeholder="Search..."
        />
      </Input>
      {customerResults.map((customer) => (
        <CustomerCard customer={customer} key={customer.id} />
      ))}
      <View />
    </ScrollView>
  );
}

export default function CustomersScreen() {
  return (
    <View className="gap-6 flex-1">
      <HStack space="md" className="justify-between p-6 bg-white items-center">
        <Box>
          <Heading size="xl">Customers</Heading>
          <Text size="sm" className="text-gray-400">
            Manage customers you have created.
          </Text>
        </Box>
      </HStack>

      <CustomersList />
    </View>
  );
}
