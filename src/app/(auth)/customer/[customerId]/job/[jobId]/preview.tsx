import BackHeaderButton from "@/src/components/BackHeaderButton";
import ScreenEnd from "@/src/components/ScreenEnd";
import { Card } from "@/src/components/ui/card";
import { Heading } from "@/src/components/ui/heading";
import { Progress, ProgressFilledTrack } from "@/src/components/ui/progress";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { useCustomerContext } from "@/src/contexts/customer-context";
import { IJobProduct, ILocationCustomer } from "@/src/contexts/user-context";
import { useLocalSearchParams } from "expo-router";

import { ResultsWithLoader } from "@/src/components/ResultsWithLoader";
import SupabaseSignedImage from "@/src/components/SupabaseSignedImage";
import { HStack } from "@/src/components/ui/hstack";
import { Icon } from "@/src/components/ui/icon";
import { formatAddressFieldsToString } from "@/src/utils/format-address-fields-to-string";
import { Tables } from "@/supabase";
import { Mail, MapPin, PhoneIcon, UserIcon } from "lucide-react-native";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function ProductListItem({ product }: { product: IJobProduct }) {
  return (
    <Card>
      <VStack space="md">
        <Heading size="sm">{product.product.name}</Heading>
        <VStack space="sm">
          <Progress value={15} size="md" orientation="horizontal">
            <ProgressFilledTrack />
          </Progress>
          <Text
            className="text-right"
            size="sm"
          >{`0/${product.number_of_units} ${product.product.unit}`}</Text>
        </VStack>
      </VStack>
    </Card>
  );
}

function ProductList({ products }: { products: IJobProduct[] }) {
  return (
    <>
      <VStack>
        <Heading size="md">Products</Heading>
        <Text size="sm">
          A list of products and measurements to be installed
        </Text>
      </VStack>
      <ResultsWithLoader hasResults={Boolean(products.length)}>
        <VStack space="sm">
          {products.map((product) => (
            <ProductListItem key={product.id} product={product} />
          ))}
        </VStack>
      </ResultsWithLoader>
    </>
  );
}

function CustomerInfo({ customer }: { customer: ILocationCustomer }) {
  return (
    <Card>
      <VStack space="sm">
        <HStack className="items-center" space="sm">
          <Icon as={UserIcon} />
          <Text>{customer.full_name}</Text>
        </HStack>
        <HStack className="items-center" space="sm">
          <Icon as={PhoneIcon} />
          <Text>{customer.phone || "No phone"}</Text>
        </HStack>
        <HStack className="items-center" space="sm">
          <Icon as={Mail} />
          <Text>{customer.email || "No email"}</Text>
        </HStack>
        <HStack className="items-center" space="sm">
          <Icon as={MapPin} />
          <Text>{formatAddressFieldsToString(customer)}</Text>
        </HStack>
      </VStack>
    </Card>
  );
}

function MediaList({
  media,
}: {
  media: Tables<"business_location_job_media">[];
}) {
  return (
    <>
      <VStack>
        <Heading size="md">Media</Heading>
        <Text size="sm">View photos of the job</Text>
      </VStack>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <ResultsWithLoader hasResults={Boolean(media.length)}>
          <HStack space="sm">
            {media.map((m) => (
              <SupabaseSignedImage
                cacheInSeconds={3600}
                path={m.path}
                size="xl"
                key={m.id}
              />
            ))}
          </HStack>
        </ResultsWithLoader>
      </ScrollView>
    </>
  );
}

export default function Screen() {
  const { top } = useSafeAreaInsets();
  const { jobId } = useLocalSearchParams();
  const { customer } = useCustomerContext();
  const job = customer.jobs.find((job) => job.id === Number(jobId));

  return (
    <ScrollView style={{ paddingBlockStart: top }}>
      <VStack space="lg">
        <VStack className="px-6">
          <BackHeaderButton />
          <Heading className="text-typography-800" size="xl">
            Preview
          </Heading>
          <Text className="text-typography-400">View a summary of the job</Text>
        </VStack>
        <VStack className="px-6" space="lg">
          <CustomerInfo customer={customer} />
          <ProductList products={job?.products ?? []} />
          <MediaList media={job?.media ?? []} />
          <ScreenEnd />
        </VStack>
      </VStack>
    </ScrollView>
  );
}
