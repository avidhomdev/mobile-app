import React from "react";

import { Link, Tabs } from "expo-router";
import { Pressable, TouchableOpacity, View } from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useUserContext } from "@/contexts/user-context";
import Text from "@/components/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
}) {
  return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />;
}

function ScreenHeader() {
  const { top } = useSafeAreaInsets();
  const { location, refreshData } = useUserContext();

  return (
    <View
      className="bg-slate-800 px-4 pb-4 flex-row items-center justify-between"
      style={{ paddingTop: top }}
    >
      <TouchableOpacity className="bg-slate-600 rounded p-1 self-start px-4 items-center flex-row gap-2">
        <Text className="text-white font-semibold">{location?.name}</Text>
        <FontAwesome name="chevron-down" color="white" />
      </TouchableOpacity>
      <View className="flex-row items-center gap-4">
        <TouchableOpacity
          className="p-2 bg-slate-600 rounded-full"
          onPress={refreshData}
        >
          <FontAwesome name="refresh" color="white" size={18} />
        </TouchableOpacity>
      </View>
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
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <Ionicons
                    name="information-circle"
                    size={25}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
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
