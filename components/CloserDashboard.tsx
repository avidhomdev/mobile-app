import { FRIENDLY_DATE_FORMAT } from "@/constants/date-formats";
import { DISPOSITION_STATUSES } from "@/constants/disposition_statuses";
import { ILocation, ILocationProfile } from "@/contexts/user-context";
import { formatAsCompactCurrency } from "@/utils/format-as-compact-currency";
import { formatAsCurrency } from "@/utils/format-as-currency";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import {
  Banknote,
  Calendar1,
  EllipsisVertical,
  PiggyBank,
} from "lucide-react-native";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Avatar, AvatarFallbackText, AvatarGroup } from "./ui/avatar";
import { Badge, BadgeText } from "./ui/badge";
import { Card } from "./ui/card";
import { Heading } from "./ui/heading";
import { Icon } from "./ui/icon";
import { Progress, ProgressFilledTrack } from "./ui/progress";
import { Text } from "./ui/text";
import {
  Table,
  TableBody,
  TableData,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

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

export function CloserDashboard({
  location,
}: {
  location: Partial<ILocation & ILocationProfile>;
}) {
  const router = useRouter();
  return (
    <View className="gap-y-6 p-6">
      {location.customers && (
        <ScrollView
          contentContainerClassName="gap-x-4"
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {location.customers?.map((customer) => {
            const dispositionStatus =
              DISPOSITION_STATUSES[customer.disposition_status] ||
              DISPOSITION_STATUSES.NEW;
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
            <TableHead>Setter</TableHead>
            <TableHead className="text-right">Closes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableData>Rajesh Kumar</TableData>
            <TableData className="text-right">10</TableData>
          </TableRow>
          <TableRow>
            <TableData>Priya Sharma</TableData>
            <TableData className="text-right">12</TableData>
          </TableRow>
          <TableRow>
            <TableData>Ravi Patel</TableData>
            <TableData className="text-right">6</TableData>
          </TableRow>
          <TableRow>
            <TableData>Ananya Gupta</TableData>
            <TableData className="text-right">18</TableData>
          </TableRow>
          <TableRow>
            <TableData>Arjun Singh</TableData>
            <TableData className="text-right">2</TableData>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">48</TableHead>
          </TableRow>
        </TableFooter>
      </Table>
    </View>
  );
}
