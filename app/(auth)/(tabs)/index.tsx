import {
  Avatar,
  AvatarFallbackText,
  AvatarGroup,
} from "@/components/ui/avatar";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableData,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Text } from "@/components/ui/text";
import { FRIENDLY_DATE_FORMAT } from "@/constants/date-formats";
import { DISPOSITION_STATUSES } from "@/constants/disposition_statuses";
import { useLocationContext } from "@/contexts/location-context";
import { useUserContext } from "@/contexts/user-context";
import { formatAsCompactCurrency } from "@/utils/format-as-compact-currency";
import { formatAsCurrency } from "@/utils/format-as-currency";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import {
  Banknote,
  Calendar1,
  CheckCircle2,
  CircleIcon,
  EllipsisVertical,
  MapPinHouse,
  PiggyBank,
  PlusSquareIcon,
  Trophy,
  UserPlus2Icon,
} from "lucide-react-native";
import { useState } from "react";
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { twMerge } from "tailwind-merge";

const avatars = [
  {
    src: "https://example.com.jpg",
    alt: "Sandeep Srivastva",
    color: "bg-emerald-600",
  },
  {
    src: "https://example.com.jpg",
    alt: "Arjun Kapoor",
    color: "bg-cyan-600",
  },
  {
    src: "https://example.com.jpg",
    alt: "Ritik Sharma ",
    color: "bg-indigo-600",
  },
  {
    src: "https://example.com.jpg",
    alt: "Akhil Sharma",
    color: "bg-gray-600",
  },
  {
    src: "https://example.com.jpg",
    alt: "Rahul Sharma ",
    color: "bg-red-400",
  },
];

