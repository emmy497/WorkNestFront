export type CandidateStatus = "open" | "placed" | "employed";

export interface CandidateListItem {
  id: string;
  name: string;
  email: string;
  headline: string;
  location: string;
  yearsOfExperience: string;
  experienceLevel: string;
  skills: string[];
  availability: string;
  applications: number;
  status: CandidateStatus;
  joinedAt: string;
}
