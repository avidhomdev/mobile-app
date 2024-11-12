import Button from "@/components/Button";
import Card from "@/components/Card";
import Text from "@/components/Text";
import { useJobContext } from "@/contexts/job-context";
import { formatAsCompactCurrency } from "@/utils/format-as-compact-currency";
import { formatAsCurrency } from "@/utils/format-as-currency";
import formatEmptyAsNa from "@/utils/format-empty-as-na";
import { formatMinutesToHoursAndMinutes } from "@/utils/format-minutes-to-hours-and-minutes";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router, useGlobalSearchParams } from "expo-router";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function JobScreen() {
  const insets = useSafeAreaInsets();
  const { jobId } = useGlobalSearchParams();
  const { job } = useJobContext();

  return (
    <ScrollView
      contentContainerClassName="gap-y-6 pb-6"
      showsVerticalScrollIndicator={false}
    >
      <View
        className="aspect-video bg-gray-900 w-full relative px-6"
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            className="flex-row items-center gap-x-2"
            onPress={router.back}
          >
            <FontAwesome name="chevron-left" size={20} color="white" />
            <Text className="text-white">Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center gap-x-2"
            onPress={() =>
              router.navigate({
                pathname: "/job/[jobId]/edit",
                params: { jobId: jobId as string },
              })
            }
          >
            <FontAwesome name="gear" size={26} color="white" />
          </TouchableOpacity>
        </View>
        <View className="absolute bottom-4 gap-y-2 w-4/5">
          <Text className="bg-white p-1 pl-6" variant="headline">
            {job?.full_name}
          </Text>
          <Text variant="subheader" className="text-white ml-6">
            {`${formatEmptyAsNa(job?.address)}, ${formatEmptyAsNa(
              job?.city
            )}, ${formatEmptyAsNa(job?.state)} ${formatEmptyAsNa(
              job?.postal_code
            )}`}
          </Text>
        </View>
      </View>
      <View className="gap-3 flex-row flex-1 px-6 flex-wrap">
        <Card className="p-4 basis-1/3 grow bg-indigo-600">
          <Text variant="subheader" className="text-indigo-300">
            Commission
          </Text>
          <View className="flex-row gap-x-2 items-center">
            <Text className="italic font-semibold text-indigo-100">
              {formatAsCurrency(Number(job?.commission))}
            </Text>
          </View>
        </Card>
        <Card className="p-4 basis-1/3 grow bg-indigo-600">
          <Text variant="subheader" className="text-indigo-300">
            Hours
          </Text>
          <View className="flex-row gap-x-2 items-center">
            <Text className="italic font-semibold text-indigo-100">
              {formatMinutesToHoursAndMinutes(Number(job?.commission) / 20)}
            </Text>
          </View>
        </Card>
      </View>
      <View className="gap-y-2 px-6">
        <Text variant="header">Products</Text>
        <ScrollView
          contentContainerClassName="gap-x-3 flex-row"
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {job?.products.map((product) => (
            <Card className="w-72 flex-1 p-3 gap-y-2" key={product.id}>
              <View>
                <Text>{product.product.name}</Text>
                <Text variant="subheader">{`${product.number_of_units} x ${product.product.measurement}`}</Text>
              </View>
              <Text className="font-bold text-green-600">
                {formatAsCompactCurrency(
                  product.number_of_units *
                    product.product.price_per_measurement
                )}
              </Text>
            </Card>
          ))}
        </ScrollView>
      </View>
      <View className="gap-y-2 px-6">
        <Text variant="header">Todos</Text>
        <Card>
          <Text>Todo item</Text>
        </Card>
        <Card>
          <Text>Todo item</Text>
        </Card>
        <Card>
          <Text>Todo item</Text>
        </Card>
        <Card>
          <Text>Todo item</Text>
        </Card>
        <Card>
          <Text>Todo item</Text>
        </Card>
        <Card>
          <Text>Todo item</Text>
        </Card>
        <Card>
          <Text>Todo item</Text>
        </Card>
      </View>
    </ScrollView>
  );
}
