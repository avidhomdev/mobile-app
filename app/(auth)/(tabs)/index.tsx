import Button from "@/components/Button";
import Card from "@/components/Card";
import Input from "@/components/Input";
import JobCard from "@/components/JobCard";
import Text from "@/components/Text";
import { formatAsCompactCurrency } from "@/utils/format-as-compact-currency";
import { formatAsCompactNumber } from "@/utils/format-as-compact-number";
import { formatAsCurrency } from "@/utils/format-as-currency";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const jobs = [
  {
    address: "128 Safe St",
    city: "Salt Lake City",
    commission: 1_000,
    id: 1,
    postal_code: "84020",
    state: "UT",
    street_view_image_url:
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    address: "128 Safe St",
    city: "Salt Lake City",
    commission: 2_000,
    id: 2,
    postal_code: "84020",
    state: "UT",
    street_view_image_url:
      "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    address: "128 Safe St",
    city: "Salt Lake City",
    commission: 3_000,
    id: 3,
    postal_code: "84020",
    state: "UT",
    street_view_image_url:
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    address: "128 Safe St",
    city: "Salt Lake City",
    commission: 14_000,
    id: 4,
    postal_code: "84020",
    state: "UT",
    street_view_image_url:
      "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    address: "128 Safe St",
    city: "Salt Lake City",
    commission: 5_000,
    id: 5,
    postal_code: "84020",
    state: "UT",
    street_view_image_url:
      "https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    address: "128 Safe St",
    city: "Salt Lake City",
    commission: 6_000,
    id: 6,
    postal_code: "84020",
    state: "UT",
    street_view_image_url:
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    address: "128 Safe St",
    city: "Salt Lake City",
    commission: 7_000,
    id: 7,
    postal_code: "84020",
    state: "UT",
    street_view_image_url:
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    address: "128 Safe St",
    city: "Salt Lake City",
    commission: 8_000,
    id: 8,
    postal_code: "84020",
    state: "UT",
    street_view_image_url:
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    address: "128 Safe St",
    city: "Salt Lake City",
    commission: 1_000,
    id: 11,
    postal_code: "84020",
    state: "UT",
    street_view_image_url:
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    address: "128 Safe St",
    city: "Salt Lake City",
    commission: 2_000,
    id: 12,
    postal_code: "84020",
    state: "UT",
    street_view_image_url:
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    address: "128 Safe St",
    city: "Salt Lake City",
    commission: 3_000,
    id: 13,
    postal_code: "84020",
    state: "UT",
    street_view_image_url:
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    address: "128 Safe St",
    city: "Salt Lake City",
    commission: 14_000,
    id: 14,
    postal_code: "84020",
    state: "UT",
    street_view_image_url:
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    address: "128 Safe St",
    city: "Salt Lake City",
    commission: 5_000,
    id: 15,
    postal_code: "84020",
    state: "UT",
    street_view_image_url:
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    address: "128 Safe St",
    city: "Salt Lake City",
    commission: 6_000,
    id: 16,
    postal_code: "84020",
    state: "UT",
    street_view_image_url:
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    address: "128 Safe St",
    city: "Salt Lake City",
    commission: 7_000,
    id: 17,
    postal_code: "84020",
    state: "UT",
    street_view_image_url:
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    address: "128 Safe St",
    city: "Salt Lake City",
    commission: 8_000,
    id: 18,
    postal_code: "84020",
    state: "UT",
    street_view_image_url:
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

export default function TabOneScreen() {
  const insets = useSafeAreaInsets();
  const totalCommissions = jobs.reduce((dictionary, job) => {
    dictionary += job.commission;
    return dictionary;
  }, 0);
  const numberOfJobs = jobs.length;
  const totalCommissionAverage = totalCommissions / numberOfJobs;

  return (
    <ScrollView
      contentContainerClassName="gap-y-6"
      showsVerticalScrollIndicator={false}
    >
      <View
        className="flex-row justify-between gap-x-6 px-6 pt-6"
        style={{ marginTop: insets.top }}
      >
        <Text variant="headline">Hi, Name</Text>
        <View className="rounded-full bg-indigo-300 size-10" />
      </View>
      <View className="px-6">
        <Input placeholder="Search for a job..." />
      </View>
      <View className="gap-3 flex-row flex-1 px-6 flex-wrap">
        <Card className="p-4 gap-y-2 basis-1/3 grow">
          <Text className="text-gray-400 text-sm font-semibold"># of Jobs</Text>
          <View className="flex-row gap-x-2 items-center">
            <Ionicons name="construct" size={28} color="#6b7280" />
            <Text className="italic text-xl font-semibold ml-auto">
              {numberOfJobs}
            </Text>
          </View>
        </Card>
        <Card className="p-4 gap-y-2 basis-1/3 grow">
          <Text className="text-gray-400 text-sm font-semibold"># of Jobs</Text>
          <View className="flex-row gap-x-2 items-center">
            <Ionicons name="timer" size={28} color="#6b7280" />
            <Button size="xs" variant="secondary" className="ml-auto">
              <Button.Text>Start</Button.Text>
            </Button>
          </View>
        </Card>
        <Card className="p-4 gap-y-2 basis-1/3 grow">
          <Text className="text-gray-400 text-sm font-semibold">
            Commission
          </Text>
          <View className="flex-row gap-x-2 items-center">
            <Ionicons name="cash" size={28} color="#6b7280" />
            <Text className="italic text-xl font-semibold ml-auto">
              {formatAsCompactCurrency(totalCommissions)}
            </Text>
          </View>
        </Card>
        <Card className="p-4 gap-y-2 basis-1/3 grow">
          <Text className="text-gray-400 text-sm font-semibold">Open Jobs</Text>
          <View className="flex-row gap-x-2 items-center">
            <Ionicons name="construct" size={28} color="#6b7280" />
            <Text className="italic text-xl font-semibold ml-auto">
              {formatAsCompactNumber(numberOfJobs - 8)}
            </Text>
          </View>
        </Card>
      </View>
      <Card className="bg-gray-800 gap-y-2 mx-6 flex-1">
        <Text className="text-gray-300 text-sm">Today's quote</Text>
        <Text className="text-white italic text-xl font-semibold">
          "Don't stop believing"
        </Text>
      </Card>
      <View className="px-6 -mb-3">
        <Text variant="header">Jobs</Text>
        <Text variant="subheader">Recently started jobs</Text>
      </View>
      <ScrollView
        contentContainerClassName="gap-x-3 flex-row px-2"
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </ScrollView>
      <View className="flex-row gap-x-2 px-6">
        <Card className="bg-indigo-800 gap-y-2 flex-1 p-4">
          <Text className="text-indigo-200 text-sm font-semibold">
            Avg Job Life
          </Text>
          <Text className="text-white italic text-xl font-semibold">
            6 days
          </Text>
        </Card>
        <Card className="bg-indigo-800 gap-y-2 flex-1 p-4">
          <Text className="text-indigo-200 text-sm font-semibold">
            Avg Commission
          </Text>
          <Text className="text-white italic text-xl font-semibold">
            {formatAsCurrency(totalCommissionAverage)}
          </Text>
        </Card>
      </View>
      <View className="px-6">
        <Text variant="header">Upcoming</Text>
        <Text variant="subheader">Next 7 days of schedule</Text>
      </View>
      <View />
    </ScrollView>
  );
}
