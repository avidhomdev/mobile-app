import BackHeaderButton from "@/src/components/BackHeaderButton";
import { ResultsWithLoader } from "@/src/components/ResultsWithLoader";
import ScreenEnd from "@/src/components/ScreenEnd";
import SupabaseSignedImage from "@/src/components/SupabaseSignedImage";
import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetSectionHeaderText,
} from "@/src/components/ui/actionsheet";
import { Badge, BadgeText } from "@/src/components/ui/badge";
import { Button, ButtonIcon, ButtonText } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { Heading } from "@/src/components/ui/heading";
import { HStack } from "@/src/components/ui/hstack";
import { Icon } from "@/src/components/ui/icon";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { useFetchStatus } from "@/src/hooks/useFetchStatus";
import { supabase } from "@/src/lib/supabase";
import { formatAsCurrency } from "@/src/utils/format-as-currency";
import { homApiFetch } from "@/src/utils/hom-api-fetch";
import { Tables } from "@/supabase";
import dayjs from "dayjs";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { Camera, Receipt, Upload, UploadCloud } from "lucide-react-native";
import { useEffect, useState, useTransition } from "react";
import { Linking, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface StripeInvoice {
  hosted_invoice_url: string;
  id: string;
  status: string;
  status_transitions: {
    paid_at: number;
  };
}

interface JobPayment extends Tables<"business_location_job_payments"> {
  receipt_url: string | null;
  stripeInvoice: StripeInvoice;
}

function useJobPayments() {
  const { jobId } = useLocalSearchParams();
  const [data, setData] = useState<JobPayment[]>([]);
  const { startFetching, setHasFetched, isFetching } = useFetchStatus();

  useEffect(() => {
    async function getJobPayments(jobId: number) {
      const { data } = await homApiFetch({
        endpoint: `job/${jobId}/payments`,
        options: {
          method: "GET",
        },
      });

      return data || [];
    }

    startFetching(() => {
      getJobPayments(Number(jobId))
        .then(setData)
        .then(() => setHasFetched(true));
    });
  }, [jobId, setHasFetched, startFetching]);

  return {
    data,
    isFetching,
  };
}

function CapturePaymentActionSheet({
  onClose,
  payment,
}: {
  onClose: () => void;
  payment: JobPayment;
}) {
  const { bottom } = useSafeAreaInsets();
  const [isSaving, startSaving] = useTransition();
  const [file, setFile] = useState<{
    id: string;
    path: string;
    fullPath: string;
  } | null>(null);

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (!result.canceled) {
      const [asset] = result.assets;
      const fileRootPath = `${payment.business_id}/locations/${payment.id}/job/${payment.job_id}/payments/${payment.id}`;
      const filePath = `${fileRootPath}/${dayjs().unix()}_${
        asset.fileName || "receipt"
      }`;

      return fetch(asset.uri)
        .then((r) => r.blob())
        .then((blob) => new Response(blob).arrayBuffer())
        .then((arrayBuffer) =>
          supabase.storage.from("business").upload(filePath, arrayBuffer, {
            cacheControl: "3600",
            upsert: true,
          })
        )
        .then(async ({ data: storageFile }) => {
          if (!storageFile) return;

          setFile(storageFile);
        });
    }
  };

  const handleSavePayment = async () => {
    if (!file) return;
    startSaving(() => {
      supabase
        .from("business_location_job_payments")
        .update({
          photo: file.path,
          received_on: dayjs().format("YYYY-MM-DD"),
        })
        .eq("id", payment.id)
        .then(({ error }) => {
          if (!error) return onClose();
        });
    });
  };

  return (
    <Actionsheet isOpen onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent style={{ paddingBlockEnd: bottom }}>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
          <ActionsheetSectionHeaderText>
            Capture Payment Details
          </ActionsheetSectionHeaderText>
        </ActionsheetDragIndicatorWrapper>
        <VStack className="w-full" space="lg">
          {file ? (
            <SupabaseSignedImage path={file.path} size="square" />
          ) : (
            <Pressable onPress={handleImagePicker}>
              <VStack className="my-[18px] items-center justify-center rounded-xl bg-background-50 border border-dashed border-outline-300 h-[130px] w-full">
                <Icon
                  as={UploadCloud}
                  className="h-[62px] w-[62px] stroke-background-200"
                />
                <Text size="sm">No files uploaded yet</Text>
              </VStack>
            </Pressable>
          )}
          <Button className="grow w-full" onPress={handleSavePayment} size="lg">
            <ButtonIcon as={Upload} />
            <ButtonText>{isSaving ? "Saving..." : "Save"}</ButtonText>
          </Button>
        </VStack>
      </ActionsheetContent>
    </Actionsheet>
  );
}

function PaymentListItem({ payment }: { payment: JobPayment }) {
  const [isCaptureVisible, setIsCaptureVisible] = useState(false);

  return (
    <>
      <Card>
        <VStack space="md">
          <HStack space="sm">
            <VStack className="grow flex-1">
              <Heading size="sm">{payment.name}</Heading>
              <VStack>
                <Text className="text-typography-400" size="xs">
                  Received On
                </Text>
                <Text>{payment.received_on || "Missing"}</Text>
              </VStack>
            </VStack>
            <VStack>
              <Badge action="info" className="self-end">
                <BadgeText>{payment.type}</BadgeText>
              </Badge>
              <Text className="text-right" size="lg">
                {formatAsCurrency(payment.amount)}
              </Text>
            </VStack>
          </HStack>
          <HStack className="justify-end" space="sm">
            {payment.receipt_url ? (
              <Button
                action="positive"
                onPress={() => Linking.openURL(payment.receipt_url!)}
              >
                <ButtonIcon as={Receipt} />
                <ButtonText>
                  {payment.stripeInvoice ? "Invoice" : "Receipt"}
                </ButtonText>
              </Button>
            ) : (
              <Button
                action="secondary"
                onPress={() => setIsCaptureVisible(true)}
              >
                <ButtonIcon as={Camera} />
                <ButtonText>Capture</ButtonText>
              </Button>
            )}
          </HStack>
        </VStack>
      </Card>
      {isCaptureVisible && (
        <CapturePaymentActionSheet
          onClose={() => setIsCaptureVisible(false)}
          payment={payment}
        />
      )}
    </>
  );
}

function PaymentList() {
  const { data, isFetching } = useJobPayments();

  return (
    <VStack className="px-6" space="sm">
      <ResultsWithLoader
        isFetching={isFetching}
        hasResults={Boolean(data?.length)}
      >
        {data.map((payment) => (
          <PaymentListItem key={payment.id} payment={payment} />
        ))}
      </ResultsWithLoader>
    </VStack>
  );
}

export default function Screen() {
  const { top } = useSafeAreaInsets();

  return (
    <ScrollView
      contentContainerClassName="gap-y-6"
      style={{ paddingBlockStart: top }}
    >
      <VStack className="px-6">
        <BackHeaderButton />
        <Heading className="text-typography-800" size="xl">
          Payments
        </Heading>
        <Text className="text-typography-400">
          History of payments belonging to the job
        </Text>
      </VStack>
      <PaymentList />
      <ScreenEnd />
    </ScrollView>
  );
}
