import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ApplicationCard from "../../components/ApplicationCard";
import JobCard from "../../components/JobCard";
import { fetchApplications } from "../../api/applications";
import { fetchSavedJobs } from "../../api/savedJobs";
import { useSavedJobs } from "../../context/SavedJobsContext";
import type { Application } from "../../types/application";
import type { Job } from "../../types/job";

type Tab = "applications" | "saved" | "notifications";

const TABS: { key: Tab; label: string }[] = [
  { key: "applications", label: "Applications" },
  { key: "saved", label: "Saved" },
  { key: "notifications", label: "Notifications" },
];

const Applications = () => {
  const [activeTab, setActiveTab] = useState<Tab>("applications");

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // The shared saved-jobs state. We use savedCount for the tab badge, and
  // savedIds so the list refreshes when a bookmark is removed from here.
  const { savedCount, savedIds } = useSavedJobs();

  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [savedLoading, setSavedLoading] = useState(true);
  const [savedError, setSavedError] = useState("");

  useEffect(() => {
    fetchApplications()
      .then((data) => setApplications(data))
      .catch(() => setError("Could not load your applications."))
      .finally(() => setLoading(false));
  }, []);

  // Reload the saved list whenever the set of saved ids changes.
  //
  // savedIds.size is the dependency rather than savedIds itself, because the
  // Set is a new object on every change — depending on it directly would
  // re-run this effect constantly.
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

  // Notifications aren't wired to real data yet — that count is a
  // placeholder so the tab bar matches the design. TODO: replace once
  // notifications have their own API + types.
  const tabCounts: Record<Tab, number> = {
    applications: applications.length,
    saved: savedCount,
    notifications: 0,
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

          {/* tabs */}
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
            {/* stat cards */}
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

            {/* list — three possible states: loading, error, or data */}
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
            {/* Same three states as the applications list: loading, error,
                or data — plus an empty state when nothing is saved yet. */}
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
              // Reusing JobCard means saved jobs look identical to the
              // Find Jobs list, bookmark and all — tapping it here removes
              // the job and the list updates on its own.
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
            <div className="rounded-[24px] border-[1.07px] border-[#ECEBF0] bg-[#FAFAFB] p-10 text-center">
              <div className="font-['Bricolage_Grotesque'] font-bold text-[18px] text-[#161320]">
                No notifications yet
              </div>
              <p className="mt-2 font-['Inter'] text-[13.5px] text-[#4B4757]">
                Updates on your applications will appear here.
              </p>
            </div>
          </section>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Applications;
