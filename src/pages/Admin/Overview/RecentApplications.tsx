import { useNavigate } from "react-router-dom";
import type { RecentApplication } from "../../../types/dashboard";
import { APPLICATION_STATUS_CONFIG } from "../../../types/application";
import { formatShortRelativeTime } from "../../../utils/formatShortRelativeTime";

interface RecentApplicationsProps {
  applications: RecentApplication[];
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

const RecentApplications = ({ applications }: RecentApplicationsProps) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-[16px] border-[1.07px] border-[#ECEBF0] bg-white p-[22px]">
      <div className="mb-[18px] flex items-center justify-between">
        <h2 className="font-['Bricolage_Grotesque'] font-bold text-[17px] text-[#161320]">
          Recent applications
        </h2>
        <button
          type="button"
          onClick={() => navigate("/admin/pipeline")}
          className="font-['Inter'] text-[13px] font-semibold text-[#6D4AFF] hover:underline"
        >
          View pipeline →
        </button>
      </div>

      {applications.length === 0 ? (
        <p className="py-[24px] text-center font-['Inter'] text-[13.5px] text-[#8B8798]">
          No applications yet.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <div className="grid min-w-[560px] grid-cols-[1fr_1fr_auto_auto_auto] gap-[12px] border-b-[1.07px] border-b-[#ECEBF0] pb-[10px] font-['Inter'] text-[11px] font-semibold tracking-[0.06em] text-[#8B8798]">
            <span>CANDIDATE</span>
            <span>ROLE</span>
            <span>STATUS</span>
            <span></span>
            <span></span>
          </div>

          <div className="flex min-w-[560px] flex-col">
            {applications.map((app) => {
              const config = APPLICATION_STATUS_CONFIG[app.status];
              return (
                <div
                  key={app.id}
                  className="grid grid-cols-[1fr_1fr_auto_auto_auto] items-center gap-[12px] border-b-[1.07px] border-b-[#ECEBF0] py-[14px] last:border-b-0"
                >
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

                  <div className="min-w-0">
                    <div className="truncate font-['Inter'] text-[13.5px] text-[#161320]">
                      {app.jobTitle}
                    </div>
                    <div className="truncate font-['Inter'] text-[11.5px] text-[#8B8798]">
                      {app.companyName}
                    </div>
                  </div>

                  <span
                    className="whitespace-nowrap rounded-full px-[10px] py-[4px] font-['Inter'] text-[11.5px] font-semibold"
                    style={{ backgroundColor: config.badgeBg, color: config.badgeText }}
                  >
                    {config.label}
                  </span>

                  <span className="whitespace-nowrap font-['Inter'] text-[12px] text-[#8B8798]">
                    {formatShortRelativeTime(app.appliedAt)}
                  </span>

                  <button
                    type="button"
                    onClick={() => navigate(`/admin/pipeline/${app.id}`)}
                    className="whitespace-nowrap font-['Inter'] text-[13px] font-semibold text-[#6D4AFF] hover:underline"
                  >
                    Review
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentApplications;
