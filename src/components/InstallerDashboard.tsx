import { useLocationContext } from "@/src/contexts/location-context";
import { ILocationJob, useUserContext } from "@/src/contexts/user-context";
import { Calendar1 } from "lucide-react-native";
import { ScreenSectionHeading } from "./ScreenSectionHeading";
import { VStack } from "./ui/vstack";
import { Card } from "./ui/card";
import { Text } from "./ui/text";
import { Link } from "expo-router";

type JobRecord = Record<string, ILocationJob>;

type InstallerRecord = Record<string, JobRecord>;

const IN_PROGRESS_JOB_STATUSES = [
  "packet_pending",
  "scheduled",
  "packet_complete",
];

const generateInstallerJobDictionary = (jobs: ILocationJob[]) => {
  return jobs.reduce<InstallerRecord>((dictionary, job) => {
    if (!IN_PROGRESS_JOB_STATUSES.includes(job.job_status)) return dictionary;
    const jobInstallerProfiles = job.profiles.filter(
      (profile) => profile.role === "installer"
    );
    if (jobInstallerProfiles.length === 0) return dictionary;

    jobInstallerProfiles.forEach((profile) => {
      if (!dictionary[profile.profile_id]) dictionary[profile.profile_id] = {};
      dictionary[profile.profile_id][job.id] = job;
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
  const profileJobs = installerJobDictionary[profile.id] ?? {};

  return (
    <VStack space="sm">
      <ScreenSectionHeading
        icon={Calendar1}
        heading="In Progress"
        subHeading="Jobs that have work to be done"
      />
      <VStack space="sm">
        {Object.values(profileJobs).map((job) => (
          <Card key={job.id}>
            <Link
              href={{
                pathname: "/customer/[customerId]/job/[jobId]",
                params: {
                  customerId: job.customer_id,
                  jobId: job.id,
                },
              }}
            >
              <VStack>
                <Text bold underline>{`JOB-${job.id} - ${job.full_name}`}</Text>
                <Text isTruncated size="xs">
                  {`${job.address}, ${job.city} ${job.state} ${job.postal_code}`}
                </Text>
              </VStack>
            </Link>
          </Card>
        ))}
      </VStack>
    </VStack>
  );
}
