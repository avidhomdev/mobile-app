import BackHeaderButton from "@/components/BackHeaderButton";
import ScreenEnd from "@/components/ScreenEnd";
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
import { Text } from "@/components/ui/text";
import { useCustomerContext } from "@/contexts/customer-context";
import { useUserContext } from "@/contexts/user-context";
import { supabase } from "@/lib/supabase";
import { formatAsCurrency } from "@/utils/format-as-currency";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Trash } from "lucide-react-native";
import { Fragment, useState } from "react";

import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

export default function Screen() {
  const { customer } = useCustomerContext();
  const { bidId } = useLocalSearchParams();
  const { top } = useSafeAreaInsets();
  const bid = customer?.bids.find((bid) => bid.id === Number(bidId));
  const totalNumberOfUnits = bid?.products.reduce((acc, product) => {
    return acc + Number(product.units ?? 0);
  }, 0);
  const commissionPerUnit = Number(bid?.commission) / (totalNumberOfUnits || 1);
  const calculatedTotal = bid?.products.reduce((acc, product) => {
    return acc + Number(product.unit_price) * Number(product.units ?? 0);
  }, 0);

  const commission = bid?.commission;
  const bidTotal = Number(calculatedTotal) + Number(commission);

  return (
    <ScrollView className="px-6" contentContainerClassName="gap-y-6">
      <View style={{ paddingTop: top }}>
        <BackHeaderButton />
        <Heading>{`View ${bid?.name} bid`}</Heading>
      </View>
      <View className="gap-y-2">
        {bid?.products.map((product) => {
          const units = product.units ?? 0;
          const unitPrice = product.unit_price ?? 0;
          const calculatedUnitPrice = unitPrice + commissionPerUnit;
          const calculatedProductTotal =
            Number(calculatedUnitPrice) * Number(units);

          return (
            <Card className="gap-y-2" key={product.id} variant="filled">
              <Text>{product.product.name}</Text>
              <Divider />
              <View className="flex-row justify-between items-center">
                <Text size="sm">{`${formatAsCurrency(
                  calculatedUnitPrice
                )} x ${units} ${product.product.unit}`}</Text>
                <Text bold>{formatAsCurrency(calculatedProductTotal)}</Text>
              </View>
            </Card>
          );
        })}
      </View>
      <Card className="border border-gray-200 gap-y-2">
        <Heading size="sm">Notes</Heading>
        <Divider />
        <Text>{bid?.notes}</Text>
      </Card>
      <Card className="border border-gray-200 gap-y-2">
        <Heading size="sm">Total</Heading>
        <Divider />
        <View className="gap-y-2">
          <View className="flex-row items-center justify-between bord">
            <Text bold>Bid Total</Text>
            <Text bold>{formatAsCurrency(bidTotal)}</Text>
          </View>
        </View>
      </Card>
      <DeleteBidButton bidId={Number(bidId)} />
      <ScreenEnd />
    </ScrollView>
  );
}
