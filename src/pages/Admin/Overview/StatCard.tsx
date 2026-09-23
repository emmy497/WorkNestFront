import { FiArrowUp } from "react-icons/fi";
import type { DashboardStat } from "../../../types/dashboard";

interface StatCardProps {
  label: string;
  stat: DashboardStat;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  iconBg: string;
  iconColor: string;
}

const StatCard = ({ label, stat, icon: Icon, iconBg, iconColor }: StatCardProps) => {
  return (
    <div className="rounded-[16px] border-[1.07px] border-[#ECEBF0] bg-white p-[20px]">
      <div className="mb-[14px] flex items-center justify-between">
        <span className="font-['Inter'] text-[13.5px] text-[#4B4757]">{label}</span>
        <span
          className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px]"
          style={{ backgroundColor: iconBg }}
        >
          <Icon className="size-[16px]" style={{ color: iconColor }} />
        </span>
      </div>
      <div className="font-['Bricolage_Grotesque'] font-extrabold text-[30px] leading-none text-[#161320]">
        {stat.value.toLocaleString()}
      </div>
      <div className="mt-[10px] flex items-center gap-[5px] font-['Inter'] text-[12.5px]">
        <FiArrowUp className="size-[12px] text-[#1E7B34]" />
        <span className="font-semibold text-[#1E7B34]">
          {stat.change}
          {stat.changeIsPercent ? "%" : ""}
        </span>
        <span className="text-[#8B8798]">{stat.changeLabel}</span>
      </div>
    </div>
  );
};

export default StatCard;
