import { JobProvider } from "@/contexts/job-context";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <JobProvider>
      <Stack screenOptions={{ headerShown: false, headerLargeTitle: true }} />
    </JobProvider>
  );
}
