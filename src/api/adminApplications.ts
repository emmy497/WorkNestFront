import type {
  AdminApplicationDetail,
  AdminApplicationListItem,
  ApplicationStatus,
  Scorecard,
} from "../types/application";
import apiClient, { extractError } from "../lib/apiClient";

// ---------------------------------------------------------------------------
// GET /api/admin/applications
//
// Every application, newest first. Pass a status to narrow it down to one
// pipeline stage (e.g. the "Shortlisted" column of a kanban-style view).
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// GET /api/admin/applications/:id
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// PATCH /api/admin/applications/:id/status
//
// Moves the application to a new stage (or rejects it). `note` is optional
// context that's saved to the status history AND included in the email the
// candidate receives for this change.
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// PATCH /api/admin/applications/:id/scorecard
//
// Saves the reviewer's star ratings and internal note. Does NOT change the
// application's stage or email the candidate — see updateApplicationStatus
// for that.
// ---------------------------------------------------------------------------
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
