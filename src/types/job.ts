export type WorkArrangement = "Remote" | "Hybrid" | "Onsite";
export type JobType = "Full-time" | "Contract" | "Internship" | "Part-time";
export type ExperienceLevel = "Junior" | "Mid-level" | "Senior";
export type CareerPath =
  | "Design"
  | "Engineering"
  | "Data"
  | "Customer"
  | "Marketing";

export interface Job {
  id: string;
  companyName: string;
  companyLogo: string;
  title: string;
  description: string;
  location: string;
  workArrangement: WorkArrangement;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  careerPath: CareerPath;
  salaryMin: number;
  salaryMax: number;
  currency?: string;
  closesInDays: number;
  featured?: boolean;

  responsibilities: string[];
  requirements: string[];
  skills: string[];
  screeningQuestions: string[];
  postedDaysAgo: number;
  whyThisCouldFit: string;
}

export type JobStatus = "draft" | "open" | "closed" | "archived";

export interface AdminJobListItem {
  id: string;
  title: string;
  companyName: string;
  jobType: JobType;
  status: JobStatus;
  applicantCount: number;
  closesAt: string;
  createdAt: string;
}

export interface CompanyOption {
  id: string;
  name: string;
}

export interface ClientListItem {
  id: string;
  name: string;
  industry: string;
  description: string;
  location: string;
  logoUrl: string;
  website: string;
  openRoles: number;
  placements: number;
}

export interface ClientPayload {
  name: string;
  industry: string;
  location: string;
  description: string;
  website: string;
  logoUrl: string;
}

export interface ClientJobRow {
  id: string;
  title: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  status: JobStatus;
  applicantCount: number;
  closesAt: string;
}

export interface ClientDetail extends ClientListItem {
  totalApplicants: number;
  jobs: ClientJobRow[];
}

export interface CreateJobPayload {
  title: string;
  companyId: string;
  location: string;
  workArrangement: WorkArrangement;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  careerPath: CareerPath;
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  salaryMin: number;
  salaryMax: number;
  numberOfPositions: number;
  closesAt: string;
  screeningQuestions: string[];
  action: "draft" | "publish";
}
