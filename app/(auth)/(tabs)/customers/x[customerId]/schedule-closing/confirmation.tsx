import celebration from "@/assets/images/illustrations/celebration.png";
import ScreenEnd from "@/components/ScreenEnd";
import {
  Button,
  ButtonGroup,
  ButtonIcon,
  ButtonText,
} from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { SHORT_FRIENDLY_DATE_TIME_FORMAT } from "@/constants/date-formats";
import { useUserContext } from "@/contexts/user-context";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CalendarPlus2, ChevronLeft, ShareIcon } from "lucide-react-native";
import { ScrollView, View } from "react-native";

export default function ScheduleClosingConfirmationScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { closers } = useUserContext();
  const closer_name = closers?.find(
    (closer) => closer.id === params.closer_id
  )?.full_name;

  return (
    <ScrollView contentContainerClassName="gap-y-4 p-4">
      <Image
        alt="Celebration"
        source={celebration}
        size="none"
        className="size-72 mx-auto"
      />
      <View>
        <Heading className="text-center text-typography-700" size="xl">
          Congratulations!
        </Heading>
        <Text className="text-center text-typography-400">
          Appointment scheduled
        </Text>
      </View>
      <Card variant="filled" className="gap-y-4">
        <Text bold>{`Meeting with ${closer_name}`}</Text>
        <View>
          <Text>{`Start: ${dayjs(params.start_datetime as string).format(
            SHORT_FRIENDLY_DATE_TIME_FORMAT
          )}`}</Text>
          <Text>{`End: ${dayjs(params.end_datetime as string).format(
            SHORT_FRIENDLY_DATE_TIME_FORMAT
          )}`}</Text>
          <Text>{`Duration: ${params.duration} mins`}</Text>
        </View>
        <ButtonGroup flexDirection="row">
          <Button>
            <ButtonIcon as={CalendarPlus2} />
            <ButtonText>Add to Calendar</ButtonText>
          </Button>
          <Button action="secondary">
            <ButtonIcon as={ShareIcon} />
            <ButtonText>Share</ButtonText>
          </Button>
        </ButtonGroup>
      </Card>
      <Button
        action="secondary"
        onPress={() =>
          router.push({
            pathname: "/customer/[customerId]",
            params: { customerId: params.customerId as string },
          })
        }
        variant="link"
      >
        <ButtonIcon as={ChevronLeft} />
        <ButtonText>Back to Customer</ButtonText>
      </Button>
      <ScreenEnd />
    </ScrollView>
  );
}
