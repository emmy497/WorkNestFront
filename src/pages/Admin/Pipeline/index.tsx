import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiChevronDown } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import type { AdminApplicationListItem, ApplicationStatus } from "../../../types/application";
import { APPLICATION_STATUS_CONFIG } from "../../../types/application";
import { fetchAdminApplications } from "../../../api/adminApplications";
import { formatShortRelativeTime } from "../../../utils/formatShortRelativeTime";
import ApplicationReview from "./ApplicationReview";

type FilterTab = ApplicationStatus | "all";

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "submitted", label: "Submitted" },
  { key: "review", label: "Reviewing" },
  { key: "shortlisted", label: "Shortlisted" },
  { key: "interview", label: "Interview" },
  { key: "offer", label: "Offer" },
  { key: "hired", label: "Hired" },
  { key: "rejected", label: "Not selected" },
];

interface RoleOption {
  jobId: string;
  jobTitle: string;
  companyName: string;
  count: number;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

const Pipeline = () => {
  const navigate = useNavigate();

  const { id: reviewId } = useParams<{ id?: string }>();
  const closeDrawer = () => navigate("/admin/pipeline");

  useEffect(() => {
    if (!reviewId) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeDrawer();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewId]);

  const [applications, setApplications] = useState<AdminApplicationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchAdminApplications()
      .then(setApplications)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load applications"))
      .finally(() => setLoading(false));
  }, []);

  const roleOptions = useMemo<RoleOption[]>(() => {
    const byJob = new Map<string, RoleOption>();

    for (const app of applications) {
      if (!app.jobId) continue;
      const existing = byJob.get(app.jobId);
      if (existing) {
        existing.count += 1;
      } else {
        byJob.set(app.jobId, {
          jobId: app.jobId,
          jobTitle: app.jobTitle,
          companyName: app.companyName,
          count: 1,
        });
      }
    }

    return Array.from(byJob.values()).sort((a, b) => b.count - a.count);
  }, [applications]);

  const effectiveJobId = selectedJobId ?? roleOptions[0]?.jobId ?? null;

  const selectedRole = roleOptions.find((role) => role.jobId === effectiveJobId) ?? null;

  const roleApplications = useMemo(
    () => applications.filter((app) => app.jobId === effectiveJobId),
    [applications, effectiveJobId]
  );

  const tabCounts = useMemo(() => {
    const counts: Record<FilterTab, number> = {
      all: roleApplications.length,
      submitted: 0,
      review: 0,
      shortlisted: 0,
      interview: 0,
      offer: 0,
      hired: 0,
      rejected: 0,
    };
    for (const app of roleApplications) counts[app.status] += 1;
    return counts;
  }, [roleApplications]);

  const visibleApplications = useMemo(
    () => (filter === "all" ? roleApplications : roleApplications.filter((app) => app.status === filter)),
    [roleApplications, filter]
  );

  function toggleSelected(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    setSelectedIds((prev) =>
      prev.size === visibleApplications.length
        ? new Set()
        : new Set(visibleApplications.map((app) => app.id))
    );
  }

  return (
    <div>
      <div className="mb-[6px] font-['Inter'] font-semibold text-[11.5px] tracking-[0.12em] text-[#6D4AFF]">
        CORE
      </div>
      <h1 className="mb-[6px] font-['Bricolage_Grotesque'] font-extrabold text-[32px] text-[#161320]">
        Pipeline
      </h1>
      <p className="mb-[20px] font-['Inter'] text-[13.5px] text-[#8B8798]">
        Evaluate, score, and move candidates through the hiring stages — per role.
      </p>

      {roleOptions.length > 0 && (
        <div className="relative mb-[20px] inline-block">
          <button
            type="button"
            onClick={() => setRoleMenuOpen((prev) => !prev)}
            className="flex items-center gap-[10px] rounded-[14px] border-[1.07px] border-[#ECEBF0] bg-white px-[16px] py-[12px] hover:bg-[#FAFAFB]"
          >
            <span className="font-['Inter'] text-[10.5px] font-semibold tracking-[0.1em] text-[#8B8798]">
              ROLE
            </span>
            <span className="font-['Inter'] text-[14px] font-semibold text-[#161320]">
              {selectedRole
                ? `${selectedRole.jobTitle} · ${selectedRole.companyName} (${selectedRole.count} applicant${selectedRole.count === 1 ? "" : "s"})`
                : "Select a role"}
            </span>
            <FiChevronDown className="size-[14px] text-[#8B8798]" />
          </button>

          {roleMenuOpen && (
            <div className="absolute left-0 top-[calc(100%+6px)] z-10 min-w-full rounded-[14px] border-[1.07px] border-[#ECEBF0] bg-white p-[6px] shadow-[0px_8px_24px_0px_#1613201A]">
              {roleOptions.map((role) => (
                <button
                  key={role.jobId}
                  type="button"
                  onClick={() => {
                    setSelectedJobId(role.jobId);
                    setFilter("all");
                    setSelectedIds(new Set());
                    setRoleMenuOpen(false);
                  }}
                  className={`block w-full whitespace-nowrap rounded-[10px] px-[12px] py-[9px] text-left font-['Inter'] text-[13.5px] ${
                    role.jobId === selectedJobId
                      ? "bg-[#F1EDFF] font-semibold text-[#6D4AFF]"
                      : "text-[#4B4757] hover:bg-[#FAFAFB]"
                  }`}
                >
                  {role.jobTitle} · {role.companyName} ({role.count} applicant{role.count === 1 ? "" : "s"})
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mb-[20px] inline-flex flex-wrap gap-[2px] rounded-full bg-[#FAFAFB] p-[4px]">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`whitespace-nowrap rounded-full px-[14px] py-[8px] font-['Inter'] text-[13px] font-semibold transition-colors ${
              filter === tab.key
                ? "bg-[#6D4AFF] text-white"
                : "text-[#4B4757] hover:bg-white"
            }`}
          >
            {tab.label}{" "}
            <span className={filter === tab.key ? "text-white/70" : "text-[#8B8798]"}>
              {tabCounts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      <div className="rounded-[16px] border-[1.07px] border-[#ECEBF0] bg-white p-[22px]">
        {loading ? (
          <p className="py-[40px] text-center font-['Inter'] text-[13.5px] text-[#8B8798]">
            Loading applications…
          </p>
        ) : error ? (
          <p className="py-[40px] text-center font-['Inter'] text-[13.5px] text-[#C62828]">
            {error}
          </p>
        ) : visibleApplications.length === 0 ? (
          <p className="py-[40px] text-center font-['Inter'] text-[13.5px] text-[#8B8798]">
            No applications here yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse">
              <thead>
                <tr className="border-b-[1.07px] border-b-[#ECEBF0] font-['Inter'] text-[11px] font-semibold tracking-[0.06em] text-[#8B8798]">
                  <th className="w-[36px] py-[10px] text-left">
                    <input
                      type="checkbox"
                      checked={
                        visibleApplications.length > 0 &&
                        selectedIds.size === visibleApplications.length
                      }
                      onChange={toggleSelectAll}
                      className="size-[15px] accent-[#6D4AFF]"
                    />
                  </th>
                  <th className="py-[10px] text-left">CANDIDATE</th>
                  <th className="py-[10px] text-left">APPLIED</th>
                  <th className="py-[10px] text-left">SCORE</th>
                  <th className="py-[10px] text-left">STAGE</th>
                  <th className="py-[10px] text-right"></th>
                </tr>
              </thead>
              <tbody>
                {visibleApplications.map((app) => {
                  const config = APPLICATION_STATUS_CONFIG[app.status];
                  return (
                    <tr
                      key={app.id}
                      className="border-b-[1.07px] border-b-[#ECEBF0] last:border-b-0"
                    >
                      <td className="py-[14px]">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(app.id)}
                          onChange={() => toggleSelected(app.id)}
                          className="size-[15px] accent-[#6D4AFF]"
                        />
                      </td>

                      <td className="min-w-0 py-[14px] pr-[16px]">
                        <div className="flex min-w-0 items-center gap-[10px]">
                          <div className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-[#F1EDFF] font-['Inter'] text-[11.5px] font-semibold text-[#6D4AFF]">
                            {initials(app.candidateName)}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate font-['Inter'] text-[13.5px] font-semibold text-[#161320]">
                              {app.candidateName}
                            </div>
                            <div className="truncate font-['Inter'] text-[11.5px] text-[#8B8798]">
                              {app.candidateHeadline || app.jobTitle}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap py-[14px] pr-[16px] font-['Inter'] text-[12.5px] text-[#8B8798]">
                        {formatShortRelativeTime(app.appliedAt)}
                      </td>

                      <td className="whitespace-nowrap py-[14px] pr-[16px]">
                        {app.score === null ? (
                          <span className="font-['Inter'] text-[12.5px] text-[#8B8798]">
                            Not scored
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-[4px] font-['Inter'] text-[13px] font-semibold text-[#161320]">
                            <FaStar className="size-[13px] text-[#FFC93C]" />
                            {app.score.toFixed(1)}
                          </span>
                        )}
                      </td>

                      <td className="whitespace-nowrap py-[14px] pr-[16px]">
                        <span
                          className="inline-flex items-center gap-[6px] rounded-full px-[10px] py-[4px] font-['Inter'] text-[11.5px] font-semibold"
                          style={{ backgroundColor: config.badgeBg, color: config.badgeText }}
                        >
                          <span
                            className="size-[6px] rounded-full"
                            style={{ backgroundColor: config.badgeText }}
                          />
                          {config.label}
                        </span>
                      </td>

                      <td className="whitespace-nowrap py-[14px] text-right">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/pipeline/${app.id}`)}
                          className="rounded-full bg-[#6D4AFF] px-[16px] py-[8px] font-['Inter'] text-[12.5px] font-semibold text-white hover:bg-[#5D3CE0]"
                        >
                          Review
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

      <div
        className={`fixed inset-0 z-50 ${reviewId ? "" : "pointer-events-none"}`}
        aria-hidden={!reviewId}
      >
        <div
          onClick={closeDrawer}
          className={`absolute inset-0 bg-[#161320]/30 transition-opacity duration-300 ${
            reviewId ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-[640px] bg-white shadow-[-8px_0px_32px_0px_#1613201F] transition-transform duration-300 ${
            reviewId ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {reviewId && (
            <ApplicationReview key={reviewId} id={reviewId} onClose={closeDrawer} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Pipeline;
