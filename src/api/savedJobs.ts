import type { Job } from "../types/job";
import apiClient, { extractError } from "../lib/apiClient";

// ---------------------------------------------------------------------------
// GET /api/saved-jobs
// The full saved jobs, ready to render as cards.
// ---------------------------------------------------------------------------
export async function fetchSavedJobs(): Promise<Job[]> {
  try {
    const res = await apiClient.get<Job[]>("/saved-jobs");
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not load your saved jobs"));
  }
}

// ---------------------------------------------------------------------------
// GET /api/saved-jobs/ids
//
// Only the ids. Job lists use this so each bookmark icon knows whether to
// look filled, without downloading every saved job's full details.
// ---------------------------------------------------------------------------
export async function fetchSavedJobIds(): Promise<string[]> {
  try {
    const res = await apiClient.get<string[]>("/saved-jobs/ids");
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not load your saved jobs"));
  }
}

// ---------------------------------------------------------------------------
// POST /api/saved-jobs/:jobId
// ---------------------------------------------------------------------------
export async function saveJobRequest(jobId: string): Promise<void> {
  try {
    await apiClient.post(`/saved-jobs/${jobId}`);
  } catch (err) {
    throw new Error(extractError(err, "Could not save that job"));
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/saved-jobs/:jobId
// ---------------------------------------------------------------------------
export async function unsaveJobRequest(jobId: string): Promise<void> {
  try {
    await apiClient.delete(`/saved-jobs/${jobId}`);
  } catch (err) {
    throw new Error(extractError(err, "Could not remove that job"));
  }
}
