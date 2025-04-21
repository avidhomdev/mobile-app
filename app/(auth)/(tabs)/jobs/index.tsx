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
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@/components/ui/drawer";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import {
  DISPOSITION_STATUS_KEYS,
  DISPOSITION_STATUSES,
} from "@/constants/disposition-statuses";
import { useUserContext } from "@/contexts/user-context";
import { Tables } from "@/supabase";
import { debounce } from "@/utils/debounce";
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
        <Card size="sm" variant="elevated">
          <HStack className="items-center justify-between">
            <VStack>
              <Text bold>{`JOB-${job.id} - ${job.full_name}`}</Text>
              <Text isTruncated size="xs">
                {`${job.address}, ${job.city} ${job.state} ${job.postal_code}`}
              </Text>
            </VStack>
            <Badge action="info" variant="outline" size="lg">
              <BadgeText>{`${completed}/${total}`}</BadgeText>
            </Badge>
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
    <ScrollView>
      <Box className="bg-white p-6">
        <Heading size="xl">Jobs</Heading>
        <Text size="sm" className="text-gray-400">
          Manage your jobs created for the customers
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
      <View className="p-2 gap-y-2">
        {jobs
          .sort((a, b) => b.created_at.localeCompare(a.created_at))
          .map((job) => (
            <JobCard job={job as IJob} key={job.id} />
          ))}
      </View>
      <ScreenEnd />
      <ScreenEnd />
    </ScrollView>
  );
}
