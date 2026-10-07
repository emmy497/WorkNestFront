import type { AdminJobListItem, CreateJobPayload } from "../types/job";
import apiClient, { extractError } from "../lib/apiClient";

export async function fetchAdminJobs(): Promise<AdminJobListItem[]> {
  try {
    const res = await apiClient.get<AdminJobListItem[]>("/admin/jobs");
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not load jobs"));
  }
}

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
