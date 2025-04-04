import { DISPOSITION_STATUSES } from "@/constants/disposition_statuses";
import { useLocationContext } from "@/contexts/location-context";
import { useUserContext } from "@/contexts/user-context";
import { formatAsCompactCurrency } from "@/utils/format-as-compact-currency";
import { formatAsCurrency } from "@/utils/format-as-currency";
import { useRouter } from "expo-router";
import {
  Banknote,
  Calendar1,
  PiggyBank,
  TrophyIcon,
  UserIcon,
} from "lucide-react-native";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Badge, BadgeText } from "./ui/badge";
import { Card } from "./ui/card";
import { Heading } from "./ui/heading";
import { Icon } from "./ui/icon";
import {
  Table,
  TableBody,
  TableData,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { tableDataStyle, tableHeadStyle } from "./ui/table/styles";
import { Text } from "./ui/text";

export function CloserDashboard() {
  const { closers } = useUserContext();
  const { location } = useLocationContext();
  const router = useRouter();

  return (
    <View className="gap-y-6 p-6">
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

      <View className="flex-row items-center gap-x-2">
        <Icon as={UserIcon} className="text-typography-500" size="lg" />
        <View className="w-0.5 h-full bg-typography-100" />
        <View>
          <Heading size="md">Recent Customers</Heading>
          <Text size="xs">Customers that were recently added</Text>
        </View>
      </View>
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
                    pathname: "/customer/[customerId]",
                    params: { customerId: customer.id },
                  })
                }
              >
                <Card
                  className={twMerge(dispositionStatus.bg, "w-72")}
                  variant="outline"
                >
                  <Badge action={dispositionStatus?.action} size="sm">
                    <BadgeText>{dispositionStatus?.label}</BadgeText>
                  </Badge>
                  <Heading className="font-normal tracking-tighter" size="xl">
                    {customer.full_name}
                  </Heading>
                </Card>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      <View className="flex-row items-center gap-x-2">
        <Icon as={TrophyIcon} className="text-typography-500" size="lg" />
        <View className="w-0.5 h-full bg-typography-100" />
        <View>
          <Heading size="md">Closer Leaderboard</Heading>
          <Text size="xs">Closers ranked by the number of jobs</Text>
        </View>
      </View>
      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead className={tableHeadStyle({ class: "p-2" })}>
              Closer
            </TableHead>
            <TableHead className={tableHeadStyle({ class: "p-2 text-right" })}>
              Jobs
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {closers?.map((closer) => (
            <TableRow key={closer.id}>
              <TableData className={tableDataStyle({ class: "p-2" })}>
                {closer.full_name}
              </TableData>
              <TableData
                className={tableDataStyle({ class: "p-2 text-right" })}
              >
                0
              </TableData>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableHead className={tableHeadStyle({ class: "p-2" })}>
              Total
            </TableHead>
            <TableHead className={tableHeadStyle({ class: "p-2 text-right" })}>
              0
            </TableHead>
          </TableRow>
        </TableFooter>
      </Table>
    </View>
  );
}
