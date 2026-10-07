import type {
  AdminApplicationDetail,
  AdminApplicationListItem,
  ApplicationStatus,
  Scorecard,
} from "../types/application";
import apiClient, { extractError } from "../lib/apiClient";

export async function fetchAdminApplications(
  status?: ApplicationStatus
): Promise<AdminApplicationListItem[]> {
  try {
    const res = await apiClient.get<AdminApplicationListItem[]>("/admin/applications", {
      params: { status },
    });

    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not load applications"));
  }
}

export async function fetchAdminApplication(
  id: string
): Promise<AdminApplicationDetail> {
  try {
    const res = await apiClient.get<AdminApplicationDetail>(`/admin/applications/${id}`);
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not load that application"));
  }
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
  note?: string
): Promise<AdminApplicationDetail> {
  try {
    const res = await apiClient.patch<AdminApplicationDetail>(`/admin/applications/${id}/status`, { status, note });
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not update this application"));
  }
}

export async function updateApplicationScorecard(
  id: string,
  scorecard: Scorecard,
  internalNote: string
): Promise<AdminApplicationDetail> {
  try {
    const res = await apiClient.patch<AdminApplicationDetail>(`/admin/applications/${id}/scorecard`, { ...scorecard, internalNote });
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not save your changes"));
  }
}
