import React, { useState } from "react";

import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@/components/ui/drawer";
import { Icon } from "@/components/ui/icon";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import { Text } from "@/components/ui/text";
import { useUserContext } from "@/contexts/user-context";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import {
  ChevronDown,
  Home,
  LogOut,
  MapPin,
  PhoneIcon,
  ShoppingCart,
  StarIcon,
  User,
  Wallet,
} from "lucide-react-native";
import { TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSession } from "@/contexts/auth-context";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />;
}

function ScreenHeader() {
  const [showDrawer, setShowDrawer] = useState(false);
  const { bottom, top } = useSafeAreaInsets();
  const { location, locations, profile } = useUserContext();
  const { signOut } = useSession();
  return (
    <View
      className="bg-slate-800 px-4 pb-4 flex-row items-center justify-between"
      style={{ paddingTop: top }}
    >
      <Menu
        placement="bottom left"
        offset={5}
        trigger={({ ...triggerProps }) => (
          <Button {...triggerProps} className="bg-slate-700 px-4">
            <ButtonText className="text-white">{location.name}</ButtonText>
            <ButtonIcon as={ChevronDown} className="text-white" />
          </Button>
        )}
      >
        {locations.map((l) => (
          <MenuItem key={l.id} textValue={l.name}>
            <Icon as={MapPin} className="mr-1" size="sm" />
            <MenuItemLabel size="sm">{l.name}</MenuItemLabel>
            {l.id === location.id && (
              <Badge action="success" className="rounded-full" size="sm">
                <BadgeText className="text-2xs capitalize">Active</BadgeText>
              </Badge>
            )}
          </MenuItem>
        ))}
      </Menu>

      <View className="flex-row items-center gap-2">
        <TouchableOpacity onPress={() => setShowDrawer(true)}>
          <Avatar className="bg-slate-600" size="md">
            <AvatarFallbackText>{profile.full_name}</AvatarFallbackText>
            <AvatarImage
              source={{
                uri: profile.avatar_url ?? undefined,
              }}
            />
          </Avatar>
        </TouchableOpacity>
      </View>
      <Drawer
        isOpen={showDrawer}
        onClose={() => {
          setShowDrawer(false);
        }}
        size="lg"
        anchor="right"
      >
        <DrawerBackdrop />
        <DrawerContent style={{ paddingBottom: bottom, paddingTop: top }}>
          <DrawerHeader className="justify-center flex-col gap-2">
            <Avatar size="2xl">
              <AvatarFallbackText>{profile.full_name}</AvatarFallbackText>
              <AvatarImage
                source={{
                  uri: profile.avatar_url ?? undefined,
                }}
              />
            </Avatar>
            <View className="justify-center items-center">
              <Text size="lg">{profile.full_name}</Text>
              {location.is_setter && (
                <Text size="sm" className="text-typography-600">
                  Setter
                </Text>
              )}
              {location.is_closer && (
                <Text size="sm" className="text-typography-600">
                  Closer
                </Text>
              )}
            </View>
          </DrawerHeader>
          <Divider className="my-4" />
          <DrawerBody contentContainerClassName="gap-2">
            <TouchableOpacity className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md">
              <Icon as={User} size="lg" className="text-typography-600" />
              <Text>My Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md">
              <Icon as={Home} size="lg" className="text-typography-600" />
              <Text>Saved Address</Text>
            </TouchableOpacity>
            <TouchableOpacity className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md">
              <Icon
                as={ShoppingCart}
                size="lg"
                className="text-typography-600"
              />
              <Text>Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md">
              <Icon as={Wallet} size="lg" className="text-typography-600" />
              <Text>Saved Cards</Text>
            </TouchableOpacity>
            <TouchableOpacity className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md">
              <Icon as={StarIcon} size="lg" className="text-typography-600" />
              <Text>Review App</Text>
            </TouchableOpacity>
            <TouchableOpacity className="gap-3 flex-row items-center hover:bg-background-50 p-2 rounded-md">
              <Icon as={PhoneIcon} size="lg" className="text-typography-600" />
              <Text>Contact Us</Text>
            </TouchableOpacity>
          </DrawerBody>
          <DrawerFooter>
            <Button
              action="secondary"
              className="w-full gap-2"
              onPress={signOut}
              variant="outline"
            >
              <ButtonText>Logout</ButtonText>
              <ButtonIcon as={LogOut} />
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </View>
  );
}

export default function TabLayout() {
  const { location } = useUserContext();

  return (
    <Tabs
      screenOptions={{
        header: () => <ScreenHeader />,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="home-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="customers"
        options={{
          title: "Customers",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="people-circle-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        redirect={!location?.is_closer}
        name="jobs"
        options={{
          title: "Jobs",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="construct-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        redirect={!location?.is_closer}
        name="schedule"
        options={{
          title: "Schedule",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="calendar-outline" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        redirect={!location?.is_closer}
        name="timesheets"
        options={{
          title: "Timesheets",
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="timer-outline" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
