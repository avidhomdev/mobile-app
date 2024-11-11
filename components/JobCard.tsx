import { Image, TouchableOpacity, View } from "react-native";
import Card from "./Card";
import Text from "./Text";
import { formatAsCurrency } from "@/utils/format-as-currency";
import { Ionicons } from "@expo/vector-icons";

interface IJob {
  address: string;
  city: string;
  commission: number;
  id: number;
  postal_code: string;
  state: string;
  street_view_image_url: string;
}

type TJobCardProps = {
  job: IJob;
};

function formatEmptyAsNa(val: unknown) {
  if (Boolean(val)) return val;
  return "NA";
}

export default function JobCard({ job }: TJobCardProps) {
  return (
    <Card className="p-0 flex-1">
      <Image
        className="aspect-video"
        resizeMode="cover"
        source={{
          uri: job.street_view_image_url,
        }}
      />
      <View className="p-4 gap-y-1 relative">
        <Text variant="header">Customer Name</Text>
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
