import type { Application } from "../types/application";
import apiClient, { extractError } from "../lib/apiClient";

// Everything the wizard collects, sent as one request at the end.
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
};

// The profile fields we use to fill the wizard in for the candidate.
export type ApplicationPrefill = Omit<
  ApplicationDraft,
  "expectedSalary" | "whyThisRole"
>;

// ---------------------------------------------------------------------------
// GET /api/applications
// ---------------------------------------------------------------------------
export async function fetchApplications(): Promise<Application[]> {
  try {
    const res = await apiClient.get<Application[]>('/applications');
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, 'Could not load your applications'));
  }
}

// ---------------------------------------------------------------------------
// GET /api/applications/prefill
//
// Whatever we already know about the candidate, so step 1 and step 2 of the
// wizard arrive already filled in.
// ---------------------------------------------------------------------------
export async function fetchApplicationPrefill(): Promise<ApplicationPrefill> {
  try {
    const res = await apiClient.get<ApplicationPrefill>('/applications/prefill');
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, 'Could not load your details'));
  }
}

// ---------------------------------------------------------------------------
// GET /api/applications/job/:jobId
//
// Checked before the wizard opens, so we don't let someone fill in four
// steps only to be told at the end that they already applied.
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// POST /api/applications/:jobId
// ---------------------------------------------------------------------------
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
