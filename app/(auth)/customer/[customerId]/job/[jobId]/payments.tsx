import BackHeaderButton from "@/components/BackHeaderButton";
import ScreenEnd from "@/components/ScreenEnd";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { FRIENDLY_DATE_FORMAT } from "@/constants/date-formats";
import { supabase } from "@/lib/supabase";
import { Tables } from "@/supabase";
import { formatAsCurrency } from "@/utils/format-as-currency";
import dayjs from "dayjs";
import { useGlobalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

async function getJobPayments(jobId: number) {
  const { data } = await supabase
    .from("business_location_job_payments")
    .select("*")
    .eq("job_id", jobId)
    .order("created_at", { ascending: false });

  return data || [];
}

export default function Screen() {
  const { jobId } = useGlobalSearchParams();
  const { top } = useSafeAreaInsets();
  const [payments, setPayments] = useState<
    Tables<"business_location_job_payments">[]
  >([]);

  useEffect(() => {
    getJobPayments(Number(jobId)).then(setPayments);
  }, [jobId]);

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
      <VStack className="px-6" space="sm">
        {payments.map((payment) => (
          <HStack
            className="w-full justify-between items-center"
            key={payment.id}
          >
            <VStack>
              <Text>{payment.name}</Text>
              <Text size="xs">
                {dayjs(payment.created_at).format(FRIENDLY_DATE_FORMAT)}
              </Text>
            </VStack>
            <Text>{payment.type || "No type found"}</Text>
            <Text>{formatAsCurrency(payment.amount)}</Text>
          </HStack>
        ))}
      </VStack>
      <ScreenEnd />
    </ScrollView>
  );
}
