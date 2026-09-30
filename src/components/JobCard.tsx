import { NavLink } from "react-router-dom";
import type { Job } from "../types/job";
import SaveJobButton from "./SaveJobButton";

interface JobCardProps {
  job: Job;
  showDescription?: boolean;

  // The Home page cards are a preview, so they don't need a bookmark.
  showSaveButton?: boolean;
}

const formatSalary = (amount: number, currency: string) =>
  amount >= 1_000_000
    ? `${currency}${(amount / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`
    : `${currency}${Math.round(amount / 1000)}k`;

const JobCard = ({
  job,
  showDescription = true,
  showSaveButton = true,
}: JobCardProps) => {
  const {
    companyName,
    companyLogo,
    title,
    description,
    location,
    workArrangement,
    jobType,
    experienceLevel,
    salaryMin,
    salaryMax,
    currency = "₦",
    closesInDays,
    featured,
  } = job;

  const tags = [location, workArrangement, jobType, experienceLevel];

  return (
    <NavLink
      to={`/job-details/${job.id}`}
      className={`relative flex h-full flex-col rounded-[24px] lg:rounded-[29.87px] border-[1.07px] bg-white p-5 lg:p-[25.6px] shadow-[0px_1.07px_3.2px_0px_#1613200F,0px_1.07px_2.13px_0px_#1613200D] transition hover:shadow-[0px_8px_24px_0px_#1613201A] ${
        featured ? "border-[#FFC93C]" : "border-[#ECEBF0]"
      }`}
    >
      {/* company */}
      <div className="mb-[15px] flex items-start justify-between gap-3">
        <div className="flex gap-[12px]">
          <img
            className="h-[45px] w-[45px] shrink-0 rounded-[9px]"
            src={companyLogo}
            alt={companyName}
          />
          <div>
            <div className="font-['Inter'] font-normal text-[11.2px] leading-[16.8px] tracking-[0.45px] text-[#8B8798] [leading-trim:none]">
              Hiring for
            </div>
            <div className="font-['Inter'] font-semibold text-[14.94px] leading-[22.4px] text-[#161320] [leading-trim:none]">
              {companyName}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-[10px]">
          {featured && (
            <span className="rounded-full bg-[#FFC93C] px-[10px] py-[4px] font-['Inter'] font-semibold text-[9.5px] tracking-[0.6px] uppercase text-[#463400]">
              Featured
            </span>
          )}

          {showSaveButton && (
            <SaveJobButton jobId={job.id} jobTitle={job.title} />
          )}
        </div>
      </div>

      {/* job title */}
      <div className="font-['Bricolage_Grotesque'] font-bold text-[19px] lg:text-[21.34px] leading-[28px] lg:leading-[32.01px] tracking-[-0.43px] text-[#161320] [leading-trim:none] mb-[10px]">
        {title}
      </div>

      {/* description */}
      {showDescription && (
        <p className="mb-[15px] font-['Inter'] font-normal text-[13.34px] leading-[21px] text-[#4B4757] line-clamp-2">
          {description}
        </p>
      )}

      {/* tags */}
      <div className="mb-[15px] flex flex-wrap gap-[8px]">
        {tags.map((tag, i) => (
          <div
            key={`${tag}-${i}`}
            className="flex h-[35.4px] w-auto min-w-[68.74px] items-center justify-center whitespace-nowrap rounded-[1065.77px] border-[1.07px] border-[#ECEBF0] bg-[#FAFAFB] px-[12.8px] pt-[5.33px] pb-[6.93px] font-['Inter'] text-[13px] text-[#4B4757]"
          >
            {tag}
          </div>
        ))}
      </div>

      {/* salary + closing */}
      <div className="mt-auto flex w-full items-center justify-between gap-2 border-t-[1.07px] border-t-[#F2F1F6] pt-[14.94px]">
        <div className="font-['Inter'] font-medium text-[13.34px] leading-[20px] text-[#161320] [leading-trim:none]">
          {formatSalary(salaryMin, currency)}–{formatSalary(salaryMax, currency)}{" "}
          <span className="font-['Inter'] font-medium text-[11.2px] leading-[16.8px] text-[#8B8798] [leading-trim:none]">
            /mo
          </span>
        </div>

        <div className="whitespace-nowrap font-['Inter'] font-normal text-[11.2px] leading-[16.8px] text-[#8A5A12] [leading-trim:none]">
          {closesInDays === 0
            ? "Closes today"
            : `Closes in ${closesInDays} ${closesInDays === 1 ? "day" : "days"}`}
        </div>
      </div>
    </NavLink>
  );
};

export default JobCard;
