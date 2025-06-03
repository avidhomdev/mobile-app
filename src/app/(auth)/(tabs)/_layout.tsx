import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetIcon,
  ActionsheetItem,
  ActionsheetItemText,
} from "@/src/components/ui/actionsheet";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Badge, BadgeText } from "@/src/components/ui/badge";
import { Button, ButtonIcon, ButtonText } from "@/src/components/ui/button";
import { Divider } from "@/src/components/ui/divider";
import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "@/src/components/ui/drawer";
import { Heading } from "@/src/components/ui/heading";
import { Icon } from "@/src/components/ui/icon";
import { Menu, MenuItem, MenuItemLabel } from "@/src/components/ui/menu";
import { Text } from "@/src/components/ui/text";
import { useSession } from "@/src/contexts/auth-context";
import { useLocationContext } from "@/src/contexts/location-context";
import { useUserContext } from "@/src/contexts/user-context";
import {
  NavigationHelpers,
  ParamListBase,
  TabNavigationState,
} from "@react-navigation/native";
import { Tabs, usePathname, useRouter } from "expo-router";
import {
  Calendar1,
  CalendarClock,
  ChevronDown,
  HardHat,
  HomeIcon,
  LogOut,
  MapPin,
  MessageSquareText,
  MessagesSquare,
  PlusIcon,
  User,
  User2,
  UserPlus2,
} from "lucide-react-native";
import { useState } from "react";
import { TouchableOpacity, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge";

function ScreenHeader() {
  const [showDrawer, setShowDrawer] = useState(false);
  const { bottom, top } = useSafeAreaInsets();
  const { location, changeLocation } = useLocationContext();
  const { locations, profile } = useUserContext();
  const { signOut } = useSession();
  return (
    <View
      className="bg-black px-4 pb-4 flex-row items-center justify-evenly gap-x-6"
      style={{ paddingTop: top }}
    >
      <View>
        <Heading className="text-white">AVID</Heading>
        <Text className="-mt-2 tracking-widest text-success-200 uppercase font-semibold text-center">
          Turf
        </Text>
      </View>
      <Menu
        closeOnSelect
        placement="bottom left"
        onSelectionChange={changeLocation}
        offset={5}
        trigger={({ ...triggerProps }) => (
          <Button {...triggerProps} className="bg-gray-900 px-4 grow">
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
          <Avatar className="bg-gray-700" size="md">
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

type TTabBar = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  descriptors: any;
  paddingBlockEnd: number;
  navigation: NavigationHelpers<ParamListBase>;
  state: TabNavigationState<ParamListBase>;
};

function ChannelsTabActionsheetItems({
  handleClose,
}: {
  handleClose: () => void;
}) {
  const router = useRouter();
  return (
    <>
      <ActionsheetItem
        onPress={() => {
          router.push(`/new-channel`);
          handleClose();
        }}
      >
        <ActionsheetIcon
          as={MessageSquareText}
          className="text-typography-500"
        />
        <ActionsheetItemText className="text-typography-700">
          New Channel
        </ActionsheetItemText>
      </ActionsheetItem>
    </>
  );
}

function TabBar({ descriptors, navigation, paddingBlockEnd, state }: TTabBar) {
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false);
  const handleClose = () => setIsActionSheetVisible(false);
  const router = useRouter();
  const pathname = usePathname();
  const { location } = useLocationContext();

  return (
    <View className="flex-row justify-between">
      <View className="bg-black rounded-full p-2 px-4 flex-row gap-x-2">
        {state.routes.flatMap((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            if (!isFocused) navigation.navigate(route.name);
          };

          return (
            <TouchableOpacity className="p-2" key={index} onPress={onPress}>
              <Icon
                as={options.tabBarIcon}
                className={twMerge(
                  isFocused ? "text-typography-white" : "text-typography-400"
                )}
                size="2xl"
              />
            </TouchableOpacity>
          );
        })}
      </View>
      {(location.is_closer || location.is_setter) && (
        <>
          <TouchableOpacity
            className="rounded-full bg-black aspect-square items-center justify-center"
            onPress={() => setIsActionSheetVisible(true)}
          >
            <Icon as={PlusIcon} className="text-typography-white" size="2xl" />
          </TouchableOpacity>
          <Actionsheet isOpen={isActionSheetVisible} onClose={handleClose}>
            <ActionsheetBackdrop />
            <ActionsheetContent style={{ paddingBlockEnd }}>
              <ActionsheetDragIndicatorWrapper>
                <ActionsheetDragIndicator />
              </ActionsheetDragIndicatorWrapper>
              {pathname === "/channels" ? (
                <ChannelsTabActionsheetItems handleClose={handleClose} />
              ) : (
                <>
                  <ActionsheetItem
                    onPress={() => {
                      router.push(`/new-closing`);
                      handleClose();
                    }}
                  >
                    <ActionsheetIcon
                      as={CalendarClock}
                      className="text-typography-500"
                    />
                    <ActionsheetItemText className="text-typography-700">
                      Schedule Closing
                    </ActionsheetItemText>
                  </ActionsheetItem>
                  <ActionsheetItem
                    onPress={() => {
                      router.push(`/new-customer`);
                      handleClose();
                    }}
                  >
                    <ActionsheetIcon
                      as={UserPlus2}
                      className="text-typography-500"
                    />
                    <ActionsheetItemText className="text-typography-700">
                      New Customer
                    </ActionsheetItemText>
                  </ActionsheetItem>
                </>
              )}
            </ActionsheetContent>
          </Actionsheet>
        </>
      )}
    </View>
  );
}

export default function TabLayout() {
  const { location } = useLocationContext();
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        sceneStyle: {
          backgroundColor: colorScheme === "dark" ? `#181719` : `#f2f1f1`,
        },
        header: () => <ScreenHeader />,
      }}
      tabBar={({ descriptors, insets, navigation, state }) => {
        const { bottom } = insets;

        return (
          <View className="px-4 absolute w-full" style={{ bottom }}>
            <TabBar
              paddingBlockEnd={bottom}
              descriptors={descriptors}
              navigation={navigation}
              state={state}
            />
          </View>
        );
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: HomeIcon,
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: "Jobs",
          tabBarIcon: HardHat,
        }}
      />
      <Tabs.Screen
        name="customers"
        options={{
          title: "Customers",
          tabBarIcon: User2,
        }}
      />
      <Tabs.Screen
        redirect={!location?.is_closer && !location?.is_installer}
        name="schedule"
        options={{
          title: "Schedule",
          tabBarIcon: Calendar1,
        }}
      />
      <Tabs.Screen
        name="channels"
        options={{
          title: "Channels",
          tabBarIcon: MessagesSquare,
        }}
      />
    </Tabs>
  );
}
