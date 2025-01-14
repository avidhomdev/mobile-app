export type DISPOSITION_STATUS_KEYS = keyof typeof DISPOSITION_STATUSES;

type TActions = "muted" | "error" | "warning" | "success" | "info" | undefined;
export const DISPOSITION_STATUSES = {
  NEW: {
    label: "New",
    action: "muted" as TActions,
  },
  SCHEDULED: {
    label: "Scheduled",
    action: "info" as TActions,
  },
  NO_SHOW: {
    label: "No show",
    action: "error" as TActions,
  },
  CANCELLED_AT_DOOR: {
    label: "Cancelled at door",
    action: "error" as TActions,
  },
  PITCHED_NOT_CLOSED: {
    label: "Pitched Not Closed",
    action: "error" as TActions,
  },
  PITCHED_PENDING: {
    label: "Pitched Pending",
    action: "info" as TActions,
  },
  PITCHED_CLOSED: {
    label: "Pitched Closed",
    action: "success" as TActions,
  },
  PITCHED_FOLLOW_UP: {
    label: "Pitched Follow Up",
    action: "warning" as TActions,
  },
};
