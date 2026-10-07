import { toast } from "react-toastify";
import type { StatusBreakdown } from "../../../types/dashboard";
import { APPLICATION_STATUS_CONFIG } from "../../../types/application";

interface PipelineSnapshotProps {
  pipeline: StatusBreakdown[];
}

const PipelineSnapshot = ({ pipeline }: PipelineSnapshotProps) => {
  const max = Math.max(1, ...pipeline.map((row) => row.count));
  const MIN_WIDTH = 14;

  return (
    <div className="rounded-[16px] border-[1.07px] border-[#ECEBF0] bg-white p-[22px]">
      <div className="mb-[18px] flex items-center justify-between">
        <h2 className="font-['Bricolage_Grotesque'] font-bold text-[17px] text-[#161320]">
          Pipeline snapshot
        </h2>
        <button
          type="button"
          onClick={() => toast.info("Coming soon!")}
          className="font-['Inter'] text-[13px] font-semibold text-[#6D4AFF] hover:underline"
        >
          Open →
        </button>
      </div>

      <div className="flex flex-col gap-[12px]">
        {pipeline.map((row) => {
          const color = APPLICATION_STATUS_CONFIG[row.status].badgeText;
          const width = Math.max((row.count / max) * 100, MIN_WIDTH);
          return (
            <div key={row.status} className="flex items-center gap-[12px]">
              <span className="w-[86px] shrink-0 font-['Inter'] text-[13px] text-[#4B4757]">
                {row.label}
              </span>
              <div className="h-[26px] flex-1 rounded-[7px] bg-[#FAFAFB]">
                <div
                  className="flex h-full items-center justify-end rounded-[7px] px-[10px] transition-[width]"
                  style={{ width: `${width}%`, backgroundColor: color }}
                >
                  <span className="font-['Inter'] text-[12.5px] font-bold text-white">
                    {row.count}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PipelineSnapshot;
