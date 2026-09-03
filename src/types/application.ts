import type { Job } from "./job";

// The five stages every application (that doesn't get rejected) moves
// through, in order. "rejected" is a separate terminal state, not a sixth
// stage — it can happen at any point, so it isn't part of this ordered list.
export const APPLICATION_STAGES = [
  "submitted",
  "review",
  "shortlisted",
  "interview",
  "offer",
] as const;

export type ApplicationStage = (typeof APPLICATION_STAGES)[number];

export type ApplicationStatus = ApplicationStage | "rejected";

export interface Application {
  id: string;
  job: Job;
  status: ApplicationStatus;
  appliedAt: string; // ISO date string
  statusMessage: string;
}

interface StatusConfig {
  label: string;
  badgeText: string;
  badgeBg: string;
  // Index into APPLICATION_STAGES this status corresponds to. `null` for
  // "rejected", since it isn't a point on the progress line — it's a
  // separate outcome the Stepper renders as fully muted.
  stageIndex: number | null;
}

// One lookup, one source of truth for every status's label + colors +
// where it sits on the stepper. Every status is required — TypeScript will
// error if a new ApplicationStatus is ever added without a matching entry.
export const APPLICATION_STATUS_CONFIG: Record<ApplicationStatus, StatusConfig> = {
  submitted: {
    label: "Submitted",
    badgeText: "#4B4757",
    badgeBg: "#FAFAFB",
    stageIndex: 0,
  },
  review: {
    label: "Under review",
    badgeText: "#8A5A12",
    badgeBg: "#FFF7E6",
    stageIndex: 1,
  },
  shortlisted: {
    label: "Shortlisted",
    badgeText: "#6D4AFF",
    badgeBg: "#F1EDFF",
    stageIndex: 2,
  },
  interview: {
    label: "Interview",
    badgeText: "#6D4AFF",
    badgeBg: "#EDE7FF",
    stageIndex: 3,
  },
  offer: {
    label: "Offer",
    badgeText: "#1E7B34",
    badgeBg: "#EAFBEF",
    stageIndex: 4,
  },
  rejected: {
    label: "Not selected",
    badgeText: "#C62828",
    badgeBg: "#FFF7F7",
    stageIndex: null,
  },
};

export const STAGE_LABELS: Record<ApplicationStage, string> = {
  submitted: "Submitted",
  review: "Review",
  shortlisted: "Shortlist",
  interview: "Interview",
  offer: "Offer",
};
