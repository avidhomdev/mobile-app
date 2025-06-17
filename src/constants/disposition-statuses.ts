import {
  Banknote,
  CalendarClock,
  DoorClosed,
  DoorOpen,
  EqualNotIcon,
  Loader,
} from "lucide-react-native";

export type DISPOSITION_STATUS_KEYS = keyof typeof DISPOSITION_STATUSES;

type TActions = "muted" | "error" | "warning" | "success" | "info" | undefined;
export const DISPOSITION_STATUSES = {
  NEW: {
    action: "warning" as TActions,
    bg: "bg-background-warning  border-warning-300",
    icon: DoorOpen,
    label: "New",
  },
  NO_SHOW: {
    action: "error" as TActions,
    bg: "bg-background-error  border-error-300",
    icon: EqualNotIcon,
    label: "No show",
  },
  CANCELLED_AT_DOOR: {
    action: "error" as TActions,
    bg: "bg-background-error  border-error-300",
    icon: DoorClosed,
    label: "Cancelled at door",
  },
  PITCHED_NOT_CLOSED: {
    action: "error" as TActions,
    bg: "bg-background-error  border-error-300",
    icon: DoorClosed,
    label: "Pitched Not Closed",
  },
  PITCHED_PENDING: {
    action: "info" as TActions,
    bg: "bg-background-info  border-info-300",
    icon: Loader,
    label: "Pitched Pending",
  },
  PITCHED_CLOSED: {
    action: "success" as TActions,
    bg: "bg-background-success  border-success-300",
    icon: Banknote,
    label: "Pitched Closed",
  },
  PITCHED_FOLLOW_UP: {
    action: "warning" as TActions,
    bg: "bg-background-warning  border-warning-300",
    icon: CalendarClock,
    label: "Pitched Follow Up",
  },
} as const;

export function getDispositionStatus(status: DISPOSITION_STATUS_KEYS) {
  return DISPOSITION_STATUSES[status] || DISPOSITION_STATUSES.NEW;
}
