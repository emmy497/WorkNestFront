import { NavLink } from "react-router-dom";
import { FiCheck, FiX } from "react-icons/fi";
import Logo from "../../components/Logo";
import Stepper from "../../components/Stepper";
import { APPLICATION_STAGES, STAGE_LABELS } from "../../types/application";
import type { Job } from "../../types/job";

type ApplySubmittedProps = {
  job: Job;
  applicationId: string;
};

const ApplySubmitted = ({ job, applicationId }: ApplySubmittedProps) => {
  const currentStageIndex = 1;

  return (
    <div className="min-h-screen bg-[#FAFAFB]">
      <header className="flex items-center justify-between px-4 py-[22px] sm:px-8 lg:px-[100px]">
        <Logo width={117} />
        <NavLink
          to="/find-jobs"
          className="flex items-center gap-[9px] font-['Inter'] text-[14px] text-[#4B4757] transition hover:text-[#161320]"
        >
          <FiX size={17} />
          Save &amp; exit
        </NavLink>
      </header>

      <div className="mx-auto w-full max-w-[600px] px-4 pb-24 pt-[60px] sm:px-6">
        <div className="rounded-[24px] border-[1.07px] border-[#ECEBF0] bg-white p-8 text-center sm:p-[44px]">
          <div className="mx-auto flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#E9F9EF]">
            <FiCheck size={28} className="text-[#1F9254]" />
          </div>

          <h1 className="mt-[22px] font-['Bricolage_Grotesque'] font-extrabold text-[30px] leading-[38px] tracking-[-1px] text-[#161320]">
            Application submitted
          </h1>

          <p className="mx-auto mt-[12px] max-w-[440px] font-['Inter'] text-[14px] leading-[23px] text-[#4B4757]">
            Your application for{" "}
            <span className="font-semibold text-[#161320]">{job.title}</span> at{" "}
            <span className="font-semibold text-[#161320]">
              {job.companyName}
            </span>{" "}
            is in. A real person on our team will review it — usually within
            about {job.closesInDays} days — and you'll hear from us either way.
          </p>

          <div className="mt-[32px]">
            <Stepper
              labels={APPLICATION_STAGES.map((stage) => STAGE_LABELS[stage])}
              currentIndex={currentStageIndex}
            />
          </div>

          <div className="mt-[36px] flex flex-col items-center justify-center gap-[12px] sm:flex-row">
            <NavLink
              to="/applications"
              state={{ applicationId }}
              className="w-full rounded-full bg-[#6D4AFF] px-[28px] py-[13px] text-center font-['Inter'] font-semibold text-[13.5px] text-white shadow-[0px_8px_22px_0px_rgba(109,74,255,0.3)] sm:w-auto"
            >
              Track this application
            </NavLink>

            <NavLink
              to="/find-jobs"
              className="w-full rounded-full border-[1.07px] border-[#ECEBF0] bg-white px-[28px] py-[13px] text-center font-['Inter'] font-semibold text-[13.5px] text-[#161320] sm:w-auto"
            >
              Browse more roles
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplySubmitted;
