import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useJobContext } from "@/contexts/job-context";
import { formatAsCompactCurrency } from "@/utils/format-as-compact-currency";
import { formatAsCurrency } from "@/utils/format-as-currency";
import formatEmptyAsNa from "@/utils/format-empty-as-na";
import { formatMinutesToHoursAndMinutes } from "@/utils/format-minutes-to-hours-and-minutes";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router, useGlobalSearchParams, useRouter } from "expo-router";
import { Fragment, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";

function Header() {
  const insets = useSafeAreaInsets();
  const { job } = useJobContext();
  const { jobId } = useGlobalSearchParams();

  return (
    <View
      className="bg-gray-900 w-full relative"
      style={{ paddingTop: insets.top }}
    >
      <View className="flex-row items-center justify-between px-6">
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
      <View className="gap-y-2 w-4/5 py-4">
        <Text className="bg-white p-1 pl-6 grow">{job?.full_name}</Text>
        <Text className="text-white ml-6">
          {`${formatEmptyAsNa(job?.address)}, ${formatEmptyAsNa(
            job?.city
          )}, ${formatEmptyAsNa(job?.state)} ${formatEmptyAsNa(
            job?.postal_code
          )}`}
        </Text>
      </View>
    </View>
  );
}

function Tiles() {
  const { job } = useJobContext();

  return (
    <View className="gap-3 flex-row px-6 flex-wrap">
      <Card className="p-4 basis-1/3 grow bg-indigo-600">
        <Text className="text-indigo-300">Commission</Text>
        <View className="flex-row gap-x-2 items-center">
          <Text className="italic font-semibold text-indigo-100">
            {formatAsCurrency(Number(job?.commission))}
          </Text>
        </View>
      </Card>
      <Card className="p-4 basis-1/3 grow bg-indigo-600">
        <Text className="text-indigo-300">Hours</Text>
        <View className="flex-row gap-x-2 items-center">
          <Text className="italic font-semibold text-indigo-100">
            {formatMinutesToHoursAndMinutes(Number(job?.commission) / 20)}
          </Text>
        </View>
      </Card>
    </View>
  );
}

function Products() {
  const { job } = useJobContext();

  return (
    <View className="gap-y-2">
      <Text className="px-6">Products</Text>
      <ScrollView
        contentContainerClassName="gap-x-3 flex-row px-2"
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {job?.products.map((product) => (
          <Card className="w-72 flex-1 p-3 gap-y-2" key={product.id}>
            <View>
              <Text>{product.product.name}</Text>
              <Text>{`${product.number_of_units} x ${product.product.unit}`}</Text>
            </View>
            <Text className="font-bold text-green-600">
              {formatAsCompactCurrency(
                product.number_of_units * Number(product.product.unit_price)
              )}
            </Text>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
}

function TodoList() {
  return (
    <View className="gap-y-2 px-6">
      <Text>Todos</Text>
      <TouchableOpacity className="flex-row items-center gap-x-2">
        <Ionicons name="checkbox-outline" size={32} color="#9ca3af" />
        <Text>Verify job measurements</Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex-row items-center gap-x-2">
        <Ionicons name="square-outline" size={32} color="#9ca3af" />
        <Text>Order products</Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex-row items-center gap-x-2">
        <Ionicons name="square-outline" size={32} color="#9ca3af" />
        <Text>Assemble crews</Text>
      </TouchableOpacity>
      <TouchableOpacity className="flex-row items-center gap-x-2">
        <Ionicons name="square-outline" size={32} color="#9ca3af" />
        <Text>Schedule installation</Text>
      </TouchableOpacity>
    </View>
  );
}

function PopoverButton() {
  const { jobId } = useGlobalSearchParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen((prevState) => !prevState);

  return (
    <Fragment>
      <TouchableOpacity
        className={twMerge(
          isOpen ? "rounded-b-full " : "rounded-full",
          "absolute bottom-6 right-4 size-14 items-center justify-center bg-gray-900 z-10"
        )}
        onPress={toggle}
      >
        {isOpen ? (
          <Ionicons name="close" size={24} color="white" />
        ) : (
          <Ionicons name="ellipsis-horizontal" size={24} color="white" />
        )}
      </TouchableOpacity>
      {isOpen && (
        <Fragment>
          <View className="absolute bottom-16 right-4 bg-gray-900 w-2/3 p-4 rounded rounded-br-none gap-y-4 z-10">
            <TouchableOpacity className="flex-row gap-x-2 items-center p-2">
              <Ionicons name="camera" size={18} color="#f3f4f6" />
              <Text className="text-gray-100">Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row gap-x-2 items-center p-2">
              <Ionicons name="document" size={18} color="#f3f4f6" />
              <Text className="text-gray-100">Send Document</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row gap-x-2 items-center p-2">
              <Ionicons name="cash" size={18} color="#f3f4f6" />
              <Text className="text-gray-100">Collect Payment</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row gap-x-2 items-center p-2">
              <Ionicons name="alarm" size={18} color="#f3f4f6" />
              <Text className="text-gray-100">Track Time</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row gap-x-2 items-center p-2"
              onPress={() => {
                router.navigate({
                  pathname: "/job/[jobId]/notes",
                  params: { jobId: jobId as string },
                });
                toggle();
              }}
            >
              <Ionicons name="chatbubble" size={18} color="#f3f4f6" />
              <Text className="text-gray-100">Take Notes</Text>
            </TouchableOpacity>
          </View>
          <TouchableWithoutFeedback onPress={toggle}>
            <View className="absolute inset-0 bg-black/70 w-full h-full z-0" />
          </TouchableWithoutFeedback>
        </Fragment>
      )}
    </Fragment>
  );
}

export default function JobScreen() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { refreshData } = useJobContext();

  return (
    <Fragment>
      <Header />
      <ScrollView
        contentContainerClassName="gap-y-6 py-6"
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
        showsVerticalScrollIndicator={false}
      >
        <Tiles />
        <Products />
        <TodoList />
      </ScrollView>
      <PopoverButton />
    </Fragment>
  );
}
