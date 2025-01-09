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
import { Fab, FabIcon, FabLabel } from "@/components/ui/fab";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { AddIcon, CloseIcon, Icon } from "@/components/ui/icon";

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
import { useUserContext } from "@/contexts/user-context";
import { Tables } from "@/supabase";
import { useRouter } from "expo-router";
import { Calendar, TrashIcon, UserSearch } from "lucide-react-native";
import { Fragment, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function CustomerCard({
  customer,
}: {
  customer: Tables<"business_location_customers">;
}) {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false);
  const handleClose = () => setIsActionSheetVisible(false);
  const [showModal, setShowModal] = useState(false);

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
            <Badge action="success">
              <BadgeText>{customer.disposition_status}</BadgeText>
            </Badge>
          </View>
          <View className="flex-row justify-between items-center">
            <View>
              <Text bold>{customer.full_name}</Text>
              <Text isTruncated size="xs">
                {`${customer.address}, ${customer.city} ${customer.state} ${customer.postal_code}`}
              </Text>
            </View>
            <Avatar className="bg-gray-200" size="md">
              <AvatarFallbackText>{customer.closer_id}</AvatarFallbackText>
              <AvatarImage />
            </Avatar>
          </View>
        </Card>
      </TouchableOpacity>
    </Fragment>
  );
}

function CustomersList() {
  const {
    location: { customers },
  } = useUserContext();

  return (
    <ScrollView contentContainerClassName="px-4 gap-2">
      {customers.toReversed().map((customer) => (
        <CustomerCard customer={customer} key={customer.id} />
      ))}
      <View />
    </ScrollView>
  );
}

export default function CustomersScreen() {
  const router = useRouter();

  return (
    <View className="gap-4 flex-1">
      <HStack space="md" className="justify-between p-4 bg-white items-center">
        <Box>
          <Heading size="xl">Customers</Heading>
          <Text size="sm" className="text-gray-400">
            Manage customers you have created.
          </Text>
        </Box>
      </HStack>
      <CustomersList />
      <Fab
        size="md"
        placement="bottom right"
        isHovered={false}
        isDisabled={false}
        isPressed={false}
        onPress={() => router.push(`/(auth)/(modals)/new-customer-modal`)}
      >
        <FabIcon as={AddIcon} />
        <FabLabel>New</FabLabel>
      </Fab>
    </View>
  );
}
