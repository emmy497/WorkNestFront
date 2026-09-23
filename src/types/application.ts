import type { Job } from "./job";

// The six stages every application (that doesn't get rejected) moves
// through, in order. "rejected" is a separate terminal state, not a seventh
// stage — it can happen at any point, so it isn't part of this ordered list.
export const APPLICATION_STAGES = [
  "submitted",
  "review",
  "shortlisted",
  "interview",
  "offer",
  "hired",
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
    label: "Reviewing",
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
  hired: {
    label: "Hired",
    badgeText: "#127A3E",
    badgeBg: "#E6F9ED",
    stageIndex: 5,
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
  hired: "Hired",
};

// ---------------------------------------------------------------------------
// Admin-only shapes — everything below is only ever returned to an admin or
// recruiter (see server/src/controllers/adminApplicationController.ts), and
// includes fields a candidate never sees: contact details, the scorecard,
// and internal notes.
// ---------------------------------------------------------------------------

// A reviewer's rating of the candidate against this role, 0-5 each.
// 0 means "not rated yet" rather than "rated zero".
export interface Scorecard {
  skillsMatch: number;
  experience: number;
  communication: number;
  portfolioWork: number;
}

export interface StatusHistoryEntry {
  status: ApplicationStatus;
  changedAt: string; // ISO date string
  note: string;
}

// One row in the admin pipeline list — just enough to render the table.
export interface AdminApplicationListItem {
  id: string;
  candidateName: string;
  candidateHeadline: string;
  jobId: string | null;
  jobTitle: string;
  companyName: string;
  status: ApplicationStatus;
  // Average of the 4 scorecard ratings, one decimal place — null if the
  // candidate hasn't been rated at all yet ("Not scored" in the table).
  score: number | null;
  appliedAt: string;
}

// The full record shown on the review screen.
export interface AdminApplicationDetail {
  id: string;
  status: ApplicationStatus;
  // What "advance" should move this to next, and null once there's nowhere
  // further to go (offer or rejected) — computed on the server so this file
  // stays the one source of truth for stage ordering.
  nextStage: ApplicationStage | null;
  statusHistory: StatusHistoryEntry[];
  appliedAt: string;

  fullName: string;
  candidateHeadline: string;
  email: string;
  phone: string;
  location: string;

  cvUrl: string;
  cvOriginalName: string;
  portfolioLink: string;
  linkedin: string;

  yearsOfExperience: string;
  availability: string;
  expectedSalary: string;
  whyThisRole: string;

  scorecard: Scorecard;
  internalNote: string;

  job: { id: string; title: string; companyName: string } | null;
}
