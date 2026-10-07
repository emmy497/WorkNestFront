import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ApplicationCard from "../../components/ApplicationCard";
import JobCard from "../../components/JobCard";
import { fetchApplications } from "../../api/applications";
import { fetchSavedJobs } from "../../api/savedJobs";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../api/notifications";
import { useSavedJobs } from "../../context/SavedJobsContext";
import type { Application } from "../../types/application";
import type { Job } from "../../types/job";
import { notificationLook, type Notification } from "../../types/notification";
import { formatShortRelativeTime } from "../../utils/formatShortRelativeTime";

type Tab = "applications" | "saved" | "notifications";

const TABS: { key: Tab; label: string }[] = [
  { key: "applications", label: "Applications" },
  { key: "saved", label: "Saved" },
  { key: "notifications", label: "Notifications" },
];

function isToday(isoDate: string): boolean {
  const date = new Date(isoDate);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

const Applications = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("applications");

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { savedCount, savedIds } = useSavedJobs();

  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [savedLoading, setSavedLoading] = useState(true);
  const [savedError, setSavedError] = useState("");

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifLoading, setNotifLoading] = useState(true);
  const [notifError, setNotifError] = useState("");

  useEffect(() => {
    fetchNotifications()
      .then((data) => {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      })
      .catch(() => setNotifError("Could not load your notifications."))
      .finally(() => setNotifLoading(false));
  }, []);

  function handleNotificationClick(notification: Notification) {
    if (!notification.isRead) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      markNotificationRead(notification.id).catch(() => {
      });
    }

    if (notification.jobId) {
      navigate(`/job-details/${notification.jobId}`);
    }
  }

  function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    markAllNotificationsRead().catch(() => {
    });
  }

  useEffect(() => {
    fetchApplications()
      .then((data) => setApplications(data))
      .catch(() => setError("Could not load your applications."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setSavedLoading(true);
    fetchSavedJobs()
      .then((data) => setSavedJobs(data))
      .catch(() => setSavedError("Could not load your saved jobs."))
      .finally(() => setSavedLoading(false));
  }, [savedIds.size]);

  const activeCount = applications.filter(
    (app) => app.status !== "rejected" && app.status !== "offer",
  ).length;
  const shortlistedCount = applications.filter((app) => app.status === "shortlisted").length;
  const interviewCount = applications.filter((app) => app.status === "interview").length;

  const tabCounts: Record<Tab, number> = {
    applications: applications.length,
    saved: savedCount,
    notifications: unreadCount,
  };

  return (
    <>
      <div className="px-4 sm:px-8 md:px-16 lg:px-[100px]">
        <Navbar />

        <div className="w-full pt-[43px] pb-[8px] mb-8">
          <div className="mb-[12px] font-['Inter'] font-medium text-[11.5px] leading-[17.25px] tracking-[1.61px] uppercase text-[#6D4AFF]">
            Your activity
          </div>
          <div className="mb-[24px] font-['Bricolage_Grotesque'] font-extrabold text-4xl lg:text-[50px] leading-tight lg:leading-[50px] tracking-tight lg:tracking-[-1.75px] text-[#161320]">
            Applications
          </div>

          <div className="flex gap-[28px] border-b-[1.07px] border-b-[#ECEBF0]">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-[8px] pb-[12px] font-['Inter'] font-medium text-[14px] ${
                  activeTab === tab.key
                    ? "border-b-2 border-[#6D4AFF] text-[#161320]"
                    : "text-[#8B8798]"
                }`}
              >
                {tab.label}
                <span
                  className={`flex size-[18px] items-center justify-center rounded-full text-[10px] font-semibold ${
                    activeTab === tab.key
                      ? "bg-[#F1EDFF] text-[#6D4AFF]"
                      : "bg-[#FAFAFB] text-[#8B8798]"
                  }`}
                >
                  {tabCounts[tab.key]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {activeTab === "applications" && (
          <section className="mb-24 lg:mb-[140px]">
            <div className="mb-[28px] flex flex-wrap gap-[16px]">
              {[
                { label: "Active", value: activeCount },
                { label: "Shortlisted", value: shortlistedCount },
                { label: "Interviews", value: interviewCount },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="min-w-[110px] rounded-[16px] border-[1.07px] border-[#ECEBF0] bg-white px-[20px] py-[16px]"
                >
                  <div className="font-['Bricolage_Grotesque'] font-extrabold text-[24px] text-[#161320]">
                    {stat.value}
                  </div>
                  <div className="font-['Inter'] font-medium text-[10px] tracking-[1.2px] uppercase text-[#8B8798]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {loading ? (
              <div className="rounded-[24px] border-[1.07px] border-[#ECEBF0] bg-[#FAFAFB] p-10 text-center font-['Inter'] text-[13.5px] text-[#4B4757]">
                Loading your applications…
              </div>
            ) : error ? (
              <div className="rounded-[24px] border-[1.07px] border-[#FFD5D5] bg-[#FFF7F7] p-10 text-center">
                <div className="font-['Bricolage_Grotesque'] font-bold text-[18px] text-[#161320]">
                  Something went wrong
                </div>
                <p className="mt-2 font-['Inter'] text-[13.5px] text-[#4B4757]">{error}</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="rounded-[24px] border-[1.07px] border-[#ECEBF0] bg-[#FAFAFB] p-10 text-center">
                <div className="font-['Bricolage_Grotesque'] font-bold text-[18px] text-[#161320]">
                  No applications yet
                </div>
                <p className="mt-2 font-['Inter'] text-[13.5px] text-[#4B4757]">
                  Roles you apply to will show up here, with live status updates.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-[18px]">
                {applications.map((application) => (
                  <ApplicationCard key={application.id} application={application} />
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "saved" && (
          <section className="mb-24 lg:mb-[140px]">
            {savedLoading ? (
              <div className="rounded-[24px] border-[1.07px] border-[#ECEBF0] bg-[#FAFAFB] p-10 text-center font-['Inter'] text-[13.5px] text-[#4B4757]">
                Loading your saved jobs…
              </div>
            ) : savedError ? (
              <div className="rounded-[24px] border-[1.07px] border-[#FFD5D5] bg-[#FFF7F7] p-10 text-center">
                <div className="font-['Bricolage_Grotesque'] font-bold text-[18px] text-[#161320]">
                  Something went wrong
                </div>
                <p className="mt-2 font-['Inter'] text-[13.5px] text-[#4B4757]">
                  {savedError}
                </p>
              </div>
            ) : savedJobs.length === 0 ? (
              <div className="rounded-[24px] border-[1.07px] border-[#ECEBF0] bg-[#FAFAFB] p-10 text-center">
                <div className="font-['Bricolage_Grotesque'] font-bold text-[18px] text-[#161320]">
                  No saved jobs yet
                </div>
                <p className="mt-2 font-['Inter'] text-[13.5px] text-[#4B4757]">
                  Tap the bookmark on any role to keep it here for later.
                </p>
                <NavLink
                  to="/find-jobs"
                  className="mt-4 inline-block font-['Inter'] text-[13px] text-[#6D4AFF] hover:underline"
                >
                  Browse open roles
                </NavLink>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-[22px]">
                {savedJobs.map((job) => (
                  <JobCard key={job.id} job={job} showDescription={false} />
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "notifications" && (
          <section className="mb-24 lg:mb-[140px]">
            {notifLoading ? (
              <div className="rounded-[24px] border-[1.07px] border-[#ECEBF0] bg-[#FAFAFB] p-10 text-center font-['Inter'] text-[13.5px] text-[#4B4757]">
                Loading your notifications…
              </div>
            ) : notifError ? (
              <div className="rounded-[24px] border-[1.07px] border-[#FFD5D5] bg-[#FFF7F7] p-10 text-center">
                <div className="font-['Bricolage_Grotesque'] font-bold text-[18px] text-[#161320]">
                  Something went wrong
                </div>
                <p className="mt-2 font-['Inter'] text-[13.5px] text-[#4B4757]">
                  {notifError}
                </p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="rounded-[24px] border-[1.07px] border-[#ECEBF0] bg-[#FAFAFB] p-10 text-center">
                <div className="font-['Bricolage_Grotesque'] font-bold text-[18px] text-[#161320]">
                  No notifications yet
                </div>
                <p className="mt-2 font-['Inter'] text-[13.5px] text-[#4B4757]">
                  Updates on your applications will appear here.
                </p>
              </div>
            ) : (
              <>
                {unreadCount > 0 && (
                  <div className="mb-[16px] flex justify-end">
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="font-['Inter'] text-[13px] font-semibold text-[#6D4AFF] hover:underline"
                    >
                      Mark all as read
                    </button>
                  </div>
                )}

                {(
                  [
                    { key: "today", label: "Today", items: notifications.filter((n) => isToday(n.createdAt)) },
                    { key: "earlier", label: "Earlier", items: notifications.filter((n) => !isToday(n.createdAt)) },
                  ] as const
                )
                  .filter((group) => group.items.length > 0)
                  .map((group) => (
                    <div key={group.key} className="mb-[24px]">
                      <div className="mb-[12px] font-['Inter'] font-medium text-[11.5px] leading-[17.25px] tracking-[1.61px] uppercase text-[#8B8798]">
                        {group.label}
                      </div>

                      <div className="flex flex-col gap-[10px]">
                        {group.items.map((notification) => {
                          const look = notificationLook(notification);
                          const Icon = look.icon;

                          return (
                            <button
                              key={notification.id}
                              type="button"
                              onClick={() => handleNotificationClick(notification)}
                              className={`flex w-full items-start gap-[14px] rounded-[16px] border-[1.07px] border-[#ECEBF0] p-[16px] text-left transition ${
                                notification.isRead ? "bg-white" : "bg-[#FAF8FF]"
                              }`}
                            >
                              <span
                                className="flex size-[38px] shrink-0 items-center justify-center rounded-full"
                                style={{ backgroundColor: look.iconBg, color: look.iconColor }}
                              >
                                <Icon size={17} />
                              </span>

                              <span className="min-w-0 flex-1">
                                <span className="block font-['Inter'] text-[13.5px] font-semibold text-[#161320]">
                                  {notification.title}
                                </span>
                                <span className="block font-['Inter'] text-[13px] text-[#8B8798]">
                                  {notification.body}
                                </span>
                                <span className="block font-['Inter'] text-[11.5px] text-[#8B8798]">
                                  {formatShortRelativeTime(notification.createdAt)}
                                </span>
                              </span>

                              {!notification.isRead && (
                                <span className="mt-[6px] size-[8px] shrink-0 rounded-full bg-[#6D4AFF]" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
              </>
            )}
          </section>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Applications;
