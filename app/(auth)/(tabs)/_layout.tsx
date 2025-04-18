import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetIcon,
  ActionsheetItem,
  ActionsheetItemText,
} from "@/components/ui/actionsheet";
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
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import { Text } from "@/components/ui/text";
import { useSession } from "@/contexts/auth-context";
import { useLocationContext } from "@/contexts/location-context";
import { useUserContext } from "@/contexts/user-context";
import {
  NavigationHelpers,
  ParamListBase,
  TabNavigationState,
} from "@react-navigation/native";
import { Tabs, useRouter } from "expo-router";
import {
  Calendar1,
  ChevronDown,
  Home,
  HomeIcon,
  LogOut,
  MapPin,
  MessagesSquare,
  PhoneIcon,
  PlusIcon,
  ShoppingCart,
  StarIcon,
  User,
  User2,
  UserPlus2,
  Wallet,
} from "lucide-react-native";
import { Fragment, useState } from "react";
import { TouchableOpacity, View } from "react-native";
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

type TTabBar = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  descriptors: any;
  paddingBlockEnd: number;
  navigation: NavigationHelpers<ParamListBase>;
  state: TabNavigationState<ParamListBase>;
};

function TabBar({ descriptors, navigation, paddingBlockEnd, state }: TTabBar) {
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false);
  const handleClose = () => setIsActionSheetVisible(false);
  const router = useRouter();
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
          <ActionsheetItem
            onPress={() => {
              router.push(`/new-customer`);
              handleClose();
            }}
          >
            <ActionsheetIcon as={UserPlus2} className="text-typography-500" />
            <ActionsheetItemText className="text-typography-700">
              New Customer
            </ActionsheetItemText>
          </ActionsheetItem>
        </ActionsheetContent>
      </Actionsheet>
    </View>
  );
}

export default function TabLayout() {
  const { location } = useLocationContext();

  return (
    <Fragment>
      <Tabs
        screenOptions={{
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
          name="customers"
          options={{
            title: "Customers",
            tabBarIcon: User2,
          }}
        />
        <Tabs.Screen
          redirect={!location?.is_closer}
          name="schedule/index"
          options={{
            title: "Schedule",
            tabBarIcon: Calendar1,
          }}
        />
        <Tabs.Screen
          name="chats"
          options={{
            title: "Chats",
            tabBarIcon: MessagesSquare,
          }}
        />
      </Tabs>
    </Fragment>
  );
}
