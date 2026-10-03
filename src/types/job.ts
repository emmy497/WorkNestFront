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

  // Detail page only
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  screeningQuestions: string[];
  postedDaysAgo: number;
  whyThisCouldFit: string;
}

// ---------------------------------------------------------------------------
// Admin-only shapes — everything below is only ever returned to an admin or
// recruiter (see server/src/controllers/adminJobController.ts). Unlike Job
// above, these expose the raw status instead of candidate-facing fields
// like closesInDays/postedDaysAgo.
// ---------------------------------------------------------------------------
export type JobStatus = "draft" | "open" | "closed" | "archived";

export interface AdminJobListItem {
  id: string;
  title: string;
  companyName: string;
  jobType: JobType;
  status: JobStatus;
  applicantCount: number;
  closesAt: string; // ISO date string
  createdAt: string; // ISO date string
}

// A company as listed for the New Role form's "Client" dropdown — see
// server/src/controllers/adminCompanyController.ts.
export interface CompanyOption {
  id: string;
  name: string;
}

// A client card on the admin Clients page, including the two computed
// stats (openRoles, placements) — see getClients in
// server/src/controllers/adminCompanyController.ts.
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

// What the "New client" / "Edit client" form sends.
export interface ClientPayload {
  name: string;
  industry: string;
  location: string;
  description: string;
  website: string;
  logoUrl: string;
}

// One row of the "Roles for {client}" table on the Client detail page.
export interface ClientJobRow {
  id: string;
  title: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  status: JobStatus;
  applicantCount: number;
  closesAt: string; // ISO date string
}

// GET /api/admin/companies/clients/:id — the full Client detail page.
export interface ClientDetail extends ClientListItem {
  totalApplicants: number;
  jobs: ClientJobRow[];
}

// What the New Role form sends to POST /api/admin/jobs.
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
  closesAt: string; // yyyy-mm-dd, from an <input type="date">
  screeningQuestions: string[];
  action: "draft" | "publish";
}
