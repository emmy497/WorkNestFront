import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { FiX } from "react-icons/fi";
import Logo from "../../components/Logo";
import type { Job } from "../../types/job";

// The four steps, in order. The wizard tracks which one you're on by index.
export const APPLY_STEPS = ["Your details", "CV & links", "Questions", "Review"];

type ApplyLayoutProps = {
  job: Job;
  currentStep: number; // 0-based index into APPLY_STEPS
  children: ReactNode;
};

// ---------------------------------------------------------------------------
// The frame every step of the apply flow shares: the slim header, the job
// card, and the step tracker.
//
// Note there's no Navbar or Footer here — this is a focused task, so we
// deliberately strip the site chrome away and leave only "Save & exit".
// ---------------------------------------------------------------------------
const ApplyLayout = ({ job, currentStep, children }: ApplyLayoutProps) => {
  return (
    <div className="min-h-screen bg-[#FAFAFB]">
      {/* Slim header */}
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

      <div className="mx-auto w-full max-w-[720px] px-4 pb-24 sm:px-6">
        {/* Which job you're applying to — visible on every step, so you
            never lose track of it partway through. */}
        <div className="flex items-center justify-between gap-4 rounded-[18px] border-[1.07px] border-[#ECEBF0] bg-white p-[18px] shadow-[0px_1.07px_3.2px_0px_#1613200F]">
          <div className="flex min-w-0 items-center gap-[14px]">
            <img
              src={job.companyLogo}
              alt={job.companyName}
              className="h-[44px] w-[44px] shrink-0 rounded-[10px]"
            />
            <div className="min-w-0">
              <div className="font-['Inter'] text-[11.5px] text-[#8B8798]">
                Applying for
              </div>
              <div className="truncate font-['Bricolage_Grotesque'] font-bold text-[17px] text-[#161320]">
                {job.title}
              </div>
            </div>
          </div>

          <div className="shrink-0 text-right">
            <div className="font-['Inter'] text-[10.5px] text-[#8B8798]">at</div>
            <div className="font-['Inter'] font-semibold text-[13.5px] text-[#161320]">
              {job.companyName}
            </div>
          </div>
        </div>

        {/* Step tracker */}
        <div className="mt-[26px] flex items-center overflow-x-auto pb-1">
          {APPLY_STEPS.map((label, index) => {
            const isDone = index < currentStep;
            const isCurrent = index === currentStep;
            const isLast = index === APPLY_STEPS.length - 1;

            return (
              <div
                key={label}
                className={`flex items-center ${isLast ? "" : "flex-1"}`}
              >
                <div className="flex shrink-0 items-center gap-[9px]">
                  <span
                    className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border-[1.5px] font-['Inter'] text-[11.5px] font-semibold ${
                      isDone
                        ? "border-[#6D4AFF] bg-[#6D4AFF] text-white"
                        : isCurrent
                          ? "border-[#6D4AFF] bg-white text-[#6D4AFF]"
                          : "border-[#ECEBF0] bg-white text-[#8B8798]"
                    }`}
                  >
                    {/* A tick once the step is behind you, the number while
                        it's ahead of you or current. */}
                    {isDone ? "✓" : index + 1}
                  </span>

                  <span
                    className={`whitespace-nowrap font-['Inter'] text-[13px] ${
                      isCurrent
                        ? "font-semibold text-[#6D4AFF]"
                        : isDone
                          ? "font-medium text-[#161320]"
                          : "text-[#8B8798]"
                    }`}
                  >
                    {label}
                  </span>
                </div>

                {!isLast && (
                  <div
                    className={`mx-[12px] h-[1.5px] flex-1 ${
                      isDone ? "bg-[#6D4AFF]" : "bg-[#ECEBF0]"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* The step's own card */}
        {children}
      </div>
    </div>
  );
};

export default ApplyLayout;
