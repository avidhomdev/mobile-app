export const MEDIA_TYPES = {
  NEARMAPS: {
    name: "Nearmap",
    required: true,
  },
  VALVE_BOX: {
    name: "Valve Box",
    required: true,
  },
  FRONT_OF_HOUSE: { name: "Front of house", required: true },
  ACCESS: { name: "Access", required: false },
  JOB_SITE: { name: "Job Site", required: true },
  GENERAL: { name: "General Area", required: false },
  DAMAGED: { name: "Damaged Property", required: false },
} as const;

export type MEDIA_TYPES_KEYS = keyof typeof MEDIA_TYPES;
