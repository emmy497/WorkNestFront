import type { AdminJobListItem, CreateJobPayload } from "../types/job";
import apiClient, { extractError } from "../lib/apiClient";

// ---------------------------------------------------------------------------
// GET /api/admin/jobs
//
// Every job, any status — the admin Jobs page's table.
// ---------------------------------------------------------------------------
export async function fetchAdminJobs(): Promise<AdminJobListItem[]> {
  try {
    const res = await apiClient.get<AdminJobListItem[]>("/admin/jobs");
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not load jobs"));
  }
}

// ---------------------------------------------------------------------------
// POST /api/admin/jobs
//
// The New Role form — "Save as draft" and "Publish role" both call this,
// differing only in payload.action.
// ---------------------------------------------------------------------------
export async function createJob(
  payload: CreateJobPayload
): Promise<{ jobId: string }> {
  try {
    const res = await apiClient.post<{ jobId: string }>("/admin/jobs", payload);
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not create this job"));
  }
}
