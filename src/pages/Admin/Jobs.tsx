import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import type { AdminJobListItem, JobStatus } from "../../types/job";
import { fetchAdminJobs } from "../../api/adminJobs";
import { formatShortRelativeTime } from "../../utils/formatShortRelativeTime";

type FilterTab = JobStatus | "all";

const STATUS_CONFIG: Record<JobStatus, { label: string; dot: string; badgeBg: string; badgeText: string }> = {
  open: { label: "Published", dot: "#1E9E5A", badgeBg: "#E9F9F0", badgeText: "#127A3E" },
  draft: { label: "Draft", dot: "#C2760C", badgeBg: "#FFF1DE", badgeText: "#8A5A12" },
  closed: { label: "Closed", dot: "#8B8798", badgeBg: "#F2F1F6", badgeText: "#4B4757" },
  archived: { label: "Archived", dot: "#8B8798", badgeBg: "#F2F1F6", badgeText: "#8B8798" },
};

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "open", label: "Published" },
  { key: "draft", label: "Draft" },
  { key: "closed", label: "Closed" },
  { key: "archived", label: "Archived" },
];

const AVATAR_COLORS = [
  "#161320",
  "#2D5BFF",
  "#6D4AFF",
  "#1E9E5A",
  "#C2760C",
  "#D9651B",
];

function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) % AVATAR_COLORS.length;
  }
  return AVATAR_COLORS[Math.abs(hash)];
}

