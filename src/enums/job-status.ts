import { Database } from "@/supabase";

type JobStatusProperty = {
  name: string;
  color: string;
};

type JobStatusRecord = Record<
  Database["public"]["Enums"]["job_status"],
  JobStatusProperty
>;

export const JOB_STATUS_PROPERTIES: JobStatusRecord = {
  packet_pending: {
    color: "emerald",
    name: "Packet Pending",
  },
  packet_complete: {
    color: "cyan",
    name: "Packing Complete",
  },
  scheduled: {
    color: "blue",
    name: "Scheduled",
  },
  install_complete: {
    color: "slate",
    name: "Install Complete",
  },
  complete: {
    color: "green",
    name: "Job Complete",
  },
  cancelled: {
    color: "red",
    name: "Cancelled",
  },
  billed: {
    color: "yellow",
    name: "Billed",
  },
  commissioned: {
    color: "green",
    name: "Commissioned",
  },
};

export function getJobStatusProperties(
  status: keyof typeof JOB_STATUS_PROPERTIES
) {
  return JOB_STATUS_PROPERTIES[status] || JOB_STATUS_PROPERTIES.packet_pending;
}
