import type { Job } from "./job";

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
  appliedAt: string;
  statusMessage: string;
}

interface StatusConfig {
  label: string;
  badgeText: string;
  badgeBg: string;
  stageIndex: number | null;
}

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


export interface Scorecard {
  skillsMatch: number;
  experience: number;
  communication: number;
  portfolioWork: number;
}

export interface StatusHistoryEntry {
  status: ApplicationStatus;
  changedAt: string;
  note: string;
}

export interface AdminApplicationListItem {
  id: string;
  candidateName: string;
  candidateHeadline: string;
  jobId: string | null;
  jobTitle: string;
  companyName: string;
  status: ApplicationStatus;
  score: number | null;
  appliedAt: string;
}

export interface AdminApplicationDetail {
  id: string;
  status: ApplicationStatus;
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
  screeningAnswers: { question: string; answer: string }[];

  scorecard: Scorecard;
  internalNote: string;

  job: { id: string; title: string; companyName: string } | null;
}
