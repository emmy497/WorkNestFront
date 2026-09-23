import type { DashboardOverview } from "../types/dashboard";
import apiClient, { extractError } from "../lib/apiClient";

// ---------------------------------------------------------------------------
// GET /api/dashboard/overview
//
// Everything the admin Overview screen needs, in one request — see the
// backend's dashboardController.ts for why it's one endpoint instead of
// several.
// ---------------------------------------------------------------------------
export async function fetchDashboardOverview(): Promise<DashboardOverview> {
  try {
    const res = await apiClient.get<DashboardOverview>("/dashboard/overview");
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not load the dashboard"));
  }
}
