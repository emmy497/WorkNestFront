import { FaCheck } from "react-icons/fa";

interface StepperProps {
  labels: string[];
  // Index of the step currently active/reached. `null` means "not on this
  // track at all" — e.g. a rejected application — and renders every step
  // in the same fully-muted state instead of showing partial progress.
  currentIndex: number | null;
}

// A horizontal progress tracker: circles connected by lines, each circle
// either completed (filled, checkmark), current (ringed), or upcoming
// (empty). Used on the Applications page, but kept generic — it only needs
// a list of labels and where "now" is, so it can be reused for any
// multi-stage process later (onboarding, checkout, etc.).
const Stepper = ({ labels, currentIndex }: StepperProps) => {
  return (
    <div className="flex w-full items-start">
      {labels.map((label, index) => {
        const isCompleted = currentIndex !== null && index < currentIndex;
        const isCurrent = currentIndex !== null && index === currentIndex;
        const isLast = index === labels.length - 1;

        return (
          <div key={label} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
            <div className="flex flex-col items-center">
              <div
                className={`flex size-[22px] shrink-0 items-center justify-center rounded-full border-2 ${
                  isCompleted
                    ? "border-[#6D4AFF] bg-[#6D4AFF]"
                    : isCurrent
                      ? "border-[#FFC93C] bg-white"
                      : "border-[#ECEBF0] bg-white"
                }`}
              >
                {isCompleted && <FaCheck className="size-[10px] text-white" />}
                {isCurrent && <span className="size-[8px] rounded-full bg-[#FFC93C]" />}
              </div>
              <span
                className={`mt-[8px] whitespace-nowrap font-['Inter'] text-[11px] ${
                  isCurrent ? "font-semibold text-[#161320]" : "text-[#8B8798]"
                }`}
              >
                {label}
              </span>
            </div>

            {!isLast && (
              <div
                className={`mx-[6px] mb-[22px] h-[2px] flex-1 ${
                  isCompleted ? "bg-[#6D4AFF]" : "bg-[#ECEBF0]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;
