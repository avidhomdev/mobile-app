import { FRIENDLY_DATE_FORMAT } from "@/constants/date-formats";
import { DISPOSITION_STATUSES } from "@/constants/disposition-statuses";
import { useLocationContext } from "@/contexts/location-context";
import { formatAsCurrency } from "@/utils/format-as-currency";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { Banknote, Calendar1, EllipsisVertical } from "lucide-react-native";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { twMerge } from "tailwind-merge";
import { Avatar, AvatarFallbackText, AvatarGroup } from "./ui/avatar";
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
import { Text } from "./ui/text";

const avatars = [
  {
    src: "https://example.com.jpg",
    alt: "Sandeep Srivastva",
    color: "bg-emerald-600",
  },
];

export function SetterDashboard() {
  const { location } = useLocationContext();
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
                    pathname: "/customer/[customerId]",
                    params: { customerId: customer.id },
                  })
                }
              >
                <Card className={twMerge(dispositionStatus.bg, "w-72 border")}>
                  <View className="items-start mb-1 justify-between flex-row">
                    <Badge action={dispositionStatus?.action} size="sm">
                      <BadgeText>{dispositionStatus?.label}</BadgeText>
                    </Badge>
                    <Icon as={EllipsisVertical} />
                  </View>
                  <Heading className="font-normal tracking-tighter" size="xl">
                    {customer.full_name}
                  </Heading>

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
      <View className="gap-x-2 flex-row">
        <Card className="basis-1/2">
          <Icon as={Calendar1} />
          <Text bold className="uppercase text-typography-400" size="xs">
            Scheduled
          </Text>
          <Text size="lg">0</Text>
        </Card>

        <Card className="basis-1/2">
          <Icon as={Banknote} />
          <Text bold className="uppercase text-typography-400" size="xs">
            Commission
          </Text>
          <Text bold className="text-success-300" size="lg">
            {formatAsCurrency(90_000)}
          </Text>
        </Card>
      </View>

      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>Setter</TableHead>
            <TableHead className="text-right">Sets</TableHead>
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
