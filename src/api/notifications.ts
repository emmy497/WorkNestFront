import type { Notification } from "../types/notification";
import apiClient, { extractError } from "../lib/apiClient";

type NotificationsResponse = {
  notifications: Notification[];
  unreadCount: number;
};

export async function fetchNotifications(): Promise<NotificationsResponse> {
  try {
    const res = await apiClient.get<NotificationsResponse>("/notifications");
    return res.data;
  } catch (err) {
    throw new Error(extractError(err, "Could not load your notifications"));
  }
}

export async function markNotificationRead(id: string): Promise<void> {
  try {
    await apiClient.patch(`/notifications/${id}/read`);
  } catch (err) {
    throw new Error(extractError(err, "Could not update that notification"));
  }
}

export async function markAllNotificationsRead(): Promise<void> {
  try {
    await apiClient.patch("/notifications/read-all");
  } catch (err) {
    throw new Error(extractError(err, "Could not update your notifications"));
  }
}
