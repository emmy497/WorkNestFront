import type { Job } from "../types/job";
import apiClient, { extractError } from "../lib/apiClient";

export async function fetchSavedJobs(): Promise<Job[]> {
  try {
    const res = await apiClient.get<Job[]>("/saved-jobs");
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not load your saved jobs"));
  }
}

export async function fetchSavedJobIds(): Promise<string[]> {
  try {
    const res = await apiClient.get<string[]>("/saved-jobs/ids");
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not load your saved jobs"));
  }
}

export async function saveJobRequest(jobId: string): Promise<void> {
  try {
    await apiClient.post(`/saved-jobs/${jobId}`);
  } catch (err) {
    throw new Error(extractError(err, "Could not save that job"));
  }
}

export async function unsaveJobRequest(jobId: string): Promise<void> {
  try {
    await apiClient.delete(`/saved-jobs/${jobId}`);
  } catch (err) {
    throw new Error(extractError(err, "Could not remove that job"));
  }
}
