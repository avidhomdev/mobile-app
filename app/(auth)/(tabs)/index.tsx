import { CloserDashboard } from "@/components/CloserDashboard";
import { SetterDashboard } from "@/components/SetterDashboard";
import { useLocationContext } from "@/contexts/location-context";
import { useUserContext } from "@/contexts/user-context";
import { useState } from "react";
import { RefreshControl, ScrollView } from "react-native";

export default function Dashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { refreshData } = useUserContext();
  const { location } = useLocationContext();
  const Dashboard = location.is_closer ? CloserDashboard : SetterDashboard;

  return (
    <ScrollView
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
      <Dashboard location={location} />
    </ScrollView>
  );
}
