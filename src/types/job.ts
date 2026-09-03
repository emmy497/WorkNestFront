export type WorkArrangement = "Remote" | "Hybrid" | "Onsite";
export type JobType = "Full-time" | "Contract" | "Internship";
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
  postedDaysAgo: number;
  whyThisCouldFit: string;
}
