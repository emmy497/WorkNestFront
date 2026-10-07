import type { Job } from "../types/job";
import apiClient, { extractError } from "../lib/apiClient";

export async function fetchJobs(): Promise<Job[]> {
  try {
    const res = await apiClient.get<Job[]>('/jobs');
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, 'Could not load jobs'));
  }
}

export async function fetchJobById(id: string): Promise<Job> {
  try {
    const res = await apiClient.get<Job>(`/jobs/${id}`);
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, 'Could not load that job'));
  }
}
