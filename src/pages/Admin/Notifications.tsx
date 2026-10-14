import { useNavigate, useOutletContext } from "react-router-dom";
import { FiClock, FiFileText } from "react-icons/fi";
import type { AdminOutletContext } from "./AdminLayout";
import { formatShortRelativeTime } from "../../utils/formatShortRelativeTime";

type Item = {
  key: string;
  icon: "application" | "closing";
  title: string;
  body: string;
  when: string;
  sortTime: number;
  to: string;
};

function daysUntil(iso: string): number {
  return Math.max(0, Math.ceil((new Date(iso).getTime() - Date.now()) / 86_400_000));
}

const Notifications = () => {
  const navigate = useNavigate();
  const { overview, loading, error } = useOutletContext<AdminOutletContext>();

  const items: Item[] = overview
    ? [
        ...overview.recentApplications.map((app) => ({
          key: `app-${app.id}`,
          icon: "application" as const,
          title: `${app.candidateName} applied for ${app.jobTitle}`,
          body: app.companyName,
          when: formatShortRelativeTime(app.appliedAt),
          sortTime: new Date(app.appliedAt).getTime(),
          to: `/admin/pipeline/${app.id}`,
        })),
        ...overview.jobsClosingSoon.map((job) => {
          const days = daysUntil(job.closesAt);
          return {
            key: `job-${job.id}`,
            icon: "closing" as const,
            title: `${job.title} closes ${days === 0 ? "today" : `in ${days} ${days === 1 ? "day" : "days"}`}`,
            body: `${job.companyName} · ${job.applicantCount} ${job.applicantCount === 1 ? "applicant" : "applicants"}`,
            when: new Date(job.closesAt).toLocaleDateString(undefined, { day: "numeric", month: "short" }),
            sortTime: Number.MAX_SAFE_INTEGER - days,
            to: "/admin/jobs",
          };
        }),
      ].sort((a, b) => b.sortTime - a.sortTime)
    : [];

  return (
    <div>
      <div className="mb-[20px]">
        <div className="mb-[6px] font-['Inter'] font-semibold text-[11.5px] tracking-[0.12em] text-[#6D4AFF]">MORE</div>
        <h1 className="mb-[6px] font-['Bricolage_Grotesque'] font-extrabold text-[26px] text-[#161320] sm:text-[32px]">
          Notifications
        </h1>
        <p className="font-['Inter'] text-[13.5px] text-[#8B8798]">New applications and roles that close soon.</p>
      </div>

      {loading ? (
        <p className="py-[40px] text-center font-['Inter'] text-[13.5px] text-[#8B8798]">Loading notifications…</p>
      ) : error ? (
        <p className="py-[40px] text-center font-['Inter'] text-[13.5px] text-[#C62828]">{error}</p>
      ) : items.length === 0 ? (
        <p className="py-[40px] text-center font-['Inter'] text-[13.5px] text-[#8B8798]">You're all caught up.</p>
      ) : (
        <ul className="overflow-hidden rounded-[16px] border-[1.07px] border-[#ECEBF0] bg-white">
          {items.map((item, i) => (
            <li key={item.key}>
              <button
                type="button"
                onClick={() => navigate(item.to)}
                className={`flex w-full items-start gap-[14px] px-[18px] py-[16px] text-left transition-colors hover:bg-[#FAFAFB] ${
                  i > 0 ? "border-t-[1.07px] border-t-[#ECEBF0]" : ""
                }`}
              >
                <span
                  className={`flex size-[36px] shrink-0 items-center justify-center rounded-full ${
                    item.icon === "application" ? "bg-[#F1EDFF] text-[#6D4AFF]" : "bg-[#FFF4E5] text-[#C2760C]"
                  }`}
                >
                  {item.icon === "application" ? <FiFileText size={16} /> : <FiClock size={16} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-['Inter'] text-[14px] font-semibold text-[#161320]">{item.title}</span>
                  <span className="block font-['Inter'] text-[12.5px] text-[#8B8798]">{item.body}</span>
                </span>
                <span className="shrink-0 font-['Inter'] text-[12px] text-[#8B8798]">{item.when}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
