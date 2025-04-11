export const LEAD_TYPES = {
  SETTER: {
    name: "Setter",
  },
  SELF_GEN: {
    name: "Self Gen",
  },
  PAID: {
    name: "Paid",
  },
} as const;

export type LEAD_TYPES_KEYS = keyof typeof LEAD_TYPES;
