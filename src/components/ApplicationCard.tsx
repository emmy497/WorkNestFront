import { NavLink } from "react-router-dom";
import { FaInfoCircle } from "react-icons/fa";
import type { Application } from "../types/application";
import { APPLICATION_STATUS_CONFIG, STAGE_LABELS, APPLICATION_STAGES } from "../types/application";
import { formatRelativeTime } from "../utils/formatRelativeTime";
import Stepper from "./Stepper";

interface ApplicationCardProps {
  application: Application;
}

const stageLabels = APPLICATION_STAGES.map((stage) => STAGE_LABELS[stage]);

const ApplicationCard = ({ application }: ApplicationCardProps) => {
  const { job, status, appliedAt, statusMessage } = application;
  const config = APPLICATION_STATUS_CONFIG[status];

  return (
    <div className="rounded-[24px] border-[1.07px] border-[#ECEBF0] bg-white p-5 lg:p-[25.6px] shadow-[0px_1.07px_3.2px_0px_#1613200F,0px_1.07px_2.13px_0px_#1613200D]">
      {/* header */}
      <div className="mb-[20px] flex flex-wrap items-start justify-between gap-3">
        <div className="flex gap-[12px]">
          <img
            className="h-[45px] w-[45px] shrink-0 rounded-[9px]"
            src={job.companyLogo}
            alt={job.companyName}
          />
          <div>
            <div className="font-['Inter'] font-normal text-[11.2px] leading-[16.8px] tracking-[0.45px] text-[#8B8798] [leading-trim:none]">
              Hiring for {job.companyName}
            </div>
            <div className="font-['Bricolage_Grotesque'] font-bold text-[18px] leading-[24px] text-[#161320] [leading-trim:none]">
              {job.title}
            </div>
          </div>
        </div>

        <div className="text-right">
          <span
            className="inline-flex items-center gap-[6px] rounded-full px-[10px] py-[4px] font-['Inter'] font-semibold text-[11px]"
            style={{ backgroundColor: config.badgeBg, color: config.badgeText }}
          >
            <span className="size-[6px] rounded-full" style={{ backgroundColor: config.badgeText }} />
            {config.label}
          </span>
          <div className="mt-[6px] font-['Inter'] text-[11px] text-[#8B8798]">
            Applied {formatRelativeTime(appliedAt)}
          </div>
        </div>
      </div>

      {/* progress tracker */}
      <div className="mb-[18px]">
        <Stepper labels={stageLabels} currentIndex={config.stageIndex} />
      </div>

      {/* status message + view role */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t-[1.07px] border-t-[#F2F1F6] pt-[14.94px]">
        <div className="flex items-center gap-[8px] font-['Inter'] text-[12.5px] text-[#4B4757]">
          <FaInfoCircle className="size-[13px] shrink-0 text-[#8B8798]" />
          {statusMessage}
        </div>

        <NavLink
          to={`/job-details/${job.id}`}
          className="whitespace-nowrap font-['Inter'] font-medium text-[12.5px] text-[#6D4AFF] hover:underline"
        >
          View role →
        </NavLink>
      </div>
    </div>
  );
};

export default ApplicationCard;
