import type { CandidateListItem } from "../types/candidate";
import apiClient, { extractError } from "../lib/apiClient";

export async function fetchCandidates(): Promise<CandidateListItem[]> {
  try {
    const res = await apiClient.get<CandidateListItem[]>("/admin/candidates");
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not load candidates"));
  }
}
