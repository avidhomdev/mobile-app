import BackHeaderButton from "@/src/components/BackHeaderButton";
import { ResultsWithLoader } from "@/src/components/ResultsWithLoader";
import ScreenEnd from "@/src/components/ScreenEnd";
import { Badge, BadgeText } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";
import { Heading } from "@/src/components/ui/heading";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { FRIENDLY_DATE_FORMAT } from "@/src/constants/date-formats";
import { useFetchStatus } from "@/src/hooks/useFetchStatus";
import { homApiFetch } from "@/src/utils/hom-api-fetch";
import { Tables } from "@/supabase";
import dayjs from "dayjs";
import { useLocalSearchParams } from "expo-router";
import { Suspense, useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface DocusignEnvelope {
  purgeState: string;
  allowComments: string;
  allowMarkup: string;
  allowReassign: string;
  anySigner: string;
  attachmentsUri: string;
  autoNavigation: string;
  burnDefaultTabData: string;
  certificateUri: string;
  createdDateTime: string;
  customFieldsUri: string;
  documentsCombinedUri: string;
  documentsUri: string;
  emailSubject: string;
  enableWetSign: string;
  envelopeId: string;
  envelopeIdStamping: string;
  envelopeLocation: string;
  envelopeUri: string;
  expireAfter: string;
  expireDateTime: string;
  expireEnabled: string;
  initialSentDateTime: string;
  isSignatureProviderEnvelope: string;
  lastModifiedDateTime: string;
  notificationUri: string;
  recipientsUri: string;
  sender: {
    userName: string;
    userId: string;
    accountId: string;
    email: string;
    ipAddress: string;
  };
  sentDateTime: string;
  signingLocation: string;
  status: string;
  statusChangedDateTime: string;
  templatesUri: string;
  uSigState: string;
}

type DocusignDocument = Tables<"business_location_job_docusign_envelopes"> & {
  envelope: DocusignEnvelope;
};

function useDocusignEnvelopeDocuments() {
  const { jobId } = useLocalSearchParams();
  const [documents, setDocuments] = useState<DocusignDocument[]>([]);
  const { startFetching, isFetching, setHasFetched } = useFetchStatus();

  useEffect(() => {
    startFetching(() => {
      homApiFetch({
        endpoint: `job/${jobId}/docusign-envelope-documents`,
        options: {
          method: "GET",
        },
      })
        .then(({ data }) => setDocuments(data?.documents || []))
        .then(() => setHasFetched(true));
    });
  }, [jobId, startFetching, setHasFetched]);

  return { documents, isFetching };
}

function DocumentListItem({ document }: { document: DocusignDocument }) {
  return (
    <Card className="w-full">
      <Badge
        className="self-start"
        action={document.envelope.status === "completed" ? "success" : "info"}
      >
        <BadgeText>{document.envelope.status}</BadgeText>
      </Badge>
      <Text className="text-typography-600">
        {document.envelope.emailSubject}
      </Text>
      <Text className="text-typography-400">
        {dayjs(document.envelope.createdDateTime).format(FRIENDLY_DATE_FORMAT)}
      </Text>
      <Text className="text-typography-400" size="sm">
        {document.envelope.sender.userName} ({document.envelope.sender.email})
      </Text>
    </Card>
  );
}

function DocumentsList() {
  const { documents, isFetching } = useDocusignEnvelopeDocuments();

  return (
    <VStack className="px-6" space="md">
      <ResultsWithLoader
        isFetching={isFetching}
        hasResults={Boolean(documents?.length)}
      >
        {documents.map((doc) => (
          <DocumentListItem key={doc.envelope_id} document={doc} />
        ))}
      </ResultsWithLoader>
    </VStack>
  );
}

export default function Screen() {
  const { top } = useSafeAreaInsets();

  return (
    <VStack space="lg" style={{ paddingBlockStart: top }}>
      <VStack className="px-6">
        <BackHeaderButton />
        <Heading className="text-typography-800" size="xl">
          Documents
        </Heading>
        <Text className="text-typography-400">
          Documents belonging to the job
        </Text>
      </VStack>
      <ScrollView>
        <Suspense fallback={<Text>Loading documents...</Text>}>
          <DocumentsList />
        </Suspense>
        <ScreenEnd />
        <ScreenEnd />
      </ScrollView>
    </VStack>
  );
}
