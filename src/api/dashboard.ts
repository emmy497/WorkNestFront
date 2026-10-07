import type { DashboardOverview } from "../types/dashboard";
import apiClient, { extractError } from "../lib/apiClient";

export async function fetchDashboardOverview(): Promise<DashboardOverview> {
  try {
    const res = await apiClient.get<DashboardOverview>("/dashboard/overview");
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not load the dashboard"));
  }
}
