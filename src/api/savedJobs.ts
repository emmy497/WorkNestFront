import type { Job } from "../types/job";
import { getToken } from "./auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ---------------------------------------------------------------------------
// Every request here is personal to the logged-in user, so every one of them
// has to send the token. This helper builds that header once.
//
// Without a token the server replies 401 and we throw, which is what tells
// the UI to prompt the user to log in.
// ---------------------------------------------------------------------------
function authHeaders(): HeadersInit {
  const token = getToken();

  if (!token) {
    throw new Error("You need to be logged in");
  }

  return { Authorization: `Bearer ${token}` };
}

// ---------------------------------------------------------------------------
// GET /api/saved-jobs
// The full saved jobs, ready to render as cards.
// ---------------------------------------------------------------------------
export async function fetchSavedJobs(): Promise<Job[]> {
  const response = await fetch(`${API_URL}/saved-jobs`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Could not load your saved jobs");
  }

  return response.json();
}

// ---------------------------------------------------------------------------
// GET /api/saved-jobs/ids
//
// Only the ids. Job lists use this so each bookmark icon knows whether to
// look filled, without downloading every saved job's full details.
// ---------------------------------------------------------------------------
export async function fetchSavedJobIds(): Promise<string[]> {
  const response = await fetch(`${API_URL}/saved-jobs/ids`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Could not load your saved jobs");
  }

  return response.json();
}

// ---------------------------------------------------------------------------
// POST /api/saved-jobs/:jobId
// ---------------------------------------------------------------------------
export async function saveJobRequest(jobId: string): Promise<void> {
  const response = await fetch(`${API_URL}/saved-jobs/${jobId}`, {
    method: "POST",
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Could not save that job");
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/saved-jobs/:jobId
// ---------------------------------------------------------------------------
export async function unsaveJobRequest(jobId: string): Promise<void> {
  const response = await fetch(`${API_URL}/saved-jobs/${jobId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Could not remove that job");
  }
}
