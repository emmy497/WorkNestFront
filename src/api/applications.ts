import type { Application } from "../types/application";
import { getToken } from "./auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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

function authHeaders(): HeadersInit {
  const token = getToken();

  if (!token) {
    throw new Error("You need to be logged in");
  }

  return { Authorization: `Bearer ${token}` };
}

async function readError(response: Response, fallback: string) {
  try {
    const data = await response.json();
    return data.message || fallback;
  } catch {
    return fallback;
  }
}

// ---------------------------------------------------------------------------
// GET /api/applications
// ---------------------------------------------------------------------------
export async function fetchApplications(): Promise<Application[]> {
  const response = await fetch(`${API_URL}/applications`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Could not load your applications"));
  }

  return response.json();
}

// ---------------------------------------------------------------------------
// GET /api/applications/prefill
//
// Whatever we already know about the candidate, so step 1 and step 2 of the
// wizard arrive already filled in.
// ---------------------------------------------------------------------------
export async function fetchApplicationPrefill(): Promise<ApplicationPrefill> {
  const response = await fetch(`${API_URL}/applications/prefill`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Could not load your details"));
  }

  return response.json();
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
  const response = await fetch(`${API_URL}/applications/job/${jobId}`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error(await readError(response, "Could not check that role"));
  }

  return response.json();
}

// ---------------------------------------------------------------------------
// POST /api/applications/:jobId
// ---------------------------------------------------------------------------
export async function submitApplication(
  jobId: string,
  draft: ApplicationDraft
): Promise<{ applicationId: string }> {
  const response = await fetch(`${API_URL}/applications/${jobId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify(draft),
  });

  if (!response.ok) {
    throw new Error(
      await readError(response, "Could not submit your application")
    );
  }

  return response.json();
}
