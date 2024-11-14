import JobCard from "@/components/JobCard";
import Text from "@/components/Text";
import { useUserContext } from "@/contexts/user-context";
import arrayGroupBy from "@/utils/array-group-by";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const STATUS_NAME_DICTIONARY = {
  new: "New",
  scheduled: "Scheduled",
  pending: "Pending",
  approved: "Approved",
  billed: "Billed",
  canceled: "Canceled",
  complete: "Complete",
};

type STATUS_NAME_DICTIONARY_KEYS = keyof typeof STATUS_NAME_DICTIONARY;

export default function JobsScreen() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { refreshData } = useUserContext();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { jobs } = useUserContext();
  const jobsByStatus = arrayGroupBy(jobs, (job) => job.status);

  return (
    <ScrollView
      contentContainerClassName="gap-y-6 pb-6"
      showsVerticalScrollIndicator={false}
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
      <View
        className="bg-gray-600 px-6 pt-0 pb-4"
        style={{ paddingTop: insets.top }}
      >
        <Text variant="headline" className="text-gray-300">
          Jobs
        </Text>
      </View>
      {Object.entries(jobsByStatus).map(([status, jobs]) => {
        return (
          <View className="gap-y-2" key={status}>
            <Text variant="header" className="px-6">
              {STATUS_NAME_DICTIONARY[status as STATUS_NAME_DICTIONARY_KEYS]}
            </Text>
            <ScrollView
              contentContainerClassName="gap-x-3 flex-row px-2"
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {jobs.map((job) => (
                <TouchableOpacity
                  className="w-72"
                  key={job.id}
                  onPress={() => router.push(`/job/${job.id}`)}
                >
                  <JobCard job={job} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );
      })}
    </ScrollView>
  );
}
