import type { Application } from "../types/application";
import apiClient, { extractError } from "../lib/apiClient";

export type ApplicationDraft = {
  fullName: string;
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
};

export type ApplicationPrefill = Omit<
  ApplicationDraft,
  "expectedSalary" | "whyThisRole" | "screeningAnswers"
>;

export async function fetchApplications(): Promise<Application[]> {
  try {
    const res = await apiClient.get<Application[]>('/applications');
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, 'Could not load your applications'));
  }
}

export async function fetchApplicationPrefill(): Promise<ApplicationPrefill> {
  try {
    const res = await apiClient.get<ApplicationPrefill>('/applications/prefill');
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, 'Could not load your details'));
  }
}

export async function checkAlreadyApplied(
  jobId: string
): Promise<{ applied: boolean; applicationId: string | null }> {
  try {
    const res = await apiClient.get<{ applied: boolean; applicationId: string | null }>(`/applications/job/${jobId}`);
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, 'Could not check that role'));
  }
}

export async function submitApplication(
  jobId: string,
  draft: ApplicationDraft
): Promise<{ applicationId: string }> {
  try {
    const res = await apiClient.post(`/applications/${jobId}`, draft);
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, 'Could not submit your application'));
  }
}
