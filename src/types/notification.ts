import type { IconType } from "react-icons";
import {
  FiSearch,
  FiCheckCircle,
  FiCalendar,
  FiXCircle,
  FiClock,
  FiBookmark,
} from "react-icons/fi";
import type { ApplicationStatus } from "./application";

export type NotificationType = "application_status" | "job_closing_soon" | "job_match";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  // Only present when type is "application_status".
  status: ApplicationStatus | null;
  jobId: string | null;
  createdAt: string; // ISO date string
}

interface NotificationLook {
  icon: IconType;
  iconColor: string;
  iconBg: string;
}

const PURPLE: Pick<NotificationLook, "iconColor" | "iconBg"> = {
  iconColor: "#6D4AFF",
  iconBg: "#F1EDFF",
};

const ORANGE: Pick<NotificationLook, "iconColor" | "iconBg"> = {
  iconColor: "#C2760C",
  iconBg: "#FFF1DE",
};

// Every ApplicationStatus that STATUS_NOTIFICATION_COPY on the backend
// actually creates a notification for (everything except "submitted").
const LOOK_BY_STATUS: Partial<Record<ApplicationStatus, NotificationLook>> = {
  review: { icon: FiSearch, ...ORANGE },
  shortlisted: { icon: FiCheckCircle, ...PURPLE },
  interview: { icon: FiCalendar, ...PURPLE },
  offer: { icon: FiCheckCircle, ...PURPLE },
  hired: { icon: FiCheckCircle, ...PURPLE },
  rejected: { icon: FiXCircle, ...ORANGE },
};

const LOOK_BY_TYPE: Record<Exclude<NotificationType, "application_status">, NotificationLook> = {
  job_closing_soon: { icon: FiClock, ...ORANGE },
  job_match: { icon: FiBookmark, ...PURPLE },
};

const DEFAULT_LOOK: NotificationLook = { icon: FiCheckCircle, ...PURPLE };

export function notificationLook(notification: Notification): NotificationLook {
  if (notification.type === "application_status") {
    return (notification.status && LOOK_BY_STATUS[notification.status]) || DEFAULT_LOOK;
  }

  return LOOK_BY_TYPE[notification.type];
}
