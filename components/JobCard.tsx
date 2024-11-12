import { Image, TouchableOpacity, View } from "react-native";
import Card from "./Card";
import Text from "./Text";
import { formatAsCurrency } from "@/utils/format-as-currency";
import { Ionicons } from "@expo/vector-icons";
import { Tables } from "@/supabase";
import formatEmptyAsNa from "@/utils/format-empty-as-na";

type TJobCardProps = {
  job: Tables<"business_location_jobs">;
};

export default function JobCard({ job }: TJobCardProps) {
  return (
    <Card className="p-0 flex-1">
      <View className="aspect-video bg-slate-100" />
      <View className="p-4 gap-y-1 relative">
        <Text variant="header">{job.full_name}</Text>
        <Text variant="subheader" className="flex-wrap">{`${formatEmptyAsNa(
          job.address
        )}, ${formatEmptyAsNa(job.city)}, ${formatEmptyAsNa(
          job.state
        )} ${formatEmptyAsNa(job.postal_code)}`}</Text>
        <View className="flex-row gap-x-2 absolute -top-8 items-center right-2 left-2">
          <View className="bg-green-400 p-2 rounded border border-green-500">
            <Text className="text-white font-bold tracking-tighter">
              {formatAsCurrency(job.commission)}
            </Text>
          </View>
          <TouchableOpacity className="ml-auto bg-black rounded-full size-12 justify-center items-center">
            <Ionicons name="navigate-circle" size={36} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
}
