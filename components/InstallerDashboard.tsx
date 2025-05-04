import { useLocationContext } from "@/contexts/location-context";
import { ILocationJob, useUserContext } from "@/contexts/user-context";
import { Calendar1 } from "lucide-react-native";
import { ScreenSectionHeading } from "./ScreenSectionHeading";
import { Card } from "./ui/card";
import { Text } from "./ui/text";
import { VStack } from "./ui/vstack";

type InstallerJobDictionary = {
  [k: string]: ILocationJob[];
};

const IN_PROGRESS_JOB_STATUSES = ["new", "scheduled", "pending", "approved"];

const generateInstallerJobDictionary = (jobs: ILocationJob[]) => {
  return jobs.reduce<InstallerJobDictionary>((dictionary, job) => {
    if (!IN_PROGRESS_JOB_STATUSES.includes(job.status)) return dictionary;
    const jobInstallerProfiles = job.profiles.filter(
      (profile) => profile.role === "installer"
    );
    if (jobInstallerProfiles.length === 0) return dictionary;

    jobInstallerProfiles.forEach((profile) => {
      dictionary[profile.profile_id] = (
        dictionary[profile.profile_id] ?? []
      ).concat(job);
    });

    return dictionary;
  }, {});
};

export function InstallerDashboard() {
  const {
    location: { jobs },
  } = useLocationContext();
  const { profile } = useUserContext();
  const installerJobDictionary = generateInstallerJobDictionary(jobs ?? []);
  const profileJobs = installerJobDictionary[profile.id] ?? [];

  return (
    <VStack space="sm">
      <ScreenSectionHeading
        icon={Calendar1}
        heading="In Progress"
        subHeading="Jobs that have work to be done"
      />
      <VStack space="sm">
        {profileJobs.map((job) => (
          <Card key={job.id}>
            <VStack>
              <Text bold>{`JOB-${job.id} - ${job.full_name}`}</Text>
              <Text isTruncated size="xs">
                {`${job.address}, ${job.city} ${job.state} ${job.postal_code}`}
              </Text>
            </VStack>
          </Card>
        ))}
      </VStack>
    </VStack>
  );
}
