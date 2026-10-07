import { useEffect, useState } from "react";
import { FiSliders, FiX } from "react-icons/fi";
import type { Job } from "../types/job";

export type FilterKey =
  | "workArrangement"
  | "jobType"
  | "experienceLevel"
  | "careerPath";

export type SelectedFilters = Record<FilterKey, string[]>;

export const emptyFilters: SelectedFilters = {
  workArrangement: [],
  jobType: [],
  experienceLevel: [],
  careerPath: [],
};

const groups: { key: FilterKey; label: string; options: string[] }[] = [
  {
    key: "workArrangement",
    label: "Work arrangement",
    options: ["Remote", "Hybrid", "Onsite"],
  },
  {
    key: "jobType",
    label: "Job type",
    options: ["Full-time", "Contract", "Internship", "Part-time"],
  },
  {
    key: "experienceLevel",
    label: "Experience level",
    options: ["Junior", "Mid-level", "Senior"],
  },
  {
    key: "careerPath",
    label: "Career path",
    options: ["Design", "Engineering", "Data", "Customer", "Marketing"],
  },
];

type JobFiltersProps = {
  jobs: Job[];
  selected: SelectedFilters;
  onToggle: (key: FilterKey, value: string) => void;
  onClearAll: () => void;

  resultCount?: number;
};

const JobFilters = ({
  jobs,
  selected,
  onToggle,
  onClearAll,
  resultCount,
}: JobFiltersProps) => {
  const [sheetOpen, setSheetOpen] = useState(false);

  const countFor = (key: FilterKey, value: string) =>
    jobs.filter((job) => job[key] === value).length;

  const activeCount = Object.values(selected).reduce(
    (total, values) => total + values.length,
    0,
  );

  useEffect(() => {
    if (sheetOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [sheetOpen]);

  const filterGroups = groups.map((group) => (
    <div key={group.key} className="mt-[26px]">
      <div className="mb-[12px] font-['Inter'] font-medium text-[10px] leading-[15px] tracking-[1.2px] uppercase text-[#8B8798] pt-[27.65px]">
        {group.label}
      </div>

      <div className="flex flex-col gap-[10px] border-b-[1.06px] border-[#F2F1F6] pb-[21.27px]">
        {group.options.map((option) => (
          <label
            key={option}
            className="flex cursor-pointer items-center gap-[11px] font-['Inter'] text-[13px] text-[#4B4757]"
          >
            <input
              type="checkbox"
              checked={selected[group.key].includes(option)}
              onChange={() => onToggle(group.key, option)}
              className="h-[20px] w-[20px] shrink-0 cursor-pointer rounded-[6.38px] border p-[3px] border-[#ECEBF0] opacity-50 accent-[#6D4AFF]"
            />
            <span className="flex-1">{option}</span>
            <span className="font-['Inter'] text-[12px] text-[#8B8798]">
              {countFor(group.key, option)}
            </span>
          </label>
        ))}
      </div>
    </div>
  ));

  return (
    <>
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="flex w-full items-center justify-center gap-[10px] rounded-full border-[1.07px] border-[#ECEBF0] bg-white px-5 py-3 font-['Inter'] text-[14px] font-medium text-[#161320] shadow-[0px_1.07px_3.2px_0px_#1613200F]"
        >
          <FiSliders size={16} className="text-[#6D4AFF]" />
          Filters
          {activeCount > 0 && (
            <span className="flex h-[20px] min-w-[20px] items-center justify-center rounded-full bg-[#6D4AFF] px-[6px] text-[11px] font-semibold text-white">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {sheetOpen && (
        <div className="lg:hidden">
          <div
            onClick={() => setSheetOpen(false)}
            className="fixed inset-0 z-40 bg-[#140A28]/45"
          />

          <div className="fixed inset-x-4 bottom-[max(16px,env(safe-area-inset-bottom))] z-50 mx-auto flex max-h-[68vh] max-w-[420px] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0px_18px_48px_0px_rgba(22,19,32,0.24)]">
            <div className="flex shrink-0 items-center justify-between border-b border-[#F2F1F6] bg-white px-5 py-[14px]">
              <div className="font-[Bricolage_Grotesque] font-bold text-[18px] leading-[27.12px] tracking-[-0.18px] text-[#161320]">
                Filters
              </div>

              <div className="flex items-center gap-[16px]">
                <button
                  type="button"
                  onClick={onClearAll}
                  className="font-['Inter'] text-[12px] text-[#6D4AFF]"
                >
                  Clear all
                </button>
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  aria-label="Close filters"
                  className="text-[#8B8798]"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-2 [&>div:first-child]:mt-0 [&>div:first-child>div:first-child]:pt-[18px]">
              {filterGroups}
            </div>

            <div className="shrink-0 border-t border-[#F2F1F6] bg-white px-5 py-4">
              <button
                type="button"
                onClick={() => setSheetOpen(false)}
                className="w-full rounded-full bg-[#6D4AFF] py-[13px] font-['Inter'] text-[14px] font-semibold text-white shadow-[0px_6px_18px_0px_rgba(109,74,255,0.25)]"
              >
                {resultCount === undefined
                  ? "Show results"
                  : `Show ${resultCount} ${resultCount === 1 ? "role" : "roles"}`}
              </button>
            </div>
          </div>
        </div>
      )}

      <aside className="hidden lg:block lg:w-[280px] lg:shrink-0">
        <div className="rounded-[24px] border-[1.07px] border-[#ECEBF0] bg-white p-6 shadow-[0px_1.07px_3.2px_0px_#1613200F,0px_1.07px_2.13px_0px_#1613200D]">
          <div className="flex items-center justify-between">
            <div className="font-[Bricolage_Grotesque] font-[700] font-bold text-[18px] leading-[27.12px] tracking-[-0.18px] text-[#161320]">
              Filters
            </div>
            <button
              type="button"
              onClick={onClearAll}
              className="font-['Inter'] text-[12px] text-[#6D4AFF] hover:underline"
            >
              Clear all
            </button>
          </div>

          {filterGroups}
        </div>
      </aside>
    </>
  );
};

export default JobFilters;
