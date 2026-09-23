import type { ApplicationStatus } from "./application";

export interface DashboardStat {
  value: number;
  change: number;
  changeLabel: string;
  // When true, `change` is a percentage (e.g. "+12% this month") instead of
  // a plain count (e.g. "+3 vs last week").
  changeIsPercent?: boolean;
}

export interface DashboardStats {
  activeJobs: DashboardStat;
  registeredCandidates: DashboardStat;
  applicationsReceived: DashboardStat;
  shortlisted: DashboardStat;
  interviewsScheduled: DashboardStat;
  placementsMade: DashboardStat;
}

export interface DashboardCounts {
  jobs: number;
  clients: number;
  candidates: number;
}

export interface StatusBreakdown {
  status: ApplicationStatus;
  label: string;
  count: number;
}

export interface RecentApplication {
  id: string;
  candidateName: string;
  candidateHeadline: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  status: ApplicationStatus;
  appliedAt: string; // ISO date string
}

export interface ClosingJob {
  id: string;
  title: string;
  companyName: string;
  location: string;
  workArrangement: string;
  closesAt: string; // ISO date string
  applicantCount: number;
}

export interface MostAppliedRole {
  id: string;
  title: string;
  companyName: string;
  count: number;
}

export interface DashboardOverview {
  stats: DashboardStats;
  counts: DashboardCounts;
  applicationsByStatus: StatusBreakdown[];
  pipeline: StatusBreakdown[];
  recentApplications: RecentApplication[];
  jobsClosingSoon: ClosingJob[];
  mostAppliedRoles: MostAppliedRole[];
}