function CloserDashboard() {
  const { location } = useLocationContext();
  const router = useRouter();
  return (
    <View className="gap-y-6">
      {location.customers && (
        <ScrollView
          contentContainerClassName="gap-x-4"
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {location.customers?.map((customer) => {
            const dispositionStatus =
              DISPOSITION_STATUSES[customer.disposition_status];
            return (
              <TouchableOpacity
                key={customer.id}
                onPress={() =>
                  router.push({
                    pathname: "/(auth)/(tabs)/customers/[customerId]",
                    params: { customerId: customer.id },
                  })
                }
              >
                <Card
                  className={twMerge(
                    `bg-${dispositionStatus.action}-50`,
                    "w-72"
                  )}
                >
                  <View className="items-start mb-1 justify-between flex-row">
                    <Badge action={dispositionStatus?.action} size="sm">
                      <BadgeText>{dispositionStatus?.label}</BadgeText>
                    </Badge>
                    <Icon as={EllipsisVertical} />
                  </View>
                  <Heading className="font-normal tracking-tighter" size="xl">
                    {customer.full_name}
                  </Heading>
                  <Text className="text-typography-500" size="xs">
                    Job is in progress and installers are at the job site.
                  </Text>
                  <View className="my-2 flex-row gap-x-2 items-center">
                    <Progress
                      className="shrink"
                      orientation="horizontal"
                      size="sm"
                      value={40}
                    >
                      <ProgressFilledTrack className="bg-info-600" />
                    </Progress>
                    <View>
                      <Text bold size="xs">
                        40%
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <AvatarGroup className="ml-2">
                      {avatars.slice(0, 3).map((avatar, index) => {
                        return (
                          <Avatar
                            key={index}
                            size="xs"
                            className={
                              "border-2 border-outline-0 " + avatar.color
                            }
                          >
                            <AvatarFallbackText className="text-white">
                              {avatar.alt}
                            </AvatarFallbackText>
                          </Avatar>
                        );
                      })}
                    </AvatarGroup>
                    <View className="flex-row gap-x-1 items-center">
                      <Icon as={Calendar1} size="xs" />
                      <Text size="xs">
                        {dayjs(customer.created_at).format(
                          FRIENDLY_DATE_FORMAT
                        )}
                      </Text>
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
      <View className="gap-y-2">
        <View className="flex-row gap-x-2">
          <Card className="basis-1/2">
            <Icon as={Calendar1} />
            <Text bold className="uppercase text-typography-400" size="xs">
              Scheduled
            </Text>
            <Text size="lg">0</Text>
          </Card>
          <Card className="basis-1/2">
            <Icon as={PiggyBank} />
            <Text bold className="uppercase text-typography-400" size="xs">
              Closed
            </Text>
            <Text size="lg">0</Text>
          </Card>
        </View>
        <View className="flex-row gap-x-2">
          <Card className="basis-1/2">
            <Icon as={Banknote} />
            <Text bold className="uppercase text-typography-400" size="xs">
              Commission
            </Text>
            <Text bold className="text-success-300" size="lg">
              {formatAsCurrency(90_000)}
            </Text>
          </Card>
          <Card className="basis-1/2">
            {/*
            TODO: projected calculation
            ---
            appointments up to selected date  / closed jobs up to selected date = close percentage
            job commission totals up to selected date / number of jobs = job commission average
            upcoming appointments * close percentage = number of projected jobs
            number of projected jobs * job commission average = upcoming job commission average projection
            current job total + upcoming job commission average projection = projected
           */}
            <Icon as={Banknote} />
            <Text bold className="uppercase text-typography-400" size="xs">
              Projected
            </Text>
            <Text bold className="text-success-300" size="lg">
              {formatAsCompactCurrency(100_000)}
            </Text>
          </Card>
        </View>
      </View>

      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>
              <Text>Closer</Text>
            </TableHead>
            <TableHead>
              <Text className="text-right">Closes</Text>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableData className="font-light">
              <Text>Rajesh Kumar</Text>
            </TableData>
            <TableData className="font-light text-right">
              <Text>40</Text>
            </TableData>
          </TableRow>

          <TableRow className="bg-yellow-50">
            <TableData>
              <View className="items-center flex-row gap-x-1">
                <Icon as={Trophy} size="xs" />
                <Text bold>Ravi Patel</Text>
              </View>
            </TableData>
            <TableData className="text-right">
              <Text>26</Text>
            </TableData>
          </TableRow>

          <TableRow>
            <TableData className="font-light">
              <Text>Ananya Gupta </Text>
            </TableData>
            <TableData className="font-light text-right">
              <Text>18</Text>
            </TableData>
          </TableRow>

          <TableRow>
            <TableData className="font-light">
              <Text>Arjun Signh </Text>
            </TableData>
            <TableData className="font-light text-right">
              <Text>12</Text>
            </TableData>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableHead className="font-light">Total</TableHead>
            <TableHead className="font-light text-right">92</TableHead>
          </TableRow>
        </TableFooter>
      </Table>
    </View>
  );
}

function SetterDashboard() {
  const { location } = useLocationContext();
  return (
    <View className="gap-y-6">
      <WelcomeBanner />
      <Quote />
      <View className="gap-y-2">
        <Heading className="text-typography-600 uppercase" size="sm">
          Tasks
        </Heading>
        <Card>
          <TouchableOpacity className="flex-row items-center gap-x-2">
            <Icon as={CircleIcon} className="text-typography-500" size="xl" />
            <Text>Setter Dashboard</Text>
          </TouchableOpacity>
        </Card>
        <Card>
          <TouchableOpacity className="flex-row items-center gap-x-2">
            <Icon as={CheckCircle2} className="text-success-400" size="xl" />
            <Text>Setter Dashboard</Text>
          </TouchableOpacity>
        </Card>
        <Card>
          <TouchableOpacity className="flex-row items-center gap-x-2">
            <Icon as={CircleIcon} className="text-typography-500" size="xl" />
            <Text>Setter Dashboard</Text>
          </TouchableOpacity>
        </Card>
        <Card>
          <TouchableOpacity className="flex-row items-center gap-x-2">
            <Icon as={CircleIcon} className="text-typography-500" size="xl" />
            <Text>Setter Dashboard</Text>
          </TouchableOpacity>
        </Card>
        <View className="items-end">
          <Button action="secondary" variant="link">
            <ButtonIcon as={PlusSquareIcon} />
            <ButtonText>Add Task</ButtonText>
          </Button>
        </View>
      </View>
      <View className="gap-y-2">
        <Heading className="text-typography-600 uppercase" size="sm">
          Customers
        </Heading>
        <ScrollView
          horizontal
          contentContainerClassName="gap-x-4"
          showsHorizontalScrollIndicator={false}
        >
          {location.customers?.slice(0, 5).map((customer) => (
            <Card className="basis-1/2 max-w-72 gap-y-2" key={customer.id}>
              <Text>{customer.full_name}</Text>
              <View>
                <Text size="sm">{customer.phone || "No phone"}</Text>
                <Text size="sm">{customer.email || "No email"}</Text>
              </View>
              <View className="flex-row items-center gap-x-2">
                <Icon as={MapPinHouse} className="text-typography-500" />
                <View>
                  <Text size="xs">{customer.address}</Text>
                  <Text size="xs">{`${customer.city}, ${customer.state} ${customer.postal_code}`}</Text>
                </View>
              </View>
            </Card>
          ))}
        </ScrollView>
        <View className="items-end">
          <Button action="secondary" variant="link">
            <ButtonIcon as={UserPlus2Icon} />
            <ButtonText>Add Customer</ButtonText>
          </Button>
        </View>
      </View>
    </View>
  );
}

function Quote() {
  return (
    <Card className="bg-gray-800 gap-y-2 flex-1">
      <Text className="text-gray-300 text-sm">Today&apos;s quote</Text>
      <Text className="text-white italic text-xl font-semibold">
        I find that the harder I work, the more luck I seem to have
      </Text>
      <Text className="text-sm -mt-1">- Thomas Jefferson</Text>
    </Card>
  );
}

function WelcomeBanner() {
  const { profile } = useUserContext();

  return (
    <View>
      <Text>Welcome back,</Text>
      <Heading size="xl">{profile.full_name}</Heading>
    </View>
  );
}

export default function Dashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { refreshData } = useUserContext();
  const { location } = useLocationContext();

  return (
    <ScrollView
      contentContainerClassName="p-6"
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
      {location.is_setter && <SetterDashboard />}
      {location.is_closer && <CloserDashboard />}
    </ScrollView>
  );
}