function formatCloses(job: AdminJobListItem): { text: string; urgent: boolean } {
  if (job.status === "draft") return { text: "—", urgent: false };

  const diffDays = Math.ceil(
    (new Date(job.closesAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays <= 0) return { text: "Closed", urgent: false };
  return {
    text: `in ${diffDays} ${diffDays === 1 ? "day" : "days"}`,
    urgent: diffDays <= 3,
  };
}

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<AdminJobListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAdminJobs()
      .then(setJobs)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load jobs"))
      .finally(() => setLoading(false));
  }, []);

  const tabCounts = useMemo(() => {
    const counts: Record<FilterTab, number> = {
      all: jobs.length,
      open: 0,
      draft: 0,
      closed: 0,
      archived: 0,
    };
    for (const job of jobs) counts[job.status] += 1;
    return counts;
  }, [jobs]);

  const visibleJobs = useMemo(() => {
    const byStatus = filter === "all" ? jobs : jobs.filter((job) => job.status === filter);

    const query = search.trim().toLowerCase();
    if (!query) return byStatus;

    return byStatus.filter(
      (job) =>
        job.title.toLowerCase().includes(query) ||
        job.companyName.toLowerCase().includes(query)
    );
  }, [jobs, filter, search]);

  return (
    <div>
      <div className="mb-[20px] flex flex-wrap items-start justify-between gap-[12px]">
        <div>
          <div className="mb-[6px] font-['Inter'] font-semibold text-[11.5px] tracking-[0.12em] text-[#6D4AFF]">
            MANAGE
          </div>
          <h1 className="mb-[6px] font-['Bricolage_Grotesque'] font-extrabold text-[32px] text-[#161320]">
            Jobs
          </h1>
          <p className="font-['Inter'] text-[13.5px] text-[#8B8798]">
            Post roles, manage drafts, and track applications per job.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/jobs/new")}
          className="flex shrink-0 items-center gap-[8px] rounded-full bg-[#6D4AFF] px-[18px] py-[11px] font-['Inter'] text-[13.5px] font-semibold text-white hover:bg-[#5D3CE0]"
        >
          <FiPlus size={15} />
          New job
        </button>
      </div>

      <div className="mb-[16px] inline-flex flex-wrap items-center gap-[4px] rounded-full border-[1.07px] border-[#ECEBF0] bg-white p-[6px]">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`whitespace-nowrap rounded-full px-[16px] py-[9px] font-['Inter'] text-[13.5px] font-semibold transition-colors ${
              filter === tab.key
                ? "bg-[#6D4AFF] text-white"
                : "text-[#161320] hover:bg-[#FAFAFB]"
            }`}
          >
            {tab.label}{" "}
            <span className={filter === tab.key ? "text-white/70" : "text-[#8B8798]"}>
              {tabCounts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      <div className="mb-[20px] flex w-full items-center gap-[10px] rounded-full border-[1.07px] border-[#ECEBF0] bg-white px-[16px] py-[11px]">
        <svg
          className="size-[16px] shrink-0 text-[#8B8798]"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
        >
          <circle cx="9" cy="9" r="6" />
          <path d="M18 18l-4.5-4.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search roles or clients…"
          className="w-full min-w-0 bg-transparent font-['Inter'] text-[13.5px] text-[#161320] outline-none placeholder:text-[#8B8798]"
        />
      </div>

      <div className="rounded-[16px] border-[1.07px] border-[#ECEBF0] bg-white p-[22px]">
        {loading ? (
          <p className="py-[40px] text-center font-['Inter'] text-[13.5px] text-[#8B8798]">
            Loading jobs…
          </p>
        ) : error ? (
          <p className="py-[40px] text-center font-['Inter'] text-[13.5px] text-[#C62828]">
            {error}
          </p>
        ) : visibleJobs.length === 0 ? (
          <p className="py-[40px] text-center font-['Inter'] text-[13.5px] text-[#8B8798]">
            No jobs match those filters.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse">
              <thead>
                <tr className="border-b-[1.07px] border-b-[#ECEBF0] font-['Inter'] text-[11px] font-semibold tracking-[0.06em] text-[#8B8798]">
                  <th className="py-[10px] text-left">ROLE</th>
                  <th className="py-[10px] text-left">STATUS</th>
                  <th className="py-[10px] text-left">APPLICANTS</th>
                  <th className="py-[10px] text-left">CLOSES</th>
                  <th className="py-[10px] text-left">POSTED</th>
                  <th className="py-[10px] text-right"></th>
                </tr>
              </thead>
              <tbody>
                {visibleJobs.map((job) => {
                  const statusConfig = STATUS_CONFIG[job.status];
                  const closes = formatCloses(job);

                  return (
                    <tr key={job.id} className="border-b-[1.07px] border-b-[#ECEBF0] last:border-b-0">
                      <td className="min-w-0 py-[14px] pr-[16px]">
                        <div className="flex min-w-0 items-center gap-[10px]">
                          <div
                            className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] font-['Inter'] text-[13px] font-bold text-white"
                            style={{ backgroundColor: avatarColor(job.companyName) }}
                          >
                            {job.companyName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate font-['Inter'] text-[13.5px] font-semibold text-[#161320]">
                              {job.title}
                            </div>
                            <div className="truncate font-['Inter'] text-[11.5px] text-[#8B8798]">
                              {job.companyName} · {job.jobType}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap py-[14px] pr-[16px]">
                        <span
                          className="inline-flex items-center gap-[6px] rounded-full px-[10px] py-[4px] font-['Inter'] text-[11.5px] font-semibold"
                          style={{ backgroundColor: statusConfig.badgeBg, color: statusConfig.badgeText }}
                        >
                          <span className="size-[6px] rounded-full" style={{ backgroundColor: statusConfig.dot }} />
                          {statusConfig.label}
                        </span>
                      </td>

                      <td className="whitespace-nowrap py-[14px] pr-[16px] font-['Inter'] text-[13px] text-[#161320]">
                        {job.status === "draft" ? "—" : job.applicantCount}
                      </td>

                      <td
                        className="whitespace-nowrap py-[14px] pr-[16px] font-['Inter'] text-[13px]"
                        style={{ color: closes.urgent ? "#C62828" : "#4B4757" }}
                      >
                        {closes.text}
                      </td>

                      <td className="whitespace-nowrap py-[14px] pr-[16px] font-['Inter'] text-[13px] text-[#8B8798]">
                        {job.status === "draft" ? "Draft" : formatShortRelativeTime(job.createdAt)}
                      </td>

                      <td className="whitespace-nowrap py-[14px] text-right">
                        <button
                          type="button"
                          aria-label="More actions"
                          className="flex size-[30px] items-center justify-center rounded-full text-[#8B8798] hover:bg-[#FAFAFB] hover:text-[#161320]"
                        >
                          ⋮
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
