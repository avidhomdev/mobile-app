import BackHeaderButton from "@/src/components/BackHeaderButton";
import ScreenEnd from "@/src/components/ScreenEnd";
import { Alert, AlertText } from "@/src/components/ui/alert";
import { Button, ButtonText } from "@/src/components/ui/button";
import { Divider } from "@/src/components/ui/divider";
import { Heading } from "@/src/components/ui/heading";
import { HStack } from "@/src/components/ui/hstack";
import { Text } from "@/src/components/ui/text";
import { VStack } from "@/src/components/ui/vstack";
import { useUserContext } from "@/src/contexts/user-context";
import { supabase } from "@/src/lib/supabase";
import dayjs from "dayjs";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function DayOfWeek({ day }: { day: string }) {
  const { slots, toggleSlotTime } = useAvailabilityContext();
  const slot = slots[day];

  return (
    <VStack space="sm">
      <Heading size="sm" className="text-center">
        {day}
      </Heading>
      <Divider />
      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack space="sm">
          {Array.from({ length: 15 }, (_, num) => {
            const time = dayjs()
              .startOf("day")
              .set("hour", 6)
              .add(num * 1, "hour");

            const timeKey = time.get("hour");

            const hasTimeSlot = slot[timeKey];

            return (
              <Button
                action={hasTimeSlot ? "primary" : "secondary"}
                key={`${time.toString()}_${hasTimeSlot}`}
                onPress={() => toggleSlotTime({ day, timeKey })}
                size="md"
              >
                <ButtonText>{time.format("hh:mm a")}</ButtonText>
              </Button>
            );
          })}
        </VStack>
        <ScreenEnd />
      </ScrollView>
    </VStack>
  );
}
type AvailabilityObjectType = Record<string, Record<number, boolean>>;

type ToggleSlotTimeProps = {
  day: string;
  timeKey: number;
};

const AvailabilityContext = createContext<{
  errorMessage?: string;
  availability: AvailabilityObjectType | null;
  cancelEditing: () => void;
  isEditing: boolean;
  isSaving: boolean;
  save: () => void;
  slots: AvailabilityObjectType;
  toggleSlotTime: (args: ToggleSlotTimeProps) => void;
} | null>(null);

function useAvailabilityContext() {
  const context = useContext(AvailabilityContext);
  return context!;
}

const generateDefaultSchedule = () => {
  const hours = Array.from({ length: 8 }).reduce<Record<number, boolean>>(
    (agg, _, cur) => {
      agg[cur + 9] = true;
      return agg;
    },
    {}
  );

  return {
    Sunday: {},
    Monday: hours,
    Tuesday: hours,
    Wednesday: hours,
    Thursday: hours,
    Friday: hours,
    Saturday: {},
  };
};

const AvailabilityProvider = ({
  children,
  availability,
}: PropsWithChildren<{
  availability: AvailabilityObjectType | null;
}>) => {
  const { location, profile } = useUserContext();
  const [errorMessage, setError] = useState<string>();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const defaultSlots = availability || generateDefaultSchedule();
  const [slots, setSlots] = useState<AvailabilityObjectType>(defaultSlots);

  const handleToggleSlotTime = useCallback(
    ({ day, timeKey }: ToggleSlotTimeProps) => {
      setIsEditing(true);
      return setSlots((prevState) => {
        const dayKey = day as keyof typeof slots;

        return {
          ...prevState,
          [dayKey]: {
            ...prevState[dayKey],
            [timeKey]: !prevState[dayKey][timeKey],
          },
        };
      });
    },
    []
  );

  const handleSave = useCallback(async () => {
    setIsSaving(true);

    return supabase
      .from("business_profiles")
      .update({
        availability: slots,
      })
      .match({ business_id: location.business_id, profile_id: profile.id })
      .then(({ error }) => {
        if (error) {
          setError(error.message);
        } else {
          setError("");
        }
        setIsSaving(false);
        setIsEditing(false);
      });
  }, [location.business_id, profile.id, slots]);

  const cancelEditing = useCallback(() => {
    setIsEditing(false);
    setSlots(defaultSlots);
  }, [defaultSlots]);

  const value = useMemo(
    () => ({
      availability,
      cancelEditing,
      errorMessage,
      isEditing,
      isSaving,
      toggleSlotTime: handleToggleSlotTime,
      save: handleSave,
      slots,
    }),
    [
      availability,
      cancelEditing,
      errorMessage,
      isEditing,
      isSaving,
      handleToggleSlotTime,
      handleSave,
      slots,
    ]
  );

  return (
    <AvailabilityContext.Provider value={value}>
      {children}
    </AvailabilityContext.Provider>
  );
};

function DaySelector() {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <ScrollView
      className="flex-1"
      contentContainerClassName="px-6"
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      <HStack space="md">
        {days.map((day) => (
          <DayOfWeek key={day} day={day} />
        ))}
      </HStack>
    </ScrollView>
  );
}

function AvailabilityHeaderActions() {
  const { cancelEditing, isEditing, save, isSaving } = useAvailabilityContext();

  return (
    <HStack className="justify-between">
      <BackHeaderButton />
      {isEditing ? (
        <HStack space="sm">
          <Button
            action="secondary"
            disabled={isSaving}
            onPress={cancelEditing}
            size="xs"
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button disabled={isSaving} onPress={save} size="xs">
            <ButtonText>{isSaving ? "Saving..." : "Save"}</ButtonText>
          </Button>
        </HStack>
      ) : (
        <Button action="secondary" disabled={isSaving} size="xs">
          <ButtonText>Save</ButtonText>
        </Button>
      )}
    </HStack>
  );
}

function Error() {
  const { errorMessage } = useAvailabilityContext();

  return (
    errorMessage && (
      <Alert action="error">
        <AlertText>{errorMessage}</AlertText>
      </Alert>
    )
  );
}

type BusinessProfileResponseType = {
  availability: AvailabilityObjectType;
};

const useBusinessProfileAvailability = ({
  profile_id,
  business_id,
}: {
  profile_id: string;
  business_id: string;
}) => {
  const [data, setData] = useState<BusinessProfileResponseType>();
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    return supabase
      .from("business_profiles")
      .select("availability")
      .match({ profile_id, business_id })
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) {
          setData(data as BusinessProfileResponseType);
        }
        setIsLoading(false);
      });
  }, [business_id, profile_id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data: (data || { availability: null }) as BusinessProfileResponseType,
    isLoading,
    refresh: fetchData,
  };
};

export default function Screen() {
  const { top } = useSafeAreaInsets();
  const { profile, location } = useUserContext();
  const { isLoading, data } = useBusinessProfileAvailability({
    profile_id: profile.id,
    business_id: location.business_id!,
  });

  return (
    <AvailabilityProvider
      key={JSON.stringify(data?.availability)}
      availability={data?.availability}
    >
      <VStack className="flex-1" space="lg" style={{ paddingTop: top }}>
        <VStack className="px-6">
          <AvailabilityHeaderActions />
          <Heading>Availability</Heading>
          <Text size="sm">
            Control the hours you are available during the week.
          </Text>
        </VStack>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <>
            <Error />
            <DaySelector />
          </>
        )}
      </VStack>
    </AvailabilityProvider>
  );
}
