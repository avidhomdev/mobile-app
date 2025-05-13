import ScreenEnd from "@/src/components/ScreenEnd";
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
import { Badge, BadgeText } from "@/src/components/ui/badge";
import { Button, ButtonIcon, ButtonText } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@/src/components/ui/drawer";
import { Heading } from "@/src/components/ui/heading";
import { HStack } from "@/src/components/ui/hstack";
import { Icon } from "@/src/components/ui/icon";
import {
  Input,
  InputField,
  InputIcon,
  InputSlot,
} from "@/src/components/ui/input";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import {
  DISPOSITION_STATUS_KEYS,
  DISPOSITION_STATUSES,
} from "@/src/constants/disposition-statuses";
import { useLocationContext } from "@/src/contexts/location-context";
import { useUserContext } from "@/src/contexts/user-context";
import { Tables } from "@/supabase";
import { debounce } from "@/src/utils/debounce";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Search, Settings2, UserSearch, X } from "lucide-react-native";
import { Fragment, useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";

interface IJob extends Tables<"business_location_jobs"> {
  tasks: Tables<"business_location_job_tasks">[];
}

type JobCardPropType = {
  job: IJob;
};

function JobCard({ job }: JobCardPropType) {
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
            pathname: "/customer/[customerId]/job/[jobId]",
            params: { customerId: job.customer_id!, jobId: job.id },
          })
        }
      >
        <Card
          className="border border-background-100"
          size="sm"
          variant="elevated"
        >
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

function CustomersFilter() {
  const { top } = useSafeAreaInsets();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <Fragment>
      <Button action="secondary" onPress={() => setIsDrawerOpen(true)}>
        <ButtonIcon as={Settings2} />
      </Button>
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
              <Heading>Filter Jobs</Heading>
              <Text>Narrow down you jobs list with multiple filters</Text>
            </View>
          </DrawerHeader>
          <DrawerBody>
            <Text>Filters coming soon...</Text>
          </DrawerBody>
          <DrawerFooter>
            <Button
              onPress={() => {
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

export default function JobsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    dispositionStatuses: DISPOSITION_STATUS_KEYS[];
    searchTerm: string;
  }>();

  const {
    location: { jobs },
  } = useUserContext();

  return (
    <ScrollView className="flex-1">
      <VStack className="bg-background-50 p-6" space="md">
        <VStack>
          <Heading size="xl">Jobs</Heading>
          <Text size="sm" className="text-gray-400">
            Manage your jobs created for the customers
          </Text>
        </VStack>
        <HStack space="md">
          <Input className="grow bg-background-light dark:bg-background-dark">
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
        </HStack>
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
      </VStack>
      <VStack className="px-6 pt-6" space="sm">
        {jobs
          .sort((a, b) => b.created_at.localeCompare(a.created_at))
          .map((job) => (
            <JobCard job={job as IJob} key={job.id} />
          ))}
      </VStack>
      <ScreenEnd />
      <ScreenEnd />
    </ScrollView>
  );
}
