import BackHeaderButton from "@/components/BackHeaderButton";
import { BidRequirementsList } from "@/components/BidRequirementsList";
import ScreenEnd from "@/components/ScreenEnd";
import { ScreenSectionHeading } from "@/components/ScreenSectionHeading";
import SupabaseSignedImage from "@/components/SupabaseSignedImage";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { MEDIA_TYPES } from "@/constants/media-types";
import { useCustomerContext } from "@/contexts/customer-context";
import { ILocationCustomerBid, useUserContext } from "@/contexts/user-context";
import { supabase } from "@/lib/supabase";
import { formatAsCurrency } from "@/utils/format-as-currency";
import { getBidRequirementsForJob } from "@/utils/get-bid-requirements-for-job";
import { toggleState } from "@/utils/toggle-state";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import {
  Blocks,
  Construction,
  Eye,
  EyeOff,
  Image,
  Settings,
  Trash,
} from "lucide-react-native";
import { Fragment, useState } from "react";

import { Pressable, RefreshControl, ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";

function DeleteBidButton({ bidId }: { bidId: number }) {
  const { refreshData } = useUserContext();
  const router = useRouter();
  const { customer } = useCustomerContext();
  const bid = customer?.bids.find((bid) => bid.id === Number(bidId));
  const [isAlertDialogVisible, setIsAlertDialogVisible] = useState(false);
  const handleCloseAlertDialog = () => setIsAlertDialogVisible(false);
  const handleDeleteBid = async () =>
    supabase
      .from("business_location_customer_bids")
      .delete()
      .eq("id", bidId)
      .then(refreshData)
      .then(handleCloseAlertDialog)
      .then(router.back);

  return (
    <Fragment>
      <Button action="negative" onPress={() => setIsAlertDialogVisible(true)}>
        <ButtonIcon as={Trash} />
        <ButtonText>Delete Bid</ButtonText>
      </Button>
      <AlertDialog
        isOpen={isAlertDialogVisible}
        onClose={handleCloseAlertDialog}
        size="md"
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Heading className="text-typography-950 font-semibold" size="md">
              {`Are you sure you want to delete ${bid?.name}?`}
            </Heading>
          </AlertDialogHeader>
          <AlertDialogBody className="mt-3 mb-4">
            <Text size="sm">
              This action is irreversible and will delete all data related to
              this bid.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={handleCloseAlertDialog}
              size="sm"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button action="negative" size="sm" onPress={handleDeleteBid}>
              <ButtonText>Delete</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Fragment>
  );
}

function Header({
  bid,
  isPreviewing,
  togglePreviewing,
}: {
  bid: ILocationCustomerBid;
  isPreviewing: boolean;
  togglePreviewing: () => void;
}) {
  const { top } = useSafeAreaInsets();

  return (
    <VStack className="px-6" space="sm">
      <HStack
        className="justify-between items-center"
        style={{ paddingBlockStart: top }}
      >
        <BackHeaderButton />
        <HStack space="lg">
          <Pressable onPress={togglePreviewing}>
            <Icon
              as={isPreviewing ? EyeOff : Eye}
              className={twMerge(
                isPreviewing ? "text-typography-500" : "text-primary-400"
              )}
              size="2xl"
            />
          </Pressable>
          <Link
            href={{
              pathname: "/customer/[customerId]/bid/[bidId]/edit",
              params: { customerId: bid.customer_id, bidId: bid.id },
            }}
          >
            <Icon as={Settings} className="text-typography-600" size="2xl" />
          </Link>
        </HStack>
      </HStack>
      <View className="flex-row items-center gap-x-2">
        <Icon as={Construction} className="text-typography-500" size="lg" />
        <View className="w-0.5 h-full bg-typography-100" />
        <View>
          <Heading size="md">{`${isPreviewing ? "Previewing" : ""} ${
            bid.name
          }`}</Heading>
        </View>
      </View>
    </VStack>
  );
}

function PerfectPacketCheck({ bid }: { bid: ILocationCustomerBid }) {
  const bidRequirementsForJob = getBidRequirementsForJob(bid);
  return (
    <Card>
      <VStack space="md">
        <Heading size="sm">Requirements</Heading>
        <View>
          <BidRequirementsList requirements={bidRequirementsForJob} />
        </View>
      </VStack>
    </Card>
  );
}

function BidProducts({
  bid,
  isPreviewing,
}: {
  bid: ILocationCustomerBid;
  isPreviewing?: boolean;
}) {
  const { commission, discount = 0 } = bid;
  const calculatedTotal =
    bid.products.reduce((acc, product) => {
      return acc + Number(product.unit_price) * Number(product.units ?? 0);
    }, 0) + discount;

  const bidTotal = calculatedTotal + commission - discount;

  return (
    <VStack space="md">
      <ScreenSectionHeading
        icon={Blocks}
        heading="Products"
        subHeading="Products included in the bid"
      />
      <Card>
        <VStack space="md">
          <Heading size="sm">Products</Heading>
          {bid.products.map((product) => {
            const units = product.units ?? 0;

            return (
              <HStack
                className="items-center justify-between"
                key={product.product_id}
                space="md"
              >
                <Text className="flex-1">{product.product.name}</Text>
                <Text>{`${units.toLocaleString()} ${
                  product.product.unit
                }`}</Text>
              </HStack>
            );
          })}

          <Divider />

          {!isPreviewing && (
            <>
              <View className="flex-row items-center justify-between">
                <Text>Products Total</Text>
                <Text>{formatAsCurrency(calculatedTotal)}</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text>Commission</Text>
                <Text>{formatAsCurrency(commission)}</Text>
              </View>
            </>
          )}
          <View className="flex-row items-center justify-between">
            <Text>Discount</Text>
            <Text>
              {`${discount > 0 ? "-" : ""} ${formatAsCurrency(discount)}`}
            </Text>
          </View>

          <Divider />

          <View className="flex-row items-center justify-between bord">
            <Text bold>Total</Text>
            <Text bold>{formatAsCurrency(bidTotal)}</Text>
          </View>
        </VStack>
      </Card>
    </VStack>
  );
}

function BidMedia({ bid }: { bid: ILocationCustomerBid }) {
  const { media } = bid;
  const mediaByTypeDictionary = media.reduce<{
    [k: string]: typeof media;
  }>((dictionary, m) => {
    dictionary[m.type] = (dictionary[m.type] ?? []).concat(m);
    return dictionary;
  }, {});

  return (
    <Fragment>
      {Object.entries(MEDIA_TYPES).flatMap(([mediaTypeKey, mediaType]) => {
        if (!mediaType.required) return [];
        const mediaByType = mediaByTypeDictionary[mediaTypeKey] ?? [];
        const hasMediaByType = mediaByType.length > 0;

        return (
          <VStack key={mediaTypeKey} space="md">
            <ScreenSectionHeading
              icon={Image}
              heading={mediaType.name}
              subHeading={`View photos of the ${mediaType.name}`}
            />
            {hasMediaByType ? (
              <ScrollView
                contentContainerClassName="gap-x-2"
                horizontal
                showsHorizontalScrollIndicator={false}
              >
                {mediaByType.map((m) => (
                  <SupabaseSignedImage
                    cacheInSeconds={3600}
                    path={m.path}
                    size="xl"
                    key={m.id}
                  />
                ))}
              </ScrollView>
            ) : (
              <Card variant="filled">
                <Text>No media found.</Text>
              </Card>
            )}
          </VStack>
        );
      })}
    </Fragment>
  );
}

function HOAInformationCard({ bid }: { bid: ILocationCustomerBid }) {
  if (!bid.hoa_approval_required) return null;

  return (
    <Card>
      <VStack space="md">
        <Heading size="sm">HOA Contact</Heading>
        <HStack className="justify-between">
          <Text bold>Name</Text>
          <Text>{bid.hoa_contact_name}</Text>
        </HStack>
        <HStack className="justify-between">
          <Text bold>Email</Text>
          <Text>{bid.hoa_contact_email}</Text>
        </HStack>
        <HStack className="justify-between">
          <Text bold>Phone</Text>
          <Text>{bid.hoa_contact_phone}</Text>
        </HStack>
      </VStack>
    </Card>
  );
}

function WaterRebateCard({ bid }: { bid: ILocationCustomerBid }) {
  if (!bid.has_water_rebate) return null;

  return (
    <Card>
      <VStack space="md">
        <Heading size="sm">Water Rebate</Heading>
        <HStack className="justify-between">
          <Text bold>Company</Text>
          <Text>{bid.water_rebate_company}</Text>
        </HStack>
      </VStack>
    </Card>
  );
}

export default function Screen() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { refreshData } = useUserContext();
  const { customer } = useCustomerContext();
  const { bidId } = useLocalSearchParams();
  const bid = customer?.bids.find((bid) => bid.id === Number(bidId));

  const [isPreviewing, setIsPreviewing] = useState(false);

  if (!bid) {
    return (
      <View>
        <Text>Not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerClassName="gap-y-6"
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
      <Header
        bid={bid}
        isPreviewing={isPreviewing}
        togglePreviewing={toggleState(setIsPreviewing)}
      />
      <VStack className="mx-6" space="xl">
        {!isPreviewing && <PerfectPacketCheck bid={bid} />}
        <BidProducts bid={bid} isPreviewing={isPreviewing} />
        <BidMedia bid={bid} />
        <HOAInformationCard bid={bid} />
        <WaterRebateCard bid={bid} />
        {!isPreviewing && (
          <Card className="border border-gray-200 gap-y-2">
            <Heading size="sm">Notes</Heading>
            <Divider />
            <Text>{bid.notes}</Text>
          </Card>
        )}
        <DeleteBidButton bidId={Number(bidId)} />
        <ScreenEnd />
      </VStack>
    </ScrollView>
  );
}
