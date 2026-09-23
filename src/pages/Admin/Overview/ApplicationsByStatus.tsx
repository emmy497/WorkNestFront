import type { StatusBreakdown } from "../../../types/dashboard";
import { APPLICATION_STATUS_CONFIG } from "../../../types/application";

interface ApplicationsByStatusProps {
  breakdown: StatusBreakdown[];
}

const ApplicationsByStatus = ({ breakdown }: ApplicationsByStatusProps) => {
  const max = Math.max(1, ...breakdown.map((row) => row.count));

  return (
    <div className="rounded-[16px] border-[1.07px] border-[#ECEBF0] bg-white p-[22px]">
      <h2 className="mb-[18px] font-['Bricolage_Grotesque'] font-bold text-[17px] text-[#161320]">
        Applications by status
      </h2>

      <div className="flex flex-col gap-[16px]">
        {breakdown.map((row) => {
          const color = APPLICATION_STATUS_CONFIG[row.status].badgeText;
          const width = (row.count / max) * 100;
          return (
            <div key={row.status}>
              <div className="mb-[6px] flex items-center justify-between font-['Inter'] text-[13px]">
                <span className="text-[#4B4757]">{row.label}</span>
                <span className="font-semibold text-[#161320]">{row.count}</span>
              </div>
              <div className="h-[7px] overflow-hidden rounded-full bg-[#FAFAFB]">
                <div
                  className="h-full rounded-full transition-[width]"
                  style={{ width: `${width}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicationsByStatus;
