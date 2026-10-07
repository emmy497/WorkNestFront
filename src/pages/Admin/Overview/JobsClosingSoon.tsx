import { toast } from "react-toastify";
import type { ClosingJob } from "../../../types/dashboard";
import { formatDaysLeft } from "../../../utils/formatShortRelativeTime";

interface JobsClosingSoonProps {
  jobs: ClosingJob[];
}

const SQUARE_COLORS = ["#6D4AFF", "#161320", "#C6531B"];

const JobsClosingSoon = ({ jobs }: JobsClosingSoonProps) => {
  return (
    <div className="rounded-[16px] border-[1.07px] border-[#ECEBF0] bg-white p-[22px]">
      <div className="mb-[16px] flex items-center justify-between">
        <h2 className="font-['Bricolage_Grotesque'] font-bold text-[17px] text-[#161320]">
          Jobs closing soon
        </h2>
        <button
          type="button"
          onClick={() => toast.info("Coming soon!")}
          className="font-['Inter'] text-[13px] font-semibold text-[#6D4AFF] hover:underline"
        >
          All jobs →
        </button>
      </div>

      {jobs.length === 0 ? (
        <p className="py-[16px] text-center font-['Inter'] text-[13.5px] text-[#8B8798]">
          Nothing closing soon.
        </p>
      ) : (
        <div className="flex flex-col gap-[16px]">
          {jobs.map((job, index) => (
            <div key={job.id} className="flex items-start gap-[12px]">
              <div
                className="flex size-[34px] shrink-0 items-center justify-center rounded-[9px] font-['Inter'] text-[13px] font-bold text-white"
                style={{ backgroundColor: SQUARE_COLORS[index % SQUARE_COLORS.length] }}
              >
                {job.companyName.charAt(0).toUpperCase() || "?"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-['Inter'] text-[13.5px] font-semibold text-[#161320]">
                  {job.title}
                </div>
                <div className="truncate font-['Inter'] text-[12px] text-[#8B8798]">
                  {job.companyName} · {job.location}
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="whitespace-nowrap font-['Inter'] text-[12px] font-semibold text-[#C6531B]">
                  {formatDaysLeft(job.closesAt)}
                </div>
                <div className="whitespace-nowrap font-['Inter'] text-[11.5px] text-[#8B8798]">
                  {job.applicantCount} applicant{job.applicantCount === 1 ? "" : "s"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsClosingSoon;
