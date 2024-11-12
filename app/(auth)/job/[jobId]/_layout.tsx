import { JobProvider } from "@/contexts/job-context";
import { Stack, useGlobalSearchParams } from "expo-router";

export default function Layout() {
  return (
    <JobProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </JobProvider>
  );
}
