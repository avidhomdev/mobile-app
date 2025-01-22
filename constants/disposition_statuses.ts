export type DISPOSITION_STATUS_KEYS = keyof typeof DISPOSITION_STATUSES;

type TActions = "muted" | "error" | "warning" | "success" | "info" | undefined;
export const DISPOSITION_STATUSES = {
  NEW: {
    bg: "bg-background-warning  border-warning-300",
    label: "New",
    action: "warning" as TActions,
  },
  SCHEDULED: {
    bg: "bg-background-info  border-info-300",
    label: "Scheduled",
    action: "info" as TActions,
  },
  NO_SHOW: {
    bg: "bg-background-error  border-error-300",
    label: "No show",
    action: "error" as TActions,
  },
  CANCELLED_AT_DOOR: {
    bg: "bg-background-error  border-error-300",
    label: "Cancelled at door",
    action: "error" as TActions,
  },
  PITCHED_NOT_CLOSED: {
    bg: "bg-background-error  border-error-300",
    label: "Pitched Not Closed",
    action: "error" as TActions,
  },
  PITCHED_PENDING: {
    bg: "bg-background-info  border-info-300",
    label: "Pitched Pending",
    action: "info" as TActions,
  },
  PITCHED_CLOSED: {
    bg: "bg-background-success  border-success-300",
    label: "Pitched Closed",
    action: "success" as TActions,
  },
  PITCHED_FOLLOW_UP: {
    bg: "bg-background-warning  border-warning-300",
    label: "Pitched Follow Up",
    action: "warning" as TActions,
  },
};
